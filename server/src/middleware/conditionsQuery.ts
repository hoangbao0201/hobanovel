import { CommentType } from "../types";

export const CommentSearchConditions = (data : Partial<CommentType>) => {
    const { novelId, chapterId } = data

    const conditions : string[] = []
    const params : Array<string | number> = []

    if (novelId !== '') {
        conditions.push('comments.novelId = ?');
        params.push(String(novelId));
    }

    if (chapterId !== '') {
        conditions.push('comments.chapterId = ?');
        params.push(String(chapterId));
    }

    const conbinedConditions = conditions.length > 0 ? conditions.join(" AND ") : conditions

    return { conditions: conbinedConditions, params }
}