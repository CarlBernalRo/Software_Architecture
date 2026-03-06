import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'error' | 'success' | 'info';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, type = 'info' }) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'error': return 'text-red-600 dark:text-red-400';
            case 'success': return 'text-green-600 dark:text-green-400';
            default: return 'text-primary';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className={`text-lg font-bold ${getTypeStyles()}`}>{title}</h3>
                    <button
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        onClick={onClose}
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="px-6 py-6">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                    <button
                        className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                        onClick={onClose}
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};
