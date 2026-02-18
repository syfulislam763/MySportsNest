import React, {useState} from 'react';
import { StyleSheet, View , Text, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import { Eye, EyeOff } from 'lucide-react-native';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackPramList } from '@/navigations/types';
import { setLoadingFalse, setLoadingTrue } from '@/context/useLoadingStore';

import { toast } from '@/context/useToastStore';
import { register_user } from './AuthAPI';
type NavigationProps = NativeStackNavigationProp<AuthStackPramList>

const appIcon = require("../../../assets/img/appIcon.png");

const SignUpScreen = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const navigation = useNavigation<NavigationProps>();
 

    const handleRegisterUser = () => {
        if(!name){
            toast.info("Name is missing", 3000)
        }else if(!email){
            toast.info("Email is missing", 3000)
        }else if(!password){
            toast.info("Password is missing", 3000)
        }else if(password.length < 8){
            toast.info("Password is less than 8 character", 3000)
        }
        else {
            const payload = {
                full_name: name,
                email: email,
                password: password,
                password2: password,
            }
            setLoadingTrue()
            register_user(payload, res => {
                setLoadingFalse()
                if(res){
                    navigation.navigate("OTPVerificationScreen", {isForgotPasswordPage:false, email: payload.email})
                }else{
                    //toast.error("Something went wrong, try again", 3000)
                }
                
            })

            console.log(payload);
            

        }
    }


    return (
        <WrapperComponent
            title={""}
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                paddingBottom: 50
            }}>
                    <View className='w-full items-center'>
                        <Image 
                            source={appIcon}
                            style={{objectFit:'fill'}}
                            className="h-40 w-40"
                        />
                    </View>

                    <Text className="text-white text-4xl font-oswald-medium mb-6 mt-5">Sign Up</Text>

                    {/* <View className="mb-6">
                        <Text className="text-white text-base font-oswald-medium mb-2">Create your username</Text>
                        <Text className="text-white/60 text-xs font-oswald-regular mb-3">Your username must be unique, 3-20 characters Letters and numbers only</Text>
                        <TextInput
                            className="text-white text-base pb-3 font-oswald-medium border-b border-white"
                            placeholder="Enter username"
                            placeholderTextColor="#a0a0a0"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View> */}

                    <View className="mb-6">
                        <Text className="text-white text-base font-oswald-medium mb-4">Name</Text>
                        <TextInput
                            className="text-white text-base pb-3 font-oswald-medium border-b border-white"
                            placeholder="Enter your name"
                            placeholderTextColor="#a0a0a0"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

                    <View className="mb-6">
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

                    <View className="mb-6">
                        <Text className="text-white text-base font-oswald-medium mb-4">Password</Text>
                        <View className="relative">
                            <TextInput
                                className="text-white text-base font-oswald-medium pb-3 border-b border-white pr-10"
                                placeholder="Enter your password"
                                placeholderTextColor="#a0a0a0"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                className="absolute right-0 bottom-2"
                                onPress={() => setShowPassword(!showPassword)}
                            >   
                                {showPassword ? <EyeOff size={30} color="white" /> : <Eye size={30} color="white" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity 
                        className="flex-row items-center mb-6 mt-2"
                        onPress={() => setAgreeTerms(!agreeTerms)}
                    >
                        <View className={`w-5 h-5 rounded border-2 ${agreeTerms ? 'bg-[#7ac7ea] border-[#7ac7ea]' : 'bg-transparent border-white'} items-center justify-center mr-3`}>
                            {agreeTerms && <Text className="text-white text-xs">✓</Text>}
                        </View>
                        <Text className="text-white text-sm font-oswald-regular">
                            I agree with <Text className="text-[#7ac7ea]">Terms & Conditions</Text>
                        </Text>
                    </TouchableOpacity>

                    <ButtonPrimary
                        title='Continue'
                        bgColor='bg-[#7ac7ea]'
                        borderColor='border-[#7ac7ea]'
                        titleColor='text-[white]'
                        onPress={() => handleRegisterUser()}
                    />

                    <View className='h-6'></View>

                    <View className="flex-row justify-center mb-12">
                        <Text className="text-white text-base font-oswald-medium">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
                            <Text className="text-[#7ac7ea] text-base font-oswald-medium">Sign In</Text>
                        </TouchableOpacity>
                    </View>

            </ScrollView>
            {/* <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                duration={3000}
                position='bottom'
                onHide={() => setToast(t => ({...t, visible:false}))}
            /> */}
        </WrapperComponent>
    );
}

const styles = StyleSheet.create({})

export default SignUpScreen;
