import React, {useEffect, useState} from 'react';
import { StyleSheet, View , Text, TextInput, TouchableOpacity, ScrollView, Image} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import { Search, Plus, Check } from 'lucide-react-native';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigations/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/context/useAuthStore';
import { add_nest_entity, get_nest_data, get_trending_data, OnboardingAPI, remove_nest_entity } from './onboardingApi';
import { setLoadingTrue, setLoadingFalse } from '@/context/useLoadingStore';

type NavigationProps = NativeStackNavigationProp<MainStackParamList>

type TrendingItem = {
    id: number,
    type: string,
    name: string,
    slug: string,
    sport: string,
    logo_url: string,
    cover_image_url: string,
    description: string,
    country: string,
    follower_count: number,
    has_api_data: boolean,
    in_nest: boolean,
    created_at: string
}

type NEST_ITEM = {
    id: number,
    entity: TrendingItem,
    position: number,
    notify_on_games: boolean,
    notify_on_news: boolean,
    added_at: string
}

const WelcomeMyNestScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('Trending');
    const [filterItem, setFilterItem] = useState('teams')
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const navigation = useNavigation<NavigationProps>()
    const insets = useSafeAreaInsets();
    const access = useAuthStore((s) => s.access);
    const logout = useAuthStore((s) => s.logout);
    const [trendingData, setTrendingData] = useState<any>({})


    const toggleItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
            setLoadingTrue();
            remove_nest_entity({entity_id:id}, res => {
                setLoadingFalse()
                if(res){

                }
            })
        } else {
            setSelectedItems([...selectedItems, id]);
            setLoadingTrue();
            add_nest_entity({entity_id:id}, res => {
                setLoadingFalse()
            })
        }
    };

    const handle_search = (value:any) => {
        console.log(value)
        setSearchQuery(value);
        // setLoadingTrue();
        get_trending_data(value, res => {
            //setLoadingFalse();
            if(res){
                setTrendingData(res);
            }
        })
    }




    const fetchAll = async () => {
        setLoadingTrue()
        try{
            const [treadingRes, nestRes] = await Promise.all([OnboardingAPI.get_trending_data(null), OnboardingAPI.get_nest_data()]);
            setTrendingData(treadingRes.data);

            const selectedEntity = (nestRes?.data?.entities ?? []).map((it:NEST_ITEM) => it.entity.id)
            setSelectedItems(selectedEntity);
            //console.log("nest res", JSON.stringify(nestRes.data, null, 2))

        }catch(e:any){
            console.log("err", JSON.stringify(e, null, 2));
        }finally{
            setLoadingFalse();
        }
    }


    useEffect(()=> {
        fetchAll();
    }, [])

    


    const filteredData = trendingData[filterItem]
    // console.log(JSON.stringify(selectedItems, null, 2))

    return (
        <View className='flex-1'>
        <WrapperComponent
            title={""}
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
            headerComponent={() => <View className='mx-6'>
                <Text className="text-white text-xl font-oswald-medium mb-2">Welcome to MySportsNest!</Text>
                <Text className="text-white/70 text-sm font-oswald-regular mb-6">Build your Nest by searching and adding your favorite teams, athletes, leagues</Text>

                <View className="relative mb-6">
                    <TextInput
                        className="bg-[#F2F2FE] rounded-xl px-5 py-4 pr-12 text-base font-oswald-regular"
                        placeholder="Search teams, athletes, leagues..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={handle_search}
                    />
                    <View className="absolute right-4 top-4">
                        <Search size={24} color="#5e5e5e" />
                    </View>
                </View>

            </View>}
        >
            <View className="flex-1">
                

                <View className="flex-row justify-between mb-6">
                    <TouchableOpacity 
                        className={`px-4 py-2 bg-[#4c4c4c] rounded-[7px] mr-3 ${selectedTab === 'Trending' ? 'border border-[#7ac7ea] bg-[#64737a]' : 'bg-transparent'}`}
                        onPress={() => {
                            setSelectedTab('Trending');
                            setFilterItem('teams')
                        }}
                    >
                        <Text className={`font-oswald-regular text-sm ${selectedTab === 'Trending' ? 'text-[#7ac7ea]' : 'text-white/60'}`}>Trending Teams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className={`px-4 py-2 bg-[#4c4c4c] rounded-[7px] mr-3 ${selectedTab === 'Popular' ? 'bg-[#64737a] border border-[#7ac7ea]' : 'bg-transparent'}`}
                        onPress={() => {
                            setSelectedTab('Popular');
                            setFilterItem('athletes')
                        }}
                    >
                        <Text className={`font-oswald-regular text-sm ${selectedTab === 'Popular' ? 'text-[#7ac7ea]' : 'text-white/60'}`}>Popular Athletes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className={`px-4 py-2 bg-[#4c4c4c] rounded-[7px] ${selectedTab === 'Leagues' ? 'bg-[#64737a] border border-[#7ac7ea]' : 'bg-transparent'}`}
                        onPress={() => {
                            setSelectedTab('Leagues');
                            setFilterItem('leagues')
                        }}
                    >
                        <Text className={`font-oswald-regular text-sm ${selectedTab === 'Leagues' ? 'text-[#7ac7ea]' : 'text-white/60'}`}>Leagues by Region</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-white text-lg font-oswald-medium mb-4">{selectedTab}</Text>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                    paddingBottom:100+ insets.bottom
                }} className="flex-1">
                    {(filteredData ?? []).map((item:TrendingItem) => (
                        <TouchableOpacity 
                            key={item.id}
                            className="flex-row items-center bg-transparent border-2 border-[#7ac7ea] rounded-2xl p-4 mb-3"
                            onPress={() => toggleItem(item.id)}
                        >
                            {item.logo_url ? 
                                <Image 
                                    source={{uri:item.logo_url}}
                                    style={{objectFit:'cover'}}
                                    className="w-12 h-12 rounded-full"
                                />:
                                <View className='w-12 h-12 rounded-full bg-white'></View>
                                
                            }
                            <View className="flex-1 ml-4">
                                <Text className="text-white text-base font-oswald-medium">{item.name}</Text>
                                <Text className="text-white/60 text-sm font-oswald-regular">{item.type} • {item.follower_count}</Text>
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
                            //onPress={() => logout()}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default WelcomeMyNestScreen;