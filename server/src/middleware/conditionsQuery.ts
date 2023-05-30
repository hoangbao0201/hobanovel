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
    const { novelId = '', userId = '', title = '', sort_by = '' } = data

    const values : string[] = []
    const conditions : string[] = []
    const params : Array<string | number> = []
    const orderBy : { query: string, by: string } = {
        query: '',
        by: ''
    }

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

    if (sort_by.includes('view_')) {
        
        orderBy.query = `
            LEFT JOIN chapters.novelId = novels.novelId 
                AND chapters.createdAt >= DATE_SUB(NOW(), INTERVAL 1 ${sort_by.split('view_')[1].toUpperCase()})
        `
        orderBy.by = `
            views
        `
    }


    const conbinedConditions = conditions.length > 0 ? conditions.join(" AND ") : conditions
    const conbinedValues = values.length > 0 ? values.join(',') : values

    return { conditions: conbinedConditions, params, values: conbinedValues, orderBy }
}