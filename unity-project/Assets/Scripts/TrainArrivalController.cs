using UnityEngine;

/// <summary>
/// TrainArrivalController - Manages train spawning and arrival animation
/// Controls the train model appearing from the portal and stopping at the platform.
/// </summary>
public class TrainArrivalController : MonoBehaviour
{
    [Header("Train Settings")]
    [Tooltip("Train prefab or model to spawn")]
    public GameObject trainPrefab;
    
    [Tooltip("Current train instance")]
    public GameObject currentTrain;

    [Header("Positions")]
    [Tooltip("Where train spawns (inside portal)")]
    public Transform spawnPoint;
    
    [Tooltip("Where train stops (platform)")]
    public Transform arrivalPoint;
    
    [Tooltip("Where train exits (opposite end)")]
    public Transform exitPoint;

    [Header("Animation")]
    [Tooltip("Time for train to travel from spawn to arrival")]
    public float arrivalDuration = 3f;
    
    [Tooltip("Time train waits at platform")]
    public float dwellTime = 5f;
    
    [Tooltip("Time for train to exit")]
    public float exitDuration = 2f;

    [Header("Effects")]
    public ParticleSystem arrivalParticles;
    public AudioSource audioSource;
    public AudioClip arrivalSound;
    public AudioClip departureSound;

    [Header("References")]
    public CountdownController countdownController;

    // State
    private bool isAnimating;
    private TrainInfo pendingTrain;

    void Start()
    {
        // Subscribe to countdown arrival
        if (countdownController != null)
        {
            countdownController.OnTrainArrival += TriggerArrival;
        }

        // Hide train initially
        if (currentTrain != null)
        {
            currentTrain.SetActive(false);
        }
    }

    /// <summary>
    /// Prepare for incoming train (called when countdown starts)
    /// </summary>
    public void PrepareTrainArrival(TrainInfo trainInfo)
    {
        pendingTrain = trainInfo;
        Debug.Log($"[Train] Preparing for train {trainInfo.trainNumber} to {trainInfo.direction}");
    }

    /// <summary>
    /// Trigger the train arrival animation
    /// </summary>
    public void TriggerArrival()
    {
        if (isAnimating) return;
        
        Debug.Log("[Train] Triggering arrival sequence");
        StartCoroutine(ArrivalSequence());
    }

    private System.Collections.IEnumerator ArrivalSequence()
    {
        isAnimating = true;

        // Spawn/activate train at spawn point
        if (currentTrain == null && trainPrefab != null)
        {
            currentTrain = Instantiate(trainPrefab, spawnPoint.position, spawnPoint.rotation);
        }
        else if (currentTrain != null)
        {
            currentTrain.transform.position = spawnPoint.position;
            currentTrain.transform.rotation = spawnPoint.rotation;
            currentTrain.SetActive(true);
        }

        // Play arrival effects
        if (arrivalParticles != null)
        {
            arrivalParticles.Play();
        }

        if (audioSource != null && arrivalSound != null)
        {
            audioSource.PlayOneShot(arrivalSound);
        }

        // Animate arrival
        yield return StartCoroutine(MoveTrain(spawnPoint.position, arrivalPoint.position, arrivalDuration));

        Debug.Log("[Train] Train arrived at platform");

        // Dwell at platform
        yield return new WaitForSeconds(dwellTime);

        // Play departure sound
        if (audioSource != null && departureSound != null)
        {
            audioSource.PlayOneShot(departureSound);
        }

        // Animate departure
        yield return StartCoroutine(MoveTrain(arrivalPoint.position, exitPoint.position, exitDuration));

        Debug.Log("[Train] Train departed");

        // Hide train
        if (currentTrain != null)
        {
            currentTrain.SetActive(false);
        }

        isAnimating = false;
    }

    private System.Collections.IEnumerator MoveTrain(Vector3 from, Vector3 to, float duration)
    {
        if (currentTrain == null) yield break;

        float elapsed = 0f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;
            
            // Smooth easing
            t = EaseInOutCubic(t);
            
            currentTrain.transform.position = Vector3.Lerp(from, to, t);
            yield return null;
        }

        currentTrain.transform.position = to;
    }

    private float EaseInOutCubic(float t)
    {
        return t < 0.5f 
            ? 4f * t * t * t 
            : 1f - Mathf.Pow(-2f * t + 2f, 3f) / 2f;
    }

    /// <summary>
    /// Reset the train controller for next arrival
    /// </summary>
    public void Reset()
    {
        StopAllCoroutines();
        isAnimating = false;
        
        if (currentTrain != null)
        {
            currentTrain.SetActive(false);
        }
    }

    void OnDestroy()
    {
        if (countdownController != null)
        {
            countdownController.OnTrainArrival -= TriggerArrival;
        }
    }
}
