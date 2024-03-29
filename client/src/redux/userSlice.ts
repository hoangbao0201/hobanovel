import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "@/types";

export interface UserSlideState {
    currentUser: UserType | null
    userLoading: boolean
    isAuthenticated: boolean
}

const initialState: UserSlideState = {
    currentUser: null,
    userLoading: true,
    isAuthenticated: false,
};

export const counterSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUserHandle: (state, action) => {
            state.currentUser = action.payload
            state.userLoading = false
            state.isAuthenticated = true
        },
        authFailedHandle: (state) => {
            state.currentUser = null
            state.userLoading = false
            state.isAuthenticated = false
        },
        logoutUserHandle: (state) => {
            state.currentUser = null
            state.userLoading = false
            state.isAuthenticated = false
        },
        loadingUserHandle: (state, action) => {
            state.userLoading = action.payload;
        }
        // followNovelRDHanlde: (state) => {
        //     state.isFollow = true
        // },
        // unfollowNovelRDHanlde: (state) => {
        //     state.isFollow = false
        // },
    },
});

export const { addUserHandle, authFailedHandle, logoutUserHandle, loadingUserHandle } = counterSlice.actions;

export default counterSlice.reducer;
