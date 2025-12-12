# Unity WebGL Build

Place your Unity WebGL build files here.

## Required Files:
After building, you should have:
```
Build/
  MetroPortal.loader.js
  MetroPortal.data
  MetroPortal.framework.js
  MetroPortal.wasm
```

## Build Instructions:

1. Open Unity project at `unity-project/`
2. Go to **File > Build Settings**
3. Select **WebGL** platform
4. Click **Player Settings**:
   - Set Product Name: `MetroPortal`
   - Set Company Name: Your name
   - Under **Publishing Settings**:
     - Compression Format: Gzip
     - Enable Exception support
5. Click **Build**
6. Select this folder as destination
7. The `Build/` folder will be created automatically

## After Building:
The AR button in the frontend will load the Unity experience automatically.
