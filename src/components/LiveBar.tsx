import React, {useState, useRef, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated,  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const LiveBar = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [isPaused, setIsPaused] = useState(false);
    const insets = useSafeAreaInsets()
    const barcelona = require("../../assets/img/barcelona.png")
    const madrid = require("../../assets/img/madrid.png")

    const liveScores = [
        { id: '1', team1: 'MAN UTD', score: '2 - 1', team2: 'CHE', icon1: barcelona, icon2: madrid },
        { id: '2', team1: 'LAL', score: '105 - 98', team2: 'GSW', icon1: barcelona, icon2: madrid },
        { id: '3', team1: 'BOS', score: '3 - 2', team2: 'NYK', icon1: barcelona, icon2: madrid },
    ];

    useEffect(() => {
        if (liveScores.length <= 1 || isPaused) return;

       
        const itemWidth = 180;
        const totalWidth = itemWidth * liveScores.length;
        console.log(liveScores.length * 3000, scrollX)
        const animation = Animated.loop(
            Animated.timing(scrollX, {
                toValue: -totalWidth,
                duration: liveScores.length * 3000,
                useNativeDriver: true,
            })
        );

        animation.start();

        return () => animation.stop();
    }, [isPaused, liveScores.length]);


    return (
        <TouchableOpacity 
            activeOpacity={1}
            onPressIn={() => setIsPaused(true)}
            onPressOut={() => setIsPaused(false)}
            className="absolute bottom-0 left-0 right-0 bg-[#7ac7ea]/95 px-4 "
            style={{paddingBottom: insets.bottom + 10, paddingTop: 20}}
        >
            {liveScores.length === 0 ? null : liveScores.length === 1 ? (
                <View className="flex-row items-center justify-center">
                    <View className="flex-row items-center bg-[#7ac7ea] rounded-full px-4 py-2">
                        <Image source={liveScores[0].icon1} className="w-8 h-8 rounded-full mr-2" style={{resizeMode: 'cover'}} />
                        <Text className="text-white text-3xl font-oswald-bold">{liveScores[0].team1} {liveScores[0].score} {liveScores[0].team2}</Text>
                        <Image source={liveScores[0].icon2} className="w-8 h-8 rounded-full ml-2" style={{resizeMode: 'cover'}} />
                    </View>
                </View>
            ) : (
                <View style={{overflow: 'hidden'}}>
                    <Animated.View 
                        style={{
                            flexDirection: 'row',
                            transform: [{ translateX: scrollX }]
                        }}
                    >
                        {[...liveScores, ...liveScores].map((score, index) => (
                            <View key={`${score.id}-${index}`} className="flex-row items-center  rounded-full px-4 py-2 mr-4" style={{width: 170}}>
                                <Image source={score.icon1} className="w-6 h-6 rounded-full mr-2" style={{resizeMode: 'cover'}} />
                                <Text className="text-white text-sm font-oswald-bold">{score.team1} {score.score} {score.team2}</Text>
                                <Image source={score.icon2} className="w-6 h-6 rounded-full ml-2" style={{resizeMode: 'cover'}} />
                            </View>
                        ))}
                    </Animated.View>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default LiveBar;
