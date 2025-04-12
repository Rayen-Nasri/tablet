"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallpaper1 } from "./wallPapres/wallPaper1";
import { Wallpaper2 } from "./wallPapres/Wallpaper2";
import { Wallpaper3 } from "./wallPapres/Wallpaper3";
import { Wallpaper4 } from "./wallPapres/Wallpaper4";
import { Wallpaper5 } from "./wallPapres/Wallpaper5";
import { Wallpaper6 } from "./wallPapres/Wallpaper6";

interface WallpaperProps {
    setActiveApp: (app: 'Settings' | 'Messages' | 'App Store' | 'Photos' | 'Flappy Bird' | 'Notes' | 'Password' | 'Wallpaper' | null) => void;
}

interface WallpaperType {
    id: number;
    component: React.ComponentType;
    name: string;
}

const wallpapers: WallpaperType[] = [
    { id: 1, component: Wallpaper1, name: 'Gooey Dots' },
    { id: 2, component: Wallpaper2, name: 'Wallpaper 2' },
    { id: 3, component: Wallpaper3, name: 'Sun Loader' },
    { id: 4, component: Wallpaper4, name: 'Wallpaper' },
    { id: 5, component: Wallpaper5, name: 'Wallpaper' },
    { id: 6, component: Wallpaper6, name: 'Wallpaper' },
];

export const Wallpaper = ({ setActiveApp }: WallpaperProps) => {
    const [selectedWallpaper, setSelectedWallpaper] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('selectedLoadingScreen');
            return saved ? parseInt(saved) : 1; 
        }
        return 1;
    });

    const handleWallpaperSelect = (id: number) => {
        setSelectedWallpaper(id);
        localStorage.setItem('selectedLoadingScreen', id.toString());
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-4xl bg-white/10 rounded-2xl overflow-hidden backdrop-blur-lg flex flex-col h-[80vh] shadow-2xl border border-white/5"
            >
                <div className="p-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h2 className="text-2xl font-semibold text-white/90">Loading Screen</h2>
                    </div>
                    <button
                        onClick={() => setActiveApp(null)}
                        className="bg-white/10 text-white/90 p-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wallpapers.map((wallpaper) => (
                            <motion.div
                                key={wallpaper.id}
                                className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all duration-200 cursor-pointer ${
                                    selectedWallpaper === wallpaper.id 
                                        ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                                        : 'border-white/10 hover:border-white/30'
                                }`}
                                onClick={() => handleWallpaperSelect(wallpaper.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    {React.createElement(wallpaper.component)}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-white font-medium">{wallpaper.name}</p>
                                </div>
                                {selectedWallpaper === wallpaper.id && (
                                    <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
