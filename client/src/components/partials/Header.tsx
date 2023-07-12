import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "usehooks-ts";

import { NavOver } from "./NavOver";
import BlurImage from "../Layout/BlurImage";
import SearchInput from "../Layout/SearchInput";
import { iconBars, iconTimes } from "../../../public/icons";
import { placeholderBlurhash } from "@/constants";
import { logoutUserHandle } from "@/redux/userSlice";
import { LoadingForm } from "../Layout/LoadingLayout";
import { useClickOutSide } from "@/hook/useClickOutSide";
import { GENRES_VALUE, RANK_VALUE } from "@/constants/data";
import { removeAccessToken } from "@/services/cookies.servies";
import ClientOnly from "../Share/ClientOnly";

interface HeaderProps {
    autoHidden?: boolean
}

const Header = ({ autoHidden = true } : HeaderProps) => {

    const matchesMobile = useMediaQuery("(max-width: 768px)");

    const dispatch = useDispatch();
    const { currentUser, userLoading, isAuthenticated } = useSelector(
        (state: any) => state.user
    );

    const userDropdownRef = useRef<any>()
    const genresDropdownRef = useRef<any>();
    const rankDropdownRef = useRef<any>();

    const [isHeader, setIsHeader] = useState(true);
    const [isDropdownGenres, setIsDropdownGenres] = useState(false);
    const [isDropdownRank, setIsDropdownRank] = useState(false);
    const [isDropdownUser, setIsDropdownUser] = useState(false);
    const [isNavOver, setIsNavOver] = useState(false);

    useEffect(() => {
        let prevScrollPosition = window.pageYOffset;

        const handleScroll = () => {
            const currentScrollPosition = window.pageYOffset;
            const shouldHideHeader =
                currentScrollPosition > prevScrollPosition && currentScrollPosition >= 100;

            setIsHeader(!shouldHideHeader);
            prevScrollPosition = currentScrollPosition;
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleHiddenDropdownGenres = () => {
        setIsDropdownGenres(false);
    }
    const handleHiddenDropdownRank = () => {
        setIsDropdownRank(false);
    }
    const handleHiddenDropdownUser = () => {
        setIsDropdownUser(false);
    }

    const eventLogoutUser = () => {
        dispatch(logoutUserHandle());
        removeAccessToken()
        window.location.reload();
    }

    useClickOutSide(genresDropdownRef, handleHiddenDropdownGenres);
    useClickOutSide(rankDropdownRef, handleHiddenDropdownRank);
    useClickOutSide(userDropdownRef, handleHiddenDropdownUser);

    useEffect(() => {
        if(!isHeader) {
            setIsDropdownGenres(false);
            setIsDropdownRank(false);
            setIsDropdownUser(false);
        }
    }, [isHeader])

    return (
        <header
            className={`bg-gray-100 border-b ${ autoHidden ? 'fixed top-0 left-0 right-0 z-20' : '' }
            ${ autoHidden && (isHeader ? "opacity-100" : "opacity-0 pointer-events-none")}`}
        >
            <div className={`w-full`}>
                <div className="max-w-7xl mx-auto flex items-center h-[50px] px-3">
                    <h1 className="text-center align-middle font-bold text-2xl">
                        <Link href="/">
                            hobanovel
                        </Link>
                    </h1>

                    <div className="hidden lg:flex items-center">
                        <div className="ml-4 relative z-20">
                            <div
                                onClick={() => setIsDropdownGenres(true)}
                                className={`h-[50px] px-3 flex items-center justify-center cursor-pointer ${isDropdownGenres && "bg-slate-200"}`}
                            >
                                Thể loại
                            </div>
                            <div
                                ref={genresDropdownRef}
                                className={`absolute w-[500px] p-4 bg-white drop-shadow-lg ${
                                    isDropdownGenres ? "block" : "hidden"
                                }`}
                            >
                                <ul className="grid grid-cols-2">
                                    {GENRES_VALUE.map((item) => {
                                        return (
                                            <li key={item.id}>
                                                <Link
                                                    className="px-4 py-2 block hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                                                    href={`/tim-truyen${item?.path}` || "/"}
                                                >
                                                    {item.value}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="ml-4 relative z-20">
                            <div
                                onClick={() => setIsDropdownRank(true)}
                                className={`h-[50px] px-3 flex items-center justify-center cursor-pointer ${isDropdownRank && "bg-slate-200"}`}
                            >
                                Bảng xếp hạng
                            </div>
                            <div
                                ref={rankDropdownRef}
                                className={`absolute w-[160px] p-4 bg-white drop-shadow-lg ${
                                    isDropdownRank ? "block" : "hidden"
                                }`}
                            >
                                <ul className="grid grid-cols-1">
                                    {RANK_VALUE.map((item) => {
                                        return (
                                            <li key={item.id}>
                                                <Link
                                                    className="px-4 py-2 block hover:bg-gray-100 cursor-pointer whitespace-nowrap"
                                                    href={`/tim-truyen${item?.path}` || "/"}
                                                >
                                                    {item.value}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        <Link
                            href='/tim-truyen?sort_by=novel_new'
                            className={`px-3 py-1 align-middle`}
                        >
                            Tìm truyện
                        </Link>
                        <SearchInput className="max-w-md"/>
                    </div>


                    <div className="ml-auto">
                                    
                        <ClientOnly>
                            {/* {
                                isAuthenticated ? (
                                    matchesMobile ? (
                                        <div className="relative">
                                            <button onClick={() => setIsNavOver(value => !value)} className={`block rounded-sm ${ isNavOver ? 'bg-[#a68f25]' : 'bg-[#d0b32e]' }`}>
                                                {
                                                    isNavOver ? (
                                                        <i className="w-5 block mx-[10px] my-[8px] fill-white">{iconTimes}</i>
                                                    ) : (
                                                        <i className="w-6 block mx-2 my-[5px] fill-white">{iconBars}</i>
                                                    )
                                                }
                                                
                                            </button>
                                        </div>
                                    ) : (
                                        isAuthenticated ? (
                                            <div className="relative">
                                                <div className="h-[50px] flex items-center">
                                                    <button
                                                        onClick={() => setIsDropdownUser(true)}
                                                        className="w-9 h-9 outline-none rounded-full overflow-hidden shadow align-middle inline-block"
                                                    >
                                                        <BlurImage
                                                            width={40}
                                                            height={40}
                                                            alt="image-demo"
                                                            blurDataURL={placeholderBlurhash}
                                                            className="group-hover:scale-105 group-hover:duration-500 object-cover w-9 h-9"
                                                            placeholder="blur"
                                                            src={
                                                                currentUser.avatarUrl ||
                                                                "/images/avatar-default-2.png"
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                                <div ref={userDropdownRef} className={`${isDropdownUser ? 'block' : 'hidden'} z-20 drop-shadow-lg min-w-[230px] p-3 absolute bg-white top-12 right-0`}>
                                                    <div className="flex items-center mb-3">
                                                        <Image
                                                            width={44}
                                                            height={44}
                                                            alt="image-demo"
                                                            className="w-11 h-11 object-cover"
                                                            src={
                                                                currentUser.thumbnailUrl ||
                                                                "/images/avatar-default-2.png"
                                                            }
                                                        />
                                                        <div className="ml-3 flex-1 line-clamp-1">{currentUser.username}</div>
                                                    </div>
                                                    <ul className="dropdown-content">
                                                        {
                                                            currentUser.username === "admin" ? (
                                                                <li>
                                                                    <Link href={`/admin`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                        Admin
                                                                    </Link>
                                                                </li>
                                                            ) : (
                                                                <li>
                                                                    <Link href={`/user/${currentUser.username}`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                        Hồ sơ
                                                                    </Link>
                                                                </li>
                                                            )
                                                        }
                                                        <li>
                                                            <Link href={`/account`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                Tài khoản
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href={`/search`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                Tìm truyện
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link href={`/creator`} target="_blank" className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                Người sánh tạo
                                                            </Link>
                                                        </li>
                                                        <li onClick={eventLogoutUser} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                            Đăng xuất
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span>
                                                    <Link className="mr-1 px-3 py-1 rounded hover:bg-gray-200" href="/auth/login">
                                                        Đăng nhập
                                                    </Link>
                                                </span>
                                                {"|"}
                                                <span>
                                                    <Link className="ml-1 px-3 py-1 rounded hover:bg-gray-200" href="/auth/register">
                                                        Đăng kí
                                                    </Link>
                                                </span>
                                            </>
                                        )
                                    )
                                ) : (
                                    <>
                                        <span>
                                            <Link className="mr-1 px-3 py-1 rounded hover:bg-gray-200" href="/auth/login">
                                                Đăng nhập
                                            </Link>
                                        </span>
                                        {"|"}
                                        <span>
                                            <Link className="ml-1 px-3 py-1 rounded hover:bg-gray-200" href="/auth/register">
                                                Đăng kí
                                            </Link>
                                        </span>
                                    </>
                                )
                            } */}


                            {   
                                matchesMobile ? (
                                    <div className="relative">
                                        <button onClick={() => setIsNavOver(value => !value)} className={`block rounded-sm ${ isNavOver ? 'bg-[#a68f25]' : 'bg-[#d0b32e]' }`}>
                                            {
                                                isNavOver ? (
                                                    <i className="w-5 block mx-[10px] my-[8px] fill-white">{iconTimes}</i>
                                                ) : (
                                                    <i className="w-6 block mx-2 my-[5px] fill-white">{iconBars}</i>
                                                )
                                            }
                                            
                                        </button>
                                    </div>
                                ) : (
                                    isAuthenticated ? (
                                        <div className="relative">
                                            <div className="h-[50px] flex items-center">
                                                <button
                                                    onClick={() => setIsDropdownUser(true)}
                                                    className="w-9 h-9 outline-none rounded-full overflow-hidden shadow align-middle inline-block"
                                                >
                                                    <BlurImage
                                                        width={40}
                                                        height={40}
                                                        alt="image-demo"
                                                        blurDataURL={placeholderBlurhash}
                                                        className="group-hover:scale-105 group-hover:duration-500 object-cover w-9 h-9"
                                                        placeholder="blur"
                                                        src={
                                                            currentUser.avatarUrl ||
                                                            "/images/avatar-default-2.png"
                                                        }
                                                    />
                                                </button>
                                            </div>
                                            <div ref={userDropdownRef} className={`${isDropdownUser ? 'block' : 'hidden'} z-20 drop-shadow-lg min-w-[230px] p-3 absolute bg-white top-12 right-0`}>
                                                <div className="flex items-center mb-3">
                                                    <Image
                                                        width={44}
                                                        height={44}
                                                        alt="image-demo"
                                                        className="w-11 h-11 object-cover"
                                                        src={
                                                            currentUser.thumbnailUrl ||
                                                            "/images/avatar-default-2.png"
                                                        }
                                                    />
                                                    <div className="ml-3 flex-1 line-clamp-1">{currentUser.username}</div>
                                                </div>
                                                <ul className="dropdown-content">
                                                    {
                                                        currentUser.username === "admin" ? (
                                                            <li>
                                                                <Link href={`/admin`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                    Admin
                                                                </Link>
                                                            </li>
                                                        ) : (
                                                            <li>
                                                                <Link href={`/user/${currentUser.username}`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                    Hồ sơ
                                                                </Link>
                                                            </li>
                                                        )
                                                    }
                                                    <li>
                                                        <Link href={`/account`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                            Tài khoản
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href={`/tim-truyen`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                            Tìm truyện
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href={`/creator`} target="_blank" className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                            Người sánh tạo
                                                        </Link>
                                                    </li>
                                                    <li onClick={eventLogoutUser} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                        Đăng xuất
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <span>
                                                <Link className="mr-1 px-3 py-1 rounded hover:bg-gray-200" href="/auth/login">
                                                    Đăng nhập
                                                </Link>
                                            </span>
                                            {"|"}
                                            <span>
                                                <Link className="ml-1 px-3 py-1 rounded hover:bg-gray-200" href="/auth/register">
                                                    Đăng kí
                                                </Link>
                                            </span>
                                        </>
                                    )
                                )
                            }

                            <NavOver user={currentUser} isShow={isNavOver} handle={() => setIsNavOver(value => !value)} handleLogout={eventLogoutUser}/>

                        </ClientOnly>
                        
                    </div>

                </div>
            </div>

        </header>
    );
};

export default Header;
