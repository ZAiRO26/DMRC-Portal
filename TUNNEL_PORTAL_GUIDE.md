# 🌀 Tunnel Portal Effect - Unity Setup Guide

Complete step-by-step guide to recreate the AR tunnel portal effect from the reference images.

![Reference Effect](./docs/portal-reference.png)

---

## 📋 What We're Building

| Feature | Description |
|---------|-------------|
| **Tunnel Effect** | 8+ rings creating depth illusion |
| **Glow Materials** | Neon blue/red emission |
| **Camera Background** | Real camera feed behind portal |
| **Countdown Timer** | Large centered MM:SS display |
| **Animations** | Rotating rings, pulsing glow |

---

## 🛠️ Prerequisites

- Unity 2022.3 LTS
- Universal Render Pipeline (URP)
- TextMeshPro package
- Post Processing (for Bloom)

---

## STEP 1: Create New URP Project

1. Open Unity Hub → New Project
2. Select **3D (URP)** template
3. Name: `MetroPortal`
4. Create Project

---

## STEP 2: Import Scripts

Copy these files from `unity-project/Assets/Scripts/` into your Unity project:
- `GameManager.cs`
- `PortalController.cs`
- `ARCameraHandler.cs`

---

## STEP 3: Create Scene Hierarchy

Create this exact structure in your Hierarchy:

```
📁 MainScene
├── 🎮 GameManager (Empty GameObject)
├── 📷 Main Camera
├── 💡 Directional Light
├── 🌀 Portal (Empty GameObject)
│   ├── 🔴 OuterRing1 (Torus - Scale 2.0)
│   ├── 🔴 OuterRing2 (Torus - Scale 1.8)
│   ├── 🔴 OuterRing3 (Torus - Scale 1.6)
│   ├── 🟣 MiddleRing1 (Torus - Scale 1.4)
│   ├── 🟣 MiddleRing2 (Torus - Scale 1.2)
│   ├── 🔵 InnerRing1 (Torus - Scale 1.0)
│   ├── 🔵 InnerRing2 (Torus - Scale 0.8)
│   ├── 🔵 InnerRing3 (Torus - Scale 0.6)
│   ├── 🔵 CoreRing (Torus - Scale 0.4)
│   └── ✨ CenterGlow (Sphere with emission)
└── 📱 UI
    └── Canvas (Screen Space - Overlay)
        ├── CountdownText (TextMeshPro)
        ├── TrainIdText (TextMeshPro)
        └── StatusText (TextMeshPro)
```

---

## STEP 4: Create Torus Rings

Unity doesn't have a built-in Torus. Choose one method:

### Option A: Use ProBuilder (Recommended)
1. Window → Package Manager → Install **ProBuilder**
2. Tools → ProBuilder → ProBuilder Window
3. New Shape → Torus
4. Set: Rows=16, Columns=24, Tube Radius=0.05, Radius=1.0

### Option B: Import Torus Model
1. Download a torus FBX from Unity Asset Store (free)
2. Or create in Blender and export as FBX

### Option C: Use Cylinders (Simple Alternative)
1. Create Cylinder
2. Scale Y to 0.02 (thin)
3. Hollow it by making material transparent in center

---

## STEP 5: Position the Rings (Tunnel Depth)

Each ring should be slightly further from camera to create tunnel depth:

| Ring | Scale (X,Y,Z) | Position Z | Color |
|------|---------------|------------|-------|
| OuterRing1 | 2.0, 2.0, 2.0 | -5.0 | Red |
| OuterRing2 | 1.8, 1.8, 1.8 | -4.5 | Red |
| OuterRing3 | 1.6, 1.6, 1.6 | -4.0 | Red/Purple |
| MiddleRing1 | 1.4, 1.4, 1.4 | -3.5 | Purple |
| MiddleRing2 | 1.2, 1.2, 1.2 | -3.0 | Purple/Blue |
| InnerRing1 | 1.0, 1.0, 1.0 | -2.5 | Blue |
| InnerRing2 | 0.8, 0.8, 0.8 | -2.0 | Blue |
| InnerRing3 | 0.6, 0.6, 0.6 | -1.5 | Blue |
| CoreRing | 0.4, 0.4, 0.4 | -1.0 | Bright Blue |

Camera should be at Position (0, 0, 0) looking at -Z.

---

## STEP 6: Create Glow Materials

### Create "RedGlow" Material
1. Right-click in Project → Create → Material
2. Name: `RedGlow`
3. Shader: `Universal Render Pipeline/Lit`
4. Settings:
   - Surface Type: Transparent
   - Base Color: `#FF3333` (Alpha: 200)
   - ✅ Enable Emission
   - Emission Color: `#FF3333`
   - Emission Intensity: `3.0`

### Create "BlueGlow" Material
1. Duplicate RedGlow → Rename to `BlueGlow`
2. Change colors:
   - Base Color: `#0088FF`
   - Emission Color: `#00CCFF`
   - Emission Intensity: `4.0`

