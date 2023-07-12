import { ReactNode } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import Head from "@/components/Share/Head";

const AdminPage = () => {
    const speak = () => {
        // if (typeof window !== 'undefined') {
        //   const { SpeechSynthesisUtterance, speechSynthesis } = window;
        //   const message = 'Hello, world!'; // Thay đổi chuỗi thành nội dung muốn chuyển đổi thành giọng nói
        //   const utterance = new SpeechSynthesisUtterance(message);
        //   speechSynthesis.speak(utterance);
        // }
    };

    return (
        <>
            <Head />
            <>
                <div>Account</div>
                <button onClick={speak}>Chuyển đổi thành giọng nói</button>
            </>
        </>
    );
};

export default AdminPage;

AdminPage.getLayout = (page: ReactNode) => {
    return <AdminLayout>{page}</AdminLayout>;
};
