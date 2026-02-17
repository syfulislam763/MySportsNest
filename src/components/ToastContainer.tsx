import React from 'react';
import { View } from 'react-native';
import Toast from './Toast'; // Your existing Toast component
import { useToastStore } from '@/context/useToastStore';

const ToastContainer = () => {
    const { toasts, hideToast } = useToastStore();

    return (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    visible={true}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    index={toast.index}
                    position={toast.position}
                    onHide={() => hideToast(toast.id)}
                />
            ))}
        </>
    );
};

export default ToastContainer;