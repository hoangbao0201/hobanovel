import { ReactNode } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import AccountLayout from "@/components/Layout/AccountLayout";
import Head from "@/components/Share/Head";


const AccountPaymentPage = () => {

    return (
        <>
            <Head />
            <>
                <div>
                    <div className="flex grid-cols-3 border">
                        <button className="flex-1 py-2">MoMo</button>
                        <button className="flex-1 py-2">VNPay</button>
                        <button className="flex-1 py-2">Tài khoản ngân hàng</button>
                    </div>
                </div>
            </>
        </>
    );
}

export default AccountPaymentPage;

AccountPaymentPage.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            <AccountLayout tab="/account/payment">{page}</AccountLayout>
        </MainLayout>
    )
}