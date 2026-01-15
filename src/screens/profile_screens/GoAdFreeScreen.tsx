import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';

const GoAdFreeScreen = () => {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

    const benefits = [
        'No ads anywhere in the app',
        'Faster UI experience',
        'leaner interface without interruptio...',
    ];

    const plans = [
        {
            id: 'monthly',
            title: 'Monthly Plan',
            price: '$4.99',
            period: '/ month',
            isBestValue: false,
        },
        {
            id: 'yearly',
            title: 'Yearly Plan',
            price: '$50.00',
            period: '/ year',
            monthlyPrice: '$4.99/mo',
            isBestValue: true,
        },
    ];

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">Go Ad-Free</Text>
                </View>
            )}
        >
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                
                <View className='flex-1'>
                    <View className="bg-gray-700 rounded-3xl p-5 mb-6">
                        <Text className="text-white text-base font-oswald-regular mb-4">
                            Remove all ads and enjoy a cleaner browsing experience.
                        </Text>
                        {benefits.map((benefit, index) => (
                            <View key={index} className="flex-row items-center mb-3">
                                <Check size={20} color="#7ac7ea" />
                                <Text className="text-[#7ac7ea] text-base font-oswald-regular ml-3">{benefit}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        className={`bg-gray-700 rounded-3xl p-5 mb-4 border-2 ${selectedPlan === 'monthly' ? 'border-white' : 'border-transparent'}`}
                        onPress={() => setSelectedPlan('monthly')}
                    >
                        <View className="flex-row items-center">
                            <View className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${selectedPlan === 'monthly' ? 'border-white bg-transparent' : 'border-white/50'}`}>
                                {selectedPlan === 'monthly' && (
                                    <View className="w-3 h-3 bg-white rounded-full" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-lg font-oswald-semiBold">Monthly Plan</Text>
                                <Text className="text-white/70 text-sm font-oswald-regular">$4.99 / month</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`bg-gray-700 rounded-3xl p-5 mb-6 border-2 ${selectedPlan === 'yearly' ? 'border-[#7ac7ea]' : 'border-transparent'}`}
                        onPress={() => setSelectedPlan('yearly')}
                    >
                        <View className="absolute top-3 right-3 bg-[#7ac7ea] rounded-full px-3 py-1">
                            <Text className="text-white text-xs font-oswald-semiBold">BEST VALUE</Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${selectedPlan === 'yearly' ? 'border-[#7ac7ea] bg-[#7ac7ea]' : 'border-white/50'}`}>
                                {selectedPlan === 'yearly' && (
                                    <Check size={16} color="white" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-lg font-oswald-semiBold">Yearly Plan</Text>
                                <Text className="text-white/70 text-sm font-oswald-regular">$50.00 / year</Text>
                            </View>
                            <View>
                                <Text className="text-[#7ac7ea] text-xl font-oswald-semiBold">$4.99/mo</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>


                
            </ScrollView>
            <TouchableOpacity className="bg-[#7ac7ea] rounded-xl py-4 mb-6">
                <Text className="text-white text-center text-base font-oswald-semiBold">Continue to Upgrade</Text>
            </TouchableOpacity>
        </WrapperComponent>
    );
};

export default GoAdFreeScreen;