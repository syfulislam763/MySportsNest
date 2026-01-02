import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackPramList } from '@/navigations/types';


type NavigationProps = NativeStackNavigationProp<AuthStackPramList>

const wlc_image = require("../../../assets/img/group_app_icon.png")
const google_icon = require("../../../assets/img/google.png")

const WelcomePage = () => {

    const navigation = useNavigation<NavigationProps>()


    return (
        <WrapperComponent
            title={""}
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
            headerComponent={() => <Text></Text>}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='flex-1'>
                <View className='flex-1 items-center justify-center'>
                    <Image
                        source={wlc_image}
                        className='h-60 w-60'
                        style={{objectFit:'fill'}}
                    />
                    <View className='h-16'/>
                    <ButtonPrimary
                        title='Sign In'
                        bgColor='bg-[#7ac7ea]'
                        borderColor='border-[#7ac7ea]'
                        titleColor='text-[white]'
                        onPress={() => navigation.navigate("SignInScreen")}
                    />
                    <View className='h-3'/>
                    <ButtonPrimary
                        title='Create Account'
                        bgColor=''
                        borderColor='border-[#7ac7ea]'
                        titleColor='text-[#7ac7ea]'
                        onPress={() => null}
                    />


                    <View className='flex-row w-full justify-between items-center my-10'>
                        <View className='w-44 h-[2px] bg-white rounded-sm'></View>
                        <Text className='font-oswald-semiBold text-xl text-white'>Or</Text>
                        <View className='w-44 h-[2px] bg-white rounded-sm'></View>
                    </View>


                    <ButtonPrimary
                        title={<View className='flex-row gap-x-2 justify-between items-center'>
                            <Image
                                source={google_icon}
                                className='h-[25px] w-[25px]'
                                style={{
                                    objectFit:'fill'
                                }}
                            />
                            <Text className='text-black'>Sign in with google</Text>
                        </View>}
                        bgColor= 'bg-white'
                        borderColor='border-[#7ac7ea]'
                        titleColor='text-[#7ac7ea]'
                        onPress={() => null}
                    />
                </View>
            </ScrollView>
        </WrapperComponent>
    );
}

const styles = StyleSheet.create({})

export default WelcomePage;
