import Head from "next/head";
import { ReactNode, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "usehooks-ts";
import { addUserHandle, logoutUserHandle } from "@/redux/userSlice";
import { getAccessToken, removeAccessToken } from "@/services/cookies.servies";

import ScrollOnTop from "./ScrollOnTop";
import { connectUserHandle } from "@/services/auth.services";
import dynamic from "next/dynamic";

import Header from "../partials/Header";
import Footer from "../partials/Footer";
import BannersIntro from "../partials/BannersIntro";


// const Header = dynamic(() => import('../partials/Header', {
//     ssr: false,
// } as ImportCallOptions));
// const Footer = dynamic(() => import('../partials/Footer', {
//     ssr: false,
// } as ImportCallOptions));
// const BannersIntro = dynamic(() => import('../partials/BannersIntro', {
//     ssr: false,
// } as ImportCallOptions));

interface MainLayoutProps {
    bg?: string;
    autoHidden?: boolean;
    children: ReactNode;
    isHeader?: boolean;
    isFooter?: boolean;
    isBannerPage?: boolean;
}

const MainLayout = ({
    bg = "#ffff",
    children,
    isHeader = true,
    isFooter = true,
    isBannerPage = true,
    autoHidden = true,
}: MainLayoutProps) => {
    const matchesMobile = useMediaQuery("(max-width: 640px)");

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(
        (state: any) => state.user
    );

    const loadUser = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                console.log("Không token");
                dispatch(logoutUserHandle());
                // removeAccessToken();
                return;
            }
            if(!isAuthenticated) {
                const connectUser = await connectUserHandle(token);
    
                if (connectUser?.success) {
                    dispatch(addUserHandle(connectUser.data.user));
                    return;
                }
                else {
                    removeAccessToken();
                }
            }
        } catch (error) {
            console.log(error);
            removeAccessToken();
            dispatch(logoutUserHandle());
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <>
            {/* <Head>
                <style>
                    {`
                        body {
                            background-color: ${bg};
                        }
                    `}
                </style>
            </Head> */}

            {/* <Head>
                <title>123</title>
            </Head> */}

            <ScrollOnTop />

            {isHeader && <Header autoHidden={autoHidden} />}

            { !matchesMobile && <BannersIntro isShow={isBannerPage}/> }

            <main 
                className={`${
                    isBannerPage &&
                    `w-full min-h-[500px] top-0 overflow-hidden ${
                        !matchesMobile && "-translate-y-28"
                    }`
                }`}
            >
                {children}
            </main>

            {isFooter && <Footer />}
        </>
    );
};

export default MainLayout;
