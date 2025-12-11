using System;
using System.Runtime.InteropServices;
using UnityEngine;

/// <summary>
/// ARCameraHandler - Manages camera permissions and AR/Static mode switching
/// Uses WebGL plugin to access device camera for AR overlay effect.
/// </summary>
public class ARCameraHandler : MonoBehaviour
{
    [Header("Camera Settings")]
    [Tooltip("Material to apply camera texture to (for background)")]
    public Material backgroundMaterial;
    
    [Tooltip("Renderer for background plane")]
    public Renderer backgroundRenderer;

    [Header("Fallback")]
    [Tooltip("Static background when camera unavailable")]
    public Texture2D fallbackTexture;

    [Header("State")]
    public bool isARMode = false;
    public bool hasCameraPermission = false;

    // Events
    public event Action OnCameraGranted;
    public event Action OnCameraDenied;
    public event Action<Texture2D> OnCameraFrame;

    // WebGL external calls
    #if UNITY_WEBGL && !UNITY_EDITOR
    [DllImport("__Internal")]
    private static extern void RequestCameraPermission();

    [DllImport("__Internal")]
    private static extern void StartCameraFeed();

    [DllImport("__Internal")]
    private static extern void StopCameraFeed();

    [DllImport("__Internal")]
    private static extern bool IsCameraActive();
    #endif

    private WebCamTexture webCamTexture;

    void Start()
    {
        Debug.Log("[ARCamera] Handler initialized");
        
        // Apply fallback initially
        if (backgroundMaterial != null && fallbackTexture != null)
        {
            backgroundMaterial.mainTexture = fallbackTexture;
        }
    }

    /// <summary>
    /// Request camera permission from user
    /// Called from JavaScript when user clicks "Enable AR"
    /// </summary>
    public void RequestCamera()
    {
        Debug.Log("[ARCamera] Requesting camera access...");

        #if UNITY_WEBGL && !UNITY_EDITOR
        RequestCameraPermission();
        #elif UNITY_EDITOR
        // Simulate in editor
        StartCoroutine(SimulatePermissionRequest());
        #else
        // Native mobile
        StartNativeCamera();
        #endif
    }

    /// <summary>
    /// Called from JavaScript when camera permission is granted
    /// </summary>
    public void OnPermissionGranted()
    {
        Debug.Log("[ARCamera] Camera permission granted");
        hasCameraPermission = true;
        isARMode = true;
        
        OnCameraGranted?.Invoke();
        
        #if UNITY_WEBGL && !UNITY_EDITOR
        StartCameraFeed();
        #endif
    }

    /// <summary>
    /// Called from JavaScript when camera permission is denied
    /// </summary>
    public void OnPermissionDenied()
    {
        Debug.Log("[ARCamera] Camera permission denied - using static mode");
        hasCameraPermission = false;
        isARMode = false;
        
        OnCameraDenied?.Invoke();
        EnableStaticMode();
    }

    /// <summary>
    /// Enable AR mode with camera background
    /// </summary>
    public void EnableARMode()
    {
        if (!hasCameraPermission)
        {
            Debug.LogWarning("[ARCamera] Cannot enable AR - no camera permission");
            return;
        }

        isARMode = true;
        Debug.Log("[ARCamera] AR mode enabled");
    }

    /// <summary>
    /// Enable static 3D mode without camera
    /// </summary>
    public void EnableStaticMode()
    {
        isARMode = false;
        
        // Apply fallback texture
        if (backgroundMaterial != null && fallbackTexture != null)
        {
            backgroundMaterial.mainTexture = fallbackTexture;
        }

        Debug.Log("[ARCamera] Static mode enabled");
    }

    /// <summary>
    /// Update background with camera frame (called from JS plugin)
    /// </summary>
    public void UpdateCameraFrame(string base64Image)
    {
        // In WebGL, JavaScript sends camera frames as base64
        // This would decode and apply to background material
        Debug.Log("[ARCamera] Received camera frame update");
    }

    #if UNITY_EDITOR
    private System.Collections.IEnumerator SimulatePermissionRequest()
    {
        yield return new WaitForSeconds(0.5f);
        
        // Simulate granted in editor
        OnPermissionGranted();
    }
    #endif

    private void StartNativeCamera()
    {
        if (WebCamTexture.devices.Length > 0)
        {
            // Use back camera if available
            string deviceName = null;
            foreach (var device in WebCamTexture.devices)
            {
                if (!device.isFrontFacing)
                {
                    deviceName = device.name;
                    break;
                }
            }

            webCamTexture = new WebCamTexture(deviceName, 1280, 720, 30);
            webCamTexture.Play();

            if (backgroundMaterial != null)
            {
                backgroundMaterial.mainTexture = webCamTexture;
            }

            hasCameraPermission = true;
            isARMode = true;
            OnCameraGranted?.Invoke();
        }
        else
        {
            OnPermissionDenied();
        }
    }

    void OnDestroy()
    {
        if (webCamTexture != null && webCamTexture.isPlaying)
        {
            webCamTexture.Stop();
        }

        #if UNITY_WEBGL && !UNITY_EDITOR
        StopCameraFeed();
        #endif
    }
}
