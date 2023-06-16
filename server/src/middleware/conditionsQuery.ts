import { CommentType, NovelType, ReviewType } from "../types";

export const CommentSearchConditions = (data : Partial<CommentType>) => {
    const { novelId = '', chapterId = '', commentId = '', userId = '', receiverId = '', commentText = '' } = data

    const values : string[] = []
    const conditions : string[] = []
    const params : Array<string | number> = []

    if (userId !== '') {
        values.push("userId")
        conditions.push('comments.userId = ?');
        params.push(String(userId));
    }
    if (novelId !== '') {
        values.push("novelId")
        conditions.push('comments.novelId = ?');
        params.push(String(novelId));
    }
    if (chapterId !== '') {
        values.push("chapterId")
        conditions.push('comments.chapterId = ?');
        params.push(String(chapterId));
    }
    if (commentId !== '') {
        values.push("commentId")
        conditions.push('comments.commentId = ?');
        params.push(String(commentId));
    }
    if (receiverId !== '') {
        values.push("receiverId")
        conditions.push('comments.receiverId = ?');
        params.push(String(receiverId));
    }
    if (commentText !== '') {
        values.push("commentText")
        conditions.push('comments.commentText = ?');
        params.push(String(commentText));
    }

    const conbinedConditions = conditions.length > 0 ? conditions.join(" AND ") : conditions
    const conbinedValues = values.length > 0 ? values.join(',') : values

    return { conditions: conbinedConditions, params, values: conbinedValues }
}
export const ReviewSearchConditions = (data : Partial<ReviewType>) => {
    const { novelId = '', reviewId = '', userId = '', commentText = '' } = data

    const values : string[] = []
    const conditions : string[] = []
    const params : Array<string | number> = []

    if (userId !== '') {
        values.push("userId")
        conditions.push('reviews.userId = ?');
        params.push(String(userId));
    }
    if (novelId !== '') {
        values.push("novelId")
        conditions.push('reviews.novelId = ?');
        params.push(String(novelId));
    }

    if (reviewId !== '') {
        values.push("reviewId")
        conditions.push('reviews.reviewId = ?');
        params.push(String(reviewId));
    }
    if (commentText !== '') {
        values.push("commentText")
        conditions.push('reviews.commentText = ?');
        params.push(String(commentText));
    }

    const conbinedConditions = conditions.length > 0 ? conditions.join(" AND ") : conditions
    const conbinedValues = values.length > 0 ? values.join(',') : values

    return { conditions: conbinedConditions, params, values: conbinedValues }
}

export const NovelSearchConditions = (data : Partial<NovelType>) => {
    const { novelId = '', userId = '', title = '' } = data

    const values : string[] = []
    const conditions : string[] = []
    const params : Array<string | number> = []

    if (userId !== '') {
        values.push("userId")
        conditions.push('novels.userId = ?');
        params.push(String(userId));
    }
    if (novelId !== '') {
        values.push("novelId")
        conditions.push('novels.novelId = ?');
        params.push(String(novelId));
    }

    if (title !== '') {
        values.push("title")
        conditions.push('novels.title LIKE ?');
        params.push(String(`%${title}%`).trim());
    }

    const conbinedConditions = conditions.length > 0 ? conditions.join(" AND ") : conditions
    const conbinedValues = values.length > 0 ? values.join(',') : values

    return { conditions: conbinedConditions, params, values: conbinedValues }
}

export const fieldGetNovel = 'novels.title, novels.novelId, novels.slug, LEFT(novels.description, 150) as description, novels.thumbnailUrl, novels.imageBlurHash, novels.chapterCount, novels.category, novels.createdAt, users.name as author'

