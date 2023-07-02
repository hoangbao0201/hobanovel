import { GetServerSideProps } from "next";
import { ReactNode, useState } from "react";

import MainLayout from "@/components/Layout/MainLayout";
import AccountLayout from "@/components/Layout/AccountLayout";
import Head from "@/components/Share/Head";
import { ListStarLayout } from "@/components/Layout/ListStarLayout";

interface AccountPageProps {

}

const AccountPage = ({} : AccountPageProps) => {
    // const [isDrop, setIsDrop] = useState(false)
    const [isShowing, setIsShowing] = useState(false);

    return (
        <>
            <Head />
            <>
                <div>
                    Account
                    <ListStarLayout numb={2.6123213}/>
                </div>
            </>
        </>
    );
};

export default AccountPage;

export const getServerSideProps : GetServerSideProps = async (context) => {

    return {
        props: {
            
        }
    }
}

AccountPage.getLayout = (page: ReactNode) => {
    return (
        <MainLayout isBannerPage={false}>
            <AccountLayout>{page}</AccountLayout>
        </MainLayout>
    );
};