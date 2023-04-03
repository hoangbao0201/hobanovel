

export interface ChapterType {

    novelName: string

    chapterId: string
    novelSlug: string
    sourceName: string | undefined
    title: string
    chapterNumber: number
    content: string
    view: number
    createdAt: Date
    updatedAt: Date
    
    chapterCount: number
}

export interface ChaptersType extends ChapterType {
    numberChaptersInWeek: number
    chapterCount: number
    views: number
}

// Comic
export interface NovelType {
    novelId: string
    slug: string
    title: string

    totalChapterCount: number
    newChapterCount: number
    newChapterTitle: string

    description: string
    author: string
    category: string
    personality: string
    thumbnailUrl: string
    thumbnailPublicId: string
    scene: string
    classify: string
    viewFrame: string
    postedBy: string
    chapters: ChaptersType
    createdAt: Date
    updatedAt: Date
    __v: number
}

// User
export interface UserType {
    userId: string
    name: string
    accout: string
    username: string
    description: string
    email: string
    password: string
    novels: NovelType[]
    avatarUrl: string
    avatarPublicId: string
    followers: UserType[]
    createdAt: Date
    updatedAt: Date
}

export interface SelectType {
    value: string
    label: string
}
