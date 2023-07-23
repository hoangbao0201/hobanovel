import { ChangeEvent, FormEvent, ReactNode, useState } from "react";

import { getSession, useSession } from "next-auth/react";

import MainLayout from "@/components/Layout/MainLayout";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { updatePasswordUserHandle } from "@/services/user.services";
import { getAccessToken } from "@/services/cookies.servies";

interface UpdatePasswordPageProps {
    user: any;
}

const UpdatePasswordPage = ({ user }: UpdatePasswordPageProps) => {
    const router = useRouter();
    
    const { data: session, status } = useSession();


    const [dataForm, setDataForm] = useState({
        email: session?.user?.email || "",
        password: "",
    });

    const handleOnChangeDataForm = (e: ChangeEvent<HTMLInputElement>) => {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = getAccessToken();
        if(!token) {
            return;
        }

        if(!dataForm.email.length || !dataForm.password.length) {
            console.log("Chưa điền thông tin");
            return;
        }
        if(dataForm.password.length < 3 || dataForm.password.length > 20) {
            console.log("Password từ có độ dài từ 3 đến 20 kí tự");
            return;
        }

        try {
            const useRes = await updatePasswordUserHandle({ ...dataForm, token });

            if(useRes.success) {
                const callbackurl = router?.query?.callbackurl as string ?? "/"
                router.push(callbackurl);
            }
        } catch (error) {}
    };

    return (
        <WrapperLayout className="bg-[#ebebeb]">
            <div className="max-w-xl w-full mx-auto">
                <div className="px-4 mb-5 uppercase font-semibold">
                    <p className="pl-4 border-l-4 border-[#ee2c74]">
                        Vui lòng hoàn thiện các thông tin dưới đây để tiếp tục
                    </p>
                </div>

                <form onSubmit={handleSubmitForm} className="mx-4">
                    <div className="mb-4">
                        <label className="w-full block mb-1">Email</label>
                        <input
                            name="email"
                            value={dataForm.email}
                            onChange={handleOnChangeDataForm}
                            disabled
                            className="h-10 py-2 px-3 w-full border border-gray-300 outline-none rounded-sm"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="w-full block mb-1">Mật khẩu*</label>
                        <input
                            name="password"
                            value={dataForm.password}
                            onChange={handleOnChangeDataForm}
                            type="password"
                            className="h-10 py-2 px-4 w-full border border-gray-300 outline-none rounded-sm"
                        />
                    </div>
                    <p className="mb-5 text-sm text-red-600 italic">
                        Mật khẩu này không phải của tài khoản Google/Facebook của bạn, chỉ dùng
                        để đăng nhập vào web nếu tài khoản Google/Facebook bị khóa
                    </p>

                    <button className="w-full text-center py-2 border outline-none bg-yellow-500 hover:bg-yellow-600 transition-all rounded-md">
                        Cập nhật
                    </button>
                </form>
            </div>
        </WrapperLayout>
    );
};

export default UpdatePasswordPage;

UpdatePasswordPage.getLayout = (page: ReactNode) => {
    return <MainLayout autoHidden={false}>{page}</MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    // if(!session) {
    //     return {
    //         redirect: {
    //             destination: "/",
    //             permanent: false
    //         }
    //     }
    // }
    return {
        props: {
            session: session,
        },
    };
};
