"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Contact {
    id: number;
    name: string;
    lastMessage: string;
    timestamp: string;
    messages: Message[];
}

interface Message {
    id: number;
    text: string;
    timestamp: string;
    sender: 'user' | 'contact';
}

interface MessagesProps {
    setActiveApp: (app: 'Settings' | 'Messages' | 'App Store' | 'Photos' | 'Flappy Bird' | 'Notes' | 'Password' | 'Wallpaper' | null) => void
}

export const Messages = ({ setActiveApp }: MessagesProps) => {
    const [contacts, setContacts] = useState<Contact[]>(() => {
        if (typeof window !== 'undefined') {
            const savedContacts = localStorage.getItem('messageContacts');
            return savedContacts ? JSON.parse(savedContacts) : [
                {
                    id: 1,
                    name: "John Doe",
                    lastMessage: "Hey! How are you?",
                    timestamp: "10:30 AM",
                    messages: [
                        { id: 1, text: "Hey! How are you?", timestamp: "10:30 AM", sender: 'contact' },
                        { id: 2, text: "I'm doing great! How about you?", timestamp: "10:31 AM", sender: 'user' },
                    ]
                },
                {
                    id: 2,
                    name: "Jane Smith",
                    lastMessage: "See you tomorrow!",
                    timestamp: "9:45 AM",
                    messages: [
                        { id: 1, text: "Are we meeting tomorrow?", timestamp: "9:44 AM", sender: 'contact' },
                        { id: 2, text: "Yes, definitely!", timestamp: "9:44 AM", sender: 'user' },
                        { id: 3, text: "See you tomorrow!", timestamp: "9:45 AM", sender: 'contact' },
                    ]
                }
            ];
        }
        return [];
    });

    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewContactForm, setShowNewContactForm] = useState(false);
    const [showEditContactForm, setShowEditContactForm] = useState(false);
    const [newContactName, setNewContactName] = useState("");
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    // Save contacts to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('messageContacts', JSON.stringify(contacts));
    }, [contacts]);

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedContact) return;

        const newMsg: Message = {
            id: Date.now(),
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'user'
        };

        const updatedContacts = contacts.map(contact =>
            contact.id === selectedContact.id
                ? {
                    ...contact,
                    lastMessage: newMessage,
                    timestamp: newMsg.timestamp,
                    messages: [...contact.messages, newMsg]
                }
                : contact
        );

        setContacts(updatedContacts);
        setSelectedContact(updatedContacts.find(c => c.id === selectedContact.id) || null);
        setNewMessage("");
    };

    const addNewContact = () => {
        if (!newContactName.trim()) return;

        const newContact: Contact = {
            id: Date.now(),
            name: newContactName,
            lastMessage: "",
            timestamp: "Now",
            messages: []
        };

        setContacts(prev => [...prev, newContact]);
        setNewContactName("");
        setShowNewContactForm(false);
    };

    const handleEditContact = () => {
        if (!editingContact || !newContactName.trim()) return;

        const updatedContacts = contacts.map(contact =>
            contact.id === editingContact.id
                ? { ...contact, name: newContactName }
                : contact
        );

        setContacts(updatedContacts);
        setSelectedContact(updatedContacts.find(c => c.id === editingContact.id) || null);
        setNewContactName("");
        setShowEditContactForm(false);
        setEditingContact(null);
    };

    const deleteContact = (contactId: number) => {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        if (selectedContact?.id === contactId) {
            setSelectedContact(null);
        }
        setShowEditContactForm(false);
        setEditingContact(null);
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-4xl bg-white/10 rounded-2xl overflow-hidden backdrop-blur-lg flex flex-col h-[85vh] sm:h-[80vh] shadow-2xl border border-white/5"
            >
                <div className="p-4 sm:p-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h2 className="text-xl sm:text-2xl font-semibold text-white/90">Messages</h2>
                    </div>
                    <button
                        onClick={() => setActiveApp(null)}
                        className="bg-white/10 text-white/90 p-2 sm:p-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto max-h-[30vh] lg:max-h-full">
                        <div className="sticky top-0 bg-black/20 backdrop-blur-sm p-4 space-y-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 rounded-xl px-4 py-2 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                onClick={() => setShowNewContactForm(true)}
                                className="w-full bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-all"
                            >
                                Add New Contact
                            </button>
                        </div>

                        <div className="space-y-2 p-4">
                            {filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ${
                                        selectedContact?.id === contact.id ? 'bg-white/10' : ''
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white/90 font-medium">{contact.name}</h3>
                                        <p className="text-white/60 text-sm truncate">{contact.lastMessage}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-white/40 text-xs">{contact.timestamp}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingContact(contact);
                                                setNewContactName(contact.name);
                                                setShowEditContactForm(true);
                                            }}
                                            className="text-white/50 hover:text-white/90 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        {selectedContact ? (
                            <>
                                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                    {selectedContact.messages.map((message) => (
                                        <div key={message.id} className={`flex justify-${message.sender === 'user' ? 'end' : 'start'}`}>
                                            <div className={`${
                                                message.sender === 'user' ? 'bg-blue-600' : 'bg-white/10'
                                            } rounded-2xl ${
                                                message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                                            } px-4 py-2 max-w-[80%] sm:max-w-[70%]`}>
                                                <p className={`${
                                                    message.sender === 'user' ? 'text-white' : 'text-white/90'
                                                } text-sm sm:text-base`}>{message.text}</p>
                                                <span className={`${
                                                    message.sender === 'user' ? 'text-white/70' : 'text-white/40'
                                                } text-xs`}>{message.timestamp}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 border-t border-white/10 bg-black/20">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-white/5 rounded-xl px-4 py-2 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className="bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 font-medium shadow-lg shadow-blue-500/20 text-sm sm:text-base"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-white/50 text-lg">Select a contact to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {showNewContactForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="bg-gradient-to-br from-black/70 to-black/50 rounded-2xl p-6 w-full max-w-md mx-4 border border-white/10 shadow-xl backdrop-blur-lg"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl text-white/90 font-semibold">Add New Contact</h3>
                        </div>
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={newContactName}
                                onChange={(e) => setNewContactName(e.target.value)}
                                placeholder="Contact Name"
                                className="w-full bg-white/5 rounded-xl px-4 py-3 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10 transition-all duration-200"
                            />
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={addNewContact}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl px-4 py-3 hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20"
                            >
                                Add Contact
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowNewContactForm(false)}
                                className="flex-1 bg-white/10 text-white/90 rounded-xl px-4 py-3 hover:bg-white/20 transition-all border border-white/5"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            {showEditContactForm && editingContact && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="bg-gradient-to-br from-black/70 to-black/50 rounded-2xl p-6 w-full max-w-md mx-4 border border-white/10 shadow-xl backdrop-blur-lg"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <h3 className="text-xl text-white/90 font-semibold">Edit Contact</h3>
                        </div>
                        <div className="relative mb-6">
                            <input
                                type="text"
                                value={newContactName}
                                onChange={(e) => setNewContactName(e.target.value)}
                                placeholder="Contact Name"
                                className="w-full bg-white/5 rounded-xl px-4 py-3 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10 transition-all duration-200"
                            />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleEditContact}
                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl px-4 py-3 hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/20 min-w-[100px]"
                            >
                                Save Changes
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => deleteContact(editingContact.id)}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl px-4 py-3 hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg shadow-red-500/20 min-w-[100px]"
                            >
                                Delete Contact
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    setShowEditContactForm(false);
                                    setEditingContact(null);
                                    setNewContactName("");
                                }}
                                className="flex-1 bg-white/10 text-white/90 rounded-xl px-4 py-3 hover:bg-white/20 transition-all border border-white/5 min-w-[100px]"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
            
        </div>
    )
}