import React, { ReactNode } from 'react';
import { StyleSheet, View , Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { renderNode } from '@/utils/utils';
type AppHeaderProps = {
    left?: ReactNode | (() => ReactNode),
    middle?: ReactNode | (() => ReactNode),
    right?: ReactNode | (() => ReactNode),
}

const AppHeader = ({left, middle, right}: AppHeaderProps) => {
    return (
        <View className="flex-row justify-between items-center h-auto py-3">
            <View>
                {renderNode(left)}
            </View>
            <View>
                {renderNode(middle)}
            </View>
            <View>
                {renderNode(right)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default AppHeader;