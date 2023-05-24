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
import ScrollOnTop from "./ScrollOnTop";
import { useMediaQuery } from "usehooks-ts";
// import { setScrollPosition } from "@/redux/scrollSlice";

interface MainLayoutProps {
    bg?: string
    children: ReactNode
    isHeader?: boolean
    isFooter?: boolean
    isBannerPage?: boolean
}

// const Header = dynamic(() => import('../partials/Header'));
// const Footer = dynamic(() => import('../partials/Footer'));
// const BannerPage = dynamic(() => import('../partials/BannerPage'));


const MainLayout= ({ bg = "#ffff", children, isHeader = true, isFooter = true, isBannerPage = true } : MainLayoutProps) => {

    const matchesMobile = useMediaQuery('(max-width: 640px)') 

    const dispatch = useDispatch();
    // const scrollPosition = useSelector((state : any) => state.scroll.position);

    // useEffect(() => {
    //     window.scrollTo(0, scrollPosition);

    //     return () => {
    //         dispatch(setScrollPosition(window.pageYOffset));
    //     };
    // }, []);

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
                            background-color: ${bg};
                        }
                    `}
                </style>
            </Head>

            <ScrollOnTop />
            
            { isHeader && <Header /> }

            { isBannerPage && <BannerPage /> }


            <div className={`${isBannerPage && `w-full min-h-[500px] top-0 ${ !matchesMobile && "-translate-y-28" }`}`}>
                {children}
            </div>

            { isFooter && <Footer /> }
        
        </>
    )
}

export default MainLayout;