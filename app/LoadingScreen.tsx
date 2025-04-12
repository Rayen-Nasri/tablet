"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wallpaper1 } from './Applications/wallPapres/wallPaper1';
import { Wallpaper2 } from './Applications/wallPapres/Wallpaper2';
import { Wallpaper3 } from './Applications/wallPapres/Wallpaper3';
import { Wallpaper4 } from './Applications/wallPapres/Wallpaper4';
import { Wallpaper5 } from './Applications/wallPapres/Wallpaper5';
import { Wallpaper6 } from './Applications/wallPapres/Wallpaper6';

interface LoadingScreenProps {
  children: React.ReactNode;
}

const wallpapers = [
  { id: 1, component: Wallpaper1 },
  { id: 2, component: Wallpaper2 },
  { id: 3, component: Wallpaper3 },
  { id: 4, component: Wallpaper4 },
  { id: 5, component: Wallpaper5 },
  { id: 6, component: Wallpaper6 },
] as const;

type WallpaperComponent = typeof wallpapers[number]['component'];

export const LoadingScreen = ({ children }: LoadingScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<WallpaperComponent>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('selectedLoadingScreen');
      const id = savedId ? parseInt(savedId) : 1;
      return wallpapers.find(w => w.id === id)?.component || Wallpaper1;
    }
    return Wallpaper1;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedId = localStorage.getItem('selectedLoadingScreen');
      const id = savedId ? parseInt(savedId) : 1;
      const Component = wallpapers.find(w => w.id === id)?.component || Wallpaper1;
      setSelectedComponent(Component);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const SelectedComponent : any = selectedComponent;

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black flex items-center justify-center"
        >
          <SelectedComponent />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};