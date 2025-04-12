"use client";
import Image from "next/image";
import play from "../public/play.svg";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IpadLoadingScreen } from "./BestPart/loadingSreen";
import { IpadHomePage } from "./BestPart/IpadHomePage";

export const Ipad = () => {
    const [loading, setLoading] = useState(false);

    return (
        <section className=" h-screen grid items-center overflow-clip   ">

            <div className="absolute -z-10 w-full h-full top-0 left-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[75px] bg-purple-500/20 opacity-30 transition-all duration-700 data-[loading=true]:opacity-80 data-[loading=true]:scale-125" data-loading={loading}></div>
                <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full blur-[75px] bg-blue-500/20 opacity-30 transition-all duration-700 data-[loading=true]:opacity-80 data-[loading=true]:scale-125" data-loading={loading}></div>
            </div>

            <div
                className="mx-3 sm:mx-10  max-w-full bgtrans"
            >
                <motion.div
                    className="relative"
                    style={{
                        perspective: "1000px",
                    }}

                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                >
                    <div className="border-[2px] border-white/10 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl rounded-[24px] h-[95vh] overflow-hidden shadow-[0_0_15px_rgba(129,88,201,0.3)] relative">
                        <div className="flex gap-3 p-4 items-center backdrop-blur-md bg-black/30 border-b border-white/10">
                            <div className="flex space-x-2">
                                {Array(3).fill("").map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="rounded-full w-[18px] h-[18px]"
                                        style={{ backgroundColor: i === 0 ? "#ff5f57" : i === 1 ? "#febc2e" : "#28c840" }}
                                        whileHover={{ scale: 1.2 }}
                                    />
                                ))}
                            </div>

                            <div className="flex-1 flex justify-center">
                            </div>

                            <motion.button
                                className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#8158C9] to-[#5b3e91] shadow-lg"
                                onClick={() => { setLoading(!loading); }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Image src={play} alt="play Button" width={20} height={20} priority className="hover:scale-105 transition-transform" />
                            </motion.button>
                        </div>

                        <div className="relative h-[calc(100%-70px)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-10"></div>

                            {loading ? (
                                <IpadLoadingScreen>
                                    <IpadHomePage />
                                </IpadLoadingScreen>
                            ) : (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex flex-col justify-center items-center h-full"
                                    >
                                        <motion.div
                                            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500"
                                            animate={{
                                                textShadow: "0 0 10px rgba(129,88,201,0.5)"
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 20
                                            }}
                                        >
                                            Sleep Mode
                                        </motion.div>
                                        <p className="text-white/50 mt-4">Click the purple button to wake</p>

                                        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                                            <motion.div
                                                className="w-20 h-1 bg-white/20 rounded-full"
                                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>

                    <motion.div
                        className="absolute -right-10 top-1/4 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl"
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 10, 0]
                        }}

                    ></motion.div>
                    <motion.div
                        className="absolute -left-10 bottom-1/3 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
                        animate={{
                            y: [0, 20, 0],
                            x: [0, -10, 0]
                        }}

                    ></motion.div>

                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-[80%] h-[20px] bg-[#8158C9]/20 blur-xl rounded-full"></div>
                </motion.div>
            </div>
        </section>
    )
}