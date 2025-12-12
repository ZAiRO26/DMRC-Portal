using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System;

/// <summary>
/// GameManager - Central controller for MetroPortal Unity experience
/// Receives data from React via JavaScript bridge
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("References")]
    public PortalController portalController;
    public TextMeshProUGUI countdownText;
    public TextMeshProUGUI trainIdText;
    public TextMeshProUGUI directionText;

    [Header("State")]
    private int currentCountdown = 0;
    private bool isCountingDown = false;
    private float countdownTimer = 0f;
    private Color lineColor = Color.blue;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    /// <summary>
    /// Called from React via sendMessage
    /// Receives JSON: { countdownSeconds, lineColor, trainId, direction }
    /// </summary>
    public void SetTrainData(string jsonData)
    {
        Debug.Log($"[GameManager] Received train data: {jsonData}");

        try
        {
            TrainData data = JsonUtility.FromJson<TrainData>(jsonData);

            // Parse color from hex
            if (ColorUtility.TryParseHtmlString(data.lineColor, out Color parsedColor))
            {
                lineColor = parsedColor;
            }

            // Set countdown
            currentCountdown = data.countdownSeconds;
            countdownTimer = 0f;
            isCountingDown = true;

            // Update UI
            if (trainIdText != null)
                trainIdText.text = data.trainId;

            if (directionText != null)
                directionText.text = data.direction;

            UpdateCountdownDisplay();

            // Start portal animation
            if (portalController != null)
            {
                portalController.StartPortal(lineColor, currentCountdown);
            }

            Debug.Log($"[GameManager] Started countdown: {currentCountdown}s, color: {data.lineColor}");
        }
        catch (Exception e)
        {
            Debug.LogError($"[GameManager] Failed to parse train data: {e.Message}");
        }
    }

    private void Update()
    {
        if (!isCountingDown) return;

        countdownTimer += Time.deltaTime;

        // Decrement countdown every second
        if (countdownTimer >= 1f)
        {
            countdownTimer = 0f;
            currentCountdown--;

            UpdateCountdownDisplay();

            // Notify portal of countdown
            if (portalController != null)
            {
                portalController.OnCountdownTick(currentCountdown);
            }

            // Train arrived
            if (currentCountdown <= 0)
            {
                OnTrainArrived();
            }
        }
    }

    private void UpdateCountdownDisplay()
    {
        if (countdownText == null) return;

        if (currentCountdown <= 0)
        {
            countdownText.text = "ARRIVED";
            countdownText.color = Color.green;
        }
        else
        {
            int minutes = currentCountdown / 60;
            int seconds = currentCountdown % 60;
            countdownText.text = $"{minutes:D2}:{seconds:D2}";

            // Color based on urgency
            if (currentCountdown < 30)
            {
                countdownText.color = Color.red;
            }
            else if (currentCountdown < 60)
            {
                countdownText.color = Color.yellow;
            }
            else
            {
                countdownText.color = Color.white;
            }
        }
    }

    private void OnTrainArrived()
    {
        isCountingDown = false;
        Debug.Log("[GameManager] Train has arrived!");

        if (portalController != null)
        {
            portalController.TriggerArrival();
        }
    }

    /// <summary>
    /// Called from React when user exits AR view
    /// </summary>
    public void StopExperience()
    {
        isCountingDown = false;
        currentCountdown = 0;

        if (portalController != null)
        {
            portalController.ResetPortal();
        }
    }
}

[Serializable]
public class TrainData
{
    public int countdownSeconds;
    public string lineColor;
    public string trainId;
    public string direction;
}
