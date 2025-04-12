"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from './notification';
import { Weather } from './weather';
import { Application } from './application';

export const IpadHomePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen relative"
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <section className="relative z-10 px-6 pt-10 lg:flex lg:gap-[100] ">
                <div className="text-white space-y-5 lg:block hidden">
                    <motion.h1
                        className="text-7xl font-light tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </motion.h1>

                    <motion.p
                        className="text-3xl text-white/80 hover:text-white transition-colors"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {currentTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center md:justify-start"
                    >
                        <div className="backdrop-blur-lg bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-xl">
                            <div className="flex gap-2 relative">
                                <motion.div
                                    className="absolute inset-y-0 rounded-xl bg-[#8158C9]/40"
                                    initial={false}
                                    animate={{ x: open ? "100%" : "0%" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    style={{ width: "50%" }}
                                />
                                {["Weather", "Notification"].map((item, index) => (
                                    <motion.button
                                        key={item}
                                        onClick={() => setOpen(index === 1)}
                                        className={`relative px-8 py-3 rounded-xl text-sm font-medium transition-colors
                                            ${(index === 0 && !open) || (index === 1 && open)
                                                ? 'text-white'
                                                : 'text-white/60 hover:text-white/80'}`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {item}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={open ? 'notification' : 'weather'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25
                            }}
                        >
                            {open ? <Notification /> : <Weather />}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <div >
                    <Application/>
                </div>
            </section>

        </motion.div>
    );
};