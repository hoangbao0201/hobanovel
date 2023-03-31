import Link from "next/link";
import { useState } from "react";
import CustomInput from "@/components/Layout/CustomInput";


const LoginPage = () => {

    const [isActive, setIsActive] = useState(false);

    const handleFocus = () => setIsActive(true);
    const handleBlur = (e : any) => {
        if (!e.target.value) setIsActive(false);
    };

    const eventSubmitForm = (e : any) => {
        e.preventDefault();
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
                            <h2 className="mb-7 text-center text-3xl font-semibold">Welcome</h2>
                            <div>
                                <CustomInput label="Username or email address" id="AccoutInputRegister"/>
                                <CustomInput type="password" label="Password" id="passwordInputRegister"/>
                            </div>
                            <div className="mb-3">
                                <Link className="text-blue-700 font-semibold" href="/">
                                    <span>Forgot password?</span>
                                </Link>
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

export default LoginPage;