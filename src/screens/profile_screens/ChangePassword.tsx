import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { EyeOff, Eye } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';
import api from '@/constants/Axios';
import { toast } from '@/context/useToastStore';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ oldPassword?: string; newPassword?: string; confirmPassword?: string }>({});

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!oldPassword.trim()) {
            newErrors.oldPassword = 'Current password is required.';
        }
        if (!newPassword.trim()) {
            newErrors.newPassword = 'New password is required.';
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters.';
        }
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your new password.';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveChanges = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await api.post('/api/auth/password/change/', {
                old_password: oldPassword,
                new_password: newPassword,
                new_password2: confirmPassword,
            });

            toast.success('Password changed successfully!');

            // Clear fields after success
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setErrors({});
        } catch (err: any) {
            const data = err?.response?.data;

            // Map server-side field errors if present
            if (data) {
                const serverErrors: typeof errors = {};
                if (data.old_password) serverErrors.oldPassword = Array.isArray(data.old_password) ? data.old_password[0] : data.old_password;
                if (data.new_password) serverErrors.newPassword = Array.isArray(data.new_password) ? data.new_password[0] : data.new_password;
                if (data.new_password2) serverErrors.confirmPassword = Array.isArray(data.new_password2) ? data.new_password2[0] : data.new_password2;
                if (data.detail) toast.error(data.detail);
                if (Object.keys(serverErrors).length) {
                    setErrors(serverErrors);
                    return;
                }
            }

            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
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
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">
                        Change Password
                    </Text>
                </View>
            )}
        >
            <View className="flex-1 justify-between">
                <View className="flex-1">

                    {/* Current Password */}
                    <View className="mb-8">
                        <Text className="text-white text-sm font-oswald-semiBold mb-3">
                            Current Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="text-white text-base font-oswald-regular pb-2 border-b border-white/30 pr-10"
                                placeholder="Enter current password"
                                placeholderTextColor="#a0a0a0"
                                value={oldPassword}
                                onChangeText={(t) => {
                                    setOldPassword(t);
                                    if (errors.oldPassword) setErrors(e => ({ ...e, oldPassword: undefined }));
                                }}
                                secureTextEntry={!showOldPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-0 bottom-2"
                            >
                                {showOldPassword ? <Eye size={20} color="#a0a0a0" /> : <EyeOff size={20} color="#a0a0a0" />}
                            </TouchableOpacity>
                        </View>
                        {errors.oldPassword && (
                            <Text className="text-red-400 text-xs font-oswald-regular mt-1">
                                {errors.oldPassword}
                            </Text>
                        )}
                    </View>

                    {/* New Password */}
                    <View className="mb-8">
                        <Text className="text-white text-sm font-oswald-semiBold mb-3">
                            New Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="text-white text-base font-oswald-regular pb-2 border-b border-white/30 pr-10"
                                placeholder="Enter new password"
                                placeholderTextColor="#a0a0a0"
                                value={newPassword}
                                onChangeText={(t) => {
                                    setNewPassword(t);
                                    if (errors.newPassword) setErrors(e => ({ ...e, newPassword: undefined }));
                                }}
                                secureTextEntry={!showNewPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-0 bottom-2"
                            >
                                {showNewPassword ? <Eye size={20} color="#a0a0a0" /> : <EyeOff size={20} color="#a0a0a0" />}
                            </TouchableOpacity>
                        </View>
                        {errors.newPassword && (
                            <Text className="text-red-400 text-xs font-oswald-regular mt-1">
                                {errors.newPassword}
                            </Text>
                        )}
                    </View>

                    {/* Confirm Password */}
                    <View className="mb-8">
                        <Text className="text-white text-sm font-oswald-semiBold mb-3">
                            Confirm Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="text-white text-base font-oswald-regular pb-2 border-b border-white/30 pr-10"
                                placeholder="Re-enter new password"
                                placeholderTextColor="#a0a0a0"
                                value={confirmPassword}
                                onChangeText={(t) => {
                                    setConfirmPassword(t);
                                    if (errors.confirmPassword) setErrors(e => ({ ...e, confirmPassword: undefined }));
                                }}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-0 bottom-2"
                            >
                                {showConfirmPassword ? <Eye size={20} color="#a0a0a0" /> : <EyeOff size={20} color="#a0a0a0" />}
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && (
                            <Text className="text-red-400 text-xs font-oswald-regular mt-1">
                                {errors.confirmPassword}
                            </Text>
                        )}
                    </View>

                </View>

                {/* Submit Button */}
                <View>
                    <TouchableOpacity
                        onPress={handleSaveChanges}
                        disabled={loading}
                        className="bg-[#7ac7ea] rounded-xl py-4 mb-6 items-center justify-center"
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text className="text-white text-center text-base font-oswald-semiBold">
                                Save Changes
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </WrapperComponent>
    );
};

export default ChangePassword;