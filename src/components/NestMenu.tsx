import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, Animated, Dimensions, PanResponder, Modal, ImageSourcePropType } from 'react-native';
import { BlurView } from 'expo-blur';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type CircularItem = {
    id: string;
    name: string;
    image: ImageSourcePropType;
}

type NestMenuProps = {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    buttonPosition?: { x: number; y: number };
}

const NestMenu: React.FC<NestMenuProps> = ({ menuOpen, setMenuOpen, buttonPosition = { x: width / 2, y: height - 100 } }) => {
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [currentOffset, setCurrentOffset] = useState<number>(0);
    const lastAngle = useRef<number>(0);
    const maxVisibleItems: number = 8;

    // ONLY ADD: Animation states
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const spiralAnim = useRef(new Animated.Value(0)).current;

    const appIcon = require("../../assets/img/appIcon.png");
    const profilePic = require("../../assets/temp/test_p1.jpg");
    const nest360 = require("../../assets/img/nest360.png");
    const nest = require("../../assets/img/Nest.png");

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

    useEffect(() => {
        if (menuOpen) {
            setShowMenu(false);
            spiralAnim.setValue(0);
            Animated.timing(spiralAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }).start(() => {
                setShowMenu(true);
            });
        } else {
            setShowMenu(false);
            spiralAnim.setValue(0);
        }
    }, [menuOpen]);

    useFocusEffect(
        useCallback(() => {
            if (menuOpen) {
                setCurrentOffset(0);
                rotationValue.setValue(0);
                lastAngle.current = 0;
            }
        }, [menuOpen])
    );

    useFocusEffect(
        useCallback(() => {
            const listener = rotationValue.addListener(({ value }: { value: number }) => {
                const anglePerItem = (Math.PI * 2) / maxVisibleItems;
                const newOffset = Math.floor(value / anglePerItem);
                setCurrentOffset(newOffset);
            });
            return () => rotationValue.removeListener(listener);
        }, [menuOpen])
    );

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const centerX: number = width / 2;
                const centerY: number = height / 2;
                const touchAngle: number = Math.atan2(evt.nativeEvent.pageY - centerY, evt.nativeEvent.pageX - centerX);
                lastAngle.current = touchAngle;
            },
            onPanResponderMove: (evt) => {
                const centerX: number = width / 2;
                const centerY: number = height / 2;
                const currentAngle: number = Math.atan2(evt.nativeEvent.pageY - centerY, evt.nativeEvent.pageX - centerX);
                const angleDiff: number = currentAngle - lastAngle.current;
                
                rotationValue.setValue((rotationValue as any)._value + angleDiff);
                lastAngle.current = currentAngle;
            },
        })
    ).current;

    const radius: number = 140;
    const centerX: number = width / 2;
    const centerY: number = height / 2;

    const getVisibleItemsData = (): Array<CircularItem & { position: number }> => {
        const items: Array<CircularItem & { position: number }> = [];
        for (let i = 0; i < maxVisibleItems; i++) {
            const actualIndex: number = (currentOffset + i + circularItems.length * 100) % circularItems.length;
            items.push({
                ...circularItems[actualIndex],
                position: i
            });
        }
        return items;
    };

    const visibleItems = getVisibleItemsData();

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
                        <TouchableOpacity className="w-full h-full rounded-full bg-[#ffffff60] items-center justify-center">
                            <Image source={nest360} className="w-full h-full" style={{resizeMode: 'cover'}} />
                        </TouchableOpacity>
                    </View>

                    {circularItems.length > maxVisibleItems && (
                        <View 
                            style={{ 
                                position: 'absolute',
                                left: centerX - 20, 
                                top: centerY + 70,
                                backgroundColor: '#7ac7ea',
                                borderRadius: 20,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                zIndex: 100
                            }}
                        >
                            <Text className="text-white text-xs font-oswald-bold">
                                +{circularItems.length - maxVisibleItems}
                            </Text>
                        </View>
                    )}

                    {visibleItems.map((item, index) => {
                        const baseAngle: number = (item.position / maxVisibleItems) * Math.PI * 2 - Math.PI / 2;
                        
                        const finalX = Math.cos(baseAngle) * radius;
                        const finalY = Math.sin(baseAngle) * radius;
                        
                        const itemProgress = spiralAnim.interpolate({
                            inputRange: [0, 0.1 + (index * 0.1), 1],
                            outputRange: [0, 0, 1],
                            extrapolate: 'clamp'
                        });
                        
                        const animatedX = itemProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [buttonPosition.x - centerX, finalX]
                        });
                        
                        const animatedY = itemProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [buttonPosition.y - centerY, finalY]
                        });
                        
                        return (
                            <Animated.View
                                key={`${item.id}-${item.position}`}
                                style={{
                                    position: 'absolute',
                                    left: centerX - 35,
                                    top: centerY - 35,
                                    opacity: showMenu ? 1 : itemProgress,
                                    transform: [
                                        {
                                            rotate: rotationValue.interpolate({
                                                inputRange: [-10000, 10000],
                                                outputRange: ['-10000rad', '10000rad']
                                            })
                                        },
                                        {
                                            translateX: showMenu ? finalX : animatedX
                                        },
                                        {
                                            translateY: showMenu ? finalY : animatedY
                                        },
                                        {
                                            scale: showMenu ? 1 : itemProgress
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
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default NestMenu;




// import React, { useRef, useState, useEffect } from 'react';
// import { StyleSheet, View, TouchableOpacity, Image, Text, Animated, Dimensions, PanResponder, Modal, ImageSourcePropType } from 'react-native';
// import { BlurView } from 'expo-blur';
// import { useCallback } from 'react';
// import { useFocusEffect } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// type CircularItem = {
//     id: string;
//     name: string;
//     image: ImageSourcePropType;
// }

// type NestMenuProps = {
//     menuOpen: boolean;
//     setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     buttonPosition?: { x: number; y: number };
// }

// const NestMenu: React.FC<NestMenuProps> = ({ menuOpen, setMenuOpen, buttonPosition = { x: width / 2, y: height - 100 } }) => {
//     const rotationValue = useRef(new Animated.Value(0)).current;
//     const [currentOffset, setCurrentOffset] = useState<number>(0);
//     const lastAngle = useRef<number>(0);
//     const maxVisibleItems: number = 8;


//     const [showMenu, setShowMenu] = useState<boolean>(false);
//     const spiralAnim = useRef(new Animated.Value(0)).current;

//     const appIcon = require("../../assets/img/appIcon.png");
//     const profilePic = require("../../assets/temp/test_p1.jpg");
//     const nest360 = require("../../assets/img/nest360.png");
//     const nest = require("../../assets/img/Nest.png");

//     const circularItems: CircularItem[] = [
//         { id: '1', name: 'Item 1', image: require("../../assets/temp/test_p1.jpg") },
//         { id: '2', name: 'Item 2', image: require("../../assets/img/appIcon.png") },
//         { id: '3', name: 'Item 3', image: require("../../assets/temp/test_p2.jpg") },
//         { id: '4', name: 'Item 4', image: require("../../assets/img/appIcon.png") },
//         { id: '5', name: 'Item 5', image: require("../../assets/temp/test.jpg") },
//         { id: '6', name: 'Item 6', image: require("../../assets/img/appIcon.png") },
//         { id: '7', name: 'Item 7', image: require("../../assets/img/appIcon.png") },
//         { id: '8', name: 'Item 8', image: require("../../assets/img/appIcon.png") },
//         { id: '9', name: 'Item 9', image: require("../../assets/img/appIcon.png") },
//         { id: '10', name: 'Item 10', image: require("../../assets/img/google.png") },
//         { id: '11', name: 'Item 11', image: require("../../assets/img/google.png") },
//         { id: '12', name: 'Item 12', image: require("../../assets/img/google.png") },
//         { id: '13', name: 'Item 13', image: require("../../assets/img/google.png") },
//         { id: '14', name: 'Item 14', image: require("../../assets/img/google.png") },
//     ];

//     useEffect(() => {
//         if (menuOpen) {
//             setShowMenu(false);
//             spiralAnim.setValue(0);
//             Animated.timing(spiralAnim, {
//                 toValue: 1,
//                 duration: 1500,
//                 useNativeDriver: true,
//             }).start(() => {
//                 setShowMenu(true);
//             });
//         } else {
//             setShowMenu(false);
//             spiralAnim.setValue(0);
//         }
//     }, [menuOpen]);

//     useFocusEffect(
//         useCallback(() => {
//             if (menuOpen) {
//                 setCurrentOffset(0);
//                 rotationValue.setValue(0);
//                 lastAngle.current = 0;
//             }
//         }, [menuOpen])
//     );

//     useFocusEffect(
//         useCallback(() => {
//             const listener = rotationValue.addListener(({ value }: { value: number }) => {
//                 const anglePerItem = (Math.PI * 2) / maxVisibleItems;
//                 const newOffset = Math.floor(value / anglePerItem);
//                 setCurrentOffset(newOffset);
//             });
//             return () => rotationValue.removeListener(listener);
//         }, [menuOpen])
//     );

//     const panResponder = useRef(
//         PanResponder.create({
//             onStartShouldSetPanResponder: () => true,
//             onMoveShouldSetPanResponder: () => true,
//             onPanResponderGrant: (evt) => {
//                 const centerX: number = width / 2;
//                 const centerY: number = height / 2;
//                 const touchAngle: number = Math.atan2(evt.nativeEvent.pageY - centerY, evt.nativeEvent.pageX - centerX);
//                 lastAngle.current = touchAngle;
//             },
//             onPanResponderMove: (evt) => {
//                 const centerX: number = width / 2;
//                 const centerY: number = height / 2;
//                 const currentAngle: number = Math.atan2(evt.nativeEvent.pageY - centerY, evt.nativeEvent.pageX - centerX);
//                 const angleDiff: number = currentAngle - lastAngle.current;
                
//                 rotationValue.setValue((rotationValue as any)._value + angleDiff);
//                 lastAngle.current = currentAngle;
//             },
//         })
//     ).current;

//     const radius: number = 140;
//     const centerX: number = width / 2;
//     const centerY: number = height / 2;

//     const getVisibleItemsData = (): Array<CircularItem & { position: number }> => {
//         const items: Array<CircularItem & { position: number }> = [];
//         for (let i = 0; i < maxVisibleItems; i++) {
//             const actualIndex: number = (currentOffset + i + circularItems.length * 100) % circularItems.length;
//             items.push({
//                 ...circularItems[actualIndex],
//                 position: i
//             });
//         }
//         return items;
//     };

//     const visibleItems = getVisibleItemsData();

//     return (
//         <Modal
//             visible={menuOpen}
//             transparent={true}
//             animationType="fade"
//             onRequestClose={() => setMenuOpen(false)}
//         >
//             <TouchableOpacity 
//                 style={styles.modalOverlay}
//                 activeOpacity={1}
//                 onPress={() => setMenuOpen(false)}
//             >
//                 <BlurView
//                     intensity={70}
//                     tint="light"
//                 />
                
//                 <View style={styles.circularContainer} {...panResponder.panHandlers}>
                    
//                     <View 
//                         style={{ 
//                             position: 'absolute',
//                             left: centerX - 45, 
//                             top: centerY - 45,
//                             width: 90,
//                             height: 90,
//                             zIndex: 100
//                         }}
//                     >
//                         <TouchableOpacity className="w-full h-full rounded-full bg-[#ffffff60] items-center justify-center">
//                             <Image source={nest360} className="w-full h-full" style={{resizeMode: 'cover'}} />
//                         </TouchableOpacity>
//                     </View>

//                     {visibleItems.map((item, index) => {
//                         const baseAngle: number = (item.position / maxVisibleItems) * Math.PI * 2 - Math.PI / 2;
                        
//                         const finalX = Math.cos(baseAngle) * radius;
//                         const finalY = Math.sin(baseAngle) * radius;
                        
//                         const itemProgress = spiralAnim.interpolate({
//                             inputRange: [0, 0.1 + (index * 0.1), 1],
//                             outputRange: [0, 0, 1],
//                             extrapolate: 'clamp'
//                         });
                        
//                         const animatedX = itemProgress.interpolate({
//                             inputRange: [0, 1],
//                             outputRange: [buttonPosition.x - centerX, finalX]
//                         });
                        
//                         const animatedY = itemProgress.interpolate({
//                             inputRange: [0, 1],
//                             outputRange: [buttonPosition.y - centerY, finalY]
//                         });
                        
//                         return (
//                             <Animated.View
//                                 key={`${item.id}-${item.position}`}
//                                 style={{
//                                     position: 'absolute',
//                                     left: centerX - 35,
//                                     top: centerY - 35,
//                                     opacity: showMenu ? 1 : itemProgress,
//                                     transform: [
//                                         {
//                                             rotate: rotationValue.interpolate({
//                                                 inputRange: [-10000, 10000],
//                                                 outputRange: ['-10000rad', '10000rad']
//                                             })
//                                         },
//                                         {
//                                             translateX: showMenu ? finalX : animatedX
//                                         },
//                                         {
//                                             translateY: showMenu ? finalY : animatedY
//                                         },
//                                         {
//                                             scale: showMenu ? 1 : itemProgress
//                                         }
//                                     ]
//                                 }}
//                             >
//                                 <TouchableOpacity>
//                                     <View className="w-[70px] h-[70px] rounded-full bg-white items-center justify-center" style={{
//                                         borderWidth: 4,
//                                         borderColor: '#7ac7ea',
//                                         shadowColor: '#000',
//                                         shadowOffset: { width: 0, height: 2 },
//                                         shadowOpacity: 0.2,
//                                         shadowRadius: 4,
//                                         elevation: 4,
//                                     }}>
//                                         <Image source={item.image} className="w-14 h-14 rounded-full" style={{resizeMode: 'cover'}} />
//                                     </View>
//                                 </TouchableOpacity>
//                             </Animated.View>
//                         );
//                     })}

//                 </View>
                
//             </TouchableOpacity>
//         </Modal>
//     );
// }

// const styles = StyleSheet.create({
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(155,155,155,0.7)',
//     },
//     circularContainer: {
//         flex: 0.5,
//         justifyContent: 'center',
//         alignItems: 'center',
//     }
// })

// export default NestMenu;
