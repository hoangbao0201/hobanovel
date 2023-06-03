export interface HistoryReadingType {
    historyReadingId: string
    chapterRead: string
    novelId: string
    userId: string
    updatedAt: Date
}

export interface BannersType extends NovelType {
    bannersId: string
    bannersUrl: string
    imageBlurHash: string
    bannersPublicId: string
    isMobile: boolean
    createdAt: Date
    updatedAt: Date
}

export interface CommentType {
    commentId: string
    commentText: string
    createdAt: Date
    updatedAt: Date

    parentId: string
    userId: string
    chapterId: string
    novelId: string
    receiverId: string
}

export interface ReviewType {
    reviewId: string

    mediumScore: number
    pointStoryline: number
    pointPersonality: number
    pointScene: number
    pointTranslation: number
    commentText: string
    createdAt: Date
    updatedAt: Date
    isSpoiler: boolean
    
    parentId: string
    userId: string
    novelId: string
}

export interface ChapterType {
    chapterId: string
    novelId: string

    userId: string
    views: string
    novelName: string
    novelSlug: string
    title: string
    content: string
    chapterNumber: number
    createdAt: Date
    updatedAt: Date
}

export interface NovelFollowerType {
    novelFollowerId: string
    novelId: string
    userId: string
}

// Novel
export interface NovelType {
    novelId: string
    userId: string

    slug: string
    title: string
    chapterCount: number
    thumbnailUrl: string | null
    imageBlurHash: string | null
    thumbnailPublicId: string | null
    description: string
    author: string
    category: string
    personality: string
    scene: string
    classify: string
    viewFrame: string
    createdAt: Date
    updatedAt: Date
}

// User
export interface UserType {
    userId: string
    name: string
    username: string
    email: string
    password: string
    description: string
    candy: number
    flower: number
    avatarUrl: string
    avatarPublicId: string
    createdAt: Date
    updatedAt: Date
}

export interface SelectType {
    value: string
    label: string
}
