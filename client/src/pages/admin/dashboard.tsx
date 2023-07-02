import { ReactNode } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";

import "draft-js/dist/Draft.css";
import CommentInput from "@/components/features/CommentInput";
import Head from "@/components/Share/Head";


const AdminDashboardPage = () => {
    
    return (
        <>
            <Head />
            <>
                <div className="w-full">
                    
                    <CommentInput />

                </div>
            </>
        </>
    );
};

export default AdminDashboardPage;

AdminDashboardPage.getLayout = (page: ReactNode) => {
    return <AdminLayout>{page}</AdminLayout>;
};
