import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

import { useMediaQuery } from "usehooks-ts";

import { UserType } from "@/types";
import { useRouter } from "next/router";
import SearchInput from "../Layout/SearchInput";




interface NavOverProps {
    user?: UserType | null
    isShow?: boolean
    handle: () => void
    handleLogout: () => void
}
export const NavOver = ({ user = null, isShow = false, handle, handleLogout } : NavOverProps) => {
    const router = useRouter();
    const matchesMobile = useMediaQuery("(max-width: 640px)");


    useEffect(() => {
        const bodyElement = document.querySelector('body');
        if (isShow) {
          bodyElement?.classList.add('overflow-hidden');
        } else {
          bodyElement?.classList.remove('overflow-hidden');
        }
    }, [isShow]);

    useEffect(() => {
        if(isShow) {
            handle()
        }
    }, [router.route])

    return (
        <>
            <div className={`p-3 fixed w-full h-full inset-0 text-white z-[100] top-[50px] left-0 right-0 bottom-0 bg-[#141414] overflow-x-hidden overflow-y-auto ${matchesMobile && isShow ? "block" : "hidden"}`}>
                
                <SearchInput className="text-gray-900"/>
                
                <ul className="block uppercase text-sm">
                    <li className="py-2">
                        <Link href={`/`}>
                            Trang chủ
                        </Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>
                            Hot
                        </Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/theo-doi`}>
                            Theo dõi
                        </Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>
                            Lịch sử
                        </Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>
                            Tìm truyện
                        </Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>
                            Con gái
                        </Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>
                            Con trai
                        </Link>
                    </li>


                </ul>

                <div className="mt-4">

                    {
                        user ? (
                            <>
                                <div className="flex items-center mb-3">
                                    <Image
                                        width={44}
                                        height={44}
                                        alt="image-demo"
                                        className="w-11 h-11 object-cover"
                                        src={
                                            user.avatarUrl ||
                                            "/images/avatar-default-2.png"
                                        }
                                    />
                                    <div className="ml-3 flex-1 line-clamp-1">{user.name}</div>
                                </div>
                                <div onClick={handleLogout}>Đăng xuất</div>
                            </>
                        ) : (
                            <>
                                <div className="py-2 border-b">
                                    <Link href={`/auth/login`}>Đăng nhập</Link>
                                </div>
                                <div className="py-2">
                                    <Link href={`/auth/register`}>Đăng kí</Link>
                                </div>
                            </>
                        )
                    }

                </div>

            </div>
        </>
    )
}