using UnityEngine;

/// <summary>
/// RingRotator - Simple rotation animation for portal rings
/// Attach to each ring object for spinning effect
/// </summary>
public class RingRotator : MonoBehaviour
{
    [Header("Rotation Settings")]
    [Tooltip("Speed of rotation in degrees per second")]
    public float rotationSpeed = 30f;
    
    [Tooltip("Axis to rotate around")]
    public Vector3 rotationAxis = Vector3.forward;
    
    [Tooltip("Enable pulsing scale effect")]
    public bool enablePulse = true;
    
    [Tooltip("Amount to pulse (0.1 = 10% scale change)")]
    public float pulseAmount = 0.05f;
    
    [Tooltip("Speed of pulse animation")]
    public float pulseSpeed = 2f;

    private Vector3 originalScale;

    private void Start()
    {
        originalScale = transform.localScale;
    }

    private void Update()
    {
        // Rotation
        transform.Rotate(rotationAxis * rotationSpeed * Time.deltaTime, Space.Self);
        
        // Pulse effect
        if (enablePulse)
        {
            float pulse = 1f + Mathf.Sin(Time.time * pulseSpeed) * pulseAmount;
            transform.localScale = originalScale * pulse;
        }
    }

    /// <summary>
    /// Set rotation speed (called from PortalController for urgency)
    /// </summary>
    public void SetSpeed(float speed)
    {
        rotationSpeed = speed;
    }

    /// <summary>
    /// Set pulse intensity (higher when train is near)
    /// </summary>
    public void SetPulseIntensity(float intensity)
    {
        pulseAmount = intensity;
        pulseSpeed = 2f + intensity * 4f;
    }
}
