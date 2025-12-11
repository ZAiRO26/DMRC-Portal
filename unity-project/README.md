# MetroPortal Unity Project

🚇 Unity WebGL components for the AR Metro Train Arrival Tracker

## Scripts Overview

| Script | Purpose |
|--------|---------|
| `MetroAPIManager.cs` | Fetches train data from backend API |
| `CountdownController.cs` | Real-time MM:SS countdown with color transitions |
| `PortalAnimator.cs` | Animated portal rings with urgency effects |
| `TrainArrivalController.cs` | Train spawn, arrival, and departure animations |
| `ARCameraHandler.cs` | Camera permissions and AR/Static mode |
| `WebGLBridge.cs` | JavaScript ↔ Unity communication |

## Unity Setup Instructions

### 1. Create New Unity Project
```
Unity Hub → New Project → 3D (URP)
Name: MetroPortal
```

### 2. Import Scripts
Copy the entire `Assets/` folder into your Unity project.

### 3. Scene Setup
Create the following hierarchy in your scene:

```
MainPortalScene
├── Main Camera
├── Directional Light
├── Managers (Empty GameObject)
│   ├── MetroAPIManager
│   ├── WebGLBridge
│   └── ARCameraHandler
├── Portal (Empty GameObject)
│   ├── OuterRing (3D Ring mesh)
│   ├── InnerRing (3D Ring mesh)
│   └── CenterGlow (Particle System)
├── Train (Initially disabled)
├── Platform (3D Environment)
├── UI Canvas
│   ├── CountdownText (TextMeshPro)
│   ├── DestinationText (TextMeshPro)
│   └── StatusText (TextMeshPro)
└── SpawnPoints (Empty)
    ├── SpawnPoint
    ├── ArrivalPoint
    └── ExitPoint
```

### 4. Configure Components
1. Add scripts to their respective GameObjects
2. Wire up all references in the Inspector
3. Create materials for portal rings with emission

### 5. WebGL Build Settings
```
File → Build Settings → WebGL
Player Settings:
  - Compression: Brotli
  - Code Optimization: Size
  - Publishing Settings: Decompression Fallback ON
```

### 6. Build & Export
Build to: `frontend/public/unity-build/`

## JavaScript Integration

```javascript
// Send station to Unity
unityInstance.SendMessage('WebGLBridge', 'ReceiveStationID', 'YL16');

// Set AR mode
unityInstance.SendMessage('WebGLBridge', 'SetARMode', '1');

// Receive events from Unity
window.onUnityReady = () => console.log('Unity loaded');
window.onTrainArrived = () => console.log('Train arrived!');
```

## Required Packages
- TextMeshPro (via Package Manager)
- Universal Render Pipeline (URP)
