import { motion } from 'framer-motion';


const notifications = [
    { id: 1, app: 'Messages', content: 'New message from Alex', time: '5m ago' },
    { id: 2, app: 'Calendar', content: 'Meeting at 3:00 PM', time: '10m ago' },
    { id: 3, app: 'Weather', content: 'Weather alert: Rain expected', time: '30m ago' },
];

export const Notification = () => {

    return (
        <div className="relative">

            <motion.div
                className="absolute  left-0 w-80 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl "
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
            >
                <h3 className="text-lg font-medium mb-3 items-center">
                    <span>Recent Notifications</span>
                </h3>
                <div className="space-y-3">
                    {notifications.map(notification => (
                        <motion.div
                            key={notification.id}
                            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                            whileHover={{ x: 5 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: notification.id * 0.1 }}
                        >
                            <div className="flex justify-between">
                                <span className="font-medium text-[#8158C9]">{notification.app}</span>
                                <span className="text-xs text-gray-400">{notification.time}</span>
                            </div>
                            <p className="text-sm mt-1">{notification.content}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            {/* )} */}
        </div>
    )
}