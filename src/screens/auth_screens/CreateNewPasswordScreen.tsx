import React, {useState} from 'react';
import { StyleSheet, View , Text, TextInput, TouchableOpacity, ScrollView, Image} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import { Eye, EyeOff } from 'lucide-react-native';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackPramList } from '@/navigations/types';
import VerificationModal from '@/components/VarificationModal';

type NavigationProps = NativeStackNavigationProp<AuthStackPramList>
const appIcon = require("../../../assets/img/appIcon.png");

const CreateNewPasswordScreen = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation = useNavigation<NavigationProps>()

    const [openModal, setOpenModal] = useState(false);
    
    const handleModal = () => {
        setOpenModal(true);
        const timeout = setTimeout(() => {

            setOpenModal(false);
            clearTimeout(timeout);

            navigation.reset({
                index:1,
                routes:[
                    { name: 'WelcomePage' },
                    { name: 'SignInScreen' },
                ]
            })
        }, 2000)
    }

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

                <Text className="text-white text-2xl font-oswald-medium mb-2 mt-5">Create New Password</Text>
                <Text className="text-white text-xs font-oswald-regular mb-8">We have sent verificatior your new passwordsion code on</Text>

                <View className="mb-6">
                    <Text className="text-white text-base font-oswald-medium mb-4">Password</Text>
                    <View className="relative">
                        <TextInput
                            className="text-white text-base font-oswald-medium pb-3 border-b border-white pr-10"
                            placeholder="Enter password"
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

                <View className="mb-8">
                    <Text className="text-white text-base font-oswald-medium mb-4">Confirm Password</Text>
                    <View className="relative">
                        <TextInput
                            className="text-white text-base font-oswald-medium pb-3 border-b border-white pr-10"
                            placeholder="Enter confirm password"
                            placeholderTextColor="#a0a0a0"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            className="absolute right-0 bottom-2"
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >   
                            {showConfirmPassword ? <EyeOff size={30} color="white" /> : <Eye size={30} color="white" />}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex-1" />

                <ButtonPrimary
                    title='Submit'
                    bgColor='bg-[#7ac7ea]'
                    borderColor='border-[#7ac7ea]'
                    titleColor='text-[white]'
                    onPress={() => handleModal()}
                />

            </ScrollView>
            {openModal && <VerificationModal title='Success!' subtitle='Your Password is successfully created' visible={openModal} onClose={() => {
                setOpenModal(false);
            }}/>}
        </WrapperComponent>
    );
}

const styles = StyleSheet.create({})

export default CreateNewPasswordScreen;