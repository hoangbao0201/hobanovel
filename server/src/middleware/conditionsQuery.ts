import { CommentType, ReviewType } from "../types";

export const CommentSearchConditions = (data : Partial<CommentType>) => {
    const { novelId = '', chapterId = '', commentId = '', userId = '', commentText = '' } = data

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