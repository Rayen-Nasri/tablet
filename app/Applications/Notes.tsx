"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface NotesProps {
    setActiveApp: (app: 'Settings' | 'Messages' | 'App Store' | 'Photos' | 'Flappy Bird' | 'Notes' | 'Password' | 'Wallpaper' | null) => void
}

interface Note {
    id: number
    title: string
    content: string
    timestamp: string
}

export const Notes = ({ setActiveApp }: NotesProps) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState<'close' | 'new' | null>(null);
    const [notes, setNotes] = useState<Note[]>(() => {
        if (typeof window !== 'undefined') {
            const savedNotes = localStorage.getItem('notes')
            return savedNotes ? JSON.parse(savedNotes) : [
                {
                    id: 1,
                    title: 'Welcome Note',
                    content: 'Welcome to the Notes app! Create and manage your notes here.',
                    timestamp: new Date().toLocaleDateString()
                }
            ]
        }
        return [{
            id: 1,
            title: 'Welcome Note',
            content: 'Welcome to the Notes app! Create and manage your notes here.',
            timestamp: new Date().toLocaleDateString()
        }]
    })

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes))
    }, [notes])
    const [selectedNote, setSelectedNote] = useState<Note | null>(null)
    const [newNote, setNewNote] = useState({ title: '', content: '' })

    const hasUnsavedChanges = () => {
        if (selectedNote) {
            const originalNote = notes.find(n => n.id === selectedNote.id)
            return originalNote?.title !== selectedNote.title || originalNote?.content !== selectedNote.content
        }
        return newNote.title.trim() !== '' || newNote.content.trim() !== ''
    }

    const handleClose = () => {
        if (hasUnsavedChanges()) {
            setPendingAction('close')
            setShowConfirmDialog(true)
        } else {
            setActiveApp(null)
        }
    }

    const handleNewNote = () => {
        if (hasUnsavedChanges()) {
            setPendingAction('new')
            setShowConfirmDialog(true)
        } else {
            setSelectedNote(null)
            setNewNote({ title: '', content: '' })
        }
    }

    const createNote = () => {
        if (!newNote.title.trim() && !newNote.content.trim()) return

        const note: Note = {
            id: Date.now(),
            title: newNote.title || 'Untitled Note',
            content: newNote.content,
            timestamp: new Date().toLocaleDateString()
        }

        setNotes([...notes, note])
        setNewNote({ title: '', content: '' })
        setSelectedNote(null)
    }

    const deleteNote = (noteId: number) => {
        setNotes(notes.filter(note => note.id !== noteId))
        if (selectedNote?.id === noteId) {
            setSelectedNote(null)
        }
    }

    const updateNote = () => {
        if (!selectedNote) return
        if (!selectedNote.title.trim() && !selectedNote.content.trim()) {
            deleteNote(selectedNote.id)
            return
        }

        const updatedNotes = notes.map(note =>
            note.id === selectedNote.id
                ? {
                    ...selectedNote,
                    title: selectedNote.title.trim() || 'Untitled Note',
                    timestamp: new Date().toLocaleDateString()
                }
                : note
        )

        setNotes(updatedNotes)
        setSelectedNote(null)
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className=" w-[90%] md:max-w-4xl bg-white/10 rounded-2xl overflow-hidden backdrop-blur-lg flex flex-col h-[90vh] sm:h-[80vh] shadow-2xl border border-white/5"
            >
                <div className="p-4 sm:p-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <h2 className="text-xl sm:text-2xl font-semibold text-white/90">Notes</h2>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={handleNewNote}
                            className="bg-white/10 text-white/90 p-2 sm:p-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                        <button
                            onClick={handleClose}
                            className="bg-white/10 text-white/90 p-2 sm:p-2.5 rounded-xl hover:bg-white/20 transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row">
                    {/* Notes List */}
                    <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto max-h-[30vh] lg:max-h-full">
                        <button
                            onClick={() => {
                                if (selectedNote || (newNote.title.trim() || newNote.content.trim())) {
                                    createNote();
                                }
                                setSelectedNote(null);
                                setNewNote({ title: '', content: '' });
                            }}
                            className="w-full bg-purple-600 text-white rounded-xl px-4 sm:px-6 py-2 sm:py-3 hover:bg-purple-700 transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            New Note
                        </button>

                        {notes.map((note) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => setSelectedNote(note)}
                                className={`cursor-pointer p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${selectedNote?.id === note.id ? 'bg-white/20 shadow-lg ring-2 ring-purple-500/50 shadow-purple-500/20' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white/90 font-medium truncate text-lg">{note.title}</h3>
                                        <p className="text-white/60 text-sm truncate mt-1">{note.content}</p>
                                        <p className="text-white/40 text-xs mt-2 font-medium">{note.timestamp}</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNote(note.id);
                                        }}
                                        className="text-white/60 hover:text-red-400 transition-colors p-1 hover:bg-white/10 rounded-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Note Editor */}
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                        <div className="space-y-3 sm:space-y-4">
                            <input
                                type="text"
                                value={selectedNote ? selectedNote.title : newNote.title}
                                onChange={(e) => selectedNote
                                    ? setSelectedNote({ ...selectedNote, title: e.target.value })
                                    : setNewNote({ ...newNote, title: e.target.value })
                                }
                                placeholder="Enter note title..."
                                className="w-full bg-white/5 rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base sm:text-lg font-medium transition-all duration-200 hover:bg-white/10"
                            />
                            <textarea
                                value={selectedNote ? selectedNote.content : newNote.content}
                                onChange={(e) => selectedNote
                                    ? setSelectedNote({ ...selectedNote, content: e.target.value })
                                    : setNewNote({ ...newNote, content: e.target.value })
                                }
                                placeholder="Start writing your note here..."
                                className="w-full h-[calc(94vh-500px)] lg:h-[calc(90vh-380px)] bg-white/5 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm sm:text-base transition-all duration-200 hover:bg-white/10"
                            />
                            {selectedNote ? (
                                <div className="flex gap-4">
                                    <button
                                        onClick={updateNote}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl px-6 py-3 hover:from-purple-700 hover:to-purple-900 transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="relative z-10">Update Note</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedNote(null)}
                                        className="flex-1 bg-white/10 text-white/90 rounded-xl px-6 hover:bg-white/20 transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 font-medium shadow-lg flex items-center justify-center gap-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={createNote}
                                    className="w-full bg-purple-600 text-white rounded-xl py-2 px-6 hover:bg-purple-700 transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 font-medium shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Note
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 max-w-md w-full"
                    >
                        <h3 className="text-xl font-semibold text-white/90 mb-4">Unsaved Changes</h3>
                        <p className="text-white/70 mb-6">You have unsaved changes. Would you like to save them before leaving?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    if (selectedNote) {
                                        updateNote()
                                    } else {
                                        createNote()
                                    }
                                    setShowConfirmDialog(false)
                                    if (pendingAction === 'close') setActiveApp(null)
                                    if (pendingAction === 'new') {
                                        setSelectedNote(null)
                                        setNewNote({ title: '', content: '' })
                                    }
                                }}
                                className="flex-1 bg-purple-600 text-white rounded-xl px-4 py-2 hover:bg-purple-700 transition-all duration-200"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmDialog(false)
                                    if (pendingAction === 'close') setActiveApp(null)
                                    if (pendingAction === 'new') {
                                        setSelectedNote(null)
                                        setNewNote({ title: '', content: '' })
                                    }
                                }}
                                className="flex-1 bg-white/10 text-white/90 rounded-xl px-4 py-2 hover:bg-white/20 transition-all duration-200"
                            >
                                Don't Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmDialog(false)
                                    setPendingAction(null)
                                }}
                                className="flex-1 bg-white/10 text-white/90 rounded-xl px-4 py-2 hover:bg-white/20 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}