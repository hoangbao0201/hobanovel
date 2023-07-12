import { createSlice } from "@reduxjs/toolkit";
import { CommentItemType, CommentType } from "@/types";

export interface CommentSliceType {
    isLoading: boolean
    comments: CommentItemType[]
}

const initialState: CommentSliceType = {
    isLoading: true,
    comments: [],
};

export const counterSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        setCommentsRDHandle: (state, action) => {
            state.isLoading = false
            state.comments = action.payload
        },
        addCommentsRDHandle: (state, action) => {
            state.isLoading = false
            state.comments.unshift(action.payload)
        },
        destroyCommentsNovelRDHandle: (state) => {
            state.isLoading = false
            state.comments = []
        },
    },
});

export const { setCommentsRDHandle, addCommentsRDHandle, destroyCommentsNovelRDHandle } = counterSlice.actions;

export default counterSlice.reducer;
