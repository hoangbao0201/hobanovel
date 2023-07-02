import { ReactNode } from "react";

import MainLayout from "@/components/Layout/MainLayout";
import AccountLayout from "@/components/Layout/AccountLayout";
import Head from "@/components/Share/Head";


const AccountNotificationPage = () => {

    return (
        <>
            <Head />
            <>
                <div>notification</div>
            </>
        </>
    );
}

export default AccountNotificationPage;

AccountNotificationPage.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            <AccountLayout tab="/account/notification">{page}</AccountLayout>
        </MainLayout>
    )
}