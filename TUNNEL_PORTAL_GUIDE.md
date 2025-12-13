# 🌀 Tunnel Portal AR Effect - Complete Beginner's Guide

This guide will walk you through creating the AR tunnel portal effect step-by-step. Every action is explained in detail for first-time Unity users.

---

# PART 1: GETTING STARTED

## Step 1.1: Install Unity Hub

If you don't have Unity yet:

1. Go to https://unity.com/download
2. Download **Unity Hub**
3. Install and open Unity Hub
4. Sign in with your Unity account (create free account if needed)

---

## Step 1.2: Install Unity Editor

1. In Unity Hub, click **Installs** on the left
2. Click **Install Editor** button (top right)
3. Select **Unity 2022.3 LTS** (Long Term Support)
4. Check these modules:
   - ✅ **WebGL Build Support** (REQUIRED for our project!)
   - ✅ Documentation
5. Click **Install** and wait (this takes 15-30 minutes)

---

## Step 1.3: Create New Project

1. In Unity Hub, click **Projects** on the left
2. Click **New project** button (top right)
3. Select **3D (URP)** template from the list
   - URP = Universal Render Pipeline (gives us nice graphics)
4. Set Project name: `MetroPortal`
5. Set Location: Choose where to save (e.g., `D:\Development\MetroPortal`)
6. Click **Create project**
7. Wait for Unity to open (first time takes 3-5 minutes)

---

## Step 1.4: Understand the Unity Interface

When Unity opens, you'll see:

```
┌─────────────────────────────────────────────────────────────────┐
│  [File] [Edit] [Assets] [GameObject] [Component] [Window]       │
├─────────────┬───────────────────────────────┬───────────────────┤
│  HIERARCHY  │        SCENE VIEW             │    INSPECTOR      │
│             │                               │                   │
│  - Main     │    (This is where you        │  (Shows details   │
│    Camera   │     see your 3D scene)       │   of selected     │
│  - Light    │                               │   object)         │
│             │                               │                   │
├─────────────┴───────────────────────────────┴───────────────────┤
│                      PROJECT / CONSOLE                           │
│  (Your files and folders)        (Error messages)               │
└─────────────────────────────────────────────────────────────────┘
```

- **Hierarchy** = List of all objects in your scene
- **Scene View** = 3D preview of your world
- **Inspector** = Properties of selected object
- **Project** = Your files and assets

---

# PART 2: IMPORT THE SCRIPTS

## Step 2.1: Create Scripts Folder

1. In the **Project** panel (bottom of screen), you'll see "Assets"
2. Right-click on **Assets**
3. Select **Create → Folder**
4. Name it: `Scripts`

---

## Step 2.2: Copy Script Files

