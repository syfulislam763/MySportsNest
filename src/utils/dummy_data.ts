import { Post } from "./main_app_types";


export const posts: Post[] = [
        {
            id: '1',
            user: 'Manchester',
            handle: '@team',
            timestamp: '24 Nov 2025, 10:45 AM',
            source: 'via YouTube',
            title: 'Exclusive interview with Manchester United about future plans',
            description: 'Latest updates and analysis from trusted sports sources covering the biggest...',
            image: require("../../assets/temp/test4.jpg"),
            likes: 764,
            avatar: require("../../assets/temp/test_p1.jpg")
        },
        {
            id: '2',
            user: 'LeBron James',
            handle: '@team',
            timestamp: '24 Nov 2025, 10:45 AM',
            source: 'via The Athletic',
            title: 'Exclusive interview with Manchester United about future plans',
            description: 'Latest updates and analysis from trusted sports sources covering the biggest...',
            image: require("../../assets/temp/test3.jpg"),
            likes: 895,
            avatar: require("../../assets/temp/test_p2.jpg")
        },
        {
            id: '3',
            user: 'Manchester',
            handle: '@Athlete',
            timestamp: '24 Nov 2025, 10:45 AM',
            source: 'via The Athletic',
            title: "Analysis: What's next for Tom Brady?",
            description: 'Latest updates and analysis from trusted sports sources covering the biggest...',
            image: require("../../assets/temp/test.jpg"),
            likes: 895,
            avatar: require("../../assets/temp/test_p1.jpg")
        }
    ];