### Create "PurpleGlow" Material
1. Duplicate → Rename to `PurpleGlow`
2. Colors:
   - Base Color: `#8844FF`
   - Emission Color: `#AA66FF`
   - Emission Intensity: `3.5`

### Apply Materials to Rings
- OuterRing1, OuterRing2, OuterRing3 → `RedGlow`
- MiddleRing1, MiddleRing2 → `PurpleGlow`
- InnerRing1, InnerRing2, InnerRing3, CoreRing → `BlueGlow`

---

## STEP 7: Enable Bloom Post-Processing

Bloom makes the glow effect pop!

1. Create Empty → Name `PostProcessVolume`
2. Add Component → **Volume**
3. Profile → New
4. Add Override → **Bloom**
5. Bloom Settings:
   - Threshold: 0.5
   - Intensity: 2.0
   - Scatter: 0.7
   - Tint: White
   - ✅ High Quality Filtering

6. On **Main Camera**:
   - Add Component → **Volume** (if not present)
   - Ensure Post Processing is ON in Camera settings

---

## STEP 8: Setup Countdown UI

1. Create Canvas (Screen Space - Overlay)
2. Create TextMeshPro - Text (UI)
3. Settings:
   - Font Size: 120
   - Font Style: Bold
   - Alignment: Center
   - Color: White
   - Position: Center of screen
   - Enable **Outline** (2px, black)

4. Name it `CountdownText`

---

## STEP 9: Configure Camera for AR

For transparent background (camera shows through):

### In Player Settings:
1. Edit → Project Settings → Player
2. Resolution and Presentation:
   - Color Space: Gamma
3. Other Settings:
   - Auto Graphics API: ✅

### On Main Camera:
1. Clear Flags: **Solid Color**
2. Background: **#00000000** (fully transparent)
3. Depth: -1

### In URP Settings:
1. Find URP Renderer Asset
2. Renderer Features → Add Clear Background (if available)

---

## STEP 10: Wire Up Scripts

### On GameManager Object:
1. Add Component → `GameManager`
2. Drag references:
   - Portal Controller → Portal object
   - Countdown Text → CountdownText UI
   - Train Id Text → TrainIdText UI
   - Direction Text → StatusText UI

### On Portal Object:
1. Add Component → `PortalController`
2. Drag references:
   - Rings array → All 9 ring objects
   - Ring Material → BlueGlow material

---

## STEP 11: Add Ring Rotation Animation

Create a simple rotation script for individual rings:

```csharp
// RingRotator.cs - Add to each ring
using UnityEngine;

public class RingRotator : MonoBehaviour
{
    public float rotationSpeed = 30f;
    public Vector3 rotationAxis = Vector3.forward;
    
    void Update()
    {
        transform.Rotate(rotationAxis * rotationSpeed * Time.deltaTime);
    }
}
```

Apply to rings with alternating directions:
- Odd rings: rotationSpeed = 30
- Even rings: rotationSpeed = -25

---

## STEP 12: WebGL Build Settings

1. File → Build Settings
2. Platform: **WebGL**
3. Click **Switch Platform**

### Player Settings:
- Product Name: `MetroPortal`
- Resolution: Default (responsive)
- Template: Minimal

### Publishing Settings:
- Compression: Gzip
- Data Caching: ✅
- Exceptions: Full (for debugging)

### Build:
1. Click **Build**
2. Select: `frontend/public/unity-build/`
3. Wait for build (~10 min)

---

## STEP 13: Test with PWA

1. Start frontend: `npm run dev`
2. Open http://localhost:4200
3. Select a station
4. Click any "AR" button
5. Unity should load with your portal!

---

## 🎨 Visual Tuning Tips

### Make It More "Unreal":
- Increase Bloom intensity to 3.0+
- Add particle effects (sparks, dust)
- Add subtle camera shake
- Add audio (low hum, whoosh sounds)

### Color Matching Reference:
```
Outer rings: #FF4444 (Red-Orange)
Middle rings: #FF00FF (Magenta)
Inner rings: #00AAFF (Cyan-Blue)
Core: #0044FF (Deep Blue)
```

### Add Depth Effects:
- Far rings: Lower alpha (0.3-0.5)
- Near rings: Higher alpha (0.8-1.0)
- Creates foggy tunnel effect

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| No glow visible | Enable Bloom in post-processing |
| Black background (no camera) | Set Camera Background alpha to 0 |
| Rings not visible | Check Z positions and camera angle |
| AR button stuck at 0% | Verify build files in unity-build/ |
| Colors wrong | Check material emission settings |

---

## 📱 Final Result

When complete, users will see:
1. Real camera background (metro station)
2. Glowing tunnel portal floating in space
3. Countdown timer: `00:31`
4. Rings rotating and pulsing
5. Portal intensifies as train approaches!

**You've created the reference AR experience! 🎉**
