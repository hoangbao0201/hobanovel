import "@/styles/main.scss";
import "@/styles/globals.scss";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import { Router } from "next/router";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import useScrollRestoration from "@/hook/useScrollRestoration";

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
    const getLayout = Component.getLayout || ((page) => page);

    useScrollRestoration(router);

    return (
        <>
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
