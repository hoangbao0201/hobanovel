
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";

// import { signIn, signOut, useSession } from 'next-auth/react';
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";


import CustomInput from "@/components/Layout/CustomInput";
import { connectUserBySocialHanlde, connectUserHandle, loginUserHandle } from "@/services/auth.services";
import { addAccessToken, getAccessTokenOnServer } from "@/services/cookies.servies";
import { addUserHandle } from "@/redux/userSlice";
import MainLayout from "@/components/Layout/MainLayout";

const LoginPage = () => {
    const router = useRouter();

    const dispatch = useDispatch();
    // const { data: session, status } = useSession()

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

    const eventSubmitForm = async (e: any) => {
        e.preventDefault();

        try {
            const loginResponse = await loginUserHandle(dataForm as any);

            if (loginResponse?.success) {
                addAccessToken(loginResponse.accessToken);

                const userResponse = await connectUserHandle(loginResponse.accessToken);

                if (userResponse?.success) {
                    dispatch(addUserHandle(userResponse.user));
                    router.back();
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    // console.log(document.cookie)

    // const handleLoginOnSocial = async () => {
    //     try {
    //         if(session?.user) {
    //             const { name, email, image } = session.user;
    //             if(!name || !email) {
    //                 return
    //             }
    //             const avatar = image || null;

    //             // JWT
    //             const connectUser = await connectUserBySocialHanlde({ name, email, avatar });

    //             if(connectUser.success) {
    //                 dispatch(addUserHandle(connectUser.user));
    //                 router.back();
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     if(status == "authenticated") {
    //         handleLoginOnSocial()
    //     }
    // }, [session])
    // console.log(session, status)

    return (
        <>
            <div className="bg-slate-100 min-h-screen">
                <div className="mx-auto max-w-[500px]">
                    <h2 className="py-10 flex justify-center">
                        <Link className="" href="/">
                            HOBANOVEL
                        </Link>
                    </h2>

                    <div className="w-full min-h-[300px] py-6 px-10 drop-shadow-md bg-white">
                        <div className="grid">
                            <h1 className="mb-7 text-center text-3xl font-semibold">
                                LOGIN
                            </h1>
                            <div>
                                <CustomInput
                                    name="accout"
                                    value={dataForm.accout}
                                    handleOnchangeValue={eventChangeValueInput}
                                    label="Username or email address"
                                    id="AccoutInputRegister"
                                />
                                <CustomInput
                                    name="password"
                                    value={dataForm.password}
                                    handleOnchangeValue={eventChangeValueInput}
                                    type="password"
                                    label="Password"
                                    id="passwordInputRegister"
                                />
                            </div>
                            <div className="mb-3">
                                <Link className="text-blue-700 font-semibold" href="/">
                                    <span>Forgot password?</span>
                                </Link>
                            </div>
                            <div className="mt-2">
                                <button
                                    onClick={eventSubmitForm}
                                    className=" transition-all w-full text-center py-3 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:shadow-xl text-white"
                                >
                                    Đăng nhập
                                </button>
                            </div>



                            {/* Social */}
                            {/* <div className="mt-2">
                                <button
                                    onClick={() =>
                                        signIn("github")
                                    }
                                    className=" transition-all w-full text-center py-3 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:shadow-xl text-white"
                                >
                                    Signin Github
                                </button>
                            </div>
                            <div className="mt-2">
                                <button
                                    onClick={() =>
                                        signIn("facebook")
                                    }
                                    className=" transition-all w-full text-center py-3 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:shadow-xl text-white"
                                >
                                    Signin Facebook
                                </button>
                            </div>
                            <div className="mt-2">
                                <button
                                    onClick={() =>
                                        signIn("google")
                                    }
                                    className=" transition-all w-full text-center py-3 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:shadow-xl text-white"
                                >
                                    Signin Google
                                </button>
                            </div>



                            <div className="mt-2">
                                <button
                                    onClick={() =>
                                        signOut()
                                    }
                                    className=" transition-all w-full text-center py-3 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:shadow-xl text-white"
                                >
                                    Sign out
                                </button>
                            </div> */}




                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps : GetServerSideProps = async (ctx) => {

    const token = getAccessTokenOnServer(ctx.req.headers.cookie as string)
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
