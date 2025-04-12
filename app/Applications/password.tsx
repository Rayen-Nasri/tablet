"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { X,  Check, AlertCircle } from "lucide-react";

interface PasswordProps {
    setActiveApp: (app: 'Settings' | 'Messages' | 'App Store' | 'Photos' | 'Flappy Bird' | 'Notes' | 'Password' | 'Wallpaper' | null) => void;
}

interface PasswordStrength {
    score: number;
    message: string;
    color: string;
}

const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap: Record<number, PasswordStrength> = {
        0: { score: 0, message: "Very Weak", color: "bg-red-500" },
        1: { score: 1, message: "Weak", color: "bg-orange-500" },
        2: { score: 2, message: "Fair", color: "bg-yellow-500" },
        3: { score: 3, message: "Good", color: "bg-blue-500" },
        4: { score: 4, message: "Strong", color: "bg-green-500" },
        5: { score: 5, message: "Very Strong", color: "bg-purple-500" }
    };

    return strengthMap[score];
};

export const Password = ({ setActiveApp }: PasswordProps) => {
    const [hasPassword, setHasPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState<PasswordStrength>({ score: 0, message: "", color: "" });
    const [currentPassword, setCurrentPassword] = useState("");
    const firstPassword = useRef<HTMLInputElement>(null);
    const secondPassword = useRef<HTMLInputElement>(null);
    
    // Check if password exists in localStorage on component mount
    useEffect(() => {
        const storedHasPassword = localStorage.getItem("hasPassword");
        if (storedHasPassword === "true") {
            setHasPassword(true);
        }
    }, []);

    const handlePasswordChange = () => {
        const password = firstPassword.current?.value || "";
        setStrength(checkPasswordStrength(password));
        setError(null);
        setSuccess(null);
    };

    const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPassword(e.target.value);
        setError(null);
        setSuccess(null);
    };
    
    const verifyPasswords = () => {
        const pass1 = firstPassword.current?.value;
        const pass2 = secondPassword.current?.value;

        if (!pass1 || !pass2) {
            setError("Please fill in both password fields");
            return;
        }

        if (pass1.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (pass1 !== pass2) {
            setError("Passwords do not match");
            return;
        }

        if (strength.score < 3) {
            setError("Please choose a stronger password");
            return;
        }
        
        // If changing password, verify current password first
        if (hasPassword) {
            const storedPassword = localStorage.getItem("password");
            if (currentPassword !== storedPassword) {
                setError("Current password is incorrect");
                return;
            }
        }

        // Save password logic
        setHasPassword(true);
        setError(null);
        setSuccess(hasPassword ? "Password updated successfully!" : "Password set successfully!");
        localStorage.setItem("hasPassword", "true");
        localStorage.setItem("password", pass1);
        
        // Reset fields after successful operation
        if (hasPassword) {
            setCurrentPassword("");
        }
        if (firstPassword.current) firstPassword.current.value = "";
        if (secondPassword.current) secondPassword.current.value = "";
        setStrength({ score: 0, message: "", color: "" });
    };

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-white bg-gray-800/90 rounded-2xl p-6 w-full max-w-md backdrop-blur-lg border border-white/10"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">
                        {hasPassword ? "Change Password" : "Set Password"}
                    </h2>
                    <button
                        onClick={() => setActiveApp(null)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5">
                    {hasPassword && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={handleCurrentPasswordChange}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                    placeholder="Enter current password"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">{hasPassword ? "New Password" : "Password"}</label>
                        <div className="relative">
                            <input
                                ref={firstPassword}
                                type={showPassword ? "text" : "password"}
                                onChange={handlePasswordChange}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                placeholder="Enter password"
                            />
                        </div>
                        
                        {strength.message && (
                            <div className="mt-3">
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(strength.score / 5) * 100}%` }}
                                        className={`h-full ${strength.color} transition-all duration-300`}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm font-medium text-white/80">
                                        Strength: <span className={`${strength.color.replace('bg-', 'text-')}`}>{strength.message}</span>
                                    </p>
                                    {strength.score < 3 && (
                                        <p className="text-xs text-white/60">Include uppercase, numbers & symbols</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Confirm Password</label>
                        <div className="relative">
                            <input
                                ref={secondPassword}
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                placeholder="Verify password"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}
                        
                        {success && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20"
                            >
                                <Check size={16} />
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={verifyPasswords}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-3 transition-all duration-200 flex items-center justify-center gap-2 mt-2 font-medium shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30"
                    >
                        <Check size={18} />
                        {hasPassword ? "Update Password" : "Save Password"}
                    </button>
                </div>
            </motion.div>
        </motion.section>
    );
};