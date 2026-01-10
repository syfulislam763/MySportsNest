import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { Search, ChevronDown, SlidersHorizontal, Heart, Bookmark, MoreVertical, Plus } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import NestMenu from '@/components/NestMenu';
import LiveBar from '@/components/LiveBar';


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

const NestFeedScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const appIcon = require("../../../assets/img/appIcon.png");
    const profilePic = require("../../../assets/temp/test_p1.jpg");
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
            image: require("../../../assets/temp/test4.jpg"),
            likes: 764,
            avatar: require("../../../assets/temp/test_p1.jpg")
        },
        {
            id: '2',
            user: 'LeBron James',
            handle: '@team',
            timestamp: '24 Nov 2025, 10:45 AM',
            source: 'via The Athletic',
            title: 'Exclusive interview with Manchester United about future plans',
            description: 'Latest updates and analysis from trusted sports sources covering the biggest...',
            image: require("../../../assets/temp/test3.jpg"),
            likes: 895,
            avatar: require("../../../assets/temp/test_p2.jpg")
        },
        {
            id: '3',
            user: 'Manchester',
            handle: '@Athlete',
            timestamp: '24 Nov 2025, 10:45 AM',
            source: 'via The Athletic',
            title: "Analysis: What's next for Tom Brady?",
            description: 'Latest updates and analysis from trusted sports sources covering the biggest...',
            image: require("../../../assets/temp/test.jpg"),
            likes: 895,
            avatar: require("../../../assets/temp/test_p1.jpg")
        }
    ];




   
    const renderPost = ({ item }: { item: Post }) => (
        <View className="p-4 mb-4 border-b border-b-white">
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

            <View className='flex-row items-center justify-between'>
                <View className='h-12 w-12'></View>
                <View className='flex-1 ml-3'>
                    <Text className="text-white text-lg font-oswald-medium mb-2 leading-6">{item.title}</Text>
                    <Text className="text-white text-sm font-oswald-regular mb-4 leading-5">{item.description}</Text>
                    {item.image && <Image source={item.image} className='w-full rounded-2xl mb-4' style={{height: 280, resizeMode: 'cover'}} />}
              

                    <View className="flex-row items-center justify-end">
                        <View className="flex-row items-center mr-5">
                            <Heart size={22} color="#7ac7ea" fill="#7ac7ea" />
                            <Text className="text-white text-base font-oswald-regular ml-2">{item.likes}</Text>
                        </View>
                        <Bookmark size={22} color="white" />
                    </View>
                </View>
            </View>
        </View>
    );
    return (
        <View className='flex-1'>
            <WrapperComponent
                title={""}
                bg_color={"bg-[#5e5e5e]"}
                container_bg={"bg-[#5e5e5e]"}
                headerComponent={() => <View className="flex-row items-center justify-between mb-4 mx-3">
                        <Image source={appIcon} className="w-14 h-14" style={{resizeMode: 'contain'}} />
                        
                        <View className="flex-1">
                            <View className=" mx-2">
                                <TextInput
                                    className="bg-white rounded-xl px-2 py-3 pr-12 text-sm font-oswald-regular"
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
                </View>}
            >
                <View className="pb-3 relative">
                    
                    <View className="flex-row items-center justify-between ">
                        <View className="flex-row items-center">
                            <TouchableOpacity className="mr-4">
                                <Text className="text-[#7ac7ea] text-lg font-oswald-medium">Nest Feed</Text>
                                <View className="h-1 bg-[#7ac7ea] rounded-full mt-1" />
                            </TouchableOpacity>
                            <TouchableOpacity className="mr-4">
                                <Text className="text-white text-lg font-oswald-medium">Nest Calendar</Text>
                                <View className='h-1 mt-1'></View>
                                {/* <View className="h-1 bg-[#7ac7ea] rounded-full mt-1" /> */}
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

                {/* <View className='bg-white w-full h-20 absolute bottom-52 right-6 items-center justify-center rounded-xl '>
                    <Text className='text-center'>
                        {"Tap the Nest icon to view the contents of your Nest\n and visit a specific team/league/athlete page"}
                    </Text>
                </View> */}

                <TouchableOpacity 
                    className="absolute bottom-24 w-28 h-28 rounded-full  items-center justify-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                        right: (width/2)-50
                    }}
                    onPress={() => setMenuOpen(true)}
                >
                    <Image source={nest} className="w-full h-full" style={{objectFit: 'cover'}} />
                </TouchableOpacity>
   
                <NestMenu 
                    menuOpen={menuOpen} 
                    setMenuOpen={setMenuOpen}
                    buttonPosition={{ x: width / 2, y: height - 100 }}
                />
            </WrapperComponent>
            
            <LiveBar/>

        </View>
    );
}


export default NestFeedScreen;