import { createSlice } from "@reduxjs/toolkit";
import { CommentItemType, CommentType } from "@/types";

interface CommentsProps extends CommentItemType {
    children?: CommentItemType[]
}

export interface CommentSliceType {
    loadComment: boolean;
    comments: CommentsProps[];
}

const initialState: CommentSliceType = {
    loadComment: true,
    comments: [],
};

export const counterSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        setCommentsRDHandle: (state, action) => {
            state.loadComment = false;
            state.comments = action.payload;
        },
        addCommentsRDHandle: (state, action) => {
            state.loadComment = false;
            state.comments.unshift(action.payload);
        },
        addReplyRDHandle: (state, action) => {
            // const { commentId } = action.payload;
            // const comment = state.comments.find((c) => c.parent.commentId === commentId);
            // if (comment) {
            //     comment.children.unshift(action.payload)
            //     // console.log("bb: ", state.comments.children = )
            // }
        },
        destroyCommentsNovelRDHandle: (state, action) => {
            const { commentId } = action.payload;
            const filterComments = state.comments.filter((comment) => comment?.commentId !== commentId);

            state.loadComment = false;
            state.comments = filterComments;
        },
        loadCommentsNovelRDHandle: (state, action) => {
            state.loadComment = action.payload;
        },
    },
});

export const { setCommentsRDHandle, addCommentsRDHandle, addReplyRDHandle, destroyCommentsNovelRDHandle, loadCommentsNovelRDHandle } =
    counterSlice.actions;

export default counterSlice.reducer;
