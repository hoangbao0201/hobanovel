import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { ChangeEvent, useState } from "react";

import CustomInput from "@/components/Layout/CustomInput";
import { connectUserHandle, registerUserHandle } from "@/services/auth.services";
import { getAccessTokenOnServer } from "@/services/cookies.servies";


const RegisterPage = () => {
    const router = useRouter();
    const [dataForm, setDataForm] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value,
        });
    };

    const eventSubmitForm = async (e : any) => {
        e.preventDefault();

        try {
            const registerResponse = await registerUserHandle(dataForm as any);

            if (registerResponse?.success) {
                router.push("/auth/login");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="bg-slate-100 min-h-screen">
    
                <div className="mx-auto max-w-[500px]">
    
                    <div className="py-10 flex justify-center">
                        <Link className="" href="/">
                            <div>Logo</div>
                        </Link>
                    </div>
    
                    <div className="w-full min-h-[300px] py-6 px-10 drop-shadow-md bg-white">
                        <div className="grid">
                            <h2 className="mb-3 text-3xl font-semibold">Create a HobaNovel Account.</h2>
                            <div className="mb-6">
                                Already have an account? <Link className="ml-3 text-blue-700 font-semibold" href="/auth/login">Sign In</Link>
                            </div>
                            <div>
                                <CustomInput value={dataForm.name} name="name" handleOnchangeValue={eventChangeValueInput} label="Fullname" id="fullnameInputRegister"/>
                                <CustomInput value={dataForm.email} name="username" handleOnchangeValue={eventChangeValueInput} label="Username" id="usernameInputRegister"/>
                                <CustomInput value={dataForm.email} name="email" handleOnchangeValue={eventChangeValueInput} label="email" id="emailInputRegister"/>
                                <CustomInput value={dataForm.password} name="password" handleOnchangeValue={eventChangeValueInput} type="password" label="Password" id="passwordInputRegister"/>
                            </div>
                            <div className="flex items-center mb-3">
                                <input className="w-6 h-6 mr-3 cursor-pointer rounded-t" type="checkbox"/>
                                <span className="text-sm">
                                    I agree to the {" "}
                                    <Link className="text-blue-700 underline decoration-solid hover:decoration-2" href="/">Subscription Service Agreement</Link>,{" "}
                                    <Link className="text-blue-700 underline decoration-solid hover:decoration-2" href="/">Privacy Policy</Link>, and{" "}
                                    <Link className="text-blue-700 underline decoration-solid hover:decoration-2" href="/">Data Processing Terms</Link>.
                                </span>
                            </div>
                            <div className="mt-2">
                                <button onClick={eventSubmitForm} className=" transition-all w-full text-center py-3 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:shadow-xl text-white">Sign Up</button>
                            </div>
                        </div>
                    </div>
    
                </div>
    
            </div>
        </>
    )
}

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

export default RegisterPage;