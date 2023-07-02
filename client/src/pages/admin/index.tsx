import { ReactNode } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import Head from "@/components/Share/Head";

const AdminPage = () => {

    return (
        <>
            <Head />
            <>
                <div>
                    Account
                </div>
            </>
        </>
    );
};

export default AdminPage;

AdminPage.getLayout = (page: ReactNode) => {
    return (
        <AdminLayout>{page}</AdminLayout>
    );
};
