
export type Entity = {
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

export type Post = {
    id: number
    source_name: string
    source_logo: string
    entity_names: string[]
    title: string
    summary: string
    thumbnail_url: string
    url: string
    published_at: string
    is_breaking: boolean
    is_trending: boolean
    views: number
    is_bookmarked: boolean
    is_liked: boolean
}