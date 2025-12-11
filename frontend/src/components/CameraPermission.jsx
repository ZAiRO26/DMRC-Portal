import { useState } from 'react';
import { Camera, VideoOff, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CameraPermission({ onGranted, onDenied }) {
    const [error, setError] = useState(null);

    const requestCamera = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            onGranted();
        } catch (err) {
            console.error("Camera permission denied:", err);
            setError("Camera access denied or unavailable.");
            // Auto-fallback after error
            setTimeout(() => onDenied(), 1500);
        }
    };

    return (
        <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center p-6 bg-[url('/grid-bg.png')] bg-cover">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-metro-purple/80 backdrop-blur-md border border-metro-blue/30 p-8 rounded-3xl max-w-sm w-full shadow-[0_0_50px_rgba(0,217,255,0.15)] text-center"
            >
                <div className="bg-gradient-to-br from-metro-blue/20 to-metro-purple w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-metro-blue/50">
                    <Camera className="w-10 h-10 text-metro-blue drop-shadow-[0_0_10px_rgba(0,217,255,0.8)]" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">AR Portal Access</h1>
                <p className="text-gray-300 mb-8 leading-relaxed text-sm">
                    To see the metro portal in your real world, we need access to your camera.
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestCamera}
                    className="w-full py-4 bg-metro-blue text-black font-bold text-lg rounded-xl mb-4 shadow-[0_0_20px_rgba(0,217,255,0.4)] flex items-center justify-center gap-2"
                >
                    <Smartphone size={20} />
                    Enable AR Mode
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onDenied}
                    className="w-full py-3 bg-transparent border border-white/20 hover:bg-white/5 text-gray-300 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                    <VideoOff size={16} />
                    Continue in Static Mode
                </motion.button>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-3 bg-metro-red/20 border border-metro-red/50 rounded-lg text-metro-red text-sm"
                    >
                        {error} <span className="opacity-70 text-xs block mt-1">Switching to 3D mode...</span>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
