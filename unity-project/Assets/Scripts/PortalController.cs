using UnityEngine;
using System.Collections;

/// <summary>
/// PortalController - Manages portal visuals and train arrival animation
/// States: Idle -> Active -> Arrival -> TrainExit
/// </summary>
public class PortalController : MonoBehaviour
{
    public enum PortalState { Idle, Active, Arrival, TrainExit }

    [Header("Portal Rings")]
    public Transform[] rings;
    public Material ringMaterial;

    [Header("Train")]
    public GameObject trainPrefab;
    public Transform trainSpawnPoint;
    public Transform trainEndPoint;
    public float trainSpeed = 10f;

    [Header("Animation Settings")]
    public float baseRotationSpeed = 30f;
    public float urgentRotationSpeed = 120f;
    public float pulseSpeed = 2f;
    public float pulseAmount = 0.1f;

    [Header("Audio")]
    public AudioSource audioSource;
    public AudioClip portalHum;
    public AudioClip trainApproaching;
    public AudioClip trainArrived;

    private PortalState currentState = PortalState.Idle;
    private Color portalColor = Color.blue;
    private float currentRotationSpeed;
    private GameObject spawnedTrain;
    private int lastCountdown = 0;

    private void Start()
    {
        currentRotationSpeed = baseRotationSpeed;
        SetPortalColor(portalColor);
    }

    private void Update()
    {
        if (currentState == PortalState.Idle) return;

        // Rotate rings
        AnimateRings();

        // Move train during TrainExit state
        if (currentState == PortalState.TrainExit && spawnedTrain != null)
        {
            MoveTrain();
        }
    }

    /// <summary>
    /// Start the portal experience
    /// </summary>
    public void StartPortal(Color lineColor, int countdown)
    {
        portalColor = lineColor;
        lastCountdown = countdown;
        currentState = PortalState.Active;

        SetPortalColor(portalColor);
        EnablePortalVisuals(true);

        if (audioSource != null && portalHum != null)
        {
            audioSource.clip = portalHum;
            audioSource.loop = true;
            audioSource.Play();
        }

        Debug.Log("[Portal] Started with color " + ColorUtility.ToHtmlStringRGB(lineColor));
    }

    /// <summary>
    /// Called every second during countdown
    /// </summary>
    public void OnCountdownTick(int secondsRemaining)
    {
        lastCountdown = secondsRemaining;

        // Increase intensity as train approaches
        if (secondsRemaining < 30)
        {
            currentRotationSpeed = urgentRotationSpeed;
            pulseSpeed = 4f;

            if (secondsRemaining < 10 && audioSource != null && trainApproaching != null)
            {
                if (!audioSource.isPlaying || audioSource.clip != trainApproaching)
                {
                    audioSource.clip = trainApproaching;
                    audioSource.loop = false;
                    audioSource.Play();
                }
            }
        }
        else if (secondsRemaining < 60)
        {
            currentRotationSpeed = Mathf.Lerp(baseRotationSpeed, urgentRotationSpeed, 0.5f);
            pulseSpeed = 3f;
        }
        else
        {
            currentRotationSpeed = baseRotationSpeed;
            pulseSpeed = 2f;
        }
    }

    /// <summary>
    /// Train has arrived - trigger exit animation
    /// </summary>
    public void TriggerArrival()
    {
        currentState = PortalState.Arrival;
        Debug.Log("[Portal] Train arrival triggered!");

        // Play arrival sound
        if (audioSource != null && trainArrived != null)
        {
            audioSource.clip = trainArrived;
            audioSource.loop = false;
            audioSource.Play();
        }

        // Spawn train
        if (trainPrefab != null && trainSpawnPoint != null)
        {
            spawnedTrain = Instantiate(trainPrefab, trainSpawnPoint.position, trainSpawnPoint.rotation);
            currentState = PortalState.TrainExit;
        }
        else
        {
            // Flash effect if no train prefab
            StartCoroutine(ArrivalFlash());
        }
    }

    /// <summary>
    /// Reset portal to idle state
    /// </summary>
    public void ResetPortal()
    {
        currentState = PortalState.Idle;
        currentRotationSpeed = baseRotationSpeed;
        pulseSpeed = 2f;

        if (spawnedTrain != null)
        {
            Destroy(spawnedTrain);
        }

        if (audioSource != null)
        {
            audioSource.Stop();
        }

        EnablePortalVisuals(false);
    }

    private void AnimateRings()
    {
        if (rings == null) return;

        float pulse = 1f + Mathf.Sin(Time.time * pulseSpeed) * pulseAmount;

        for (int i = 0; i < rings.Length; i++)
        {
            if (rings[i] == null) continue;

            // Rotate (alternate directions)
            float direction = (i % 2 == 0) ? 1f : -1f;
            rings[i].Rotate(Vector3.forward, currentRotationSpeed * direction * Time.deltaTime);

            // Pulse scale
            rings[i].localScale = Vector3.one * pulse;
        }
    }

    private void MoveTrain()
    {
        if (spawnedTrain == null || trainEndPoint == null) return;

        // Move towards end point
        spawnedTrain.transform.position = Vector3.MoveTowards(
            spawnedTrain.transform.position,
            trainEndPoint.position,
            trainSpeed * Time.deltaTime
        );

        // Check if reached destination
        if (Vector3.Distance(spawnedTrain.transform.position, trainEndPoint.position) < 0.1f)
        {
            // Train has passed
            StartCoroutine(TrainPassedSequence());
        }
    }

    private IEnumerator TrainPassedSequence()
    {
        yield return new WaitForSeconds(2f);
        ResetPortal();
    }

    private IEnumerator ArrivalFlash()
    {
        // Flash portal color
        for (int i = 0; i < 5; i++)
        {
            SetPortalColor(Color.white);
            yield return new WaitForSeconds(0.1f);
            SetPortalColor(portalColor);
            yield return new WaitForSeconds(0.1f);
        }

        yield return new WaitForSeconds(1f);
        currentState = PortalState.Active;
    }

    private void SetPortalColor(Color color)
    {
        if (ringMaterial != null)
        {
            ringMaterial.SetColor("_EmissionColor", color * 2f);
            ringMaterial.color = color;
        }

        // Also set individual ring materials if present
        if (rings != null)
        {
            foreach (var ring in rings)
            {
                if (ring == null) continue;
                var renderer = ring.GetComponent<Renderer>();
                if (renderer != null && renderer.material != null)
                {
                    renderer.material.SetColor("_EmissionColor", color * 2f);
                    renderer.material.color = color;
                }
            }
        }
    }

    private void EnablePortalVisuals(bool enabled)
    {
        if (rings == null) return;

        foreach (var ring in rings)
        {
            if (ring != null)
            {
                ring.gameObject.SetActive(enabled);
            }
        }
    }
}
