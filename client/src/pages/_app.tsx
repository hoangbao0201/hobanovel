import "@/styles/main.scss";
import "@/styles/globals.scss";
import { Router } from "next/router";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Inter } from "next/font/google";


import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react"
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

import MainLayout from "@/components/Layout/MainLayout";
import useScrollRestoration from "@/hook/useScrollRestoration";


type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session }> & {
    Component: NextPageWithLayout;
};

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
NProgress.configure({ showSpinner: false });

// FONT

// const MySource_Sans_Pro = Source_Sans_Pro({
//     weight: ['400',"600", "700", "900"],
//     style: ['normal', 'italic'],
//     subsets: ['latin'],
//     display: 'swap',
// })
const inter = Inter({
    subsets: ["latin"]
});


const MyApp = ({
    Component,
    pageProps: { session, ...pageProps }, router
} : AppPropsWithLayout) => {

    useScrollRestoration(router);

    const getLayout = Component.getLayout ?? (
        (page) => {
            return (
                <MainLayout>
                    {page}
                </MainLayout>
            )
        }
    )

    return (
        <>
            <style jsx global>{`
                html {
                font-family: ${inter.style.fontFamily};
                }
            `}</style>


            <SessionProvider session={session}>
                <Provider store={store}>

                        <PersistGate loading={false} persistor={persistor}>

                                {() => getLayout(<Component {...pageProps} />)}
                                {/* {getLayout(<Component {...pageProps} />)} */}

                        </PersistGate>

                </Provider>
            </SessionProvider>
                

            <ToastContainer />
        </>
    )
    
}
export default MyApp;



{/* <SessionProvider session={session}>
    {(<Component {...pageProps} />)}
</SessionProvider> */}



// const makeStore = () => store;
// const wrapper = createWrapper(makeStore);

// export default wrapper.withRedux(MyApp);