import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    StyleSheet, View, TouchableOpacity, Image, Text,
    Animated, Dimensions, PanResponder, Modal
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';
import AddToNestModal from './AddToNestModal';
import { OnboardingAPI } from '@/screens/onboarding_screens/onboardingApi';

type NavigationPropsType = NativeStackNavigationProp<MainStackParamList>

type TrendingItem = {
    id: number
    type: string
    name: string
    slug: string
    sport: string
    logo_url: string
    cover_image_url: string
    description: string
    country: string
    follower_count: number
    has_api_data: boolean
    in_nest: boolean
    created_at: string
}

type NEST_ITEM = {
    id: number
    entity: TrendingItem
    position: number
    notify_on_games: boolean
    notify_on_news: boolean
    added_at: string
}

const { width, height } = Dimensions.get('window')

type CircularItem = {
    id: string
    name: string
    image: string
}

type NestMenuProps = {
    menuOpen: boolean
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    buttonPosition?: { x: number; y: number }
}

const EMPTY_ITEM: CircularItem = { id: '', name: '', image: '' }

const RADIUS           = 140
const ITEM_SIZE        = 70
const MAX_VISIBLE      = 8
const GATE_ANGLE       = Math.PI / 2
const FADE_HALF_WIDTH  = Math.PI / 5
const TWO_PI           = Math.PI * 2
const WHEEL_HIT_RADIUS = RADIUS + ITEM_SIZE

const wrap = (v: number) => ((v % TWO_PI) + TWO_PI) % TWO_PI

