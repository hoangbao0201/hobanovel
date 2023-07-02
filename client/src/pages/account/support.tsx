import { ReactNode } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import AccountLayout from "@/components/Layout/AccountLayout";
import Head from "@/components/Share/Head";


const AccountSupportPage = () => {

    return (
        <>
            <Head />
            <>
                <div>support</div>
            </>
        </>
    );
}

export default AccountSupportPage;

AccountSupportPage.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            <AccountLayout tab="/account/support">{page}</AccountLayout>
        </MainLayout>
    )
}