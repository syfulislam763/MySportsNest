import React, {useState} from 'react';
import { StyleSheet, View , Text, TextInput, ScrollView, Image} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackPramList } from '@/navigations/types';

type NavigationProps = NativeStackNavigationProp<AuthStackPramList>
const appIcon = require("../../../assets/img/appIcon.png");

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation<NavigationProps>()

    return (
        <WrapperComponent
            title={""}
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20, flex: 1}}>
            
                <View className='w-full items-center'>
                    <Image 
                        source={appIcon}
                        style={{objectFit:'fill'}}
                        className="h-40 w-40"
                    />
                </View>

                <Text className="text-white text-2xl font-oswald-medium mb-8 mt-5">Forgot Password</Text>

                <View className="mb-8">
                    <Text className="text-white text-base font-oswald-medium mb-4">Email</Text>
                    <TextInput
                        className="text-white text-base pb-3 font-oswald-medium border-b border-white"
                        placeholder="Enter your email"
                        placeholderTextColor="#a0a0a0"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View className="flex-1" />

                <ButtonPrimary
                    title='Continue'
                    bgColor='bg-[#7ac7ea]'
                    borderColor='border-[#7ac7ea]'
                    titleColor='text-[white]'
                    onPress={() => navigation.navigate("OTPVerificationScreen", {isForgotPasswordPage:true})}
                />

            </ScrollView>
        </WrapperComponent>
    );
}

const styles = StyleSheet.create({})

export default ForgotPasswordScreen;