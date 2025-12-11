using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

/// <summary>
/// MetroAPIManager - Handles communication with the MetroPortal backend API
/// This script fetches train arrival data and updates the UI accordingly.
/// </summary>
public class MetroAPIManager : MonoBehaviour
{
    [Header("API Configuration")]
    [Tooltip("Base URL of the backend API")]
    public string apiBaseUrl = "http://localhost:3000/api/v1/metro";
    
    [Tooltip("How often to refresh data (seconds)")]
    public float refreshInterval = 30f;

    [Header("Testing (Editor Only)")]
    [Tooltip("Enable to auto-start with test station")]
    public bool autoStartInEditor = true;
    
    [Tooltip("Station ID to use for testing")]
    public string testStationId = "YL16";

    [Header("References")]
    public CountdownController countdownController;
    public TrainArrivalController trainController;

    // Current station being tracked
    private string currentStationId;
    private Coroutine refreshCoroutine;

    // Events for other scripts to subscribe to
    public event Action<TrainArrivalData> OnArrivalDataReceived;
    public event Action<string> OnAPIError;

    void Start()
    {
        Debug.Log("[MetroAPI] Manager initialized. Waiting for station selection...");
        
        // Auto-start in Editor for testing
        #if UNITY_EDITOR
        if (autoStartInEditor && !string.IsNullOrEmpty(testStationId))
        {
            Debug.Log($"[MetroAPI] Auto-starting with test station: {testStationId}");
            Invoke("StartTestStation", 1f); // Delay 1 second for other scripts to initialize
        }
        #endif
    }
    
    // Called by Invoke for delayed start
    private void StartTestStation()
    {
        SetStation(testStationId);
    }

    /// <summary>
    /// Called from JavaScript when user selects a station
    /// </summary>
    /// <param name="stationId">Station ID (e.g., "YL16" for Rajiv Chowk)</param>
    public void SetStation(string stationId)
    {
        Debug.Log($"[MetroAPI] Station selected: {stationId}");
        currentStationId = stationId;
        
        // Stop existing refresh if running
        if (refreshCoroutine != null)
        {
            StopCoroutine(refreshCoroutine);
        }
        
        // Start new refresh cycle
        refreshCoroutine = StartCoroutine(RefreshLoop());
    }

    private IEnumerator RefreshLoop()
    {
        while (true)
        {
            yield return StartCoroutine(FetchArrivals(currentStationId));
            yield return new WaitForSeconds(refreshInterval);
        }
    }

    private IEnumerator FetchArrivals(string stationId)
    {
        string url = $"{apiBaseUrl}/arrivals/{stationId}";
        Debug.Log($"[MetroAPI] Fetching: {url}");

        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            request.timeout = 10;
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                string json = request.downloadHandler.text;
                Debug.Log($"[MetroAPI] Response received: {json.Substring(0, Math.Min(100, json.Length))}...");
                
                try
                {
                    APIResponse response = JsonUtility.FromJson<APIResponse>(json);
                    if (response.success && response.data != null)
                    {
                        ProcessArrivalData(response.data);
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError($"[MetroAPI] JSON Parse Error: {e.Message}");
                    OnAPIError?.Invoke("Failed to parse API response");
                }
            }
            else
            {
                Debug.LogError($"[MetroAPI] Request failed: {request.error}");
                OnAPIError?.Invoke(request.error);
            }
        }
    }

    private void ProcessArrivalData(TrainArrivalData data)
    {
        Debug.Log($"[MetroAPI] Processing {data.trains?.Length ?? 0} trains for {data.station}");
        
        // Update countdown controller with first train
        if (data.trains != null && data.trains.Length > 0)
        {
            TrainInfo nextTrain = data.trains[0];
            countdownController?.StartCountdown(nextTrain.arrivalTime, nextTrain.direction);
            trainController?.PrepareTrainArrival(nextTrain);
        }
        
        // Notify subscribers
        OnArrivalDataReceived?.Invoke(data);
    }

    void OnDestroy()
    {
        if (refreshCoroutine != null)
        {
            StopCoroutine(refreshCoroutine);
        }
    }
}

// ============================================================================
// DATA MODELS
// ============================================================================

[Serializable]
public class APIResponse
{
    public bool success;
    public TrainArrivalData data;
}

[Serializable]
public class TrainArrivalData
{
    public string station;
    public string stationId;
    public string line;
    public string lineColor;
    public TrainInfo[] trains;
    public string lastUpdated;
    public string source;
}

[Serializable]
public class TrainInfo
{
    public string trainNumber;
    public string direction;
    public int arrivalTime; // seconds until arrival
    public int platform;
    public string status;
}
