import Link from "next/link";
import { useEffect } from "react";



interface NavOverProps {
    isShow?: boolean
}
export const NavOver = ({ isShow = false } : NavOverProps) => {

    useEffect(() => {
        const bodyElement = document.querySelector('body');
        if (isShow) {
          bodyElement?.classList.add('overflow-hidden');
        } else {
          bodyElement?.classList.remove('overflow-hidden');
        }
    }, [isShow]);

    return (
        <>
            <div className={`p-3 fixed w-full h-full inset-0 text-white z-[100] top-[50px] left-0 right-0 bottom-0 bg-[#141414] overflow-x-hidden overflow-y-auto ${isShow ? "block" : "hidden"}`}>
                

                
                <ul className="block uppercase text-sm">
                    <li className="py-2">
                        <Link href={`/`}>Trang chủ</Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>Hot</Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/theo-doi`}>Theo dõi</Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>Lịch sử</Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>Tìm truyện</Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>Con gái</Link>
                    </li>
                    <li className="py-2">
                        <Link href={`/`}>Con trai</Link>
                    </li>


                </ul>

                <div className="mt-4">

                    <div className="py-2 border-b">
                        <Link href={`/auth/login`}>Đăng nhập</Link>
                    </div>
                    <div className="py-2">
                        <Link href={`/auth/register`}>Đăng kí</Link>
                    </div>

                </div>

            </div>
        </>
    )
}