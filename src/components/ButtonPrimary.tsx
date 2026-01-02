import React, { ReactNode } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';


type ButtonPrimaryProps = {
    title?: string | ReactNode,
    borderColor?: string,
    bgColor?: string,
    titleColor?: string,
    onPress: () => any
}

const ButtonPrimary = ({title, borderColor, bgColor, titleColor, onPress}:ButtonPrimaryProps) => {
    return (
        <TouchableOpacity onPress={() => onPress()} className={`w-full ${bgColor} rounded-[8px] p-3 items-center border ${borderColor}`}>
            <Text className={`font-oswald-semiBold text-xl ${titleColor}`}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default ButtonPrimary;
