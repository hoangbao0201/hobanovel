import { ReactNode } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import AccountLayout from "@/components/Layout/AccountLayout";
import Head from "@/components/Share/Head";


const AccountUserPage = () => {

    return (
        <>
            <Head />
            <>
                <div>user</div>
            </>
        </>
    );
}

export default AccountUserPage;

AccountUserPage.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            <AccountLayout tab="/account/user">{page}</AccountLayout>
        </MainLayout>
    )
}