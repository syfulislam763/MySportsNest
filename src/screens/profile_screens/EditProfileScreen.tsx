import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';

const EditProfileScreen = () => {
    const [name, setName] = useState<string>('John Doe');
    const [email, setEmail] = useState<string>('john-doe@example.com');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const profilePic = require("../../../assets/temp/test_p1.jpg");

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Sorry, we need camera roll permissions to upload profile pictures.',
                [{ text: 'OK' }]
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">Edit Profile</Text>
                </View>
            )}
        >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="flex-1">
                    <View className="items-center mb-8 mt-4">
                        <View className="relative">
                            <View className="w-32 h-32 rounded-full bg-white items-center justify-center overflow-hidden">
                                {selectedImage ? (
                                    <Image 
                                        source={{ uri: selectedImage }} 
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-20 h-20 rounded-full bg-gray-400" />
                                )}
                            </View>
                            <TouchableOpacity 
                                onPress={pickImage}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-[#7ac7ea] rounded-full items-center justify-center border-4 border-[#5e5e5e]"
                            >
                                <Camera size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-white text-sm font-oswald-regular mb-2">Name</Text>
                        <TextInput
                            className="text-white text-base font-oswald-regular pb-2 border-b border-white/30"
                            placeholder="John Doe"
                            placeholderTextColor="#a0a0a0"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-white text-sm font-oswald-regular mb-2">Email</Text>
                        <TextInput
                            className="text-white text-base font-oswald-regular pb-2 border-b border-white/30"
                            placeholder="john-doe@example.com"
                            placeholderTextColor="#a0a0a0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>
            </ScrollView>

            <View className="">
                <TouchableOpacity className="bg-[#7ac7ea] rounded-xl py-4 mb-6">
                    <Text className="text-white text-center text-base font-oswald-semiBold">Save Changes</Text>
                </TouchableOpacity>
            </View>
        </WrapperComponent>
    );
};

export default EditProfileScreen;