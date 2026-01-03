import React, {useState} from 'react';
import { StyleSheet, View , Text, TextInput, TouchableOpacity, Image, ScrollView} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import { Eye, EyeOff } from 'lucide-react-native';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackPramList } from '@/navigations/types';
import { useAuth } from '@/context/AuthProvider';

type NavigationProps = NativeStackNavigationProp<AuthStackPramList>
const appIcon = require("../../../assets/img/appIcon.png");
const google = require("../../../assets/img/google.png")

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation<NavigationProps>();

    const {setIsAuthenticated} = useAuth();


    return (
        <WrapperComponent
            title={""}
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                paddingBottom:20
            }}>

                <View className="flex-1">
            
                    <View className='w-full items-center'>
                        <Image 
                            source={appIcon}
                            style={{objectFit:'fill'}}
                            className="h-40 w-40"
                        />
                    </View>

                    <Text className="text-white text-4xl font-oswald-medium mb-8 mt-5">Log In</Text>

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

                    <View className="mb-2">
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
                            {showPassword?<EyeOff size={30}/>: <Eye size={30}/>}
                        </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")} className="self-end mb-8 mt-4">
                        <Text className="text-[#c4a574] text-base font-oswald-medium">Forgot password?</Text>
                    </TouchableOpacity>

                    <ButtonPrimary
                        title='Continue'
                        bgColor='bg-[#7ac7ea]'
                        borderColor='border-[#7ac7ea]'
                        titleColor='text-[white]'
                        onPress={() => setIsAuthenticated(true)}
                    />

                    <View className='h-5'></View>

                    <View className="flex-row items-center mb-8">
                        <View className="flex-1 h-[1px] bg-white/40" />
                        <Text className="text-white text-sm mx-4 font-oswald-medium">Or Sign in with</Text>
                        <View className="flex-1 h-[1px] bg-white/40" />
                    </View>

                    <TouchableOpacity className="bg-white rounded-full w-14 h-14 items-center justify-center self-center mb-8">
                        <View className="w-8 h-8 rounded-full bg-white items-center justify-center">
                            <Image
                                source={google}
                                style={{objectFit:'fill'}}
                                className='h-[24] w-[24]'
                            />
                        </View>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mb-12">
                        <Text className="text-white text-base font-oswald-medium">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
                            <Text className="text-[#7dc8e3] text-base font-oswald-medium">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>
        </WrapperComponent>
    );
}

const styles = StyleSheet.create({})

export default SignInScreen;


