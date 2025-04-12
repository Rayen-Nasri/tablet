"use client";
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PasswordValidation } from './PasswordValidation';
import { Wallpaper1 } from '../Applications/wallPapres/wallPaper1';
import { Wallpaper2 } from '../Applications/wallPapres/Wallpaper2';
import { Wallpaper3 } from '../Applications/wallPapres/Wallpaper3';
import { Wallpaper4 } from '../Applications/wallPapres/Wallpaper4';
import { Wallpaper5 } from '../Applications/wallPapres/Wallpaper5';
import { Wallpaper6 } from '../Applications/wallPapres/Wallpaper6';

const wallpapers = [
  { id: 1, component: Wallpaper1 },
  { id: 2, component: Wallpaper2 },
  { id: 3, component: Wallpaper3 },
  { id: 4, component: Wallpaper4 },
  { id: 5, component: Wallpaper5 },
  { id: 6, component: Wallpaper6 },
] as const;

type WallpaperComponent = typeof wallpapers[number]['component'];

export const IpadLoadingScreen = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [existPass, setExistPass] = useState(false);
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<WallpaperComponent>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('selectedLoadingScreen');
      const id = savedId ? parseInt(savedId) : 1;
      return wallpapers.find(w => w.id === id)?.component || Wallpaper1;
    }
    return Wallpaper1;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem("hasPassword") === "true") {
        setExistPass(true);
      }
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
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

  const handlePasswordSuccess = () => {
    setPasswordValidated(true);
  };

  const SelectedComponent: any = selectedComponent;

  return (
    <div className="relative ">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className='relative z-10 h-[80vh] flex flex-col items-center justify-center'>
            <SelectedComponent />
          </div>

        ) : (
          existPass ? (
            passwordValidated ? (
              <div>
                {children}
              </div>
            )
              : (
                <PasswordValidation
                  onSuccess={handlePasswordSuccess}
                  isNewPassword={false}
                />
              )
          ) : (
            <div>{children}</div>
          ))}
      </AnimatePresence>
    </div>
  );
};



