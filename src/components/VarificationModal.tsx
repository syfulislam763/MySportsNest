import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Animated, Easing, Image } from 'react-native';

type VerificationModalProps = {
    visible: boolean;
    title?: string | undefined,
    title_?: string | undefined,
    subtitle?: string | undefined,
    onClose?: () => void;
}

const success = require("../../assets/img/success.png")

const VerificationModal = ({ visible,title,title_, subtitle, onClose }: VerificationModalProps) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [visible]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center" style={{backgroundColor: 'rgba(94, 94, 94, 0.8)'}}>
                <View className="bg-white/95 rounded-3xl w-[320px] p-8 items-center" style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 10,
                }}>
                    
                    <View className="mb-8 items-center justify-center">
                        <View className="absolute w-24 h-24 rounded-full bg-[#7ac7ea]/20" />
                        <View className="absolute w-20 h-20 rounded-full bg-[#7ac7ea]/30" />
                        <View className="absolute w-16 h-16 rounded-full bg-[#7ac7ea]/40" />
                        <Image 
                            source={success}
                            style={{width: 130, height: 130, objectFit: 'cover'}}
                        />
                    </View>

                    <Text className="text-black text-2xl font-oswald-semi-bold text-center mb-1">{title}</Text>
                    {title_ && <Text className="text-black text-2xl font-oswald-semi-bold text-center mb-8">{title_}</Text>}
                    {subtitle && <Text className="text-[#6E6E6E] text-base font-oswald-medium text-center mb-8">{subtitle}</Text>}

                    <Animated.View style={{ transform: [{ rotate: spin }], width: 48, height: 48, position: 'relative' }}>
                        <View style={{position: 'absolute', top: 0, left: '50%', marginLeft: -4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7ac7ea'}} />

                        <View style={{position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7ac7ea', opacity: 0.8}} />

                        <View style={{position: 'absolute', right: 0, top: '50%', marginTop: -4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7ac7ea', opacity: 0.65}} />

                        <View style={{position: 'absolute', bottom: 3, right: 3, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7ac7ea', opacity: 0.5}} />
                        
                        <View style={{position: 'absolute', bottom: 0, left: '50%', marginLeft: -4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7ac7ea', opacity: 0.35}} />

                        <View style={{position: 'absolute', bottom: 3, left: 3, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7ac7ea', opacity: 0.2}} />

                        <View style={{position: 'absolute', left: 0, top: '50%', marginTop: -4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7ac7ea', opacity: 0.1}} />

                        <View style={{position: 'absolute', top: 3, left: 3, width: 8, height: 8, borderRadius: 4, backgroundColor: '#7ac7ea', opacity: 0.05}} />

                    </Animated.View>

                </View>
            </View>
        </Modal>
    );
}

export default VerificationModal;