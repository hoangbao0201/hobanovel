import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

// import { useClickOutSide } from "@/hook/useClickOutSide";
import { GENRES_VALUE, RANK_VALUE } from "@/constants/data";
import BlurImage from "../Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";
import { logoutUserHandle } from "@/redux/userSlice";
import { removeAccessToken } from "@/services/cookies.servies";
import { LoadingForm } from "../Layout/LoadingLayout";
import { iconBars } from "../../../public/icons";
import { NavOver } from "./NavOver";
import { useClickOutSide } from "@/hook/useClickOutSide";
import SearchInput from "../Layout/SearchInput";

interface HeaderProps {
    autoHidden?: boolean
}

const Header = ({ autoHidden = true } : HeaderProps) => {

    const router = useRouter()

    const matchesMobile = useMediaQuery("(max-width: 640px)");

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
        <>
            {
                autoHidden && <div className="w-full h-[50px]"></div>
            }
            <header
                // bg-gray-100
                // bg-[#3f3567] 
                className={`bg-gray-100 border-b ${ autoHidden ? 'fixed top-0 left-0 right-0 z-20' : '' } 
                    ${ autoHidden && (isHeader ? "opacity-100" : "opacity-0 pointer-events-none")}`}
            >
                <div className={`w-full`}>
                    <div className="max-w-7xl mx-auto flex items-center h-[50px] px-3">
                        <h2 className="text-center align-middle font-bold text-2xl">
                            <Link href="/">
                                hobanovel
                            </Link>
                            {/* <Link href="/">
                                <Image
                                    width={150}
                                    height={30}
                                    src={"/images/hobanovel-logo.png"}
                                    alt="hobanovel logo"
                                />
                            </Link> */}
                        </h2>

                        <div className="hidden lg:flex items-center">
                            <div className="ml-4 relative">
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
                                    <div className="grid grid-cols-2">
                                        {GENRES_VALUE.map((item) => {
                                            return (
                                                <Link
                                                    key={item.id}
                                                    className="px-4 py-2 block hover:bg-gray-100 cursor-pointer"
                                                    href="/"
                                                >
                                                    <span className="">{item.value}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
    
                            <div className="ml-4 relative">
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
                                    <div className="grid grid-cols-1">
                                        {RANK_VALUE.map((item) => {
                                            return (
                                                <Link
                                                    key={item.id}
                                                    className="px-4 py-2 block hover:bg-gray-100 cursor-pointer"
                                                    href="/"
                                                >
                                                    <span className="">{item.value}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link
                            href='/tim-truyen?sort_by=novel_new'
                            className={`px-3 py-1 align-middle`}
                        >
                            Tìm truyện
                        </Link>

                        {
                            !matchesMobile && <SearchInput />
                        }

                        <div className="ml-auto">
                            <div className="flex items-center">
                                {
                                    userLoading ? (
                                        <LoadingForm />
                                    ) : (
                                        matchesMobile ? (
                                            <div className="relative">
                                                <button onClick={() => setIsNavOver(value => !value)} className="bg-[#d0b32e] rounded-sm flex items-center justify-center py-[5px] px-2">
                                                    <i className="w-6 inline-block fill-white">{iconBars}</i>
                                                </button>
                                            </div>
                                        ) : (
                                            isAuthenticated ? (
                                                <div className="relative">
                                                    <span className="h-[50px] flex items-center">
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
                                                    </span>
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
                                                        <div className="dropdown-content">
                                                            {
                                                                currentUser.username === "admin" ? (
                                                                    <Link href={`/admin`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                        <span className="block w-full">Admin</span>
                                                                    </Link>
                                                                ) : (
                                                                    <Link href={`/user/${currentUser.username}`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                        <span className="block w-full">Hồ sơ</span>
                                                                    </Link>
                                                                )
                                                            }
                                                            <Link href={`/account`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                <span className="block w-full">Tài khoản</span>
                                                            </Link>
                                                            <Link href={`/search`} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                <span className="block w-full">Tìm truyện</span>
                                                            </Link>
                                                            <Link href={`/creator`} target="_blank" className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                <span className="block w-full">Người sánh tạo</span>
                                                            </Link>
                                                            <div onClick={eventLogoutUser} className="hover:bg-gray-100 py-2 px-2 block cursor-pointer">
                                                                Đăng xuất
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <Link className="mr-1" href="/auth/login">
                                                        <h2 className="px-3 py-1 rounded hover:bg-gray-200">
                                                            Đăng nhập
                                                        </h2>
                                                    </Link>
                                                    {"|"}
                                                    <Link className="ml-1" href="/auth/register">
                                                        <h2 className="px-3 py-1 rounded hover:bg-gray-200">
                                                            Đăng kí
                                                        </h2>
                                                    </Link>
                                                </>
                                            )
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <NavOver user={currentUser} isShow={isNavOver} handle={() => setIsNavOver(value => !value)}/>
        </>
    );
};

export default Header;
