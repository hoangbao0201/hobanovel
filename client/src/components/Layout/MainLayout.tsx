import { ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";

import { useDispatch, useSelector } from "react-redux";
import { addUserHandle, logoutUserHandle } from "@/redux/userSlice";
import { getAccessToken, removeAccessToken } from "@/services/cookies.servies";

import Header from "../partials/Header";
import Footer from "../partials/Footer";
import BannerPage from "../partials/BannerPage";
import { connectUserHandle } from "@/services/auth.services";
import Head from "next/head";

interface MainLayoutProps {
    children: ReactNode
    isHeader?: boolean
    isFooter?: boolean
    isBannerPage?: boolean
}

// const Header = dynamic(() => import('../partials/Header'));
// const Footer = dynamic(() => import('../partials/Footer'));
// const BannerPage = dynamic(() => import('../partials/BannerPage'));


const MainLayout= ({ children, isHeader = true, isFooter = true, isBannerPage = true } : MainLayoutProps) => {
    const dispatch = useDispatch();
    const { userLoading } = useSelector(
        (state: any) => state.user
    );

    const loadUser = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                console.log("Không token");
                dispatch(logoutUserHandle());
                removeAccessToken();
                return;
            }

            const connectUser = await connectUserHandle(token);

            if (connectUser?.data.success) {
                dispatch(addUserHandle(connectUser.data.user));
                return;
            }
            
            dispatch(logoutUserHandle());
            removeAccessToken();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <>
            <Head>
                <style>
                    {`
                        body {
                            background-color: #ffff;
                        }
                    `}
                </style>
            </Head>

            { isHeader && <Header /> }

            { isBannerPage && <BannerPage /> }

            <div className={`${isBannerPage && "top-0 -translate-y-28"}`}>
                {children}
            </div>

            { isFooter && <Footer /> }
        
        </>
    )
}

export default MainLayout;