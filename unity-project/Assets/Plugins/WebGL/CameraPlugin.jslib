// MetroPortal WebGL Camera Plugin
// Place this file in: Assets/Plugins/WebGL/CameraPlugin.jslib

mergeInto(LibraryManager.library, {

  // Request camera permission from browser
  RequestCameraPermission: function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
          window.cameraStream = stream;
          // Notify Unity of success
          SendMessage('ARCameraHandler', 'OnPermissionGranted');
        })
        .catch(function(err) {
          console.error('[CameraPlugin] Permission denied:', err);
          SendMessage('ARCameraHandler', 'OnPermissionDenied');
        });
    } else {
      console.error('[CameraPlugin] getUserMedia not supported');
      SendMessage('ARCameraHandler', 'OnPermissionDenied');
    }
  },

  // Start the camera feed
  StartCameraFeed: function() {
    if (window.cameraStream) {
      var video = document.createElement('video');
      video.id = 'metro-camera-feed';
      video.srcObject = window.cameraStream;
      video.autoplay = true;
      video.playsInline = true;
      video.style.position = 'absolute';
      video.style.top = '0';
      video.style.left = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.zIndex = '-1';
      
      // Insert behind canvas
      var canvas = document.querySelector('canvas');
      if (canvas && canvas.parentNode) {
        canvas.parentNode.insertBefore(video, canvas);
      }
      
      video.play();
      console.log('[CameraPlugin] Camera feed started');
    }
  },

  // Stop the camera feed
  StopCameraFeed: function() {
    if (window.cameraStream) {
      window.cameraStream.getTracks().forEach(function(track) {
        track.stop();
      });
      window.cameraStream = null;
    }
    
    var video = document.getElementById('metro-camera-feed');
    if (video) {
      video.remove();
    }
    
    console.log('[CameraPlugin] Camera feed stopped');
  },

  // Check if camera is active
  IsCameraActive: function() {
    return window.cameraStream ? 1 : 0;
  },

  // Send loading status to React
  SendLoadingStatus: function(isLoading) {
    if (window.onUnityLoading) {
      window.onUnityLoading(isLoading);
    }
  },

  // Send ready status to React
  SendReadyStatus: function() {
    if (window.onUnityReady) {
      window.onUnityReady();
    }
    console.log('[WebGLBridge] Unity is ready');
  },

  // Send error message to React
  SendErrorMessage: function(errorPtr) {
    var error = UTF8ToString(errorPtr);
    if (window.onUnityError) {
      window.onUnityError(error);
    }
    console.error('[WebGLBridge] Error:', error);
  },

  // Send countdown update to React
  SendCountdownUpdate: function(seconds) {
    if (window.onCountdownUpdate) {
      window.onCountdownUpdate(seconds);
    }
  },

  // Send train arrived event to React
  SendTrainArrived: function() {
    if (window.onTrainArrived) {
      window.onTrainArrived();
    }
    console.log('[WebGLBridge] Train arrived!');
  }

});
