using System.Runtime.InteropServices;
using UnityEngine;

/// <summary>
/// WebGLBridge - Handles JavaScript ↔ Unity communication
/// This is the central bridge for all external calls between the React app and Unity.
/// </summary>
public class WebGLBridge : MonoBehaviour
{
    [Header("Manager References")]
    public MetroAPIManager apiManager;
    public CountdownController countdownController;
    public PortalAnimator portalAnimator;
    public TrainArrivalController trainController;
    public ARCameraHandler cameraHandler;

    // JavaScript → Unity external calls are received via SendMessage
    // Unity → JavaScript calls use DllImport

    #if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void SendLoadingStatus(bool isLoading);

    [DllImport("__Internal")]
    private static extern void SendReadyStatus();

    [DllImport("__Internal")]
    private static extern void SendErrorMessage(string error);

    [DllImport("__Internal")]
    private static extern void SendCountdownUpdate(int seconds);

    [DllImport("__Internal")]
    private static extern void SendTrainArrived();
    #endif

    private static WebGLBridge instance;
    public static WebGLBridge Instance => instance;

    void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        Debug.Log("[WebGLBridge] Bridge initialized");
        
        // Notify JavaScript that Unity is ready
        NotifyReady();

        // Subscribe to events
        if (countdownController != null)
        {
            countdownController.OnTrainArrival += OnTrainArrived;
        }
    }

    // =========================================================================
    // INCOMING: JavaScript → Unity (called via SendMessage)
    // =========================================================================

    /// <summary>
    /// Called from JavaScript when user selects a station
    /// Usage: unityInstance.SendMessage('WebGLBridge', 'ReceiveStationID', 'YL16');
    /// </summary>
    public void ReceiveStationID(string stationId)
    {
        Debug.Log($"[WebGLBridge] Received station ID: {stationId}");
        
        if (apiManager != null)
        {
            apiManager.SetStation(stationId);
        }

        if (portalAnimator != null)
        {
            portalAnimator.ResetToNormal();
        }
    }

    /// <summary>
    /// Called from JavaScript with train arrival data as JSON
    /// Usage: unityInstance.SendMessage('WebGLBridge', 'ReceiveTrainData', jsonString);
    /// </summary>
    public void ReceiveTrainData(string jsonData)
    {
        Debug.Log($"[WebGLBridge] Received train data: {jsonData.Substring(0, Mathf.Min(50, jsonData.Length))}...");
        
        try
        {
            TrainArrivalData data = JsonUtility.FromJson<TrainArrivalData>(jsonData);
            
            if (data.trains != null && data.trains.Length > 0)
            {
                TrainInfo nextTrain = data.trains[0];
                countdownController?.StartCountdown(nextTrain.arrivalTime, nextTrain.direction);
                trainController?.PrepareTrainArrival(nextTrain);
            }
        }
        catch (System.Exception e)
        {
            Debug.LogError($"[WebGLBridge] JSON parse error: {e.Message}");
            NotifyError("Failed to parse train data");
        }
    }

    /// <summary>
    /// Called from JavaScript to enable/disable AR mode
    /// Usage: unityInstance.SendMessage('WebGLBridge', 'SetARMode', '1'); // 1=AR, 0=Static
    /// </summary>
    public void SetARMode(string mode)
    {
        bool arEnabled = mode == "1" || mode.ToLower() == "true";
        Debug.Log($"[WebGLBridge] Setting AR mode: {arEnabled}");

        if (cameraHandler != null)
        {
            if (arEnabled)
                cameraHandler.EnableARMode();
            else
                cameraHandler.EnableStaticMode();
        }
    }

    /// <summary>
    /// Called from JavaScript when camera permission result is known
    /// Usage: unityInstance.SendMessage('WebGLBridge', 'OnCameraPermission', 'granted');
    /// </summary>
    public void OnCameraPermission(string result)
    {
        Debug.Log($"[WebGLBridge] Camera permission: {result}");

        if (cameraHandler != null)
        {
            if (result == "granted")
                cameraHandler.OnPermissionGranted();
            else
                cameraHandler.OnPermissionDenied();
        }
    }

    // =========================================================================
    // OUTGOING: Unity → JavaScript
    // =========================================================================

    /// <summary>
    /// Notify JavaScript that Unity is ready
    /// </summary>
    public void NotifyReady()
    {
        Debug.Log("[WebGLBridge] Notifying JS: Unity Ready");
        
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendReadyStatus();
        #endif
    }

    /// <summary>
    /// Notify JavaScript of loading state change
    /// </summary>
    public void NotifyLoading(bool isLoading)
    {
        Debug.Log($"[WebGLBridge] Notifying JS: Loading = {isLoading}");
        
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendLoadingStatus(isLoading);
        #endif
    }

    /// <summary>
    /// Notify JavaScript of an error
    /// </summary>
    public void NotifyError(string message)
    {
        Debug.LogError($"[WebGLBridge] Notifying JS: Error = {message}");
        
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendErrorMessage(message);
        #endif
    }

    /// <summary>
    /// Notify JavaScript when train arrives
    /// </summary>
    private void OnTrainArrived()
    {
        Debug.Log("[WebGLBridge] Notifying JS: Train Arrived");
        
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendTrainArrived();
        #endif
    }

    void OnDestroy()
    {
        if (countdownController != null)
        {
            countdownController.OnTrainArrival -= OnTrainArrived;
        }
    }
}
