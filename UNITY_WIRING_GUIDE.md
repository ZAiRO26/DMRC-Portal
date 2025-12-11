# Part 4: Wire Up Components - Detailed Guide

Based on your current hierarchy, here's exactly what to do next.

---

## Step 1: Add Script Components to GameObjects

You need to attach the C# scripts to the correct GameObjects.

### 1.1 MetroAPIManager GameObject
1. Click on `Managers → MetroAPIManager` in Hierarchy
2. Look at the **Inspector** panel (right side)
3. Click **"Add Component"** button at bottom
4. Type: `MetroAPIManager` and select it
5. You should now see the script with empty fields

### 1.2 WebGLBridge GameObject
1. Click on `Managers → WebGLBridge`
2. Click **"Add Component"**
3. Type: `WebGLBridge` and select it

### 1.3 ARCameraHandler GameObject
1. Click on `Managers → ARCameraHandler`
2. Click **"Add Component"**
3. Type: `ARCameraHandler` and select it

### 1.4 Portal GameObject
1. Click on `Portal` (the parent, not the rings)
2. Click **"Add Component"**
3. Type: `PortalAnimator` and select it

### 1.5 Train GameObject
1. Click on `Train`
2. Click **"Add Component"**
3. Type: `TrainArrivalController` and select it

### 1.6 Canvas (for CountdownController)
1. Click on `Canvas`
2. Click **"Add Component"**
3. Type: `CountdownController` and select it

---

## Step 2: Create SpawnPoint (Missing)

I notice you have `ArrivalPoint` and `ExitPoint` but need `SpawnPoint`:

1. Right-click on `SpawnPoints` in Hierarchy
2. Select **Create Empty**
3. Name it: `SpawnPoint`
4. In Inspector, set Position:
   - X: `0`
   - Y: `1.5`
   - Z: `15`

---

## Step 3: Wire Up References (The Important Part!)

Now drag-and-drop to connect everything. **This is like connecting wires.**

### 3.1 Configure CountdownController (on Canvas)

1. Click on `Canvas` in Hierarchy
2. In Inspector, find the `Countdown Controller` component
3. **Drag and drop** these objects into the empty slots:

| Field | Drag This Object |
|-------|------------------|
| Countdown Text | `Canvas → CountdownText` |
| Destination Text | `Canvas → DestinationText` |
| Status Text | `Canvas → StatusText` |

**How to drag:** Click and hold on the object in Hierarchy, drag it to the empty field in Inspector, release.

### 3.2 Configure PortalAnimator (on Portal)

1. Click on `Portal` in Hierarchy
2. Find `Portal Animator` component in Inspector
3. Drag these:

| Field | Drag This Object |
|-------|------------------|
| Outer Ring | `Portal → OuterRing` |
| Inner Ring | `Portal → InnerRing` |
| Center Glow | `Portal → CenterGlow` |
| Countdown Controller | `Canvas` |

*Leave material fields empty for now*

### 3.3 Configure TrainArrivalController (on Train)

1. Click on `Train` in Hierarchy
2. Find `Train Arrival Controller` in Inspector
3. Drag these:

| Field | Drag This Object |
|-------|------------------|
| Train Prefab | `Train` (itself) |
| Current Train | `Train` (itself) |
| Spawn Point | `SpawnPoints → SpawnPoint` |
| Arrival Point | `SpawnPoints → ArrivalPoint` |
| Exit Point | `SpawnPoints → ExitPoint` |
| Countdown Controller | `Canvas` |

### 3.4 Configure MetroAPIManager (on Managers/MetroAPIManager)

1. Click on `Managers → MetroAPIManager`
2. Find `Metro API Manager` in Inspector
3. Set:
   - Api Base Url: `http://localhost:3000/api/v1/metro`
   - Refresh Interval: `30`
4. Drag these:

| Field | Drag This Object |
|-------|------------------|
| Countdown Controller | `Canvas` |
| Train Controller | `Train` |

### 3.5 Configure WebGLBridge (on Managers/WebGLBridge)

1. Click on `Managers → WebGLBridge`
2. Find `Web GL Bridge` in Inspector
3. Drag these:

| Field | Drag This Object |
|-------|------------------|
| Api Manager | `Managers → MetroAPIManager` |
| Countdown Controller | `Canvas` |
| Portal Animator | `Portal` |
| Train Controller | `Train` |
| Camera Handler | `Managers → ARCameraHandler` |

---

## Step 4: Verify Everything

### Check for Errors
1. Look at **Console** window (Window → General → Console)
2. Clear any old messages (click Clear button)
3. There should be **no red errors**

### Quick Visual Check
Each component should show objects in the reference fields, not "None":

```
✅ Good: [CountdownText (Text Mesh Pro)]
❌ Bad:  [None (Text Mesh Pro UGUI)]
```

---

## Step 5: Save Your Scene!

**IMPORTANT:** Don't lose your work!

1. Press `Ctrl + S`
2. Or go to **File → Save**
3. Name your scene: `MainPortalScene`
4. Save in: `Assets/Scenes/` folder

---

## Step 6: Test Play Mode

1. Press the **Play** button (▶️) at top center
2. Watch the Console for messages like:
   - `[WebGLBridge] Bridge initialized`
   - `[MetroAPI] Manager initialized`
3. The portal rings should start rotating
4. Press Play again to stop

---

## Troubleshooting

### "Script not found" when adding component?
- Make sure scripts are in `Assets/Scripts/` folder
- Check Console for compile errors (red text)
- Try: Assets → Reimport All

### Fields are grayed out?
- Make sure you're NOT in Play mode
- Stop play mode first, then edit

### Reference field won't accept my drag?
- Make sure you're dragging the correct type
- The object must have the required component attached

---

## Next: Part 5 - Camera Setup

Once all references are connected, move to Part 5 in the main guide to configure the camera!
