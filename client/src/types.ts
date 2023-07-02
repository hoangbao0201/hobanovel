
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
    rank?: number
    senderRank?: number
    username?: string
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

// export interface ReviewItemWith extends NovelType {
//     countReplyReview?: string | null
//     receiverName?: string
//     receiverId?: string
//     senderName?: string
//     senderId?: string

//     name?: string   
//     avatarUrl?: string
//     avatarPublicId?: string
// }





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
    category: number
    personality: number
    scene: number
    classify: number
    viewFrame: number
    createdAt: Date
    updatedAt: Date
}

// User
export interface UserType {
    userId: string
    name: string
    username: string
    email: string
    rank: number
    password: string
    description?: string
    candy?: number
    flower?: number
    avatarUrl?: string
    avatarPublicId?: string
    createdAt: Date
    updatedAt: Date
}

// Review Type
export interface ReviewType {
    reviewId: string
    
    isRating: boolean
    isSpoiler: boolean
    mediumScore: number
    pointStoryline: number
    pointPersonality: number
    pointScene: number
    pointTranslation: number

    commentText: string
    createdAt: Date
    updatedAt: Date

    userId: string
    novelId: string
    parentId?: string | null
    
    name?: string
    rank?: number
    avatarUrl?: string
    username?: string

    slug?: string
    title?: string

    countReplyReview?: number
}
export interface ReplyReviewType {
    reviewId: string

    commentText: string
    parentId?: string | null

    senderId?: string
    senderAvatarUrl?: string
    senderName?: string
    senderUsername?: string
    senderRank?: number

    receiverId?: string
    receiverName?: string
    receiverUsername?: string

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






// ----------------------------------------------- //
export type NovelResType = Pick<NovelType, 'title' | 'novelId' | 'slug' | 'chapterCount' | 'thumbnailUrl' | 'imageBlurHash' | 'description' | 'category' | 'createdAt' | 'author'> & {
    countPage?: number
    mediumScore?: number
}

export type NovelBySlugType = Pick<NovelType, 'novelId' | 'slug' | 'title' | 'chapterCount' | 'thumbnailUrl' | 'imageBlurHash' | 'description' | 'author' | 'category' | 'personality' | 'scene' | 'classify' | 'viewFrame' | 'createdAt'> & {
    newChapterCount: number;
    mediumScore: number;
    views: number
    chapterRead: number
    followerCount: number
}

export type ChapterDetailResType = Pick<ChapterType, 'chapterId' | 'novelName' | 'novelSlug' | 'title' | 'content' | 'chapterNumber' | 'updatedAt' | 'novelId'> & {
    creator: string
    creatorId: string
    chapterCount: number
}

// export type ReviewResType =  ReviewType & Pick<UserType, 'name' | 'avatarUrl'> & {
// }
// export type ReplyReviewResType =  ReviewResType & {
//     senderId: string
//     senderName: string
//     receiverId: string
//     receiverName: string
//     countReplyReview: number
// }