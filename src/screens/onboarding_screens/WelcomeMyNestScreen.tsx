import React, {useState} from 'react';
import { StyleSheet, View , Text, TextInput, TouchableOpacity, ScrollView, Image} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import { Search, Plus, Check } from 'lucide-react-native';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigations/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProps = NativeStackNavigationProp<MainStackParamList>

type TrendingItem = {
    id: string;
    name: string;
    type: string;
    followers: string;
    image: any;
}

const WelcomeMyNestScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('Trending Teams');
    const [selectedItems, setSelectedItems] = useState<string[]>(['1', '2', '3']);
    const navigation = useNavigation<NavigationProps>()
    const insets = useSafeAreaInsets()

    const trendingData: TrendingItem[] = [
        { id: '1', name: 'Manchester United', type: 'Team', followers: '6.2M followers', image: require('../../../assets/img/appIcon.png') },
        { id: '2', name: 'Cristiano Ronaldo', type: 'Athlete', followers: '8.9M followers', image: require('../../../assets/img/appIcon.png') },
        { id: '3', name: 'LeBron James', type: 'Athlete', followers: '8.9M followers', image: require('../../../assets/img/appIcon.png') },
        { id: '4', name: 'Manchester', type: 'League', followers: '6.5M followers', image: require('../../../assets/img/appIcon.png') },
        { id: '5', name: 'Los Angeles Lakers', type: 'Team', followers: '5.2M followers', image: require('../../../assets/img/appIcon.png') },
        { id: '6', name: 'FC Barcelona', type: 'Team', followers: '5.2M followers', image: require('../../../assets/img/appIcon.png') },
    ];

    const toggleItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    return (
        <View className='flex-1'>
            <WrapperComponent
            title={""}
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
            headerComponent={() => <Text></Text>}
        >
            <View className="flex-1">
                <Text className="text-white text-xl font-oswald-medium mb-2">Welcome to MySportsNest!</Text>
                <Text className="text-white/70 text-sm font-oswald-regular mb-6">Build your Nest by searching and adding your favorite teams, athletes, leagues</Text>

                <View className="relative mb-6">
                    <TextInput
                        className="bg-[#F2F2FE] rounded-xl px-5 py-4 pr-12 text-base font-oswald-regular"
                        placeholder="Search teams, athletes, leagues..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View className="absolute right-4 top-4">
                        <Search size={24} color="#5e5e5e" />
                    </View>
                </View>

                <View className="flex-row justify-between mb-6">
                    <TouchableOpacity 
                        className={`px-4 py-2 bg-[#4c4c4c] rounded-[7px] mr-3 ${selectedTab === 'Trending Teams' ? 'border border-[#7ac7ea] bg-[#64737a]' : 'bg-transparent'}`}
                        onPress={() => setSelectedTab('Trending Teams')}
                    >
                        <Text className={`font-oswald-regular text-sm ${selectedTab === 'Trending Teams' ? 'text-[#7ac7ea]' : 'text-white/60'}`}>Trending Teams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className={`px-4 py-2 bg-[#4c4c4c] rounded-[7px] mr-3 ${selectedTab === 'Popular Athletes' ? 'bg-[#64737a] border border-[#7ac7ea]' : 'bg-transparent'}`}
                        onPress={() => setSelectedTab('Popular Athletes')}
                    >
                        <Text className={`font-oswald-regular text-sm ${selectedTab === 'Popular Athletes' ? 'text-[#7ac7ea]' : 'text-white/60'}`}>Popular Athletes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className={`px-4 py-2 bg-[#4c4c4c] rounded-[7px] ${selectedTab === 'Leagues by Region' ? 'bg-[#64737a] border border-[#7ac7ea]' : 'bg-transparent'}`}
                        onPress={() => setSelectedTab('Leagues by Region')}
                    >
                        <Text className={`font-oswald-regular text-sm ${selectedTab === 'Leagues by Region' ? 'text-[#7ac7ea]' : 'text-white/60'}`}>Leagues by Region</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-white text-lg font-oswald-medium mb-4">Trending</Text>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                    paddingBottom:100+ insets.bottom
                }} className="flex-1">
                    {trendingData.map((item) => (
                        <TouchableOpacity 
                            key={item.id}
                            className="flex-row items-center bg-transparent border-2 border-[#7ac7ea] rounded-2xl p-4 mb-3"
                            onPress={() => toggleItem(item.id)}
                        >
                            <Image 
                                source={item.image}
                                style={{objectFit:'cover'}}
                                className="w-12 h-12 rounded-full"
                            />
                            <View className="flex-1 ml-4">
                                <Text className="text-white text-base font-oswald-medium">{item.name}</Text>
                                <Text className="text-white/60 text-sm font-oswald-regular">{item.type} • {item.followers}</Text>
                            </View>
                            <View className="w-8 h-8 rounded-full items-center justify-center" style={{backgroundColor: selectedItems.includes(item.id) ? '#7ac7ea' : 'transparent'}}>
                                {selectedItems.includes(item.id) ? (
                                    <Check size={20} color="white" />
                                ) : (
                                    <Plus size={24} color="#7ac7ea" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                
            </View>
        </WrapperComponent>

            <View style={{
                height: 80+ insets.bottom,
                paddingBottom: insets.bottom
            }} className='bg-[#4c4c4c] rounded-tl-[50px] rounded-tr-[50px] absolute bottom-0 w-full'>
                <View className="flex-row items-center justify-center pt-4 pb-2">

                    <View className="w-1/2">
                        <ButtonPrimary
                            title='Continue'
                            bgColor='bg-[#7ac7ea]'
                            borderColor='border-[#7ac7ea]'
                            titleColor='text-[white]'
                            onPress={() => navigation.navigate("ScoreVisibilityScreen")}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default WelcomeMyNestScreen;