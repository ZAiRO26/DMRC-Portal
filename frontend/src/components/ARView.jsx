/**
 * ARView Component
 * Unity WebGL loader with React integration
 */

import { useState, useEffect, useCallback } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function ARView({ trainData, onBack }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const { unityProvider, sendMessage, isLoaded: unityLoaded, loadingProgression } = useUnityContext({
        loaderUrl: '/unity-build/Build/MetroPortal.loader.js',
        dataUrl: '/unity-build/Build/MetroPortal.data',
        frameworkUrl: '/unity-build/Build/MetroPortal.framework.js',
        codeUrl: '/unity-build/Build/MetroPortal.wasm',
    });

    // Send train data to Unity when loaded
    useEffect(() => {
        if (unityLoaded && trainData) {
            setIsLoaded(true);
            // Send countdown and color to Unity
            sendMessage(
                'GameManager',
                'SetTrainData',
                JSON.stringify({
                    countdownSeconds: trainData.countdownSeconds,
                    lineColor: trainData.line?.lineColor || '#0066FF',
                    trainId: trainData.trainId,
                    direction: trainData.line?.direction || 'Unknown'
                })
            );
        }
    }, [unityLoaded, trainData, sendMessage]);

    // Handle Unity errors
    const handleError = useCallback((message) => {
        console.error('Unity error:', message);
        setLoadError('Failed to load AR experience');
    }, []);

    return (
        <div className="ar-view">
            {/* Header */}
            <div className="ar-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={24} />
                    <span>Exit AR</span>
                </button>
                {trainData && (
                    <div className="train-info">
                        <span
                            className="line-badge"
                            style={{ backgroundColor: trainData.line?.lineColor }}
                        >
                            {trainData.trainId}
                        </span>
                        <span className="direction">{trainData.line?.direction}</span>
                    </div>
                )}
            </div>

            {/* Loading Overlay */}
            {!isLoaded && !loadError && (
                <div className="loading-overlay">
                    <Loader2 className="spin" size={48} />
                    <p>Loading AR Experience...</p>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${loadingProgression * 100}%` }}
                        />
                    </div>
                    <span>{Math.round(loadingProgression * 100)}%</span>
                </div>
            )}

            {/* Error State */}
            {loadError && (
                <div className="error-overlay">
                    <AlertCircle size={48} />
                    <p>{loadError}</p>
                    <button onClick={onBack}>Go Back</button>
                </div>
            )}

            {/* Unity Canvas */}
            <Unity
                unityProvider={unityProvider}
                className="unity-canvas"
                style={{
                    width: '100%',
                    height: '100%',
                    visibility: isLoaded ? 'visible' : 'hidden'
                }}
            />
        </div>
    );
}
