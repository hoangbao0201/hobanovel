import { ReactNode } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import AccountLayout from "@/components/Layout/AccountLayout";
import Head from "@/components/Share/Head";


const AccountBookcasePage = () => {

    return (
        <>
            <Head />
            <>
                <div>bookcase</div>
            </>
        </>
    );
}

export default AccountBookcasePage;

AccountBookcasePage.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            <AccountLayout tab="/account/bookcase">{page}</AccountLayout>
        </MainLayout>
    )
}