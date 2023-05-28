import { ReactNode, useEffect } from "react";

import { useDispatch } from "react-redux";
import { addUserHandle, logoutUserHandle } from "@/redux/userSlice";
import { getAccessToken, removeAccessToken } from "@/services/cookies.servies";

import Header from "../partials/Header";
import Footer from "../partials/Footer";
import BannersIntro from "../partials/BannersIntro";
import { connectUserHandle } from "@/services/auth.services";
import Head from "next/head";
import ScrollOnTop from "./ScrollOnTop";
import { useMediaQuery } from "usehooks-ts";

interface MainLayoutProps {
    bg?: string;
    autoHidden?: boolean;
    children: ReactNode;
    isHeader?: boolean;
    isFooter?: boolean;
    isBannerPage?: boolean;
}

// const Header = dynamic(() => import('../partials/Header'));
// const Footer = dynamic(() => import('../partials/Footer'));
// const BannerPage = dynamic(() => import('../partials/BannerPage'));

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

            {isHeader && <Header autoHidden={autoHidden} />}

            {isBannerPage && <BannersIntro />}

            <div
                className={`${
                    isBannerPage &&
                    `w-full min-h-[500px] top-0 overflow-hidden ${
                        !matchesMobile && "-translate-y-28"
                    }`
                }`}
            >
                {children}
            </div>

            {isFooter && <Footer />}
        </>
    );
};

export default MainLayout;
