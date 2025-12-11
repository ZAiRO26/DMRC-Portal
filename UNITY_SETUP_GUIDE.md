# MetroPortal - Complete Unity Setup Guide

A step-by-step walkthrough to set up the Unity WebGL component for MetroPortal.

---

## Prerequisites

- **Unity Hub** installed ([Download](https://unity.com/download))
- **Unity 2022.3 LTS** (any 2022.3.x version)
- **TextMeshPro** package (included in Unity)
- Approximately **2-3 hours** for full setup

---

## Part 1: Create Unity Project

### Step 1.1: Open Unity Hub
1. Launch **Unity Hub**
2. Click **"New Project"** button (top right)

### Step 1.2: Configure Project
| Setting | Value |
|---------|-------|
| Editor Version | **2022.3.x LTS** (any available) |
| Template | **3D (URP)** - Universal Render Pipeline |
| Project Name | `MetroPortal` |
| Location | Choose any folder |

3. Click **"Create Project"**
4. Wait for Unity to initialize (may take 5-10 minutes first time)

---

## Part 2: Import Scripts

### Step 2.1: Copy Script Files
1. Open **Windows Explorer**
2. Navigate to: `d:\Development\AntiGravity\Metro-Del\unity-project\Assets\`
3. You'll see:
   ```
   Assets/
   ├── Scripts/
   │   ├── MetroAPIManager.cs
   │   ├── CountdownController.cs
   │   ├── PortalAnimator.cs
   │   ├── TrainArrivalController.cs
   │   ├── ARCameraHandler.cs
   │   └── WebGLBridge.cs
   └── Plugins/
       └── WebGL/
           └── CameraPlugin.jslib
   ```

### Step 2.2: Paste into Unity Project
1. Copy the entire `Scripts` folder
2. Copy the entire `Plugins` folder
3. Paste both into your Unity project's `Assets` folder:
   ```
   [Your Unity Project Location]/MetroPortal/Assets/
   ```

### Step 2.3: Verify Import
1. Return to Unity Editor
2. Wait for compilation (progress bar at bottom)
3. Check **Console** window (Window → General → Console)
4. Should show **no errors** (warnings are OK)

> **⚠️ If you see "TextMeshProUGUI not found" error:**
> - Go to **Window → TextMeshPro → Import TMP Essential Resources**
> - Click "Import" in the popup

---

## Part 3: Create Scene Hierarchy

### Step 3.1: Create New Scene
1. **File → New Scene**
2. Choose **Basic (Built-in)** template
3. **File → Save As** → Name it `MainPortalScene`

### Step 3.2: Create Manager Objects

#### Create Managers Parent
1. Right-click in Hierarchy → **Create Empty**
2. Name it: `Managers`
3. Position: `(0, 0, 0)`

#### Add MetroAPIManager
1. Right-click `Managers` → **Create Empty**
2. Name it: `MetroAPIManager`
3. In Inspector, click **Add Component**
4. Search and add: `Metro API Manager`

#### Add WebGLBridge
1. Right-click `Managers` → **Create Empty**
2. Name it: `WebGLBridge`
3. Add Component: `Web GL Bridge`

#### Add ARCameraHandler
1. Right-click `Managers` → **Create Empty**
2. Name it: `ARCameraHandler`
3. Add Component: `AR Camera Handler`

### Step 3.3: Create Portal System

#### Create Portal Parent
1. Right-click in Hierarchy → **Create Empty**
2. Name it: `Portal`
3. Position: `(0, 1.5, 5)` (in front of camera)

#### Create Outer Ring
1. Right-click `Portal` → **3D Object → Torus** (or use a custom ring mesh)
   - If no Torus available: **3D Object → Cylinder**, scale to `(3, 0.1, 3)`
2. Name it: `OuterRing`
3. Scale: `(3, 3, 0.1)`

#### Create Inner Ring
1. Right-click `Portal` → **3D Object → Torus** (or Cylinder)
2. Name it: `InnerRing`
3. Scale: `(2, 2, 0.1)`

#### Create Center Glow
1. Right-click `Portal` → **Effects → Particle System**
2. Name it: `CenterGlow`
3. Configure Particle System:
   - Shape: Sphere, Radius: 0.5
   - Start Color: Cyan (#00D9FF)
   - Start Size: 0.1
   - Emission Rate: 50

### Step 3.4: Create Portal Materials

#### Create Neon Blue Material
1. Right-click in Project → **Create → Material**
2. Name it: `NeonBlue`
3. In Inspector:
   - Shader: **Universal Render Pipeline/Lit**
   - Base Color: `#00D9FF`
   - ✅ Enable **Emission**
   - Emission Color: `#00D9FF`
   - Emission Intensity: `2`
4. Drag onto `OuterRing`

#### Create Neon Red Material
1. Create another Material → Name: `NeonRed`
2. Base Color: `#FF0055`
3. Emission Color: `#FF0055`
4. Drag onto `InnerRing`

### Step 3.5: Create Train System

#### Create Train (Placeholder)
1. Right-click Hierarchy → **3D Object → Cube**
2. Name it: `Train`
3. Scale: `(1, 0.5, 3)` (train-like proportion)
4. Position: `(0, 0.5, 10)` (behind portal)
5. **Disable the GameObject** (uncheck checkbox in Inspector)

> **💡 Tip:** Replace with a proper metro train 3D model later

#### Create Spawn Points
1. Right-click Hierarchy → **Create Empty** → Name: `SpawnPoints`
2. Create 3 child empty objects:
   | Name | Position |
   |------|----------|
   | `SpawnPoint` | `(0, 1.5, 15)` |
   | `ArrivalPoint` | `(0, 1.5, 0)` |
   | `ExitPoint` | `(0, 1.5, -15)` |

### Step 3.6: Create UI Canvas

#### Create Canvas
1. Right-click Hierarchy → **UI → Canvas**
2. In Canvas component:
   - Render Mode: **Screen Space - Overlay**
   - UI Scale Mode: **Scale With Screen Size**
   - Reference Resolution: `1080 x 1920` (portrait mobile)

#### Create Countdown Text
1. Right-click Canvas → **UI → Text - TextMeshPro**
2. Name it: `CountdownText`
3. In Inspector:
   - Text: `00:00`
   - Font Size: `120`
   - Alignment: Center
   - Color: White
4. In Rect Transform:
   - Anchor: Bottom Center
   - Position Y: `300`

#### Create Destination Text
1. Right-click Canvas → **UI → Text - TextMeshPro**
2. Name it: `DestinationText`
3. Text: `HUDA CITY CENTRE`
4. Font Size: `36`
5. Position Y: `450`

#### Create Status Text
1. Right-click Canvas → **UI → Text - TextMeshPro**
2. Name it: `StatusText`
3. Text: `APPROACHING`
4. Font Size: `24`
5. Position Y: `200`

---

## Part 4: Wire Up Components

### Step 4.1: Configure WebGLBridge
1. Select `WebGLBridge` in Hierarchy
2. In Inspector, drag and drop:
   | Field | Drag From |
   |-------|-----------|
   | Api Manager | `Managers/MetroAPIManager` |
   | Countdown Controller | *(add to Canvas first)* |
   | Portal Animator | `Portal` |
   | Train Controller | *(add to Train first)* |
   | Camera Handler | `Managers/ARCameraHandler` |

### Step 4.2: Add Missing Components

#### Add PortalAnimator to Portal
1. Select `Portal` object
2. Add Component → `Portal Animator`
3. Drag references:
   - Outer Ring → `OuterRing`
   - Inner Ring → `InnerRing`
   - Center Glow → `CenterGlow`
   - Outer Ring Material → `NeonBlue`
   - Inner Ring Material → `NeonRed`

#### Add CountdownController to Canvas
1. Select `Canvas` (or create empty child)
2. Add Component → `Countdown Controller`
3. Drag references:
   - Countdown Text → `CountdownText`
   - Destination Text → `DestinationText`
   - Status Text → `StatusText`

#### Add TrainArrivalController to Train
1. Select `Train` object
2. Add Component → `Train Arrival Controller`
3. Drag references:
   - Train Prefab → `Train` itself
   - Spawn Point → `SpawnPoints/SpawnPoint`
   - Arrival Point → `SpawnPoints/ArrivalPoint`
   - Exit Point → `SpawnPoints/ExitPoint`

### Step 4.3: Configure MetroAPIManager
1. Select `MetroAPIManager`
2. Set:
   - API Base URL: `http://localhost:3000/api/v1/metro`
   - Refresh Interval: `30`
3. Drag references:
   - Countdown Controller → from Canvas
   - Train Controller → from Train

### Step 4.4: Complete WebGLBridge Wiring
1. Go back to `WebGLBridge`
2. Now drag all the remaining references you just created

---

## Part 5: Configure Camera

### Step 5.1: Setup Main Camera
1. Select `Main Camera`
2. Position: `(0, 1.5, -5)`
3. Rotation: `(0, 0, 0)`
4. Clear Flags: **Solid Color**
5. Background: `#1A0033` (dark purple)

### Step 5.2: Add Post Processing (Optional)
1. Select Main Camera
2. Add Component → **Volume** (or use Global Volume)
3. Add **Bloom** override:
   - Intensity: `1`
   - Threshold: `0.9`

---

## Part 6: Test in Editor

### Step 6.1: Enter Play Mode
1. Press **Play** button (▶️)
2. Check Console for errors
3. You should see:
   - Portal rings rotating
   - UI showing `00:00`
   - Debug logs: `[WebGLBridge] Bridge initialized`

### Step 6.2: Test API Connection
1. Make sure backend is running:
   ```bash
   cd d:\Development\AntiGravity\Metro-Del\backend
   npm run dev
   ```
2. In Unity Console, you should see API fetch attempts

---

## Part 7: Build for WebGL

### Step 7.1: Configure Build Settings
1. **File → Build Settings**
2. Select **WebGL** platform
3. Click **Switch Platform** (first time takes a while)

### Step 7.2: Configure Player Settings
1. Click **Player Settings**
2. Configure:

| Setting | Value |
|---------|-------|
| Company Name | `MetroPortal` |
| Product Name | `MetroPortal AR` |
| **Resolution → Default Canvas Width** | `1080` |
| **Resolution → Default Canvas Height** | `1920` |
| **Publishing Settings → Compression Format** | `Brotli` |
| **Publishing Settings → Decompression Fallback** | ✅ Enabled |
| **Other Settings → Color Space** | `Gamma` |
| **Other Settings → API Compatibility** | `.NET Standard 2.1` |

### Step 7.3: Optimize for Mobile
1. In Player Settings → **Quality**:
   - Texture Quality: Medium
   - Anti Aliasing: Disabled
   - Shadows: Disabled
2. In Player Settings → **Other**:
   - Managed Stripping Level: High

### Step 7.4: Build
1. Click **Build**
2. Select output folder:
   ```
   d:\Development\AntiGravity\Metro-Del\frontend\public\unity-build
   ```
3. Wait for build (10-30 minutes first time)

### Step 7.5: Verify Build Output
You should see these files:
```
frontend/public/unity-build/
├── Build/
│   ├── unity-build.loader.js
│   ├── unity-build.data.br
│   ├── unity-build.framework.js.br
│   └── unity-build.wasm.br
├── TemplateData/
└── index.html
```

---

## Part 8: Integrate with React

### Step 8.1: Install react-unity-webgl
```bash
cd d:\Development\AntiGravity\Metro-Del\frontend
npm install react-unity-webgl
```

### Step 8.2: Update UnityWebGLLoader.jsx
Replace the placeholder content with actual Unity loading code. I can help you with this once the build is ready.

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Scripts won't compile | Import TextMeshPro Essential Resources |
| Build size too large | Enable stripping, reduce textures |
| CORS errors in browser | Ensure backend CORS allows localhost:5173 |
| Camera not working | Check HTTPS (camera requires secure context) |
| Blank WebGL canvas | Check browser console for errors |

### Recommended Build Size
- **Target:** < 15MB compressed
- **Use:** Brotli compression
- **Strip:** Unused code with High stripping level

---

## Next Steps After Build

1. ✅ Test the build locally with `npm run dev`
2. ✅ Deploy backend to Railway/Render
3. ✅ Deploy frontend to Netlify/Vercel
4. ✅ Update API URLs for production
5. ✅ Test on mobile devices

---

**Questions?** Let me know when you reach any step and I can provide more details!
