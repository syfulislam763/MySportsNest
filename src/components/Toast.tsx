import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

type ToastProps = {
    visible: boolean;
    message: string;
    type?: ToastType;
    duration?: number;
    index?:number;
    onHide?: () => void;
    position?: 'top' | 'bottom';
};

const TOAST_CONFIG: Record<ToastType, {
    wrapper: string;
    icon: string;
    iconText: string;
    message: string;
    bar: string;
    label: string;
}> = {
    success: {
        wrapper: 'bg-green-950',
        icon: 'bg-green-900/50 border border-green-700',
        iconText: 'text-green-400 text-sm font-bold',
        message: 'text-green-400 text-sm font-medium',
        bar: 'bg-green-400',
        label: '✓',
    },
    error: {
        wrapper: 'bg-red-950 ',
        icon: 'bg-red-900/50 border border-red-700',
        iconText: 'text-red-400 text-sm font-bold',
        message: 'text-red-400 text-sm font-medium',
        bar: 'bg-red-400',
        label: '✕',
    },
    info: {
        wrapper: 'bg-[#0d1a26]',
        icon: 'bg-[#7ac7ea]/10 border border-[#7ac7ea]/30',
        iconText: 'text-[#7ac7ea] text-sm font-bold',
        message: 'text-[#7ac7ea] text-sm font-medium',
        bar: 'bg-[#7ac7ea]',
        label: 'i',
    },
};

const Toast = ({
    visible,
    message,
    type = 'info',
    duration = 3000,
    index = 0,
    onHide,
    position = 'top',
}: ToastProps) => {
    const translateY = useRef(new Animated.Value(position === 'top' ? -80 : 80)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const progress = useRef(new Animated.Value(0)).current;
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const config = TOAST_CONFIG[type];

    useEffect(() => {
        if (visible) {
            progress.setValue(0);

            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 350,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();

            Animated.timing(progress, {
                toValue: 1,
                duration: duration,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();

            hideTimerRef.current = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: position === 'top' ? -80 : 80,
                        duration: 300,
                        easing: Easing.in(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                ]).start(() => onHide?.());
            }, duration);
        } else {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            translateY.setValue(position === 'top' ? -80 : 80);
            opacity.setValue(0);
            progress.setValue(0);
        }

        return () => {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        };
    }, [visible]);

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '0%'],
    });

    if (!visible) return null;

    return (
        <Animated.View
            style={[{ 
                opacity, 
                transform: [{ translateY }]
            }, position=="top"? {top: 70+index}: {bottom: 70+index} ]}
            className={`absolute left-5 right-5 z-50`}
        >
            <View
                className={`rounded-[7px] px-4 py-3 flex-row items-center gap-3 overflow-hidden ${config.wrapper}`}
            >
                {/* Icon badge */}
                <View className={`w-8 h-8 rounded-full items-center justify-center flex-shrink-0 ${config.icon}`}>
                    <Text className={config.iconText}>{config.label}</Text>
                </View>

                {/* Message text */}
                <Text className={`flex-1 leading-5 tracking-wide ${config.message}`} numberOfLines={2}>
                    {message}
                </Text>

                {/* Draining progress bar */}
                <Animated.View
                    className={`absolute bottom-0 left-0 h-[3px] rounded-sm opacity-70 ${config.bar}`}
                    style={{ width: progressWidth }}
                />
            </View>
        </Animated.View>
    );
};

export default Toast