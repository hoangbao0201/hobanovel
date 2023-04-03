import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useClickOutSide } from "@/hook/useClickOutSide";
import { GENRES_VALUE, RANK_VALUE } from "@/constants/data";
import BlurImage from "../Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";
import LoadingLayout from "../Layout/LoadingLayout";

const Header = () => {
    const dispatch = useDispatch();
    const { currentUser, userLoading, isAuthenticated } = useSelector(
        (state: any) => state.user
    );

    const genresDropdownRef = useRef<any>();
    const rankDropdownRef = useRef<any>();
    const [isHeader, setIsHeader] = useState(true);
    const [isDropdownGenres, setIsDropdownGenres] = useState(false);
    const [isDropdownRank, setIsDropdownRank] = useState(false);

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

    const handleHiddenDropdown = () => {
        setIsDropdownGenres(false);
        setIsDropdownRank(false);
    };

    useClickOutSide(genresDropdownRef, handleHiddenDropdown);
    useClickOutSide(rankDropdownRef, handleHiddenDropdown);

    return (
        <>
            <div className="w-full h-12"></div>
            <header
                className={`transition-all ${
                    isHeader ? "opacity-100" : "opacity-0 pointer-events-none"
                } bg-neutral-100 fixed top-0 left-0 right-0 z-50 drop-shadow-sm`}
            >
                <div className={`w-full`}>
                    <div className="max-w-7xl mx-auto flex items-center h-12 px-3">
                        <h2 className="text-center align-middle font-semibold text-xl">
                            <Link href="/">HOBANOVEL</Link>
                        </h2>

                        <div className="ml-4 relative">
                            <div
                                onClick={() => setIsDropdownGenres(true)}
                                className={`h-12 px-3 flex items-center justify-center cursor-pointer ${isDropdownGenres && "bg-slate-200"}`}
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
                                className={`h-12 px-3 flex items-center justify-center cursor-pointer ${isDropdownRank && "bg-slate-200"}`}
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

                        <div className="ml-auto">
                            <div className="flex items-center">
                                {userLoading ? (
                                    <LoadingLayout />
                                ) : isAuthenticated ? (
                                    <div>
                                        <Link
                                            href="/"
                                            className="w-9 h-9 rounded-full overflow-hidden shadow align-middle inline-block"
                                        >
                                            <BlurImage
                                                width={200}
                                                height={200}
                                                alt="image-demo"
                                                blurDataURL={placeholderBlurhash}
                                                className="group-hover:scale-105 group-hover:duration-500 object-cover w-9 h-9"
                                                placeholder="blur"
                                                src={
                                                    currentUser.thumbnailUrl ||
                                                    "/images/avatar-default-2.png"
                                                }
                                            />
                                        </Link>
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
