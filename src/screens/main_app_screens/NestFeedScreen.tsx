import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image, Animated, PanResponder, Dimensions, Modal } from 'react-native';
import { Search, Calendar, ChevronDown, SlidersHorizontal, Heart, Bookmark, MoreVertical, Plus } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

type Post = {
    id: string;
    user: string;
    handle: string;
    timestamp: string;
    source: string;
    title: string;
    description: string;
    image: any;
    likes: number;
    avatar: any;
}

type CircularItem = {
    id: string;
    name: string;
    image: any;
}

const NestFeedScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const rotationValue = useRef(new Animated.Value(0)).current;
    const [currentOffset, setCurrentOffset] = useState(0);
    const lastAngle = useRef(0);
    
    const appIcon = require("../../../assets/img/appIcon.png");
    const profilePic = require("../../../assets/img/appIcon.png");
    const nest360 = require("../../../assets/img/nest360.png")
    const nest = require("../../../assets/img/Nest.png")

    const posts: Post[] = [
        {
            id: '1',
            user: 'Manchester',
            handle: '@team',
            timestamp: '24 Nov 2025, 10:45 AM',
            source: 'via YouTube',
            title: 'Exclusive interview with Manchester United about future plans',
            description: 'Latest updates and analysis from trusted sports sources covering the biggest...',
            image: require("../../../assets/img/appIcon.png"),
            likes: 764,
            avatar: require("../../../assets/img/appIcon.png")
        },
        {
            id: '2',
            user: 'LeBron James',
            handle: '@team',
            timestamp: '24 Nov 2025, 10:45 AM',
            source: 'via The Athletic',
            title: 'Exclusive interview with Manchester United about future plans',
            description: 'Latest updates and analysis from trusted sports sources covering the biggest...',
            image: require("../../../assets/img/appIcon.png"),
            likes: 895,
            avatar: require("../../../assets/img/appIcon.png")
        },
        {
            id: '3',
            user: 'Manchester',
            handle: '@Athlete',
            timestamp: '24 Nov 2025, 10:45 AM',
            source: 'via The Athletic',
            title: "Analysis: What's next for Tom Brady?",
            description: 'Latest updates and analysis from trusted sports sources covering the biggest...',
            image: require("../../../assets/img/appIcon.png"),
            likes: 895,
            avatar: require("../../../assets/img/appIcon.png")
        }
    ];

    const circularItems: CircularItem[] = [
        { id: '1', name: 'Item 1', image: require("../../../assets/img/appIcon.png") },
        { id: '2', name: 'Item 2', image: require("../../../assets/img/appIcon.png") },
        { id: '3', name: 'Item 3', image: require("../../../assets/img/appIcon.png") },
        { id: '4', name: 'Item 4', image: require("../../../assets/img/appIcon.png") },
        { id: '5', name: 'Item 5', image: require("../../../assets/img/appIcon.png") },
        { id: '6', name: 'Item 6', image: require("../../../assets/img/appIcon.png") },
        { id: '7', name: 'Item 7', image: require("../../../assets/img/appIcon.png") },
        { id: '8', name: 'Item 8', image: require("../../../assets/img/appIcon.png") },
        { id: '9', name: 'Item 9', image: require("../../../assets/img/appIcon.png") },
        { id: '10', name: 'Item 10', image: require("../../../assets/img/google.png") },
        { id: '11', name: 'Item 11', image: require("../../../assets/img/google.png") },
        { id: '12', name: 'Item 12', image: require("../../../assets/img/google.png") },
        { id: '13', name: 'Item 13', image: require("../../../assets/img/google.png") },
        { id: '14', name: 'Item 14', image: require("../../../assets/img/google.png") },
    ];

    const maxVisibleItems = 8;

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

    const renderPost = ({ item }: { item: Post }) => (
        <View className="bg-[#4a4a4a] rounded-3xl p-4 mb-4 mx-4">
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-start flex-1">
                    <Image source={item.avatar} className="w-12 h-12 rounded-full" style={{resizeMode: 'cover'}} />
                    <View className="ml-3 flex-1">
                        <View className="flex-row items-center flex-wrap">
                            <Text className="text-white text-lg font-oswald-medium">{item.user}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-2">{item.handle}</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-1">•</Text>
                            <Text className="text-white/60 text-sm font-oswald-regular ml-1">{item.timestamp}</Text>
                        </View>
                        <Text className="text-white/60 text-xs font-oswald-regular mt-1">{item.source}</Text>
                    </View>
                </View>
                <MoreVertical size={24} color="white" />
            </View>

            <Text className="text-white text-lg font-oswald-medium mb-2 leading-6">{item.title}</Text>
            <Text className="text-white/70 text-sm font-oswald-regular mb-4 leading-5">{item.description}</Text>

            <Image source={item.image} className="w-full rounded-2xl mb-4" style={{height: 280, resizeMode: 'cover'}} />

            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Heart size={22} color="#7ac7ea" fill="#7ac7ea" />
                    <Text className="text-white text-base font-oswald-regular ml-2">{item.likes}</Text>
                </View>
                <Bookmark size={22} color="white" />
            </View>
        </View>
    );

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

                {/* <View 
                    style={{ 
                        position: 'absolute',
                        left: centerX - 30, 
                        bottom: 120,
                        zIndex: 100
                    }}
                >
                    <TouchableOpacity className="w-[60px] h-[60px] rounded-full items-center justify-center" style={{
                        backgroundColor: '#ff6b6b',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}>
                        <Plus size={32} color="white" strokeWidth={3} />
                    </TouchableOpacity>
                </View>

                <View className="absolute self-center bg-white rounded-full px-6 py-3" style={{bottom: 40}}>
                    <Text className="text-[#7ac7ea] text-sm font-oswald-medium text-center">Tap an entity to view</Text>
                    <Text className="text-[#7ac7ea] text-sm font-oswald-medium text-center">Tap outside to close</Text>
                </View> */}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#5e5e5e]">
            <View className="px-4 pt-3 pb-3">
                <View className="flex-row items-center justify-between mb-4">
                    <Image source={appIcon} className="w-14 h-14" style={{resizeMode: 'contain'}} />
                    
                    <View className="flex-1 mx-3">
                        <View className="relative">
                            <TextInput
                                className="bg-white rounded-full px-5 py-3 pr-12 text-sm font-oswald-regular"
                                placeholder="Search teams, athletes, leagues..."
                                placeholderTextColor="#a0a0a0"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <View className="absolute right-4 top-3">
                                <Search size={22} color="#5e5e5e" />
                            </View>
                        </View>
                    </View>

                    <Image source={profilePic} className="w-12 h-12 rounded-full" style={{resizeMode: 'cover'}} />
                </View>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity className="mr-4">
                            <Text className="text-[#7ac7ea] text-lg font-oswald-medium">Nest Feed</Text>
                            <View className="h-1 bg-[#7ac7ea] rounded-full mt-1" />
                        </TouchableOpacity>

                        <TouchableOpacity className="mr-4">
                            <Calendar size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center">
                        <TouchableOpacity className="flex-row items-center mr-3 border border-white/30 rounded-full px-3 py-1">
                            <Text className="text-white text-sm font-oswald-regular mr-1">Sort</Text>
                            <ChevronDown size={16} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center border border-white/30 rounded-full px-3 py-1">
                            <SlidersHorizontal size={18} color="white" />
                            <Text className="text-white text-sm font-oswald-regular ml-1">Filter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
            />

            <View className="absolute bottom-0 left-0 right-0 bg-[#4a4a4a] py-3 px-4">
                <View className="flex-row items-center justify-around">
                    <View className="flex-row items-center bg-[#7ac7ea] rounded-full px-4 py-2">
                        <Image source={appIcon} className="w-6 h-6 rounded-full mr-2" style={{resizeMode: 'cover'}} />
                        <Text className="text-white text-sm font-oswald-bold">MAN UTD 2 - 1 CHE</Text>
                        <Image source={appIcon} className="w-6 h-6 rounded-full ml-2" style={{resizeMode: 'cover'}} />
                    </View>

                    <View className="flex-row items-center bg-[#7ac7ea] rounded-full px-4 py-2">
                        <Image source={appIcon} className="w-6 h-6 rounded-full mr-2" style={{resizeMode: 'cover'}} />
                        <Text className="text-white text-sm font-oswald-bold">LAL 105 - 98</Text>
                        <Image source={appIcon} className="w-6 h-6 rounded-full ml-2" style={{resizeMode: 'cover'}} />
                    </View>
                </View>
            </View>

            <TouchableOpacity 
                className="absolute bottom-24 right-6 w-28 h-28 rounded-full  items-center justify-center"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                }}
                onPress={() => setMenuOpen(true)}
            >
                <Image source={nest} className="w-full h-full" style={{objectFit: 'cover'}} />
            </TouchableOpacity>

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
                    >
                        <CircularMenu />

                    </BlurView>
                    
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(155,155,155,0.7)',
    },
    circularContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default NestFeedScreen;