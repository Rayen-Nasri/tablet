"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, AlertCircle, Lock } from 'lucide-react';


interface PasswordValidationProps {
    onSuccess: () => void;
    isNewPassword: boolean;
}

interface PasswordStrength {
    score: number;
    message: string;
    color: string;
}

export const PasswordValidation = ({ onSuccess, isNewPassword }: PasswordValidationProps) => {
    const [showRecovery, setShowRecovery] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState<PasswordStrength>({ score: 0, message: "", color: "" });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = () => {
        setIsValidating(true);

        if (!password) {
            setError("Please enter your password");
            setIsValidating(false);
            return;
        }

        const storedPassword = localStorage.getItem("password");
        if (password !== storedPassword) {
            setError("Incorrect password");
            setIsValidating(false);
            return;
        }

        setSuccess("Password verified successfully!");

        // Delay to show success message before proceeding
        setTimeout(() => {
            onSuccess();
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-[80vh] flex flex-col items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-xl"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                        <Lock size={28} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">Enter Password</h2>
                    <p className="text-white/60 text-center mt-2">
                        Please enter your iPad password to continue
                    </p>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-white"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }
                                }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-4 rounded-lg border border-red-500/20 shadow-lg shadow-red-500/5"
                            >
                                <motion.div
                                    animate={{
                                        rotate: [0, -10, 10, -10, 10, 0],
                                        transition: { duration: 0.5, delay: 0.2 }
                                    }}
                                >
                                    <AlertCircle size={16} />
                                </motion.div>
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30
                                    }
                                }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-4 rounded-lg border border-green-500/20 shadow-lg shadow-green-500/5"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        transition: { duration: 0.5, delay: 0.2 }
                                    }}
                                >
                                    <Check size={16} />
                                </motion.div>
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isNewPassword && (
                        <motion.div
                            className="flex justify-end "
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <button
                                onClick={() => {
                                    const storedPass = localStorage.getItem('password');
                                    if (storedPass) {
                                        setShowRecovery(true);
                                        setTimeout(() => {
                                            setPassword(storedPass);
                                            setConfirmPassword(storedPass);
                                        }, 300);
                                    }
                                }}
                                className="relative px-4  text-purple-400 hover:text-purple-500 text-sm flex items-center gap-1 rounded-lg transition-all duration-200"
                            >
                                <motion.span
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center gap-1"
                                >
                                    <AlertCircle size={14} />
                                    Forgot Password?
                                </motion.span>
                            </button>
                        </motion.div>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={isValidating}
                        className={`w-full ${isValidating ? 'bg-purple-600/70' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg px-4 py-3 transition-all duration-200 flex items-center justify-center gap-2 mt-2 font-medium shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30`}
                    >
                        {isValidating ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white/90 rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Check size={18} />
                                Set Password
                            </>
                        )}
                    </button>
                    {showRecovery && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-1 bg-purple-500/5 rounded-2xl border border-purple-400/30 relative overflow-hidden"
                        >
                            <div className="absolute inset-0  animate-pulse" />
                            <div className="relative z-10">
                                <div className="bg-purple-950/50 p-3 rounded-lg border border-purple-400/20 backdrop-blur-sm">
                                    <code className="text-purple-300 font-mono text-lg tracking-wide">
                                        {localStorage.getItem('password')}
                                    </code>
                                </div>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-purple-500/20 blur-xl opacity-50" />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};