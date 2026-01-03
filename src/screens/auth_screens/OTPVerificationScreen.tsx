import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View , Text, TextInput, TouchableOpacity, ScrollView, Image} from 'react-native';
import WrapperComponent from '@/components/WrapperComponent';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackPramList } from '@/navigations/types';
import VerificationModal from '@/components/VarificationModal';
import { useRoute, RouteProp } from '@react-navigation/native';

type NavigationProps = NativeStackNavigationProp<AuthStackPramList>
const appIcon = require("../../../assets/img/appIcon.png");
type OTPRouteProp = RouteProp<AuthStackPramList, 'OTPVerificationScreen'>
const OTPVerificationScreen = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(59);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute <OTPRouteProp>()
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


    useEffect(() => {
    
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <WrapperComponent
            title={""}
            bg_color={"bg-[#5e5e5e]"}
            container_bg={"bg-[#5e5e5e]"}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}>
            
                <View className='w-full items-center'>
                    <Image 
                        source={appIcon}
                        style={{objectFit:'fill'}}
                        className="h-40 w-40"
                    />
                </View>

                <Text className="text-white text-2xl font-oswald-medium mb-4 mt-5">Inter OTP Code</Text>

                <Text className="text-white text-sm font-oswald-regular mb-1">We have sent verification code on</Text>
                <Text className="text-white text-sm font-oswald-regular mb-10">abed@gmail.com</Text>

                <View className="flex-row justify-between mb-8">
                    {otp.map((digit, index) => (
                        <View key={index}>
                            <TextInput
                                ref={(ref) => {
                                    inputRefs.current[index] = ref;
                                }}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="numeric"
                                maxLength={1}
                                selectTextOnFocus
                                style={{
                                    width: 70,
                                    height: 60,
                                    fontSize: 40,
                                    color: '#7ac7ea',
                                    fontFamily: 'Oswald-Medium',
                                    textAlign: 'center',
                                    borderBottomWidth: 2,
                                    borderBottomColor: '#ffffff',
                                    padding: 0,
                                    paddingBottom: 5
                                }}
                            />
                        </View>
                    ))}
                </View>

                <View className="items-center mb-auto">
                    <Text className="text-white text-sm font-oswald-regular">
                        Didn't receive the code? <Text className="text-[#7ac7ea]">Resend code</Text>
                    </Text>
                    <Text className="text-white text-sm font-oswald-regular mt-1">
                        Resend code at {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
                    </Text>
                </View>

                <View className="mt-auto pt-40">
                    <ButtonPrimary
                        title={route.params.isForgotPasswordPage?'Verify':'Submit'}
                        bgColor='bg-[#7ac7ea]'
                        borderColor='border-[#7ac7ea]'
                        titleColor='text-[white]'
                        onPress={() => {
                            if(route?.params?.isForgotPasswordPage){
                                navigation.navigate("CreateNewPasswordScreen")
                            }else{
                                handleModal()
                            }
                        }}
                    />
                </View>

            </ScrollView>

            {openModal && <VerificationModal title='Account Created' title_='Successfully' visible={openModal} onClose={() => {
                setOpenModal(false);
            }}/>}
        </WrapperComponent>
    );
}

const styles = StyleSheet.create({})

export default OTPVerificationScreen;