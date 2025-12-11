using UnityEngine;

/// <summary>
/// PortalAnimator - Controls the visual animation of the portal rings
/// Includes rotation, pulsing, and color transitions based on countdown urgency.
/// </summary>
public class PortalAnimator : MonoBehaviour
{
    [Header("Ring References")]
    [Tooltip("Outer portal ring transform")]
    public Transform outerRing;
    
    [Tooltip("Inner portal ring transform")]
    public Transform innerRing;
    
    [Tooltip("Center glow/particle system")]
    public Transform centerGlow;

    [Header("Ring Materials")]
    public Material outerRingMaterial;
    public Material innerRingMaterial;

    [Header("Colors")]
    public Color normalColor = new Color(0f, 0.85f, 1f);    // Neon Blue #00D9FF
    public Color warningColor = new Color(1f, 0.8f, 0f);    // Yellow
    public Color urgentColor = new Color(1f, 0f, 0.33f);    // Neon Red #FF0055

    [Header("Rotation Settings")]
    [Tooltip("Base rotation speed (degrees/second)")]
    public float baseRotationSpeed = 20f;
    
    [Tooltip("Maximum rotation speed multiplier")]
    public float maxSpeedMultiplier = 4f;

    [Header("Pulse Settings")]
    [Tooltip("Base pulse frequency")]
    public float basePulseFrequency = 1f;
    
    [Tooltip("Pulse scale amplitude")]
    public float pulseAmplitude = 0.1f;

    [Header("References")]
    public CountdownController countdownController;

    // State
    private float currentSpeedMultiplier = 1f;
    private Color currentColor;
    private float initialOuterScale;
    private float initialInnerScale;

    void Start()
    {
        currentColor = normalColor;
        
        if (outerRing != null)
            initialOuterScale = outerRing.localScale.x;
        
        if (innerRing != null)
            initialInnerScale = innerRing.localScale.x;

        // Subscribe to countdown events
        if (countdownController != null)
        {
            countdownController.OnWarningThreshold += OnWarning;
            countdownController.OnUrgentThreshold += OnUrgent;
            countdownController.OnTrainArrival += OnArrival;
        }

        ApplyColor(normalColor);
    }

    void Update()
    {
        AnimateRotation();
        AnimatePulse();
        AnimateGlow();
    }

    private void AnimateRotation()
    {
        float speed = baseRotationSpeed * currentSpeedMultiplier;

        if (outerRing != null)
        {
            outerRing.Rotate(0, 0, speed * Time.deltaTime);
        }

        if (innerRing != null)
        {
            innerRing.Rotate(0, 0, -speed * 0.7f * Time.deltaTime);
        }
    }

    private void AnimatePulse()
    {
        float frequency = basePulseFrequency * currentSpeedMultiplier;
        float pulse = 1f + Mathf.Sin(Time.time * frequency * Mathf.PI * 2f) * pulseAmplitude;

        if (outerRing != null)
        {
            float scale = initialOuterScale * pulse;
            outerRing.localScale = new Vector3(scale, scale, outerRing.localScale.z);
        }

        if (innerRing != null)
        {
            // Inner ring pulses slightly out of phase
            float innerPulse = 1f + Mathf.Sin((Time.time + 0.5f) * frequency * Mathf.PI * 2f) * pulseAmplitude * 0.5f;
            float scale = initialInnerScale * innerPulse;
            innerRing.localScale = new Vector3(scale, scale, innerRing.localScale.z);
        }
    }

    private void AnimateGlow()
    {
        if (centerGlow == null) return;

        // Subtle breathing effect
        float intensity = 1f + Mathf.Sin(Time.time * 2f) * 0.2f;
        centerGlow.localScale = Vector3.one * intensity;
    }

    private void OnWarning()
    {
        Debug.Log("[Portal] Warning state - increasing speed");
        currentSpeedMultiplier = 2f;
        LerpToColor(warningColor, 1f);
    }

    private void OnUrgent()
    {
        Debug.Log("[Portal] Urgent state - maximum intensity");
        currentSpeedMultiplier = maxSpeedMultiplier;
        LerpToColor(urgentColor, 0.5f);
    }

    private void OnArrival()
    {
        Debug.Log("[Portal] Train arriving - portal activation");
        // Could trigger special arrival animation here
        StartCoroutine(ArrivalSequence());
    }

    private System.Collections.IEnumerator ArrivalSequence()
    {
        // Flash effect
        for (int i = 0; i < 3; i++)
        {
            ApplyColor(Color.white);
            yield return new WaitForSeconds(0.1f);
            ApplyColor(normalColor);
            yield return new WaitForSeconds(0.1f);
        }

        // Reset to normal
        ResetToNormal();
    }

    private void LerpToColor(Color target, float duration)
    {
        StartCoroutine(ColorLerpCoroutine(target, duration));
    }

    private System.Collections.IEnumerator ColorLerpCoroutine(Color target, float duration)
    {
        Color startColor = currentColor;
        float elapsed = 0f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;
            Color newColor = Color.Lerp(startColor, target, t);
            ApplyColor(newColor);
            yield return null;
        }

        ApplyColor(target);
    }

    private void ApplyColor(Color color)
    {
        currentColor = color;

        if (outerRingMaterial != null)
        {
            outerRingMaterial.SetColor("_EmissionColor", color * 2f);
            outerRingMaterial.color = color;
        }

        if (innerRingMaterial != null)
        {
            innerRingMaterial.SetColor("_EmissionColor", color * 1.5f);
            innerRingMaterial.color = color;
        }
    }

    /// <summary>
    /// Reset portal to normal state
    /// </summary>
    public void ResetToNormal()
    {
        currentSpeedMultiplier = 1f;
        ApplyColor(normalColor);
    }

    void OnDestroy()
    {
        if (countdownController != null)
        {
            countdownController.OnWarningThreshold -= OnWarning;
            countdownController.OnUrgentThreshold -= OnUrgent;
            countdownController.OnTrainArrival -= OnArrival;
        }
    }
}
