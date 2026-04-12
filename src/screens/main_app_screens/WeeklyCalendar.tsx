import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';
import api from '@/constants/Axios';

interface Entity {
    id: number;
    name: string;
    logo_url: string;
    type: string;
    sport: string;
}

interface CalendarEvent {
    id: number;
    sport: string;
    status: string;
    status_detail: string;
    home_entity: Entity;
    away_entity: Entity;
    league: { id: number; name: string; logo_url: string; type: string; sport: string };
    home_score: number | null;
    away_score: number | null;
    start_time: string;
    venue_name: string;
    venue_city: string;
    broadcaster: string;
    stream_url: string;
}

interface DayEvents {
    [key: string]: CalendarEvent[];
}

type NavigationProps = StackNavigationProp<MainStackParamList>;

const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
};

const formatParam = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const getDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const WeeklyCalendar = () => {
    const [currentStartDate, setCurrentStartDate] = useState<Date>(getWeekStart(new Date()));
    const [eventsByDate, setEventsByDate] = useState<DayEvents>({});

    const navigation = useNavigation<NavigationProps>();

    const fetchEvents = useCallback(async (startDate: Date) => {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        try {
            const response = await api.get('/api/calendar/nest/', {
                params: {
                    start_date: formatParam(startDate),
                    end_date: formatParam(endDate),
                },
            });
            const rawByDate: { [key: string]: CalendarEvent[] } = response.data?.data?.events_by_date ?? {};
            const normalized: DayEvents = {};
            Object.entries(rawByDate).forEach(([key, events]) => {
                const parts = key.split('-');
                const normalizedKey = `${parts[0]}-${String(Number(parts[1])).padStart(2, '0')}-${String(Number(parts[2])).padStart(2, '0')}`;
                normalized[normalizedKey] = events;
            });
            setEventsByDate(normalized);
        } catch (e) {
            setEventsByDate({});
        }
    }, []);

    useEffect(() => {
        fetchEvents(currentStartDate);
    }, [currentStartDate, fetchEvents]);

    const getWeekDays = (startDate: Date): Date[] => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return date;
        });
    };

    const formatDateRange = (startDate: Date): string => {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        const startMonth = startDate.toLocaleString('en-US', { month: 'long' });
        const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
        if (startMonth === endMonth) {
            return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}`;
        }
        return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentStartDate);
        newDate.setDate(currentStartDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentStartDate(newDate);
    };

    const formatTime = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const weekDays = getWeekDays(currentStartDate);

    return (
        <View className="flex-1 bg-[#5e5e5e]">
            <View className="border-[1px] border-white rounded-xl overflow-hidden mt-4 mb-20" style={{ flex: 1 }}>
                <View className="flex-row items-center justify-between bg-[#5e5e5e] px-4 py-4 border-b-[1px] border-white">
                    <TouchableOpacity onPress={() => navigateWeek('prev')} className="p-1">
                        <ChevronLeft size={28} color="white" strokeWidth={3} />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-oswald-bold">{formatDateRange(currentStartDate)}</Text>
                    <TouchableOpacity onPress={() => navigateWeek('next')} className="p-1">
                        <ChevronRight size={28} color="white" strokeWidth={3} />
                    </TouchableOpacity>
                </View>

                <View className="flex-row border-b-[1px] border-white">
                    {weekDays.map((day, index) => (
                        <View key={index} className={`flex-1 items-center py-3 bg-[#6e6e6e] ${index < 6 ? 'border-r-[1px] border-white' : ''}`}>
                            <Text className="text-white text-base font-oswald-semiBold">{day.toLocaleString('en-US', { weekday: 'short' })}</Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row border-b-[1px] border-white">
                    {weekDays.map((day, index) => (
                        <View key={index} className={`flex-1 items-center py-3 bg-[#6e6e6e] ${index < 6 ? 'border-r-[1px] border-white' : ''}`}>
                            <Text className="text-white text-xl font-oswald-bold">{day.getDate()}</Text>
                        </View>
                    ))}
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View className="flex-row" style={{ minHeight: 500 }}>
                        {weekDays.map((day, index) => {
                            const dateKey = getDateKey(day);
                            const events = eventsByDate[dateKey] || [];
                            return (
                                <View key={index} className={`flex-1 bg-[#6e6e6e] px-0 py-3 ${index < 6 ? 'border-r-[1px] border-white' : ''}`}>
                                    {events.map((event) => (
                                        <TouchableOpacity
                                            key={event.id}
                                            onPress={() => navigation.navigate('EventDetailsScreen', { id: 12444 })}//12444 | event.id
                                            className="flex-col gap-1 items-center mb-3"
                                        >
                                            <Image
                                                source={{ uri: event.home_entity.logo_url }}
                                                style={{ width: 22, height: 22 }}
                                                resizeMode="contain"
                                            />
                                            <Text className="text-white text-sm font-oswald-medium ml-1.5">
                                                {formatTime(event.start_time)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default WeeklyCalendar;