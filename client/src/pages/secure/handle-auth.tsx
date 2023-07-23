import { ReactNode } from "react";
import MainLayout from "@/components/Layout/MainLayout";


const HandleAuth = () => {


    return (
        <div>Auth</div>
    )
}

export default HandleAuth;

HandleAuth.getLayout = (page: ReactNode) => {
    return <MainLayout autoHidden={false}>{page}</MainLayout>;
};
