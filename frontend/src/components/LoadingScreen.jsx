import { motion } from 'framer-motion';

export default function LoadingScreen({ message = "Initializing System..." }) {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 backdrop-blur-sm">
            <div className="relative w-40 h-40 mb-8">
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-metro-blue border-t-transparent opacity-80"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Middle Ring */}
                <motion.div
                    className="absolute inset-4 rounded-full border-2 border-metro-red border-b-transparent opacity-70"
                    animate={{ rotate: -180 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Pulse */}
                <motion.div
                    className="absolute inset-10 rounded-full bg-metro-blue opacity-20 blur-xl"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white uppercase animate-pulse text-center">
                {message}
            </h2>
            <p className="mt-2 text-metro-blue/70 text-sm font-mono">DMRC PROTOCOL V2.0</p>
        </div>
    );
}
