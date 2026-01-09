import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, Animated, Dimensions, PanResponder, Modal } from 'react-native';
import { BlurView } from 'expo-blur';


const { width, height } = Dimensions.get('window');


type CircularItem = {
    id: string;
    name: string;
    image: any;
}
type NestMenuProps = {
    menuOpen: boolean,
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NestMenu = ({menuOpen, setMenuOpen}:NestMenuProps) => {
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [currentOffset, setCurrentOffset] = useState(0);
    const lastAngle = useRef(0);
    const maxVisibleItems = 8;

    const appIcon = require("../../assets/img/appIcon.png");
    const profilePic = require("../../assets/temp/test_p1.jpg");
    const nest360 = require("../../assets/img/nest360.png")
    const nest = require("../../assets/img/Nest.png")

    const circularItems: CircularItem[] = [
        { id: '1', name: 'Item 1', image: require("../../assets/img/appIcon.png") },
        { id: '2', name: 'Item 2', image: require("../../assets/img/appIcon.png") },
        { id: '3', name: 'Item 3', image: require("../../assets/img/appIcon.png") },
        { id: '4', name: 'Item 4', image: require("../../assets/img/appIcon.png") },
        { id: '5', name: 'Item 5', image: require("../../assets/img/appIcon.png") },
        { id: '6', name: 'Item 6', image: require("../../assets/img/appIcon.png") },
        { id: '7', name: 'Item 7', image: require("../../assets/img/appIcon.png") },
        { id: '8', name: 'Item 8', image: require("../../assets/img/appIcon.png") },
        { id: '9', name: 'Item 9', image: require("../../assets/img/appIcon.png") },
        { id: '10', name: 'Item 10', image: require("../../assets/img/google.png") },
        { id: '11', name: 'Item 11', image: require("../../assets/img/google.png") },
        { id: '12', name: 'Item 12', image: require("../../assets/img/google.png") },
        { id: '13', name: 'Item 13', image: require("../../assets/img/google.png") },
        { id: '14', name: 'Item 14', image: require("../../assets/img/google.png") },
    ];



    const CircularMenu = () => {
        const radius = 140;
        const centerX = width / 2;
        const centerY = height / 2;

        const getVisibleItemsData = () => {
            const items = [];
            for (let i = 0; i < maxVisibleItems; i++) {
                const actualIndex = (currentOffset + i + circularItems.length * 100) % circularItems.length;
                items.push({
                    ...circularItems[actualIndex],
                    position: i
                });
            }
            return items;
        };

        const visibleItems = getVisibleItemsData();

        return (
            <View style={styles.circularContainer} {...panResponder.panHandlers}>
                
                <View 
                    style={{ 
                        position: 'absolute',
                        left: centerX - 45, 
                        top: centerY - 45,
                        width: 90,
                        height: 90,
                        zIndex: 100
                    }}
                >
                    <TouchableOpacity className="w-full h-full rounded-full bg-[#ffffff60] items-center justify-center" style={{}}>
                        <Image source={nest360} className="w-full h-full" style={{objectFit: 'cover'}} />
                    </TouchableOpacity>
                </View>

                {visibleItems.map((item) => {
                    const baseAngle = (item.position / maxVisibleItems) * Math.PI * 2 - Math.PI / 2;
                    
                    return (
                        <Animated.View
                            key={`${item.id}-${item.position}`}
                            style={{
                                position: 'absolute',
                                left: centerX - 35,
                                top: centerY - 35,
                                transform: [
                                    {
                                        rotate: rotationValue.interpolate({
                                            inputRange: [-10000, 10000],
                                            outputRange: ['-10000rad', '10000rad']
                                        })
                                    },
                                    {
                                        translateX: Math.cos(baseAngle) * radius
                                    },
                                    {
                                        translateY: Math.sin(baseAngle) * radius
                                    }
                                ]
                            }}
                        >
                            <TouchableOpacity>
                                <View className="w-[70px] h-[70px] rounded-full bg-white items-center justify-center" style={{
                                    borderWidth: 4,
                                    borderColor: '#7ac7ea',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                    elevation: 4,
                                }}>
                                    <Image source={item.image} className="w-14 h-14 rounded-full" style={{resizeMode: 'cover'}} />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}

            </View>
        );
    };


    useEffect(() => {
        const listener = rotationValue.addListener(({ value }) => {
            const anglePerItem = (Math.PI * 2) / maxVisibleItems;
            const newOffset = Math.floor(value / anglePerItem);
            setCurrentOffset(newOffset);
        });
        return () => rotationValue.removeListener(listener);
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const centerX = width / 2;
                const centerY = height / 2;
                const touchAngle = Math.atan2(evt.nativeEvent.pageY - centerY, evt.nativeEvent.pageX - centerX);
                lastAngle.current = touchAngle;
            },
            onPanResponderMove: (evt, gestureState) => {
                const centerX = width / 2;
                const centerY = height / 2;
                const currentAngle = Math.atan2(evt.nativeEvent.pageY - centerY, evt.nativeEvent.pageX - centerX);
                const angleDiff = currentAngle - lastAngle.current;
                
                rotationValue.setValue(rotationValue._value + angleDiff);
                lastAngle.current = currentAngle;
            },
        })
    ).current;




    return (
        <Modal
            visible={menuOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setMenuOpen(false)}
        >
            <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setMenuOpen(false)}
            >
                <BlurView
                    intensity={70}
                    tint="light"
                />
                <CircularMenu />
                
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(155,155,155,0.7)',
    },
    circularContainer: {
        flex: 1/2,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default NestMenu;
