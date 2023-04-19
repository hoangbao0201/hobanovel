

export interface CommentType {
    commentId: string
    
    parentId: string
    commentText: string
    createdAt: Date
    updatedAt: Date

    userId: string
    chapterId: string
}

export interface ReviewItemWith extends ReviewType {
    countReplyReview: number
}

export interface ReviewType extends UserType, NovelType {
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

    userId: string
    novelId: string
}

export interface ChapterType {
    chapterId: string
    novelId: string

    novelName: string
    novelSlug: string
    title: string
    content: string
    chapterNumber: number
    createdAt: Date
    updatedAt: Date
}

// Novel
export interface NovelType {
    novelId: string
    userId: string

    slug: string
    title: string
    chapterNumber: number
    thumbnailUrl: string
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
