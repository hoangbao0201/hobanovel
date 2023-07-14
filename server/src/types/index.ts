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
    senderId: string
    senderName: string
    receiverId: string

    novelId: string
    chapterId: string
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
    avatarUrl: string | null
    avatarPublicId: string
    createdAt: Date
    updatedAt: Date
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
    category: number
    personality: number
    scene: number
    classify: number
    viewFrame: number
    createdAt: Date
    updatedAt: Date
}

export interface SelectType {
    value: string
    label: string
}


// ---------------------
export interface ChapterViewersType {
    
    chapterViewerId: string
    
    views: number
    chapterId: string
    userId: string


    createdAt: Date
    updatedAt: Date
}


// ------------------------
export interface TypeResponse {
    success: boolean
    message?: string
    error: Error
}