import "@/styles/main.scss";
import "@/styles/globals.scss";
import { NextPage } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Router } from "next/router";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect } from "react";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Analytics } from '@vercel/analytics/react';

import { persistor, store } from "@/redux/store";
// import { GA_TRACKING_ID, pageview } from "@/utils/gtag";
import { PersistGate } from "redux-persist/integration/react";
import useScrollRestoration from "@/hook/useScrollRestoration";
import { AdsenseForm } from "@/components/features/AdSenseForm";


export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithlayout = AppProps & {
    Component: NextPageWithLayout;
};

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
NProgress.configure({ showSpinner: false });

// FONT

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps, router }: AppPropsWithlayout) {
    const getLayout = Component.getLayout || ((page) => {
        return (
            <>
                {page}
            </>
        )
    });

    useScrollRestoration(router);

    // ----
    // useEffect(() => {
    //     const handleRouteChange = (url: string) => {
    //         pageview(url);
    //     };
    //     router.events.on('routeChangeComplete', handleRouteChange);
    //     router.events.on('hashChangeComplete', handleRouteChange);
    //     return () => {
    //         router.events.off('routeChangeComplete', handleRouteChange);
    //         router.events.off('hashChangeComplete', handleRouteChange);
    //     };
    // }, [router.events]);

    return (
        <>

            {/* Ads */}
            {/* <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6688547661590907" crossOrigin="anonymous" /> */}
            <AdsenseForm />

            {/* Analytics */}
            {/* <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script id="google-analytics" strategy="lazyOnload">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>
            <Analytics /> */}

            <ToastContainer />
            <style jsx global>{`
                html {
                    font-family: ${inter.style.fontFamily};
                }
            `}</style>
            <Provider store={store}>
                <PersistGate loading={true} persistor={persistor}>
                    {getLayout(<Component {...pageProps} />)}
                </PersistGate>
            </Provider>
        </>
    );
}
