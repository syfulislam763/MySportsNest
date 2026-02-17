import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

export type Toast = {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    position?: 'top' | 'bottom';
    index: number;
};

type ToastStore = {
    index: number;
    toasts: Toast[];
    showToast: (toast: Omit<Toast, 'id'>) => void;
    hideToast: (id: string) => void;
    clearAll: () => void;
};

const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    index: 0,
    showToast: (toast) => {
        const id = generateId();
        const newToast: Toast = {
            id,
            duration: 3000,
            position: 'top',
            ...toast,
        };
        
        set((state) => ({
            toasts: [...state.toasts, {...newToast, index: state.index+50}],
            index: state.index+50
        }));
    },
    
    hideToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id).map(toast => ({...toast, index: toast.index - 50})),
            index: state.index - 50
        }));
    },
    
    clearAll: () => {
        set({ toasts: [], index: 0 });
    },
}));


export const toast = {
    success: (message: string, duration?: number) => {
        useToastStore.getState().showToast({ message, type: 'success', duration, index: 0 });
    },
    error: (message: string, duration?: number) => {
        useToastStore.getState().showToast({ message, type: 'error', duration, index: 0});
    },
    info: (message: string, duration?: number) => {
        useToastStore.getState().showToast({ message, type: 'info', duration, index: 0 });
    },
};