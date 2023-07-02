import { ReactNode } from "react";

import MainLayout from "@/components/Layout/MainLayout";
import AccountLayout from "@/components/Layout/AccountLayout";
import Head from "@/components/Share/Head";


const AccountAssectsPage = () => {

    return (
        <>
            <Head />
            <>
                <div>assects</div>
            </>
        </>
    );
}

export default AccountAssectsPage;

AccountAssectsPage.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            <AccountLayout tab="/account/assects">{page}</AccountLayout>
        </MainLayout>
    )
}