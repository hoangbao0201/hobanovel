import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "@/types";

interface CounterState {
    currentUser: UserType | null
    userLoading: boolean
    isAuthenticated: boolean
}

const initialState: CounterState = {
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
        }
    },
});

export const { addUserHandle, authFailedHandle, logoutUserHandle } = counterSlice.actions;

export default counterSlice.reducer;
