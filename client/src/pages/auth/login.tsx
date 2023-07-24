
import Link from "next/link";
import Image from "next/image"
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";

import { signIn, useSession } from 'next-auth/react';
import { useDispatch, useSelector } from "react-redux";


import MainLayout from "@/components/Layout/MainLayout";
import FormLayout from "@/components/Layout/FormLayout";
import CustomInput from "@/components/Share/CustomInput";
import { addUserHandle, loadingUserHandle } from "@/redux/userSlice";
import { checkExistUserByAccoutHandle } from "@/services/user.services";
import { connectUserHandle, loginUserHandle } from "@/services/auth.services";
import { addAccessToken, getAccessTokenOnServer } from "@/services/cookies.servies";

const LoginPage = () => {
    const router = useRouter();

    const { data: session, status } = useSession();
    
    const dispatch = useDispatch();
    const { userLoading, isAuthenticated, currentUser } = useSelector(
        (state: any) => state.user
    );

    // state
    const [dataForm, setDataForm] = useState({
        accout: "",
        password: "",
    });

    // Event Onchange Values
    const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value,
        });
    };

    // Event Submit Form
    const eventSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!dataForm.accout || !dataForm.password) {
            console.log("Chưa điền thông tin");
            return;
        }

        dispatch(loadingUserHandle(true));

        try {
            const loginResponse = await loginUserHandle(dataForm as any);

            if (loginResponse?.success) {
                addAccessToken(loginResponse.accessToken);

                const userResponse = await connectUserHandle(loginResponse.accessToken);

                if (userResponse?.success) {
                    dispatch(addUserHandle(userResponse.user));

                    const callbackurl = router?.query?.callbackurl as string ?? "/"
                    router.push(callbackurl)
                }
            }

            dispatch(loadingUserHandle(false));
        } catch (error) {
            dispatch(loadingUserHandle(false));
        }
    };

    const handleLogin = async () => {
        dispatch(loadingUserHandle(true));
        try {
            if(session?.user && session.user.name && session.user.email && session.user.image) {
                const dataReq = {
                    name: session.user.name as string,
                    username: session.user.email.split("@")[0],
                    email: session.user.email,
                    avatarUrl: session.user.image as string,
                }
                const userRes = await checkExistUserByAccoutHandle(dataReq);
                if(userRes.success) {
                    addAccessToken(userRes.token);
                    const userResponse = await connectUserHandle(userRes.token);
                    dispatch(addUserHandle(userResponse.user));

                    if(userRes.exist) {
                        const callbackurl = router?.query?.callbackurl as string ?? "/";
                        router.push(callbackurl);
                    }
                    else {
                        const callbackurl = router?.query?.callbackurl as string ?? "/";
                        router.push("/secure/update-password?callbackurl=" + callbackurl);
                    }
                }
            }

            dispatch(loadingUserHandle(false))
        } catch (error) {
            dispatch(loadingUserHandle(false));
        }
    }

    useEffect(() => {
        if(status == "authenticated") {
            handleLogin()
        }
    }, [status])

    return (
        <>
            <div className="bg-slate-100 min-h-screen transition-all ease-linear">
                <div className="mx-auto max-w-[500px]">
                    <h2 className="py-6 flex justify-center text-2xl font-semibold">
                        <Link className="" href="/">
                            HOBANOVEL
                        </Link>
                    </h2>

                    <FormLayout loading={userLoading} className="w-full min-h-[300px] drop-shadow-md bg-white" classChild="py-6 sm:px-10 px-5">

                        <form onSubmit={eventSubmitForm} className="grid">
                            <h1 className="pl-4 mb-7 border-l-8 uppercase border-blue-700 text-2xl font-semibold">
                                Đăng nhập
                            </h1>
                            <div>
                                <CustomInput
                                    name="accout"
                                    value={dataForm.accout}
                                    handleOnchangeValue={eventChangeValueInput}
                                    label="Tài khoản"
                                    id="AccoutInputRegister"
                                />
                                <CustomInput
                                    name="password"
                                    value={dataForm.password}
                                    handleOnchangeValue={eventChangeValueInput}
                                    type="password"
                                    label="Mật khẩu"
                                    id="passwordInputRegister"
                                />
                            </div>
                            {/* <div className="mb-3">
                                <Link className="text-blue-700 font-semibold" href="/">
                                    <span>Forgot password?</span>
                                </Link>
                            </div> */}
                            <div className="mt-2">
                                <button
                                    className=" transition-all w-full text-center py-3 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:shadow-xl text-white"
                                >
                                    Đăng nhập
                                </button>
                            </div>

                        </form>

                        {/* Social */}
                        <div className="transition-all mt-5 [&>button]:mb-3 [&>button]:border [&>button>img]:absolute [&>button>img]:left-0 [&>button>img]:top-0 [&>button]:relative text-gray-800">
                            <button
                                onClick={() =>
                                    signIn("facebook")
                                }
                                className="flex justify-center items-center h-10 px-1 py-2 w-full rounded hover:bg-gray-100 active:bg-gray-200 active:shadow-xl"
                            >
                                <Image
                                    width={15}
                                    height={15}
                                    alt="icon facebook"
                                    className="w-7 h-7 block my-[5px] ml-3 border-r pr-2"
                                    src={`/emotions/iconFB.svg`}
                                />
                                Signin Facebook
                            </button>
                            <button
                                onClick={() =>
                                    signIn("google")
                                }
                                className="flex justify-center items-center h-10 px-1 py-2 w-full rounded hover:bg-gray-100 active:bg-gray-200 active:shadow-xl"
                            >
                                <Image
                                    width={15}
                                    height={15}
                                    alt="icon facebook"
                                    className="w-7 h-7 block my-[5px] ml-3 border-r pr-2"
                                    src={`/emotions/iconGG.svg`}
                                />
                                Signin Google
                            </button>
                            <button
                                onClick={() =>
                                    signIn("github")
                                }
                                className="flex justify-center items-center h-10 px-1 py-2 w-full rounded hover:bg-gray-100 active:bg-gray-200 active:shadow-xl"
                            >
                                <Image
                                    width={15}
                                    height={15}
                                    alt="icon facebook"
                                    className="w-7 h-7 block my-[5px] ml-3 border-r pr-2"
                                    src={`/emotions/iconGH.svg`}
                                />
                                Signin Github
                            </button>
                        </div>

                    </FormLayout>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps : GetServerSideProps = async (ctx) => {

    const token = getAccessTokenOnServer(ctx.req.headers.cookie as string);
    if(!token) {
        return {
            props: {}
        }
    }

    const userResponse = await connectUserHandle(token as string);
    if(userResponse?.success) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default LoginPage;


LoginPage.getLayout = (page: ReactNode) => {
    return <MainLayout autoHidden={false}>{page}</MainLayout>;
};