export const getAdvancedNovelConditions = (data : any) => {
    const { novelId = '', userId = '', title = '', sort_by = '', page = '1', genres, status, personality, scene, classify, viewFrame } = data

    
    const conditions : string[] = []
    const params : Array<string | number> = []

    if (userId !== '') {
        conditions.push(`novels.userId = ?`);
        params.push(String(userId));
    }
    if (novelId !== '') {
        conditions.push(`novels.novelId = ?`);
        params.push(String(novelId));
    }

    if (title !== '') {
        conditions.push(`novels.title LIKE ?`);
        params.push(String(title));
    }

    // Filter Novel
    if(genres) {
        conditions.push(`category IN (${genres})`);
    }
    if(status) {
        conditions.push(`status IN (${status})`);
    }
    if(personality) {
        conditions.push(`personality IN (${personality})`);
    }
    if(scene) {
        conditions.push(`scene IN (${scene})`);
    }
    if(classify) {
        conditions.push(`classify IN (${classify})`);
    }
    if(viewFrame) {
        conditions.push(`viewFrame IN (${viewFrame})`);
    }

    
    const conbinedConditions = conditions.length > 0 ? 'WHERE ' + conditions.join(" AND ") : ''
    
    // console.log(conbinedConditions)

    // -----

    const join = `
        LEFT JOIN users ON users.userId = novels.userId        
    `
    const pageOf = !isNaN(Number(page)) ? (page-1)*20 : 0

    switch(sort_by) {
        case 'view_most':
            return {
                join: (`
                    LEFT JOIN chapters ON chapters.novelId = novels.novelId
                    LEFT JOIN users ON users.userId = novels.userId
                `),
                params,
                sort: 'ORDER BY SUM(chapters.views) DESC',
                conditions: conbinedConditions,
                page: pageOf
            }
        // case 'view_day':
        //     return {
        //         join: (`
        //                 LEFT JOIN chapters ON chapters.novelId = novels.novelId
        //                 LEFT JOIN users ON users.userId = novels.userId
        //             ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}                    
        //         `),
        //         params,
        //         sort: 'ORDER BY SUM(chapters.views) DESC',
        //         page: pageOf
        //     }
        case 'review_count':
            return {
                join: (`
                    LEFT JOIN reviews ON reviews.novelId = novels.novelId AND reviews.isRating IS TRUE
                    LEFT JOIN users ON users.userId = novels.userId
                `),
                params,
                conditions: conbinedConditions,
                sort: 'ORDER BY COUNT(reviews.novelId) DESC',
                page: pageOf
            }
        case 'review_score':
            return {
                join: (`
                    LEFT JOIN reviews ON reviews.novelId = novels.novelId AND reviews.isRating IS TRUE
                    LEFT JOIN users ON users.userId = novels.userId
                `),
                params,
                conditions: conbinedConditions,
                sort: 'ORDER BY SUM(reviews.mediumScore) DESC',
                page: pageOf
            }
        case 'chapter_count':
            return {
                join: (`
                    LEFT JOIN chapters ON chapters.novelId = novels.novelId
                    LEFT JOIN users ON users.userId = novels.userId
                `),
                params,
                conditions: conbinedConditions,
                sort: 'ORDER BY COUNT(chapters.chapterId) DESC',
                page: pageOf
            } 
        case 'chapter_new':
            return {
                join: (`
                    LEFT JOIN chapters ON chapters.novelId = novels.novelId
                    LEFT JOIN users ON users.userId = novels.userId
                `),
                params,
                conditions: conbinedConditions,
                sort: 'ORDER BY MAX(chapters.createdAt) DESC',
                page: pageOf
            } 
        case 'novel_new':
            return {
                join: (`
                    LEFT JOIN users ON users.userId = novels.userId
                `),
                params,
                conditions: conbinedConditions,
                sort: 'ORDER BY novels.createdAt DESC',
                page: pageOf
            } 
        case 'follow_count':
            return {
                join: (`
                    LEFT JOIN novel_followers ON novel_followers.novelId = novels.novelId
                    LEFT JOIN users ON users.userId = novels.userId
                `),
                params,
                conditions: conbinedConditions,
                sort: 'ORDER BY COUNT(novel_followers.novelId) DESC',
                page: pageOf
            }
        case 'comment_count':
            return {
                join: (`
                    LEFT JOIN comments ON comments.novelId = novels.novelId
                    LEFT JOIN users ON users.userId = novels.userId
                `),
                params,
                conditions: conbinedConditions,
                sort: 'ORDER BY COUNT(comments.novelId) DESC',
                page: pageOf
            }
        default:
            return {
                join,
                params,
                sort: '',
                conditions: conbinedConditions,
                page: pageOf
            }
    }
}