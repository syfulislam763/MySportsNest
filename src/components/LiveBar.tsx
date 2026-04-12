import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthProvider';

const ITEM_WIDTH = 180;

const abbr = (name: string): string =>
    name.split(' ').map((w) => w[0]?.toUpperCase() ?? '').join('');

const LiveBar = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [isPaused, setIsPaused] = useState(false);
    const currentAnimation = useRef<Animated.CompositeAnimation | null>(null);
    const insets = useSafeAreaInsets();
    const { liveScores } = useAuth();

    useFocusEffect(
        useCallback(() => {
            if (liveScores.length <= 1) return;

            const totalWidth = ITEM_WIDTH * liveScores.length;

            const startAnimation = () => {
                const currentValue = (scrollX as any)._value;
                const remainingDistance = totalWidth - currentValue;
                const speed = totalWidth / (liveScores.length * 3000);
                const duration = Math.abs(remainingDistance / speed + 1000);

                currentAnimation.current = Animated.loop(
                    Animated.sequence([
                        Animated.timing(scrollX, {
                            toValue: -totalWidth,
                            duration: duration,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scrollX, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ])
                );

                currentAnimation.current.start();
            };

            if (!isPaused) {
                startAnimation();
            }

            return () => {
                currentAnimation.current?.stop();
            };
        }, [isPaused, liveScores.length])
    );

    const renderLogo = (uri: string, side: 'left' | 'right') => {
        if (uri) {
            return (
                <Image
                    source={{ uri }}
                    className={`w-6 h-6 rounded-full ${side === 'left' ? 'mr-2' : 'ml-2'}`}
                    style={{ resizeMode: 'cover' }}
                />
            );
        }
        return (
            <View
                className={`w-6 h-6 rounded-full bg-white/30 items-center justify-center ${side === 'left' ? 'mr-2' : 'ml-2'}`}
            >
                <Text className="text-white text-[8px] font-oswald-bold">?</Text>
            </View>
        );
    };

    const getScoreLabel = (game: (typeof liveScores)[0]): string => {
        if (game.status_detail) return game.status_detail;
        if (game.home_score !== null && game.away_score !== null) {
            return `${game.home_score} - ${game.away_score}`;
        }
        return 'vs';
    };

    if (liveScores.length === 0) return null;

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => setIsPaused(true)}
            onPressOut={() => setIsPaused(false)}
            className="absolute bottom-0 left-0 right-0 bg-[#7ac7ea]/95 px-4"
            style={{ paddingBottom: insets.bottom + 10, paddingTop: 20 }}
        >
            {liveScores.length === 1 ? (
                <View className="flex-row items-center justify-center">
                    <View className="flex-row items-center bg-[#7ac7ea] rounded-full px-4 py-2">
                        {renderLogo(liveScores[0].home_logo, 'left')}
                        <Text className="text-white text-3xl font-oswald-bold">
                            {abbr(liveScores[0].home_team)} {getScoreLabel(liveScores[0])} {abbr(liveScores[0].away_team)}
                        </Text>
                        {renderLogo(liveScores[0].away_logo, 'right')}
                    </View>
                </View>
            ) : (
                <View style={{ overflow: 'hidden' }}>
                    <Animated.View
                        style={{
                            flexDirection: 'row',
                            transform: [{ translateX: scrollX }],
                        }}
                    >
                        {[...liveScores, ...liveScores].map((game, index) => (
                            <View
                                key={`${game.id}-${index}`}
                                className="flex-row items-center rounded-full px-4 py-2 mr-4"
                                style={{ width: ITEM_WIDTH }}
                            >
                                {renderLogo(game.home_logo, 'left')}
                                <Text className="text-white text-sm font-oswald-bold flex-1" numberOfLines={1}>
                                    {abbr(game.home_team)} {getScoreLabel(game)} {abbr(game.away_team)}
                                </Text>
                                {renderLogo(game.away_logo, 'right')}
                                <View className="h-6 w-[1px] bg-white ml-4" />
                            </View>
                        ))}
                    </Animated.View>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({});

export default LiveBar;