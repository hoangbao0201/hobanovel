import { createSlice } from "@reduxjs/toolkit";
import { BannersType } from "@/types";

export interface CommentSliceType {
    isLoading: boolean
    banners: BannersType[]
}

const initialState: CommentSliceType = {
    isLoading: true,
    banners: [],
};

export const counterSlice = createSlice({
    name: "banners",
    initialState,
    reducers: {
        setBannersRDHandle: (state, action) => {
            state.isLoading = false
            state.banners = action.payload
        },
        addBannersRDHandle: (state, action) => {
            state.isLoading = false
            state.banners.unshift(action.payload)
        },
    },
});

export const { setBannersRDHandle, addBannersRDHandle } = counterSlice.actions;

export default counterSlice.reducer;