1. Open Windows File Explorer
2. Navigate to your project: `D:\Development\AntiGravity\Metro-Del\unity-project\Assets\Scripts\`
3. Copy these files:
   - `GameManager.cs`
   - `PortalController.cs`
   - `RingRotator.cs`
4. In Unity, right-click on your `Scripts` folder
5. Select **Show in Explorer**
6. Paste the copied files there
7. Go back to Unity - you'll see the scripts appear

---

# PART 3: CREATE THE SCENE STRUCTURE

## Step 3.1: Save Your Scene First

1. Press **Ctrl + S**
2. A save dialog appears
3. Name your scene: `MainScene`
4. Click **Save**

---

## Step 3.2: Create the GameManager Object

1. In **Hierarchy** panel (left side), right-click on empty space
2. Select **Create Empty**
3. A new object "GameObject" appears - click on it
4. In **Inspector** (right side), at the very top, you'll see the name
5. Change the name from "GameObject" to: `GameManager`
6. Press **Enter** to confirm

**What is this?**
> This empty object will hold our main game controller script.

---

## Step 3.3: Create the Portal Parent Object

1. Right-click in **Hierarchy** → **Create Empty**
2. Rename to: `Portal`
3. In **Inspector**, find **Transform** section
4. Set **Position** to: X=0, Y=0, Z=-3
   - This places the portal 3 meters in front of camera

**What is this?**
> This will be the parent container for all our portal rings.

---

## Step 3.4: Create the First Ring

1. Right-click on **Portal** in Hierarchy (not empty space!)
2. Select **3D Object → Cylinder**
3. A cylinder appears as a child of Portal
4. Rename it to: `Ring01`

---

## Step 3.5: Shape the Cylinder into a Ring

With **Ring01** selected, in the **Inspector**:

1. Find **Transform** section
2. Set **Scale**:
   - X: `2`
   - Y: `0.02` (makes it very thin like a ring)
   - Z: `2`
3. Set **Position**:
   - X: `0`
   - Y: `0`
   - Z: `0`

Now you have a thin disk! But we need it to be a ring (hollow in middle).

---

## Step 3.6: Make It Look Like a Ring

We'll use a custom material to fake the ring look:

1. In **Project** panel, right-click on **Assets**
2. **Create → Folder** → Name it: `Materials`
3. Right-click on **Materials** folder
4. **Create → Material**
5. Name it: `RedRing`

---

## Step 3.7: Configure the Red Ring Material

With **RedRing** material selected, in **Inspector**:

1. Find **Surface Type** → Change to: `Transparent`
2. Find **Base Map** → Click the color box
3. Set color to **Red**: R=255, G=50, B=50, A=200
4. Scroll down to find **Emission** checkbox → ✅ Enable it
5. Click the **Emission** color box → Set to same red
6. Set **Intensity** to: `2`

**What is Emission?**
> Emission makes the material glow! This creates the neon effect.

---

## Step 3.8: Apply Material to Ring

1. Click on **Ring01** in Hierarchy
2. Drag **RedRing** material from Project panel
3. Drop it onto Ring01 in the Scene view
4. The ring should now be glowing red!

---

## Step 3.9: Create More Rings (Copy & Paste)

We need 8 more rings. Here's how to create them quickly:

1. Click on **Ring01** in Hierarchy
2. Press **Ctrl + D** to duplicate (creates Ring01 (1))
3. Rename it to: `Ring02`
4. Repeat until you have: Ring01, Ring02, Ring03, Ring04, Ring05, Ring06, Ring07, Ring08, Ring09

---

## Step 3.10: Position Each Ring for Tunnel Depth

Select each ring and set these values in **Transform**:

| Ring | Position Z | Scale X,Y,Z | Color |
|------|------------|-------------|-------|
| Ring01 | 0 | 2.00, 0.02, 2.00 | Red |
| Ring02 | 0.5 | 1.80, 0.02, 1.80 | Red |
| Ring03 | 1.0 | 1.60, 0.02, 1.60 | Red |
| Ring04 | 1.5 | 1.40, 0.02, 1.40 | Purple |
| Ring05 | 2.0 | 1.20, 0.02, 1.20 | Purple |
| Ring06 | 2.5 | 1.00, 0.02, 1.00 | Blue |
| Ring07 | 3.0 | 0.80, 0.02, 0.80 | Blue |
| Ring08 | 3.5 | 0.60, 0.02, 0.60 | Blue |
| Ring09 | 4.0 | 0.40, 0.02, 0.40 | Blue |

**How to do this:**
1. Click on **Ring02** in Hierarchy
2. In Inspector, find **Transform → Position**
3. Set Z to: `0.5`
4. Find **Transform → Scale**
5. Set X to: `1.8`, Z to: `1.8`
6. Repeat for each ring with values from table

---

## Step 3.11: Create Blue and Purple Materials

Create two more materials like you did for RedRing:

**BlueRing Material:**
1. Right-click Materials folder → Create → Material
2. Name: `BlueRing`
3. Surface Type: Transparent
4. Color: R=0, G=150, B=255, A=200
5. Enable Emission, same color, Intensity: 3

**PurpleRing Material:**
1. Create → Material
2. Name: `PurpleRing`
3. Color: R=150, G=50, B=255, A=200
4. Enable Emission, same color, Intensity: 2.5

---

## Step 3.12: Apply Materials to Rings

Drag and drop materials onto rings:

- Ring01, Ring02, Ring03 → **RedRing** material
- Ring04, Ring05 → **PurpleRing** material
- Ring06, Ring07, Ring08, Ring09 → **BlueRing** material

---

# PART 4: ADD ROTATION ANIMATION

## Step 4.1: Add RingRotator Script to Rings

1. Click on **Ring01** in Hierarchy
2. In **Inspector**, scroll to bottom
3. Click **Add Component** button
4. Type: `RingRotator`
5. Click on **RingRotator** to add it

---

## Step 4.2: Configure Rotation Settings

With Ring01 selected, find the **Ring Rotator** component in Inspector:

- **Rotation Speed**: `30` (degrees per second)
- **Rotation Axis**: X=0, Y=0, Z=1 (rotates around Z axis)
- **Enable Pulse**: ✅ Check this
- **Pulse Amount**: `0.05`
- **Pulse Speed**: `2`

---

## Step 4.3: Add RingRotator to All Rings

Repeat Step 4.1-4.2 for each ring, with alternating speeds:

| Ring | Rotation Speed |
|------|----------------|
| Ring01 | 30 |
| Ring02 | -25 (negative = opposite direction!) |
| Ring03 | 35 |
| Ring04 | -20 |
| Ring05 | 40 |
| Ring06 | -30 |
| Ring07 | 45 |
| Ring08 | -35 |
| Ring09 | 50 |

**Why alternate?**
> Different speeds and directions create mesmerizing visual effect!

---

# PART 5: ADD THE COUNTDOWN TEXT

## Step 5.1: Create UI Canvas

1. Right-click in **Hierarchy** → **UI → Canvas**
2. A "Canvas" object appears with "EventSystem" below it
3. Click on **Canvas**
4. In Inspector, find **Canvas Scaler**
5. Set **UI Scale Mode** to: `Scale With Screen Size`
6. Set **Reference Resolution** to: 1080 x 1920

---

## Step 5.2: Create Countdown Text

1. Right-click on **Canvas** in Hierarchy
2. Select **UI → Text - TextMeshPro**
3. A popup appears asking to import TMP - Click **Import TMP Essentials**
4. Wait for import, then close the popup
5. Rename the text object to: `CountdownText`

---

## Step 5.3: Configure Countdown Text

With **CountdownText** selected, in Inspector:

**Rect Transform:**
- Anchor: Click anchor preset icon (square) → Choose **Center**
- Position: X=0, Y=0
- Width: 500
- Height: 200

**TextMeshPro - Text:**
- Text Input: `00:00`
- Font Size: `120`
- Alignment: Center (both horizontal and vertical)
- Font Style: Bold
- Vertex Color: White

---

# PART 6: ADD BLOOM (GLOW EFFECT)

## Step 6.1: Create Post-Processing Volume

1. Right-click in **Hierarchy** → **Create Empty**
2. Rename to: `PostProcess`
3. Click **Add Component** → Search: `Volume` → Add it

---

## Step 6.2: Configure Volume

With **PostProcess** selected:

1. In Volume component, click **New** next to Profile
2. Click **Add Override** button
3. Search and select: **Bloom**
4. In Bloom settings:
   - Check ✅ **Threshold** → Set to: `0.5`
   - Check ✅ **Intensity** → Set to: `3`
   - Check ✅ **Scatter** → Set to: `0.7`

---

## Step 6.3: Enable Post-Processing on Camera

1. Click on **Main Camera** in Hierarchy
2. In Inspector, find **Rendering** section
3. Make sure **Post Processing** is ✅ checked

Now your rings should have a beautiful glow!

---

# PART 7: ATTACH THE MAIN SCRIPTS

## Step 7.1: Add GameManager Script

1. Click on **GameManager** object in Hierarchy
2. In Inspector, click **Add Component**
3. Search: `GameManager`
4. Add it

---

## Step 7.2: Wire GameManager References

With **GameManager** selected, you'll see empty slots in the script:

1. **Portal Controller** slot → Drag **Portal** object here
2. **Countdown Text** slot → Drag **CountdownText** here

**How to drag:**
- Click and hold on the object in Hierarchy
- Drag it to the slot in Inspector
- Release when the slot highlights

---

## Step 7.3: Add PortalController Script

1. Click on **Portal** object in Hierarchy
2. Add Component → Search: `PortalController`
3. Add it

---

## Step 7.4: Wire PortalController References

In the **Portal Controller** component:

1. Find **Rings** array
2. Set **Size** to: `9`
3. Drag each ring into the slots:
   - Element 0 → Ring01
   - Element 1 → Ring02
   - ... etc

---

# PART 8: CONFIGURE FOR WEBGL

## Step 8.1: Open Build Settings

1. Go to menu: **File → Build Settings**
2. A window opens showing platforms

---

## Step 8.2: Switch to WebGL Platform

1. Click on **WebGL** in the platform list
2. Click **Switch Platform** button (bottom right)
3. Wait for Unity to convert (takes 2-5 minutes)

---

## Step 8.3: Configure Player Settings

1. In Build Settings, click **Player Settings** button
2. A new window opens

**Under Player → Resolution and Presentation:**
- Nothing to change, just verify

**Under Player → Other Settings:**
- Color Space: Gamma

**Under Player → Publishing Settings:**
- Compression Format: Gzip
- Data Caching: ✅

---

# PART 9: BUILD FOR WEB

## Step 9.1: Add Scene to Build

1. In Build Settings, click **Add Open Scenes**
2. Your "MainScene" should appear in the list with a checkmark

---

## Step 9.2: Build the Project

1. Click **Build** button
2. Navigate to: `D:\Development\AntiGravity\Metro-Del\frontend\public\unity-build\`
3. Create a new folder called: `Build`
4. Select the `Build` folder
5. Click **Select Folder**
6. Wait for build to complete (10-20 minutes first time)

---

## Step 9.3: Verify Build Output

After building, check that these files exist:
```
frontend/public/unity-build/Build/
├── MetroPortal.loader.js
├── MetroPortal.data.gz
├── MetroPortal.framework.js.gz
└── MetroPortal.wasm.gz
```

---

# PART 10: TEST IT!

## Step 10.1: Start the Frontend

Open terminal and run:
```bash
cd D:\Development\AntiGravity\Metro-Del\frontend
npm run dev
```

---

## Step 10.2: Test in Browser

1. Open Chrome: http://localhost:4200
2. Select a station
3. Click any **AR** button
4. The portal should appear with glowing rings!

---

# 🎉 CONGRATULATIONS!

You've created the AR tunnel portal effect!

**Next Steps:**
- Add audio effects
- Create train 3D model
- Add more visual polish
- Deploy to production

**Need Help?**
Check the troubleshooting section in `UNITY_BUILD_GUIDE.md`