const NestMenu: React.FC<NestMenuProps> = ({
    menuOpen,
    setMenuOpen,
    buttonPosition = { x: width / 2, y: height - 100 },
}) => {
    const offsetRef     = useRef(new Animated.Value(0)).current
    const lastAngle     = useRef<number>(0)
    const lastSwapAngle = useRef<number[]>(Array(MAX_VISIBLE).fill(Infinity))
    const headIndex     = useRef<number>(MAX_VISIBLE)
    const slotAssign    = useRef<number[]>(Array(MAX_VISIBLE).fill(-1))

    const [openAddtoNestModal, setOpenAddToNestModal] = useState<boolean>(false)
    const [circularItems, setCircularItems]           = useState<CircularItem[]>([])

    const [slotItems, setSlotItems] = useState<CircularItem[]>(
        Array(MAX_VISIBLE).fill(EMPTY_ITEM)
    )

    const introAnim  = useRef(new Animated.Value(0)).current
    const navigation = useNavigation<NavigationPropsType>()

    const itemAnims = useRef(
        Array.from({ length: MAX_VISIBLE }, () => ({
            x:       new Animated.Value(0),
            y:       new Animated.Value(0),
            opacity: new Animated.Value(0),
            scale:   new Animated.Value(0),
        }))
    ).current

    const cx = width / 2
    const cy = height / 2
    const nest360 = require('../../assets/img/nest360.png')

    const seedSlots = useCallback((items: CircularItem[]) => {
        const total   = items.length
        const visible = Math.min(total, MAX_VISIBLE)

        headIndex.current     = visible     
        lastSwapAngle.current = Array(MAX_VISIBLE).fill(Infinity)

        const newSlots: CircularItem[] = Array(MAX_VISIBLE).fill(EMPTY_ITEM)
        for (let i = 0; i < MAX_VISIBLE; i++) {
            slotAssign.current[i] = i < visible ? i : -1
            newSlots[i]           = i < visible ? items[i] : EMPTY_ITEM
        }
        setSlotItems(newSlots)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res  = await OnboardingAPI.get_nest_data()
                const temp = (res?.data?.entities ?? []).map((it: NEST_ITEM) => ({
                    id:    String(it.entity.id),
                    name:  it.entity.name,
                    image: it.entity.logo_url,
                }))
                setCircularItems(temp)
            } catch (_) {}
        }
        fetchData()
    }, [openAddtoNestModal])

    useEffect(() => {
        if (circularItems.length > 0) seedSlots(circularItems)
    }, [circularItems])

    useEffect(() => {
        if (menuOpen) {
            offsetRef.setValue(0)
            introAnim.setValue(0)
            lastAngle.current = 0
            if (circularItems.length > 0) seedSlots(circularItems)
        } else {
            introAnim.setValue(0)
        }
    }, [menuOpen])

    useFocusEffect(
        useCallback(() => {
            if (menuOpen) {
                offsetRef.setValue(0)
                lastAngle.current = 0
                if (circularItems.length > 0) seedSlots(circularItems)
            }
        }, [menuOpen, circularItems])
    )

    useEffect(() => {
        const total   = circularItems.length
        const visible = Math.min(total, MAX_VISIBLE)
        if (visible === 0) return

        const needsConveyor = total > MAX_VISIBLE

        const id = offsetRef.addListener(({ value: offset }) => {
            for (let slotIdx = 0; slotIdx < visible; slotIdx++) {
                const baseAngle = GATE_ANGLE + (slotIdx / visible) * TWO_PI
                const angle     = baseAngle + offset

                itemAnims[slotIdx].x.setValue(Math.cos(angle) * RADIUS)
                itemAnims[slotIdx].y.setValue(Math.sin(angle) * RADIUS)

                const norm         = wrap(angle - GATE_ANGLE)
                const distFromGate = Math.min(norm, TWO_PI - norm)
                const opacity      = distFromGate < FADE_HALF_WIDTH
                    ? distFromGate / FADE_HALF_WIDTH
                    : 1
                itemAnims[slotIdx].opacity.setValue(opacity)

                if (needsConveyor && opacity < 0.12) {
                    const snapped = Math.round(angle / (TWO_PI / visible)) * (TWO_PI / visible)
                    if (Math.abs(snapped - lastSwapAngle.current[slotIdx]) > 0.01) {
                        lastSwapAngle.current[slotIdx] = snapped

                        const nextIdx  = ((headIndex.current % total) + total) % total
                        headIndex.current += 1
                        slotAssign.current[slotIdx] = nextIdx

                        const nextItem = circularItems[nextIdx] ?? EMPTY_ITEM
                        setSlotItems(prev => {
                            const copy    = [...prev]  
                            copy[slotIdx] = nextItem   
                            return copy
                        })
                    }
                }
            }
        })

        return () => offsetRef.removeListener(id)
    }, [circularItems])

    useEffect(() => {
        const visible = Math.min(circularItems.length, MAX_VISIBLE)
        if (!menuOpen || visible === 0) return

        for (let idx = 0; idx < visible; idx++) {
            const baseAngle = GATE_ANGLE + (idx / visible) * TWO_PI
            const finalX    = Math.cos(baseAngle) * RADIUS
            const finalY    = Math.sin(baseAngle) * RADIUS

            itemAnims[idx].x.setValue(buttonPosition.x - cx)
            itemAnims[idx].y.setValue(buttonPosition.y - cy)
            itemAnims[idx].opacity.setValue(0)
            itemAnims[idx].scale.setValue(0)

            Animated.parallel([
                Animated.timing(itemAnims[idx].x,       { toValue: finalX, duration: 500, delay: idx * 30, useNativeDriver: true }),
                Animated.timing(itemAnims[idx].y,       { toValue: finalY, duration: 500, delay: idx * 30, useNativeDriver: true }),
                Animated.timing(itemAnims[idx].opacity, { toValue: 1,      duration: 500, delay: idx * 30, useNativeDriver: true }),
                Animated.spring(itemAnims[idx].scale,   { toValue: 1,                     delay: idx * 30, useNativeDriver: true }),
            ]).start()
        }
    }, [menuOpen, circularItems])

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt) => {
                const dx = evt.nativeEvent.pageX - cx
                const dy = evt.nativeEvent.pageY - cy
                return Math.sqrt(dx * dx + dy * dy) < WHEEL_HIT_RADIUS
            },
            onMoveShouldSetPanResponder: (evt) => {
                const dx = evt.nativeEvent.pageX - cx
                const dy = evt.nativeEvent.pageY - cy
                return Math.sqrt(dx * dx + dy * dy) < WHEEL_HIT_RADIUS
            },
            onPanResponderGrant: (evt) => {
                lastAngle.current = Math.atan2(
                    evt.nativeEvent.pageY - cy,
                    evt.nativeEvent.pageX - cx
                )
            },
            onPanResponderMove: (evt) => {
                const current = Math.atan2(
                    evt.nativeEvent.pageY - cy,
                    evt.nativeEvent.pageX - cx
                )
                let delta = current - lastAngle.current
                if (delta >  Math.PI) delta -= TWO_PI
                if (delta < -Math.PI) delta += TWO_PI
                offsetRef.setValue((offsetRef as any)._value + delta)
                lastAngle.current = current
            },
        })
    ).current

    const visible = Math.min(circularItems.length, MAX_VISIBLE)

    return (
        <Modal
            visible={menuOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuOpen(false)}
        >
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={() => setMenuOpen(false)}
            />

            <View style={styles.circularContainer} pointerEvents="box-none" {...panResponder.panHandlers}>

                <View style={[styles.centreWrapper, { left: cx - 45, top: cy - 45 }]}>
                    <TouchableOpacity
                        onPress={() => setOpenAddToNestModal(true)}
                        style={styles.centreButton}
                    >
                        <Image source={nest360} style={styles.centreImage} />
                    </TouchableOpacity>
                </View>

                {circularItems.length > MAX_VISIBLE && (
                    <View style={[styles.badge, { left: cx - 28, top: cy + 60 }]}>
                        <Text style={styles.badgeText}>{circularItems.length} nest</Text>
                    </View>
                )}

                {Array.from({ length: MAX_VISIBLE }).map((_, slotIdx) => {
                    const item     = slotItems[slotIdx]
                    const isActive = slotIdx < visible && item.id !== ''

                    return (
                        <Animated.View
                            key={slotIdx}
                            pointerEvents={isActive ? 'auto' : 'none'}
                            style={{
                                position: 'absolute',
                                left:    cx - ITEM_SIZE / 2,
                                top:     cy - ITEM_SIZE / 2,
                                width:   ITEM_SIZE,
                                height:  ITEM_SIZE,
                                opacity: isActive ? itemAnims[slotIdx].opacity : 0,
                                transform: [
                                    { translateX: itemAnims[slotIdx].x },
                                    { translateY: itemAnims[slotIdx].y },
                                    { scale:      itemAnims[slotIdx].scale },
                                ],
                            }}
                        >
                            {isActive && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setMenuOpen(false)
                                        console.log(item.id)
                                        navigation.navigate('TeamDetailScreen', {
                                            entity_id: Number(item.id),
                                            logo: item.image
                                        })
                                    }}
                                    style={styles.itemButton}
                                >
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.itemImage}
                                    />
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    )
                })}
            </View>

            {openAddtoNestModal && (
                <AddToNestModal
                    visible={openAddtoNestModal}
                    onClose={() => setOpenAddToNestModal(false)}
                    onConfirm={() => setOpenAddToNestModal(false)}
                />
            )}
        </Modal>
    )
}

const styles = StyleSheet.create({
    circularContainer: {
        flex: 1,
    },
    centreWrapper: {
        position: 'absolute',
        width: 90,
        height: 90,
        zIndex: 100,
    },
    centreButton: {
        width: '100%',
        height: '100%',
        borderRadius: 45,
        backgroundColor: '#ffffff60',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centreImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        backgroundColor: '#7ac7ea60',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        zIndex: 100,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Oswald-Bold',
    },
    itemButton: {
        width:           ITEM_SIZE,
        height:          ITEM_SIZE,
        borderRadius:    ITEM_SIZE / 2,
        borderWidth:     4,
        borderColor:     '#7ac7ea',
        backgroundColor: '#fff',
        alignItems:      'center',
        justifyContent:  'center',
        shadowColor:     '#000',
        shadowOffset:    { width: 0, height: 2 },
        shadowOpacity:   0.2,
        shadowRadius:    4,
        elevation:       4,
    },
    itemImage: {
        width:        ITEM_SIZE - 16,
        height:       ITEM_SIZE - 16,
        borderRadius: (ITEM_SIZE - 16) / 2,
        resizeMode:   'cover',
    },
})

export default NestMenu