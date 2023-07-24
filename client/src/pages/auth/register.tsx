import Link from "next/link";
import Image from "next/image"
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ChangeEvent, useEffect, useState } from "react";

import ReCAPTCHA from "react-google-recaptcha";
import { signIn, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

// import CustomInput from "@/components/Share/CustomInput";
import { checkValueAuth } from "@/utils/checkValueAuth";
import { iconHideEye, iconShowEye } from "../../../public/icons";
import { addUserHandle, loadingUserHandle } from "@/redux/userSlice";
import { checkExistUserByAccoutHandle } from "@/services/user.services";
import { addAccessToken, getAccessTokenOnServer } from "@/services/cookies.servies";
import { connectUserHandle, registerUserHandle } from "@/services/auth.services";
import FormLayout from "@/components/Layout/FormLayout";

const RegisterPage = () => {
    const router = useRouter();

    const dispatch = useDispatch();
    const { userLoading, isAuthenticated, currentUser } = useSelector(
        (state: any) => state.user
    );
    const { data: session, status } = useSession();

    const [dataForm, setDataForm] = useState<{
        acceptTerms: boolean,
        isHuman: boolean,
        fullname: string,
        username: string,
        email: string,
        password: string,
    }>({
        acceptTerms: false,
        isHuman: false,
        fullname: "",
        username: "",
        email: "",
        password: "",
    });
    const [typeError, setTypeError] = useState({
        success: false,
        fullname: "",
        username: "",
        email: "",
        password: "",
    })
    const [isCheck, setIsCheck] = useState(false);
    const [isPassword, setIsPassword] = useState(false);

    const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setDataForm((prevDataForm) => ({
            ...prevDataForm,
            acceptTerms: checked,
        }));

        if(!isCheck) {
            setIsCheck(true);
        }
    };

    const eventSubmitForm = async (e: any) => {
        e.preventDefault();

        if(!typeError.success) {
            return;
        }

        try {
            const dataReq = {
                name: dataForm.fullname,
                username: dataForm.username,
                email: dataForm.email,
                password: dataForm.password
            }
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

    const onChangeCaptcha = (value : any) => {
        setDataForm({
            ...dataForm,
            isHuman: !!value
        })
        setIsCheck(true);
    }
      
    useEffect(() => {
        setTypeError(checkValueAuth(dataForm));
    }, [dataForm]);


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
            <div className="bg-slate-100 min-h-screen">
                {/* <div className="mx-auto"> */}
                    <h2 className="py-6 flex justify-center text-2xl font-semibold">
                        <Link className="" href="/">
                            HOBANOVEL
                        </Link>
                    </h2>

                    <FormLayout loading={userLoading} className="w-full max-w-[500px] min-h-[300px] mx-auto drop-shadow-md bg-white">
                        <div className="relative py-6 sm:px-10 px-5">
                            <h1 className="pl-4 mb-7 border-l-8 uppercase border-blue-700 text-2xl font-semibold">
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

                            <form className={`grid leading-tight mb-4 ${!isCheck && "[&>p]:text-transparent"}`}>

                                {/* <div className="flex gap-2">
                                    <div className={`w-1/2 relative ${isCheck && !!typeError.lastName.length ? '[&>input]:border-red-500 [&>label]:text-red-500' : '[&>input]:border-gray-300 [&>p]:text-transparent'}`}>
                                        <label htmlFor="lastName" className="block cursor-pointer bg-white mb-1">Họ*</label>
                                        <input
                                            name="lastName"
                                            value={dataForm.lastName}
                                            onChange={eventChangeValueInput}
                                            className="w-full flex items-center leading-none border border-gray-300 outline-none rounded-sm overflow-hidden px-4 py-[10px] flex-1"
                                            id=""
                                            placeholder="nguyễn h.."
                                        />
                                        <p className="text-red-500 h-4 my-1 ">
                                            {typeError?.lastName}
                                        </p>
                                    </div>
                                    <div className={`w-1/2 relative ${isCheck && !!typeError.firstName.length ? '[&>input]:border-red-500 [&>label]:text-red-500' : '[&>input]:border-gray-300 [&>p]:text-transparent'}`}>
                                        <label htmlFor="firstName" className="block cursor-pointer bg-white mb-1">Tên*</label>
                                        <input
                                            name="firstName"
                                            value={dataForm.firstName}
                                            onChange={eventChangeValueInput}
                                            className="w-full flex items-center leading-none border border-gray-300 outline-none rounded-sm overflow-hidden px-4 py-[10px] flex-1"
                                            id=""
                                            placeholder=""
                                        />
                                        <p className="text-red-500 h-4 my-1 ">
                                            {typeError?.firstName}
                                        </p>
                                    </div>
                                </div> */}

                                <div className={`w-full relative ${isCheck && !!typeError.fullname.length ? '[&>input]:border-red-500 [&>label]:text-red-500' : '[&>input]:border-gray-300'}`}>
                                    <label htmlFor="fullname" className="block cursor-pointer bg-white mb-1">
                                        Họ và tên*
                                    </label>
                                    <input
                                        name="fullname"
                                        value={dataForm.fullname}
                                        onChange={eventChangeValueInput}
                                        className={`w-full flex items-center leading-none border outline-none rounded-sm overflow-hidden px-4 py-[10px] flex-1`}
                                        id="fullname"
                                        placeholder="fullname"
                                    />
                                </div>
                                <p className="text-red-500 h-4 my-1 ">
                                    {typeError.fullname}
                                </p>
    
                                <div className={`w-full relative ${isCheck && !!typeError.username.length ? '[&>input]:border-red-500 [&>label]:text-red-500' : '[&>input]:border-gray-300'}`}>
                                    <label htmlFor="username" className="block cursor-pointer bg-white mb-1">
                                        Tên đăng nhập*
                                    </label>
                                    <input
                                        name="username"
                                        value={dataForm.username}
                                        onChange={eventChangeValueInput}
                                        className={`w-full flex items-center leading-none border outline-none rounded-sm overflow-hidden px-4 py-[10px] flex-1`}
                                        id="username"
                                        placeholder="username"
                                    />
                                </div>
                                <p className="text-red-500 h-4 my-1 ">
                                    {typeError.username}
                                </p>

                                <div className={`w-full relative ${isCheck && !!typeError.email.length ? '[&>input]:border-red-500 [&>label]:text-red-500' : '[&>input]:border-gray-300'}`}>
                                    <label htmlFor="email" className="block cursor-pointer bg-white mb-1">Email*</label>
                                    <input
                                        name="email"
                                        value={dataForm.email}
                                        onChange={eventChangeValueInput}
                                        className="w-full flex items-center leading-none border border-gray-300 outline-none rounded-sm overflow-hidden px-4 py-[10px] flex-1"
                                        id="email"
                                        placeholder="name@email.com"
                                    />
                                </div>
                                <p className="text-red-500 h-4 my-1 ">
                                    {typeError.email}
                                </p>

                                <div className={`w-full ${isCheck && !!typeError.password.length ? '[&>div>input]:border-red-500 [&>label]:text-red-500' : '[&>input]:border-gray-300'}`}>
                                    <label htmlFor="password" className="block cursor-pointer bg-white mb-1">Mật khẩu*</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            value={dataForm.password}
                                            type={isPassword ? "text" : "password"}
                                            onChange={eventChangeValueInput}
                                            className="w-full flex items-center leading-none border border-gray-300 outline-none rounded-sm overflow-hidden px-4 py-[10px] h-10 flex-1"
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
                                <p className="text-red-500 h-4 my-1 ">
                                    {typeError.password}
                                </p>


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

                                <ReCAPTCHA
                                    sitekey="6LfKHUEnAAAAAAhOUptIuOJDtnMKo1-DP-KhxFSE"
                                    onChange={onChangeCaptcha}
                                />,

                                <div className="mt-2">
                                    <button
                                        disabled={!typeError.success}
                                        onClick={eventSubmitForm}
                                        className={`${typeError.success && dataForm.acceptTerms && dataForm.isHuman ? "active:shadow-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white" : "bg-gray-300 text-gray-500 cursor-default"} transition-all w-full text-center py-3 rounded`}
                                    >
                                        Sign Up
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

                        </div>
                    </FormLayout>
                {/* </div> */}
            </div>
        </>
    );
};


// const RegisterPage = () => {
//     const router = useRouter();
//     const [dataForm, setDataForm] = useState({
//         name: "",
//         username: "",
//         email: "",
//         password: ""
//     });

//     const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
//         setDataForm({
//             ...dataForm,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const eventSubmitForm = async (e : any) => {
//         e.preventDefault();

//         try {
//             const registerResponse = await registerUserHandle(dataForm as any);

//             if (registerResponse?.success) {
//                 router.push("/auth/login?callbackurl=" + router?.query?.callbackurl as string || "/");
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     return (
//         <>
//             <div className="bg-slate-100 min-h-screen">
    
//                 <div className="mx-auto max-w-[500px]">
    
//                     <h2 className="py-10 flex justify-center">
//                         <Link className="" href="/">
//                             Hobanovel
//                         </Link>
//                     </h2>
    
//                     <div className="w-full min-h-[300px] py-6 sm:px-10 px-4 drop-shadow-md bg-white">
//                         <div className="grid">
//                             <h1 className="mb-3 text-2xl font-semibold">Đăng kí tài khoản</h1>
//                             <h3 className="mb-6">
//                                 Bạn có đã có tài khoản?{" "}
//                                 <Link
//                                     className="ml-3 text-sm text-blue-700 font-semibold"
//                                     href={`/auth/login?callback=${
//                                         (router.query.callback as string) || "/"
//                                     }`}
//                                 >
//                                     Đăng nhập ngay
//                                 </Link>
//                             </h3>
//                             <div>
//                                 <CustomInput value={dataForm.name} name="name" handleOnchangeValue={eventChangeValueInput} label="Fullname" id="fullnameInputRegister"/>
//                                 <CustomInput value={dataForm.email} name="username" handleOnchangeValue={eventChangeValueInput} label="Username" id="usernameInputRegister"/>
//                                 <CustomInput value={dataForm.email} name="email" handleOnchangeValue={eventChangeValueInput} label="email" id="emailInputRegister"/>
//                                 <CustomInput value={dataForm.password} name="password" handleOnchangeValue={eventChangeValueInput} type="password" label="Password" id="passwordInputRegister"/>
//                             </div>
                            
//                             <div className="flex items-center ml-1 mb-6 mt-5">
//                                 <input
//                                     // checked={dataForm.acceptTerms}
//                                     // onChange={handleCheckboxChange}
//                                     type="checkbox"
//                                     className="w-5 h-5 flex-shrink-0 mr-3 cursor-pointer rounded-t"
//                                 />

//                                 <div className="sm:text-[15px] text-[13px]">
//                                     Tôi đồng ý với Thỏa thuận dịch vụ đăng ký{", "}
//                                     <Link
//                                         className="text-blue-700 underline decoration-solid hover:decoration-2"
//                                         href="/chinh-sach-bao-mat"
//                                     >
//                                         Chính sách quyền riêng tư và Điều khoản xử lý dữ liệu.
//                                     </Link>
//                                 </div>
//                             </div>
//                             <div className="mt-2">
//                                 <button onClick={eventSubmitForm} className=" transition-all w-full text-center py-3 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:shadow-xl text-white">Sign Up</button>
//                             </div>
//                         </div>
//                     </div>
    
//                 </div>
    
//             </div>
//         </>
//     )
// }


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const token = getAccessTokenOnServer(ctx.req.headers.cookie as string);
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
