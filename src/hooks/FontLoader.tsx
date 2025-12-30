import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, } from "react-native";
import * as Font from 'expo-font';
import { ReactNode } from "react";

type FontLoaderProps = {
    children: ReactNode
}

const FontLoader = ({children}: FontLoaderProps) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);


    useEffect(() => {

        (
            async function loadFonts () {
                await Font.loadAsync({
                    "Oswald-Bold": require("../../assets/fonts/Oswald-Bold.ttf"),
                    "Oswald-ExtraLight":require("../../assets/fonts/Oswald-ExtraLight.ttf"),
                    "Oswald-Light": require("../../assets/fonts/Oswald-Light.ttf"),
                    "Oswald-Medium":require("../../assets/fonts/Oswald-Medium.ttf"),
                    "Oswald-Regular":require("../../assets/fonts/Oswald-Regular.ttf"),
                    "Oswald-SemiBold":require("../../assets/fonts/Oswald-SemiBold.ttf")

                })
                setFontsLoaded(true);
            }


        )()




    }, [])



    if (!fontsLoaded) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
        );
     }

    return children;


}


export default FontLoader;