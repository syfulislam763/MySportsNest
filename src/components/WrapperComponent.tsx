import React, { ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AppHeader from './AppHeader';
import BackButton from './BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { renderNode } from '@/utils/utils';

type WrapperComponentProps = {
    bg_color?: string;
    title?: string;
    container_bg?: string;
    headerComponent?: ReactNode | (() => ReactNode);
    footerComponent?: ReactNode | (() => ReactNode);
    children: ReactNode;
}

const WrapperComponent = ({
    bg_color="bg-red-500", 
    title="title",
    container_bg ="bg-[##e7eaef]",
    headerComponent,
    footerComponent,
    children,
    
}:WrapperComponentProps

) => {
    
    return (
        <SafeAreaView className={`flex-1 ${bg_color}`}>
            {headerComponent?renderNode(headerComponent):
                <View className="px-5 pb-3">
                    <AppHeader
                        left={()=> <BackButton bg_color={""}/>}
                        middle={() => <Text className="text-white font-archivo-semi-bold text-2xl">{title}</Text>}
                        right={()=>null}
                    />
                </View>
            }
            <View className={`h-full px-6 py-8 ${container_bg}`}>
                {children}

                <View className="">
                    {footerComponent?renderNode(footerComponent):null}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default WrapperComponent;