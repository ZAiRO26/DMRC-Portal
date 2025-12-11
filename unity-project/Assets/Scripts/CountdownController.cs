using System;
using UnityEngine;
using TMPro;

/// <summary>
/// CountdownController - Manages the real-time countdown timer display
/// Updates every frame and triggers events at key milestones.
/// </summary>
public class CountdownController : MonoBehaviour
{
    [Header("UI References")]
    [Tooltip("TextMeshPro element displaying MM:SS")]
    public TextMeshProUGUI countdownText;
    
    [Tooltip("TextMeshPro element displaying destination")]
    public TextMeshProUGUI destinationText;
    
    [Tooltip("TextMeshPro element displaying status")]
    public TextMeshProUGUI statusText;

    [Header("Visual Settings")]
    public Color normalColor = new Color(1f, 1f, 1f);      // White
    public Color warningColor = new Color(1f, 0.8f, 0f);   // Yellow
    public Color urgentColor = new Color(1f, 0f, 0.33f);   // Red (#FF0055)
    public Color arrivalColor = new Color(0f, 0.85f, 1f);  // Cyan (#00D9FF)

    [Header("Thresholds (seconds)")]
    public int warningThreshold = 60;
    public int urgentThreshold = 30;
    public int arrivalThreshold = 10;

    [Header("Audio (Optional)")]
    public AudioSource audioSource;
    public AudioClip warningSound;
    public AudioClip urgentSound;
    public AudioClip arrivalSound;

    // Events
    public event Action OnWarningThreshold;
    public event Action OnUrgentThreshold;
    public event Action OnTrainArrival;

    // State
    private float remainingSeconds;
    private bool isCountingDown;
    private bool playedWarning;
    private bool playedUrgent;
    private bool playedArrival;

    void Update()
    {
        if (!isCountingDown) return;

        remainingSeconds -= Time.deltaTime;
        
        if (remainingSeconds <= 0)
        {
            remainingSeconds = 0;
            isCountingDown = false;
            TriggerArrival();
        }

        UpdateDisplay();
        CheckThresholds();
    }

    /// <summary>
    /// Start a new countdown
    /// </summary>
    /// <param name="seconds">Seconds until train arrives</param>
    /// <param name="destination">Train destination name</param>
    public void StartCountdown(int seconds, string destination)
    {
        remainingSeconds = seconds;
        isCountingDown = true;
        
        // Reset threshold flags
        playedWarning = false;
        playedUrgent = false;
        playedArrival = false;

        if (destinationText != null)
        {
            destinationText.text = destination.ToUpper();
        }

        if (statusText != null)
        {
            statusText.text = "APPROACHING";
        }

        Debug.Log($"[Countdown] Started: {seconds}s to {destination}");
    }

    /// <summary>
    /// Stop the countdown
    /// </summary>
    public void StopCountdown()
    {
        isCountingDown = false;
    }

    private void UpdateDisplay()
    {
        if (countdownText == null) return;

        int totalSeconds = Mathf.CeilToInt(remainingSeconds);
        int minutes = totalSeconds / 60;
        int seconds = totalSeconds % 60;

        countdownText.text = $"{minutes:D2}:{seconds:D2}";

        // Color based on urgency
        if (remainingSeconds <= arrivalThreshold)
        {
            countdownText.color = arrivalColor;
        }
        else if (remainingSeconds <= urgentThreshold)
        {
            countdownText.color = urgentColor;
        }
        else if (remainingSeconds <= warningThreshold)
        {
            countdownText.color = warningColor;
        }
        else
        {
            countdownText.color = normalColor;
        }
    }

    private void CheckThresholds()
    {
        // Warning threshold (T-60s)
        if (!playedWarning && remainingSeconds <= warningThreshold)
        {
            playedWarning = true;
            PlaySound(warningSound);
            OnWarningThreshold?.Invoke();
            Debug.Log("[Countdown] Warning threshold reached");
        }

        // Urgent threshold (T-30s)
        if (!playedUrgent && remainingSeconds <= urgentThreshold)
        {
            playedUrgent = true;
            PlaySound(urgentSound);
            OnUrgentThreshold?.Invoke();
            
            if (statusText != null)
            {
                statusText.text = "ARRIVING SOON";
            }
            Debug.Log("[Countdown] Urgent threshold reached");
        }

        // Arrival threshold (T-10s)
        if (!playedArrival && remainingSeconds <= arrivalThreshold)
        {
            playedArrival = true;
            PlaySound(arrivalSound);
            
            if (statusText != null)
            {
                statusText.text = "ARRIVING NOW";
            }
            Debug.Log("[Countdown] Arrival threshold reached");
        }
    }

    private void TriggerArrival()
    {
        if (countdownText != null)
        {
            countdownText.text = "00:00";
        }
        
        if (statusText != null)
        {
            statusText.text = "TRAIN ARRIVED";
        }

        OnTrainArrival?.Invoke();
        Debug.Log("[Countdown] Train arrived!");
    }

    private void PlaySound(AudioClip clip)
    {
        if (audioSource != null && clip != null)
        {
            audioSource.PlayOneShot(clip);
        }
    }

    /// <summary>
    /// Get current remaining time in seconds
    /// </summary>
    public float GetRemainingTime()
    {
        return remainingSeconds;
    }

    /// <summary>
    /// Get normalized progress (1 = full time, 0 = arrived)
    /// </summary>
    public float GetProgress(float totalTime)
    {
        return Mathf.Clamp01(remainingSeconds / totalTime);
    }
}
