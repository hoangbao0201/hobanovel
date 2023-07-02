import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { Context, MakeStore, createWrapper } from "next-redux-wrapper";

import userReducer, { UserSlideState } from "./userSlice";
import commentReducer, { CommentSliceType } from "./commentSlice";
import bannersReducer, { BannersSliceType } from "./bannersSlice";


export interface RootState {
    user: UserSlideState;
    comment: CommentSliceType;
    banners: BannersSliceType;
}

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: ['comment', 'banners']
};

const rootReducer = combineReducers({ user: userReducer, comment: commentReducer, banners: bannersReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);


//  ------------

// const makeStore: MakeStore<Store<RootState, AnyAction>> = (context: Context) => {
//     return { store, persistor }
// }

// export const wrapper = createWrapper<Store<RootState, AnyAction>>(makeStore)