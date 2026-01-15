import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronLeft, ChevronRight, Users, User } from 'lucide-react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';
import { useNavigation } from '@react-navigation/native';

interface CalendarEvent {
    id: string;
    time: string;
    type: 'team' | 'athlete';
    title: string;
    teams?: string;
    location?: string;
    image: any;
}

interface DayEvents {
    [key: string]: CalendarEvent[];
}


type NavigationProps = StackNavigationProp<MainStackParamList>

const WeeklyCalendar = () => {
    const [currentStartDate, setCurrentStartDate] = useState<Date>(new Date(2024, 11, 1));
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const navigation = useNavigation<NavigationProps>()

    const sampleEvents: DayEvents = {
        '2024-12-1': [
            { id: '1', time: '7:00pm', type: 'team', title: 'Lakers vs Warriors', teams: 'Los Angeles Lakers vs Golden State Warriors', location: 'Crypto.com Arena', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '2', time: '7:00pm', type: 'team', title: 'Heat vs Celtics', teams: 'Miami Heat vs Boston Celtics', location: 'TD Garden', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '3', time: '7:00pm', type: 'athlete', title: 'LeBron James Interview', location: 'ESPN Studio', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '4', time: '7:00pm', type: 'athlete', title: 'Stephen Curry Practice', location: 'Chase Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '5', time: '7:00pm', type: 'team', title: 'Nets vs 76ers', teams: 'Brooklyn Nets vs Philadelphia 76ers', location: 'Wells Fargo Center', image: require('../../../assets/temp/test_p1.jpg') },
        ],
        '2024-12-2': [
            { id: '6', time: '7:00pm', type: 'team', title: 'Bucks vs Suns', teams: 'Milwaukee Bucks vs Phoenix Suns', location: 'Footprint Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '7', time: '7:00pm', type: 'team', title: 'Clippers vs Nuggets', teams: 'LA Clippers vs Denver Nuggets', location: 'Ball Arena', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '8', time: '7:00pm', type: 'athlete', title: 'Giannis Press Conference', location: 'Fiserv Forum', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '9', time: '7:00pm', type: 'athlete', title: 'Kevin Durant Training', location: 'Suns Practice Facility', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '10', time: '7:00pm', type: 'team', title: 'Mavericks vs Pelicans', teams: 'Dallas Mavericks vs New Orleans Pelicans', location: 'Smoothie King Center', image: require('../../../assets/temp/test_p1.jpg') },
        ],
        '2024-12-3': [
            { id: '11', time: '7:00pm', type: 'athlete', title: 'Luka Doncic Interview', location: 'American Airlines Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '12', time: '7:00pm', type: 'athlete', title: 'Jayson Tatum Workout', location: 'Celtics Practice Facility', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '13', time: '7:00pm', type: 'athlete', title: 'Damian Lillard Q&A', location: 'Bucks Training Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '14', time: '7:00pm', type: 'athlete', title: 'Anthony Edwards Practice', location: 'Target Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '15', time: '7:00pm', type: 'athlete', title: 'Ja Morant Photoshoot', location: 'FedExForum', image: require('../../../assets/temp/test_p1.jpg') },
        ],
        '2024-12-4': [
            { id: '16', time: '7:00pm', type: 'team', title: 'Spurs vs Rockets', teams: 'San Antonio Spurs vs Houston Rockets', location: 'Toyota Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '17', time: '7:00pm', type: 'team', title: 'Jazz vs Kings', teams: 'Utah Jazz vs Sacramento Kings', location: 'Golden 1 Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '18', time: '7:00pm', type: 'athlete', title: 'Victor Wembanyama Interview', location: 'AT&T Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '19', time: '7:00pm', type: 'athlete', title: "De'Aaron Fox Practice", location: 'Kings Practice Facility', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '20', time: '7:00pm', type: 'athlete', title: 'Alperen Sengun Training', location: 'Rockets Practice Facility', image: require('../../../assets/temp/test_p1.jpg') },
        ],
        '2024-12-5': [
            { id: '21', time: '7:00pm', type: 'team', title: 'Grizzlies vs Thunder', teams: 'Memphis Grizzlies vs Oklahoma City Thunder', location: 'Paycom Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '22', time: '7:00pm', type: 'team', title: 'Pacers vs Raptors', teams: 'Indiana Pacers vs Toronto Raptors', location: 'Scotiabank Arena', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '23', time: '7:00pm', type: 'team', title: 'Wizards vs Hawks', teams: 'Washington Wizards vs Atlanta Hawks', location: 'State Farm Arena', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '24', time: '7:00pm', type: 'athlete', title: 'Shai Gilgeous-Alexander Interview', location: 'Paycom Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '25', time: '7:00pm', type: 'athlete', title: 'Trae Young Practice', location: 'Hawks Training Facility', image: require('../../../assets/temp/test_p1.jpg') },
        ],
        '2024-12-6': [
            { id: '26', time: '7:00pm', type: 'athlete', title: 'Paolo Banchero Workout', location: 'Kia Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '27', time: '7:00pm', type: 'athlete', title: 'Chet Holmgren Training', location: 'Thunder Practice Facility', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '28', time: '7:00pm', type: 'athlete', title: 'Tyrese Haliburton Press Conference', location: 'Gainbridge Fieldhouse', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '29', time: '7:00pm', type: 'athlete', title: 'Zion Williamson Interview', location: 'Pelicans Training Facility', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '30', time: '7:00pm', type: 'athlete', title: 'Devin Booker Practice', location: 'Suns Practice Facility', image: require('../../../assets/temp/test_p1.jpg') },
        ],
        '2024-12-7': [
            { id: '31', time: '7:00pm', type: 'team', title: 'Bulls vs Knicks', teams: 'Chicago Bulls vs New York Knicks', location: 'Madison Square Garden', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '32', time: '7:00pm', type: 'team', title: 'Cavaliers vs Pistons', teams: 'Cleveland Cavaliers vs Detroit Pistons', location: 'Little Caesars Arena', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '33', time: '7:00pm', type: 'team', title: 'Magic vs Hornets', teams: 'Orlando Magic vs Charlotte Hornets', location: 'Spectrum Center', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '34', time: '7:00pm', type: 'athlete', title: 'Jalen Brunson Interview', location: 'Madison Square Garden', image: require('../../../assets/temp/test_p1.jpg') },
            { id: '35', time: '7:00pm', type: 'team', title: 'Blazers vs Timberwolves', teams: 'Portland Trail Blazers vs Minnesota Timberwolves', location: 'Target Center', image: require('../../../assets/temp/test_p1.jpg') },
        ],
    };

    const getWeekDays = (startDate: Date) => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const formatDateRange = (startDate: Date) => {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        const startMonth = startDate.toLocaleString('en-US', { month: 'long' });
        const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
        if (startMonth === endMonth) {
            return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}`;
        } else {
            return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
        }
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentStartDate);
        newDate.setDate(currentStartDate.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentStartDate(newDate);
    };

    const getDayName = (date: Date) => {
        return date.toLocaleString('en-US', { weekday: 'short' });
    };

    const getDateKey = (date: Date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
                            <Text className="text-white text-base font-oswald-semiBold">{getDayName(day)}</Text>
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
                            const events = sampleEvents[dateKey] || [];
                            return (
                                <View key={index} className={`flex-1 bg-[#6e6e6e] px-0 py-3 ${index < 6 ? 'border-r-[1px] border-white' : ''}`}>
                                    {events.map((event) => (
                                        <TouchableOpacity key={event.id} onPress={() => {
                                            setSelectedEvent(event);
                                            navigation.navigate("EventDetailsScreen")
                                        }} className="flex-col gap-1 items-center mb-3">
                                            {event.type === 'team' ? (
                                                <Users size={18} color="#FFA500" strokeWidth={2.5} />
                                            ) : (
                                                <User size={18} color="#4A90E2" strokeWidth={2.5} />
                                            )}
                                            <Text className="text-white text-sm font-oswald-medium ml-1.5">{event.time}</Text>
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