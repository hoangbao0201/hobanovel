import { ReactNode } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import AccountLayout from "@/components/Layout/AccountLayout";
import Head from "@/components/Share/Head";


const AccountSettingsPage = () => {

    return (
        <>
            <Head />
            <>
                <div>settings</div>
            </>
        </>
    );
}

export default AccountSettingsPage;

AccountSettingsPage.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            <AccountLayout tab="/account/settings">{page}</AccountLayout>
        </MainLayout>
    )
}