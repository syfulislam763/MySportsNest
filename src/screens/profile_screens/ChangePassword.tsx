import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { EyeOff, Eye } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';

const ChangePassword = () => {
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const handleSaveChanges = () => {
        console.log('Save password changes');
    };

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">
                        Change Password
                    </Text>
                </View>
            )}
        >
            <View className="flex-1 justify-between">
                <View className="flex-1">
                    <View className="mb-8">
                        <Text className="text-white text-sm font-oswald-semiBold mb-3">
                            Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="text-white text-base font-oswald-regular pb-2 border-b border-white/30 pr-10"
                                placeholder="Enter password"
                                placeholderTextColor="#a0a0a0"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-0 bottom-2"
                            >
                                {showPassword ? (
                                    <Eye size={20} color="#a0a0a0" />
                                ) : (
                                    <EyeOff size={20} color="#a0a0a0" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-white text-sm font-oswald-semiBold mb-3">
                            New Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="text-white text-base font-oswald-regular pb-2 border-b border-white/30 pr-10"
                                placeholder="Enter New password"
                                placeholderTextColor="#a0a0a0"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-0 bottom-2"
                            >
                                {showNewPassword ? (
                                    <Eye size={20} color="#a0a0a0" />
                                ) : (
                                    <EyeOff size={20} color="#a0a0a0" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-white text-sm font-oswald-semiBold mb-3">
                            Confirm Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="text-white text-base font-oswald-regular pb-2 border-b border-white/30 pr-10"
                                placeholder="Enter confirm password"
                                placeholderTextColor="#a0a0a0"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-0 bottom-2"
                            >
                                {showConfirmPassword ? (
                                    <Eye size={20} color="#a0a0a0" />
                                ) : (
                                    <EyeOff size={20} color="#a0a0a0" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="">
                    <TouchableOpacity
                        onPress={handleSaveChanges}
                        className="bg-[#7ac7ea] rounded-xl py-4 mb-6"
                    >
                        <Text className="text-white text-center text-base font-oswald-semiBold">
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </WrapperComponent>
    );
};

export default ChangePassword;