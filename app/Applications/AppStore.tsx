"use client"
import { StaticImageData } from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback, memo, useMemo } from 'react'
import Image from 'next/image'
import { FiX, FiDownload, FiSearch, FiGrid, FiList, FiArrowLeft, FiInfo, FiShare2 } from 'react-icons/fi'
import book from "../../public/book.png"
import fitness from "../../public/fitness.png"
import task from "../../public/task.png"
import weather from "../../public/weather.png"
import music from "../../public/music.png"
import photo from "../../public/photo.png"

interface App {
    id: number
    name: string
    icon: StaticImageData,
    description: string
    category: string
    rating: number
    installed: boolean
    size: string
    developer?: string
    version?: string
    lastUpdated?: string
}

// Update the initialApps array
const initialApps: App[] = [
    {
        id: 1,
        name: 'Photo Editor Pro',
        icon: photo,
        description: 'Professional photo editing tools with advanced filters and effects.',
        category: 'Photography',
        rating: 4.8,
        installed: false,
        size: '45 MB',
        developer: 'Creative Labs',
        version: '2.3.1',
        lastUpdated: '2 weeks ago'
    },
    {
        id: 2,
        name: 'Task Master',
        icon: task,
        description: 'Organize your tasks and boost productivity with smart reminders.',
        category: 'Productivity',
        rating: 4.6,
        installed: false,
        size: '28 MB',
        developer: 'Productivity Tools Inc.',
        version: '1.8.5',
        lastUpdated: '3 days ago'
    },
    {
        id: 3,
        name: 'Weather Forecast',
        icon: weather,
        description: 'Accurate weather predictions with beautiful visualizations.',
        category: 'Weather',
        rating: 4.7,
        installed: false,
        size: '32 MB',
        developer: 'Weather Systems',
        version: '3.2.0',
        lastUpdated: '1 week ago'
    },
    {
        id: 4,
        name: 'Music Player',
        icon: music,
        description: 'Stream and organize your music with advanced audio features.',
        category: 'Entertainment',
        rating: 4.9,
        installed: false,
        size: '38 MB',
        developer: 'Audio Labs',
        version: '4.1.2',
        lastUpdated: '5 days ago'
    },
    {
        id: 5,
        name: 'Fitness Tracker',
        icon: fitness,
        description: 'Track your workouts and maintain a healthy lifestyle.',
        category: 'Health & Fitness',
        rating: 4.5,
        installed: false,
        size: '42 MB',
        developer: 'Health Solutions',
        version: '2.5.3',
        lastUpdated: '2 days ago'
    },
    {
        id: 6,
        name: 'Recipe Book',
        icon: book,
        description: 'Discover and save delicious recipes from around the world.',
        category: 'Food & Drink',
        rating: 4.4,
        installed: false,
        size: '35 MB',
        developer: 'Culinary Apps',
        version: '1.9.7',
        lastUpdated: '1 week ago'
    },
]

interface AppStoreProps {
    setActiveApp: (app: 'Settings' | 'Messages' | 'App Store' | 'Photos' | 'Flappy Bird' | 'Notes' | 'Password' | 'Wallpaper' | null) => void
}


