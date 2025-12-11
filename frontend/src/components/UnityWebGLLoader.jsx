import { useEffect } from 'react';
import useMetroStore from '../store/useMetroStore';
import { motion } from 'framer-motion';

/**
 * Unity WebGL Loader Placeholder
 * In the final version, this will integrate with react-unity-webgl
 * to load the actual Unity build.
 */
export default function UnityWebGLLoader() {
    const { selectedStation } = useMetroStore();

    return (
        <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)_scale(2)] opacity-30"></div>

            {/* Central Portal Placeholder Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[500px] max-h-[500px]">
                {/* Outer Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-metro-blue/20"
                />

                {/* Middle Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-10 rounded-full border border-metro-red/20 border-dashed"
                />

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
                    <p className="text-metro-blue/50 font-mono text-xs tracking-[0.3em] mb-2">UNITY WEBGL LAYER</p>
                    <div className="text-white/20 text-4xl font-bold">ARC-01</div>

                    {selectedStation && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 px-4 py-1 rounded-full bg-metro-blue/10 border border-metro-blue/20 text-metro-blue text-xs"
                        >
                            TARGET: {selectedStation.name}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-80"></div>
        </div>
    );
}
