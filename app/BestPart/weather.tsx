
import { motion } from 'framer-motion';


export const Weather = () => {
    return (
        <div className="flex gap-6">
            <motion.div
                className="border border-white/20 w-64 h-[220px] rounded-3xl backdrop-blur-md p-6  bg-white/5 hover:bg-white/10 hover:border-white/30 shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    
                    className="flex flex-col h-full justify-between"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-6xl font-extralight tracking-tighter">23°</p>
                        <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
                        </svg>
                    </div>
                    <div className="space-y-3">
                        <p className="text-base text-gray-300 font-medium">Partly Cloudy</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">H:27°</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-sm font-medium">L:18°</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}