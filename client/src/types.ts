
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
    isMobile: boolean
    imageBlurHash: string
    bannersPublicId: string
    createdAt: Date
    updatedAt: Date
}

export interface CommentItemWith {
    countReplyComment?: string | null
    receiverName?: string
    receiverId?: string
    senderName?: string
    senderId?: string

    name?: string   
    avatarUrl?: string
    avatarPublicId?: string
}

export interface CommentType extends CommentItemWith {
    commentId: string
    commentText: string
    createdAt: Date
    updatedAt: Date

    parentId?: string | null | undefined
    userId: string
    chapterId?: string | null | undefined
    novelId?: string | null | undefined
}

export interface ReviewItemWith extends NovelType {
    countReplyReview?: string | null
    receiverName?: string
    receiverId?: string
    senderName?: string
    senderId?: string

    name?: string   
    avatarUrl?: string
    avatarPublicId?: string
}

export interface ReviewType extends ReviewItemWith {
    reviewId: string

    isRating: boolean
    mediumScore: number
    pointStoryline: number
    pointPersonality: number
    pointScene: number
    pointTranslation: number
    commentText: string
    createdAt: Date
    updatedAt: Date
    isSpoiler: boolean

    userId: string
    novelId: string
    parentId?: string | null
}

export interface ChapterType {
    chapterId: string
    novelId: string

    views: string
    novelName: string
    novelSlug: string
    title: string
    content: string
    chapterNumber: number
    createdAt: Date
    updatedAt: Date
}

// Follow Novel
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
    thumbnailUrl: string
    imageBlurHash: string
    thumbnailPublicId: string
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
    description?: string
    candy?: number
    flower?: number
    avatarUrl?: string
    avatarPublicId?: string
    createdAt: Date
    updatedAt: Date
}

export interface SelectType {
    value: string
    label: string
}



// ----------------------------------------------- //

export type NovelBySlugType = Pick<NovelType, 'novelId' | 'slug' | 'title' | 'chapterCount' | 'thumbnailUrl' | 'imageBlurHash' | 'description' | 'author' | 'category' | 'personality' | 'scene' | 'classify' | 'viewFrame' | 'createdAt'> & {
    newChapterCount: number;
    mediumScore: number;
    views: number
    chapterRead: number
}

export type ChapterDetailResType = Pick<ChapterType, 'chapterId' | 'novelName' | 'novelSlug' | 'title' | 'content' | 'chapterNumber' | 'updatedAt' | 'novelId'> & {
    creator: string
    creatorId: string
    chapterCount: Number
}