import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigations/types';
import { Post } from '@/utils/main_app_types';
import { setLoadingFalse, setLoadingTrue } from '@/context/useLoadingStore';
import { feedback_post, get_home_feed, like_post } from '@/screens/main_app_screens/HomeFeedAPI';
import { useAuthStore } from '@/context/useAuthStore';
import { OnboardingAPI, add_nest_entity, remove_nest_entity } from '@/screens/onboarding_screens/onboardingApi';
import { toast } from '@/context/useToastStore';
import api from '@/constants/Axios';

type NavigationProps = StackNavigationProp<MainStackParamList>;

export type SearchEntity = {
    id: number;
    type: string;
    name: string;
    slug: string;
    sport: string;
    logo_url: string;
    cover_image_url: string;
    description: string;
    country: string;
    follower_count: number;
    has_api_data: boolean;
    in_nest: boolean;
    created_at: string;
};

const buildQuery = (filters: string[], sort: string): string | null => {
    const hasFilter = filters.length > 0;
    const hasSort = !!sort;
    if (hasFilter && hasSort) return `type=${filters[0].toLowerCase()}&sort=${sort.toLowerCase()}`;
    if (hasFilter) return `type=${filters[0].toLowerCase()}`;
    if (hasSort) return `sort=${sort.toLowerCase()}`;
    return null;
};

export const useNestFeed = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchEntity[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [openTooltipId, setOpenTooltipId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<string>('feed');

    const profile = useAuthStore((s) => s.profile);
    const setProfile = useAuthStore((s) => s.setProfile);
    const navigation = useNavigation<NavigationProps>();

    // ─── API Helpers ────────────────────────────────────────────────────────────

    const handle_get_feed_posts = useCallback((query: string | null) => {
        setLoadingTrue();
        get_home_feed(query, (res) => {
            setLoadingFalse();
            if (res) {
                setPosts(res?.data?.results ?? []);
            }
        });
    }, []);

    const handle_Like = useCallback((id: number) => {
        like_post(id, (res) => {
            if (res) {
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === id
                            ? { ...p, is_liked: res?.data?.liked, views: p.views + (res?.data?.liked ? 1 : -1) }
                            : p
                    )
                );
            }
        });
    }, []);

    const handle_feedback = useCallback((id: number) => {
        feedback_post(id, (res) => {
            if (res) {
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === id ? { ...p, is_bookmarked: !p.is_bookmarked } : p
                    )
                );
            }
        });
    }, []);

    const handleHidePost = useCallback((id: number) => {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setOpenTooltipId(null);
    }, []);


    const handleSort = useCallback((sortString: string) => {
        setSelectedSort(sortString);
        setSortOpen(false);
        setFilterOpen(false)
        setSelectedFilters((prevFilters) => {
            const q = buildQuery(prevFilters, sortString);
            handle_get_feed_posts(q);
            return prevFilters;
        });
    }, [handle_get_feed_posts]);

    const handleApplyFilter = useCallback(() => {
        setSelectedFilters((prevFilters) => {
            setSelectedSort((prevSort) => {
                const q = buildQuery(prevFilters, prevSort);
                handle_get_feed_posts(q);
                return prevSort;
            });
            return prevFilters;
        });
        setFilterOpen(false);
    }, [handle_get_feed_posts]);

    const toggleFilter = useCallback((filter: string) => {
        setSelectedFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [filter]
        );
    }, []);

    const clearSort = useCallback(() => {
        
        setSelectedSort('');
        setSelectedFilters((prevFilters) => {
            const q = buildQuery(prevFilters, '');
            handle_get_feed_posts(q);
            return prevFilters;
        });
    }, [handle_get_feed_posts]);

    const clearFilter = useCallback(() => {
        setSelectedFilters([]);
        setSelectedSort((prevSort) => {
            const q = buildQuery([], prevSort);
            handle_get_feed_posts(q);
            return prevSort;
        });
    }, [handle_get_feed_posts]);


    const handle_search = useCallback((value: string) => {
        OnboardingAPI.get_trending_data(value)
            .then((res) => {
                const all: SearchEntity[] = [
                    ...(res?.data?.teams ?? []),
                    ...(res?.data?.athletes ?? []),
                    ...(res?.data?.leagues ?? []),
                ];
                setSearchResults(all);
                const nestIds = all.filter((i) => i.in_nest).map((i) => i.id);
                setSelectedItems((prev) => Array.from(new Set([...prev, ...nestIds])));
            })
            .catch(() => {});
    }, []);

    const toggleSearchItem = useCallback((id: number) => {
        setSelectedItems((prev) => {
            if (prev.includes(id)) {
                setLoadingTrue();
                remove_nest_entity({ entity_id: id }, () => setLoadingFalse());
                return prev.filter((i) => i !== id);
            } else {
                setLoadingTrue();
                add_nest_entity({ entity_id: id }, () => setLoadingFalse());
                return [...prev, id];
            }
        });
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
    }, []);

    // ─── Dropdown Toggles ────────────────────────────────────────────────────────

    const toggleSort = useCallback(() => {
        setSortOpen((prev) => !prev);
        // setFilterOpen(false);
    }, []);

    const toggleFilterPanel = useCallback(() => {
        setFilterOpen((prev) => !prev);
        // setSortOpen(false);
    }, []);

    const closeAllDropdowns = useCallback(() => {
        setMenuOpen(false);
        setSortOpen(false);
        setFilterOpen(false);
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) return;
        const timer = setTimeout(() => handle_search(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery, handle_search]);

    useEffect(() => {
        handle_get_feed_posts(null);
    }, [profile?.nest_count]);

    useFocusEffect(
        useCallback(() => {
            Promise.all([
                api.get('/api/auth/profile-info/'),
                api.get('/api/auth/profile/'),
            ])
                .then(([profileInfoRes, profileDataRes]) => {
                    setProfile({
                        ...profileInfoRes.data,
                        ...profileDataRes.data.data,
                    });
                })
                .catch(() => {
                    toast.error('Failed to load profile');
                });
        }, [])
    );

    return {

        searchQuery, setSearchQuery,
        searchResults,
        selectedItems,
        menuOpen, setMenuOpen,
        sortOpen, filterOpen,
        selectedSort,
        selectedFilters,
        posts,
        openTooltipId, setOpenTooltipId,
        activeTab, setActiveTab,
        profile,
        navigation,
  
        handle_Like,
        handle_feedback,
        handleHidePost,
        handleSort,
        handleApplyFilter,
        toggleFilter,
        toggleSearchItem,
        clearSearch,
        clearSort,
        clearFilter,
        toggleSort,
        toggleFilterPanel,
        closeAllDropdowns,
    };
};