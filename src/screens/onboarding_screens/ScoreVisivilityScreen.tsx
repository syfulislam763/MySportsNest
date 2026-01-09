import React, {useState} from 'react';
import { StyleSheet, View , Text, TouchableOpacity, ScrollView, Switch} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigations/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VerificationModal from '@/components/VarificationModal';

type NavigationProps = NativeStackNavigationProp<MainStackParamList>

const ScoreVisibilityScreen = () => {
    const [showLiveScores, setShowLiveScores] = useState(true);
    const navigation = useNavigation<NavigationProps>();

    const [openModal, setOpenModal] = useState(false);
    
        const handleModal = () => {
            setOpenModal(true);
            const timeout = setTimeout(() => {
    
                setOpenModal(false);
                navigation.navigate("NestFeedScreen")
                clearTimeout(timeout);

            }, 2000)
        }
    

    const insets = useSafeAreaInsets()

    return (
        <View className='flex-1'>
            <WrapperComponent
                title={""}
                bg_color={"bg-[#5e5e5e]"}
                container_bg={"bg-[#5e5e5e]"}
                headerComponent={() => <View className='mx-6'>
                    <Text className="text-white text-2xl font-oswald-medium mb-2">Score Visibility</Text>
                    <Text className="text-white/70 text-sm font-oswald-regular mb-6">Choose if you want live scores to appear in your Nest feed</Text>

                </View>}
            >
                <View className="flex-1">
                    
                    <View className="bg-[#4a4a4a] rounded-2xl p-5 mb-6">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-white text-base font-oswald-medium">Show Live Scores</Text>
                            <Switch
                                value={showLiveScores}
                                onValueChange={setShowLiveScores}
                                trackColor={{ false: '#767577', true: '#7ac7ea' }}
                                thumbColor={showLiveScores ? '#ffffff' : '#f4f3f4'}
                            />
                        </View>
                        <Text className="text-white/70 text-sm font-oswald-regular">Enable to see live match scores in your feed.</Text>
                    </View>

                    <View className="flex-1" />
                    
                </View>
            </WrapperComponent>
            <View style={{
                height: 80+ insets.bottom,
                paddingBottom: insets.bottom
            }} className='bg-[#4c4c4c] rounded-tl-[50px] rounded-tr-[50px] absolute bottom-0 w-full'>
                <View className="flex-row items-center justify-around pt-4 pb-2">
                    <TouchableOpacity onPress={()=>navigation.goBack()} className="w-1/3">
                        <View className="bg-transparent py-4 rounded-full items-center">
                            <Text className="text-[#7ac7ea] text-base font-oswald-medium">Back</Text>
                        </View>
                    </TouchableOpacity>
                    <View className="w-1/3">
                        <ButtonPrimary
                            title='Done'
                            bgColor='bg-[#7ac7ea]'
                            borderColor='border-[#7ac7ea]'
                            titleColor='text-[white]'
                            onPress={() => handleModal()}
                        />
                    </View>
                </View>
            </View>

            {openModal && <VerificationModal subtitle={`You're all set! Start exploring personalized\ncontent from your favorite sports entities.`} title='Your Nest is Ready!' title_='' visible={openModal} onClose={() => {
                setOpenModal(false);
            }}/>}
        </View>
    );
}

const styles = StyleSheet.create({})

export default ScoreVisibilityScreen;