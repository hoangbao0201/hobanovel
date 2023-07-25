import Link from "next/link";
import Image from "next/image"
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ChangeEvent, useEffect, useState } from "react";

import { getSession, signIn, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "next-auth/jwt"

import { checkValueAuth } from "@/utils/checkValueAuth";
import FormLayout from "@/components/Layout/FormLayout";
import { iconHideEye, iconShowEye } from "../../../public/icons";
import { addUserHandle, loadingUserHandle } from "@/redux/userSlice";
import { checkExistUserByAccoutHandle } from "@/services/user.services";
import { addAccessToken, getAccessTokenOnServer } from "@/services/cookies.servies";
import { connectUserHandle, registerUserHandle } from "@/services/auth.services";

const RegisterPage = ({ test } : any) => {

    // console.log(test)

    const router = useRouter();

    const dispatch = useDispatch();
    const { userLoading, isAuthenticated, currentUser } = useSelector(
        (state: any) => state.user
    );
    const { data: session, status } = useSession();

    const [dataForm, setDataForm] = useState<{
        acceptTerms: boolean,
        name: string,
        username: string,
        email: string,
        password: string,
    }>({
        acceptTerms: false,
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [isPassword, setIsPassword] = useState(false);
    const [messageError, setMessageError] = useState<string | null>(null)

    // Event Onchange Value Input
    const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value,
        });
    };

    // Handle Onchange CheckBox
    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setDataForm((prevDataForm) => ({
            ...prevDataForm,
            acceptTerms: checked,
        }));
    };

    // Event Submit Form
    const eventSubmitForm = async (e: any) => {
        e.preventDefault();

        const dataReq = {
            name: dataForm.name,
            username: dataForm.username,
            email: dataForm.email,
            password: dataForm.password
        }
        const checkValue = checkValueAuth(dataReq);
        if(!checkValue.success) {
            // setMessageError(checkValue);
            setMessageError("Đăng nhập thất bại. Vui lòng thử lại.")
            console.log("error");
            return;
        }
        return;
        try {
            
            const registerResponse = await registerUserHandle(dataReq);

            if (registerResponse?.success) {
                router.push(
                    (("/auth/login?callbackurl=" + router?.query?.callbackurl) as string) || "/"
                );
            }
        } catch (error) {
            console.log(error);
        }
    };
      
    // useEffect(() => {
    //     setTypeError(checkValueAuth(dataForm));
    // }, [dataForm]);

    // Handle Login
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

                    return;
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
    }, [status]);

    // console.log(typeError)

    return (
        <>
            <div className="bg-slate-100 min-h-screen transition-all ease-linear">
                <div className="mx-auto max-w-[500px]">
                    <h2 className="py-6 flex justify-center text-2xl font-semibold">
                        <Link className="" href="/">
                            HOBANOVEL
                        </Link>
                    </h2>

                    <FormLayout loading={userLoading} className="w-full drop-shadow-md bg-white" classChild="py-6 sm:px-10 px-5">
                        <h1 className="border-l-8 border-pink-600 pl-6 leading-none py-3 uppercase text-2xl font-semibold mb-6">
                            ĐĂNG KÝ TÀI KHOẢN
                        </h1>
                        <h3 className="mb-6">
                            Bạn có đã có tài khoản?{" "}
                            <Link
                                className="ml-3 text-sm text-blue-700 font-semibold"
                                href={`/auth/login?callback=${
                                    (router.query.callback as string) || "/"
                                }`}
                            >
                                Đăng nhập ngay
                            </Link>
                        </h3>
                        {/* <h4>Hiện tại chỉ hỗ trợ đăng ký tài khoản qua tài khoản Facebook hoặc Google</h4> */}

                        <form className={`grid leading-tight mb-4 ${"[&>p]:text-transparent"}`}>

                            <div className={`w-full relative mb-4 [&>input]:border-gray-300`}>
                                <label htmlFor="name" className="block cursor-pointer bg-white mb-1">
                                    Họ và tên
                                </label>
                                <input
                                    name="name"
                                    value={dataForm.name}
                                    onChange={eventChangeValueInput}
                                    className={`w-full flex focus:border-blue-500 items-center leading-none border outline-none rounded-sm overflow-hidden px-4 py-[10px] flex-1`}
                                    id="name"
                                    placeholder="name"
                                />
                            </div>

                            <div className={`w-full relative mb-4 [&>input]:border-gray-300`}>
                                <label htmlFor="username" className="block cursor-pointer bg-white mb-1">
                                    Tên đăng nhập
                                </label>
                                <input
                                    name="username"
                                    value={dataForm.username}
                                    onChange={eventChangeValueInput}
                                    className={`w-full flex focus:border-blue-500 items-center leading-none border outline-none rounded-sm overflow-hidden px-4 py-[10px] flex-1`}
                                    id="username"
                                    placeholder="username"
                                />
                            </div>

                            <div className={`w-full relative mb-4 [&>input]:border-gray-300`}>
                                <label htmlFor="email" className="block cursor-pointer bg-white mb-1">Email</label>
                                <input
                                    name="email"
                                    value={dataForm.email}
                                    onChange={eventChangeValueInput}
                                    className="w-full flex focus:border-blue-500 items-center leading-none border border-gray-300 outline-none rounded-sm overflow-hidden px-4 py-[10px] flex-1"
                                    id="email"
                                    placeholder="name@email.com"
                                />
                            </div>

                            <div className={`w-full relative mb-4 [&>input]:border-gray-300`}>
                                <label htmlFor="password" className="block cursor-pointer bg-white mb-1">Mật khẩu</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        value={dataForm.password}
                                        type={isPassword ? "text" : "password"}
                                        onChange={eventChangeValueInput}
                                        className="w-full flex focus:border-blue-500 items-center leading-none border border-gray-300 outline-none rounded-sm overflow-hidden px-4 py-[10px] h-10 flex-1"
                                        id="password"
                                        placeholder="••••••••"
                                    />
                                    <span onClick={() => setIsPassword(value => !value)} className="absolute top-0 right-0 translate-y-[3px] mr-2 p-[5px] cursor-pointer ">
                                        <i className="block w-6 h-6 fill-gray-600">
                                            {isPassword ? iconShowEye : iconHideEye}
                                        </i>
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center ml-1 mb-6 mt-5">
                                <input
                                    checked={dataForm.acceptTerms}
                                    onChange={handleCheckboxChange}
                                    type="checkbox"
                                    className="w-5 h-5 flex-shrink-0 mr-3 cursor-pointer rounded-t"
                                />

                                <div className="text-[15px]">
                                    Tôi đồng ý với Thỏa thuận dịch vụ đăng ký{", "}
                                    <Link
                                        className="text-blue-700 underline decoration-solid hover:decoration-2"
                                        href="/chinh-sach-bao-mat"
                                    >
                                        Chính sách quyền riêng tư và Điều khoản xử lý dữ liệu.
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-2">
                                <button
                                    onClick={eventSubmitForm}
                                    className={`${dataForm.acceptTerms ? "active:shadow-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white" : "bg-gray-300 text-gray-500 cursor-default"} transition-all w-full text-center py-3 rounded`}
                                >
                                    Đăng kí
                                </button>
                            </div>
                                
                        </form>

                        {
                            messageError && (<p className="border text-sm text-red-900 bg-red-100 py-2 px-4 rounded-sm">{messageError}</p>)
                        }

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
                                Đăng nhập bằng Facebook
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
                                Đăng nhập bằng Google
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
                                Đăng nhập bằng Github
                            </button>
                        </div>

                    </FormLayout>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const token = getAccessTokenOnServer(context.req.headers.cookie as string);

    const session = await getSession(context);
    const tokenc = await getToken({ req: context.req })
    if(!token && session) {
        // console.log(session)
        return {
            props: {
                test: {
                    session,
                    tokenc
                }
            }
        }
    }
    // if(!token )
    const userResponse = await connectUserHandle(token as string);



    if (userResponse?.success) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

export default RegisterPage;
