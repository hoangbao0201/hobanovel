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

export const getAdvancedNovelConditions = (data : any) => {
    const { novelId = '', userId = '', title = '', sort_by = '', page = '1' } = data

    const field = 'novels.title, novels.novelId, novels.slug, novels.thumbnailUrl, novels.chapterCount, novels.category, novels.createdAt'
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

    const conbinedConditions = conditions.length > 0 ? conditions.join(" AND ") : conditions

    // -----

    const query = `
        SELECT ${field} FROM novels
        ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
        LIMIT 10 OFFSET ${(page-1)*10}
    `

    switch(sort_by) {
        case 'view_most':
            return {
                query: (`
                    SELECT ${field} FROM novels
                        LEFT JOIN chapters ON chapters.novelId = novels.novelId
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    GROUP BY novels.novelId
                    ORDER BY SUM(chapters.views) DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            }
        case 'view_day':
            return {
                query: (`
                    SELECT ${field} FROM novels
                        LEFT JOIN chapters ON chapters.novelId = novels.novelId
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    GROUP BY novels.novelId
                    ORDER BY SUM(chapters.views) DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            }
        case 'review_count':
            return {
                query: (`
                    SELECT ${field} FROM novels
                        LEFT JOIN reviews ON reviews.novelId = novels.novelId AND reviews.isRating IS TRUE
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    GROUP BY novels.novelId
                    ORDER BY COUNT(reviews.novelId) DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            }
        case 'review_score':
            return {
                query: (`
                    SELECT ${field} FROM novels
                        LEFT JOIN reviews ON reviews.novelId = novels.novelId AND reviews.isRating IS TRUE
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    GROUP BY novels.novelId
                    ORDER BY SUM(reviews.mediumScore) DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            }
        case 'chapter_count':
            return {
                query: (`
                    SELECT ${field} FROM novels
                        LEFT JOIN chapters ON chapters.novelId = novels.novelId
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    GROUP BY novels.novelId
                    ORDER BY COUNT(chapters.chapterId) DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            } 
        case 'chapter_new':
            return {
                query: (`
                    SELECT ${field} FROM novels
                        LEFT JOIN chapters ON chapters.novelId = novels.novelId
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    GROUP BY novels.novelId
                    ORDER BY MAX(chapters.createdAt) DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            } 
        case 'novel_new':
            return {
                query: (`
                    SELECT ${field} FROM novels
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    ORDER BY novels.createdAt DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            } 
        case 'follow_count':
            return {
                query: (`
                    SELECT ${field} FROM novels
                        LEFT JOIN novel_followers ON novel_followers.novelId = novels.novelId
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    GROUP BY novels.novelId
                    ORDER BY COUNT(novel_followers.novelId) DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            }
        case 'comment_count':
            return {
                query: (`
                    SELECT ${field} FROM novels
                        LEFT JOIN novel_followers ON novel_followers.novelId = novels.novelId
                    ${conbinedConditions.length > 0 ? 'WHERE ' + conbinedConditions : ''}
                    GROUP BY novels.novelId
                    ORDER BY COUNT(novel_followers.novelId) DESC
                    LIMIT 10 OFFSET ${(page-1)*10}
                `),
                params
            }
        default:
            return {
                query,
                params
            }
    }
}