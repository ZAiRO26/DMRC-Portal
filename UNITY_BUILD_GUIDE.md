# Unity WebGL Build Guide for MetroPortal

Complete step-by-step guide to build and integrate the Unity AR experience.

## Prerequisites

- Unity 2022.3 LTS with WebGL module
- TextMeshPro package

## Step 1: Open Project

1. Open Unity Hub
2. Click "Open" and select `unity-project/` folder
3. Wait for project to load

## Step 2: Setup Scene

### Create Hierarchy:
```
MainScene
├── GameManager (empty GameObject)
├── Portal
│   ├── Ring1 (3D Object > Torus/Circle)
│   ├── Ring2
│   ├── Ring3
│   └── Ring4
├── Train (your 3D train model or cube)
├── UI
│   └── Canvas
│       ├── CountdownText (TextMeshPro)
│       ├── TrainIdText (TextMeshPro)
│       └── DirectionText (TextMeshPro)
└── Main Camera
```

### Attach Scripts:
1. **GameManager** object → Add `GameManager.cs`
2. **Portal** object → Add `PortalController.cs`

### Wire References:
In GameManager Inspector:
- Portal Controller → drag Portal object
- Countdown Text → drag CountdownText
- Train Id Text → drag TrainIdText
- Direction Text → drag DirectionText

In PortalController Inspector:
- Rings → drag Ring1, Ring2, Ring3, Ring4
- Train Prefab → drag Train object

## Step 3: Create Portal Materials

1. Right-click in Project → Create → Material
2. Name: `PortalRingMaterial`
3. Shader: `Universal Render Pipeline/Lit`
4. Enable Emission
5. Set Base Color: `#00D9FF` (cyan)
6. Set Emission Color: `#00D9FF`
7. Apply to all Ring objects

## Step 4: Configure WebGL Build

1. Go to **File > Build Settings**
2. Select **WebGL** platform
3. Click **Switch Platform**
4. Click **Player Settings**:

### Player Settings:
- **Product Name**: `MetroPortal`
- **Company Name**: Your name
- **Resolution**: Default (Responsive)

### Publishing Settings:
- **Compression Format**: Gzip
- **Enable Exceptions**: Full (for debugging)
- **Data Caching**: Enabled

### Other Settings:
- **Color Space**: Gamma
- **Auto Graphics API**: Enabled

## Step 5: Build

1. Click **Build**
2. Select folder: `frontend/public/unity-build/`
3. Wait for build to complete (~5-10 minutes)

## Step 6: Verify Build

After building, you should have:
```
frontend/public/unity-build/
├── Build/
│   ├── MetroPortal.loader.js
│   ├── MetroPortal.data.gz
│   ├── MetroPortal.framework.js.gz
│   └── MetroPortal.wasm.gz
└── TemplateData/ (optional)
```

## Step 7: Update ARView.jsx (if needed)

If your build files have different names, update `ARView.jsx`:
```javascript
const { unityProvider } = useUnityContext({
  loaderUrl: '/unity-build/Build/MetroPortal.loader.js',
  dataUrl: '/unity-build/Build/MetroPortal.data.gz',
  frameworkUrl: '/unity-build/Build/MetroPortal.framework.js.gz',
  codeUrl: '/unity-build/Build/MetroPortal.wasm.gz',
});
```

## Step 8: Test

1. Restart frontend: `npm run dev`
2. Open http://localhost:4200
3. Select a station
4. Click "AR" button on any train
5. Unity should load and display countdown

## Troubleshooting

### Build fails with memory error
- Reduce texture sizes
- Disable unused packages

### AR doesn't load (stuck at 0%)
- Check browser console for errors
- Verify file paths in ARView.jsx
- Ensure .gz files are served correctly

### Unity can't find GameManager
- Ensure GameManager object exists in scene
- GameManager.cs must be attached to it
- Build with the correct scene

## Next Steps

After getting basic AR working:
1. Add 3D train models
2. Enhance portal visual effects
3. Add audio for train arrival
4. Implement camera AR background
