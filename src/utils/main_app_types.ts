

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
    is_breaking: boolean,
    is_trending: boolean,
    views: number,
    is_bookmarked: boolean,
    is_liked: boolean
}