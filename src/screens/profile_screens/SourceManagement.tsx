import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import WrapperComponent from '@/components/WrapperComponent';
import BackButton from '@/components/BackButton';
import { setLoadingFalse, setLoadingTrue } from '@/context/useLoadingStore';
import api from '@/constants/Axios';
import { toast } from '@/context/useToastStore';

interface SourceItem {
    id: number;
    source_id: number;
    name: string;
    domain: string;
    favicon_url: string;
    is_active: boolean;
    is_healthy: boolean;
}

const SourceManagement = () => {
    const [sources, setSources] = useState<SourceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchSources = async () => {
            try {
                const res = await api.get('/api/source/my/');
                setSources(res.data.sources ?? []);
            } catch (_) {
                toast.error('Failed to load sources.');
            } finally {
                setLoading(false);
            }
        };
        fetchSources();
    }, []);

    const handleDelete = async (sourceId: number) => {
        setDeletingId(sourceId);
        setLoadingTrue();
        try {
            await api.delete(`/api/source/${sourceId}/remove/`);
            setSources(prev => prev.filter(s => s.source_id !== sourceId));
            toast.success('Source removed successfully.');
        } catch (_) {
            toast.error('Failed to remove source. Please try again.');
        } finally {
            setDeletingId(null);
            setLoadingFalse();
        }
    };

    return (
        <WrapperComponent
            title=""
            bg_color="bg-[#5e5e5e]"
            container_bg="bg-[#5e5e5e]"
            headerComponent={() => (
                <View className="flex-row items-center mb-4 mx-5">
                    <BackButton />
                    <Text className="text-white text-xl font-oswald-semiBold ml-4">
                        Source Management
                    </Text>
                </View>
            )}
        >
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#7ac7ea" />
                </View>
            ) : sources.length === 0 ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-white text-xl font-oswald-semiBold text-center">
                        No sources added yet
                    </Text>
                    <Text className="text-gray-400 text-sm font-oswald-regular mt-2 text-center">
                        Add news sources to personalise your feed.
                    </Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="flex-1">
                        {sources.map((item) => (
                            <View
                                key={item.id}
                                className="flex-row items-center bg-[#4a4a4a] rounded-xl p-4 mb-3"
                            >
                                {/* Favicon / fallback */}
                                <View className="w-12 h-12 rounded-full bg-white items-center justify-center overflow-hidden">
                                    {item.favicon_url ? (
                                        <Image
                                            source={{ uri: item.favicon_url }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Text className="text-[#5e5e5e] text-lg font-oswald-semiBold">
                                            {item.name.charAt(0).toUpperCase()}
                                        </Text>
                                    )}
                                </View>

                                {/* Info */}
                                <View className="flex-1 ml-4">
                                    <Text className="text-white text-base font-oswald-semiBold">
                                        {item.name}
                                    </Text>
                                    <Text className="text-gray-400 text-sm font-oswald-regular mt-0.5">
                                        {item.domain}
                                    </Text>
                                </View>

                                {/* Delete */}
                                <TouchableOpacity
                                    onPress={() => handleDelete(item.source_id)}
                                    disabled={deletingId === item.source_id}
                                    className="p-2"
                                    style={{ opacity: deletingId === item.source_id ? 0.4 : 1 }}
                                >
                                    <Trash2 size={24} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </WrapperComponent>
    );
};

export default SourceManagement;