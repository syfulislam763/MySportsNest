import { useState, useEffect, useCallback } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '@/navigations/types';
import api from '@/constants/Axios';
import { toast } from '@/context/useToastStore';
import {MatchData} from '../components/match/match_types';

type EntityIdType = RouteProp<MainStackParamList, 'LiveScoreDetail'>;

export const useMatchDetail = () => {
    const route = useRoute<EntityIdType>();
    const [match, setMatch] = useState<MatchData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMatch = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await api.get(`/api/scores/live/detail/${route.params.matchId}/`);
            setMatch(res.data?.data ?? null);
        } catch (_) {
            toast.error('Failed to load match details.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [route.params.matchId]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMatch(true);
    };

    return { match, loading, refreshing, onRefresh };
};