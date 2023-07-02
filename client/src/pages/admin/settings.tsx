import { ReactNode, useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import Head from "@/components/Share/Head";

const AdminSettingsPage = () => {
    // const [isDrop, setIsDrop] = useState(false)
    const [isShowing, setIsShowing] = useState(false);

    return (
        <>
            <Head />
            <>
                <div>
                    Settings
                </div>
            </>
        </>
    );
};

export default AdminSettingsPage;

AdminSettingsPage.getLayout = (page: ReactNode) => {
    return (
        <AdminLayout>{page}</AdminLayout>
    );
};