const AppCard = memo(({ app, onInstall, onSelect, isInstalling }: {
    app: App,
    onInstall: (id: number) => void,
    onSelect: (app: App) => void,
    isInstalling: number | null
}) => {
    return (
        <div
            className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 hover:from-white/15 hover:to-white/10 transition-all duration-200 border border-white/10 shadow-lg "
            onClick={() => onSelect(app)}
        >
            <div className="flex items-start space-x-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg shadow-black/20 border border-white/20">
                    <Image
                        src={app.icon}
                        alt={app.name}
                        width={64}
                        height={64}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-white/90 font-medium">{app.name}</h3>
                            <p className="text-white/60 text-sm">{app.category}</p>
                        </div>
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onInstall(app.id);
                            }}
                            className={`px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-lg transition-all duration-300 font-medium ${app.installed
                                ? 'bg-gray-600/80 text-white/70 hover:bg-gray-700/80'
                                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-purple-900/20'}`}
                            disabled={isInstalling === app.id}
                        >
                            {app.installed ? 'Installed' : (
                                <>
                                    <FiDownload className="h-4 w-4" />
                                    <span>Install</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                    <p className="text-white/70 text-sm mt-2 line-clamp-2">{app.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-white/60">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(app.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="ml-1">{app.rating.toFixed(1)}</span>
                        </div>
                        <span>{app.size}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

AppCard.displayName = 'AppCard';

// Add this hook

export const AppStore = ({ setActiveApp }: AppStoreProps) => {
    const [apps, setApps] = useState<App[]>(initialApps)
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedApp, setSelectedApp] = useState<App | null>(null)
    const [isInstalling, setIsInstalling] = useState<number | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    useEffect(() => {
        const savedApps = localStorage.getItem('portfolioApps')
        if (savedApps) setApps(JSON.parse(savedApps))
    }, [])

    // Optimize categories calculation
    const categories = useMemo(() =>
        ['All', ...new Set(apps.map(app => app.category))],
        [apps]
    );

    // Memoize filtered apps computation
    const filteredApps = useMemo(() =>
        apps.filter(app => {
            const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
            const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        }),
        [apps, selectedCategory, searchQuery]
    );

    // Optimize toggleInstall with functional updates
    const toggleInstall = useCallback((appId: number) => {
        if (isInstalling !== null) return; // Prevent multiple installations

        try {
            setIsInstalling(appId);
            
            // Update apps state with functional update to ensure latest state
            setApps(prevApps => {
                const updatedApps = prevApps.map(app =>
                    app.id === appId ? { ...app, installed: !app.installed } : app
                );
                
                // Update localStorage with the latest state
                try {
                    localStorage.setItem('portfolioApps', JSON.stringify(updatedApps));
                } catch (error) {
                    console.error('Failed to update localStorage:', error);
                }
                
                return updatedApps;
            });

            // Simulate installation delay
            const installationDelay = Math.random() * 500 + 500;
            const timer = setTimeout(() => {
                setIsInstalling(null);
            }, installationDelay);

            return () => clearTimeout(timer); // Cleanup on unmount
        } catch (error) {
            console.error('Installation failed:', error);
            setIsInstalling(null);
        }
    }, [isInstalling]); // Remove apps dependency since we're using functional updates

    const handleAppSelect = useCallback((app: App) => {
        setSelectedApp(app)
    }, [])

    const handleCloseAppDetails = useCallback(() => {
        setSelectedApp(null)
    }, [])

    // Memoize filtered apps for better performance
    const memoizedFilteredApps = useMemo(() => {
        return filteredApps.sort((a, b) => a.name.localeCompare(b.name))
    }, [filteredApps])

    // App detail view component
    const AppDetailView = useCallback(() => {
        if (!selectedApp) return null

        // Get the latest app data from apps state
        const currentApp = apps.find(app => app.id === selectedApp.id) || selectedApp

        return (
            <div
                className="w-full h-full flex flex-col"
            >
                <div className="flex items-center mb-6">
                    <motion.button
                        onClick={handleCloseAppDetails}
                        className="mr-4 bg-white/10 p-2 rounded-full hover:bg-white/20 "
                    >
                        <FiArrowLeft className="h-5 w-5 text-white/90" />
                    </motion.button>
                    <h2 className="text-2xl font-semibold text-white/90">App Details</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg shadow-black/20 border border-white/20 mb-4">
                            <Image
                                src={currentApp.icon}
                                alt={currentApp.name}
                            />
                        </div>

                        <motion.button
                            onClick={() => toggleInstall(currentApp.id)}
                            className={`px-6 py-2 rounded-xl text-sm flex items-center gap-2 w-full justify-center ${currentApp.installed
                                ? 'bg-gray-600/80 text-white/70 hover:bg-gray-700/80'
                                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                                }`}
                            disabled={isInstalling === currentApp.id}
                        >
                            <AnimatePresence mode="wait">
                                {isInstalling === currentApp.id ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white/90 animate-spin"></div>
                                        <span>{currentApp.installed ? 'Uninstalling...' : 'Installing...'}</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="flex items-center gap-2"
                                    >
                                        {currentApp.installed ? 'Uninstall' : (
                                            <>
                                                <FiDownload className="h-4 w-4" />
                                                <span>Install</span>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white/95 mb-1">{selectedApp.name}</h1>
                        <p className="text-white/60 text-sm mb-4">{selectedApp.category} • {selectedApp.developer}</p>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(selectedApp.rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="ml-2 text-white/90 font-medium">{selectedApp.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-white/60">{selectedApp.size}</span>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                            <p className="text-white/80 leading-relaxed">{selectedApp.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-white/60 text-xs mb-1">Version</p>
                                <p className="text-white/90">{selectedApp.version || 'N/A'}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <p className="text-white/60 text-xs mb-1">Last Updated</p>
                                <p className="text-white/90">{selectedApp.lastUpdated || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex justify-between pt-4 border-t border-white/10">
                    <div className="flex space-x-2">
                        <motion.button
                            className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-all duration-300 border border-white/10"
                        >
                            <FiShare2 className="h-5 w-5 text-white/80" />
                        </motion.button>
                        <motion.button
                            className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-all duration-300 border border-white/10"
                        >
                            <FiInfo className="h-5 w-5 text-white/80" />
                        </motion.button>
                    </div>
                    <p className="text-white/50 text-sm">Developer: Me </p>
                </div>
            </div>
        )
    }, [selectedApp, handleCloseAppDetails, toggleInstall, isInstalling])

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div
                className=" max-w-4xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 backdrop-blur-lg border border-white/10 shadow-xl overflow-hidden max-h-[90vh]"
            >
                <AnimatePresence mode="wait">
                    {selectedApp ? (
                        <AppDetailView />
                    ) : (
                        <div
                            key="app-list"
                            className="flex flex-col lg:flex-col  space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2
                                    className="sm:block hidden text-2xl font-semibold text-white/90"
                                >
                                    App Store
                                </h2>
                                <div className="flex gap-2 flex-col-1 sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                                    <div className="relative w-full sm:w-auto">
                                        <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none -opacity  ${isSearchFocused ? 'opacity-0' : 'opacity-100'}`}>
                                            <FiSearch className="h-4 w-4 text-white/50" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search apps..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => setIsSearchFocused(true)}
                                            onBlur={() => setIsSearchFocused(false)}
                                            className={`bg-white/5 text-white/90 rounded-xl px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 transition-all duration-300 ${isSearchFocused ? 'pl-4 border-purple-500/50' : 'pl-10'}`}
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute inset-y-0 right-3 flex items-center text-white/50 hover:text-white/90"
                                            >
                                                <FiX className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className=" hidden sm:flex bg-white/5 rounded-xl p-1 border border-white/10">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white/20 text-white/90' : 'text-white/60 hover:text-white/90'}`}
                                        >
                                            <FiGrid className="h-4 w-4" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white/20 text-white/90' : 'text-white/60 hover:text-white/90'}`}
                                        >
                                            <FiList className="h-4 w-4" />
                                        </motion.button>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05, rotate: 90 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveApp(null)}
                                        className="bg-white/10 text-white/90 p-2 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/10"
                                    >
                                        <FiX className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            </div>

                            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {categories.map((category) => (
                                    <motion.button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-xl whitespace-nowrap ${selectedCategory === category
                                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/20'
                                            : 'bg-white/5 text-white/90 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {category}
                                    </motion.button>
                                ))}
                            </div>

                            {memoizedFilteredApps.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <FiSearch className="h-12 w-12 text-white/30 mb-4" />
                                    <p className="text-white/60 text-lg">No apps found matching "{searchQuery}"</p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Clear search
                                    </button>
                                </div>
                            ) : (
                                <div className={`
                                    ${viewMode === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                                        : 'flex flex-col space-y-3'
                                    } 
                                    overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent`}
                                >
                                    {memoizedFilteredApps.map((app) => (
                                        <AppCard
                                            key={app.id}
                                            app={app}
                                            onInstall={toggleInstall}
                                            onSelect={handleAppSelect}
                                            isInstalling={isInstalling}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}