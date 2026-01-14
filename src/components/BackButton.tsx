import React from 'react';
import { StyleSheet, View, Image, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {MoveLeft, Circle} from 'lucide-react-native'

type BackButtonProps = {
    bg_color?: string | null | undefined
}

const BackButton = ({bg_color=""}:BackButtonProps) => {
    const navigtation = useNavigation()
    return (
        <Pressable onPress={()=> navigtation.goBack()} className={`h-10 w-10 justify-center items-center rounded-full ${bg_color}`}>
           
           <MoveLeft color={'white'} size={30}/>
            
        </Pressable>
    );
}

const styles = StyleSheet.create({})

export default BackButton;