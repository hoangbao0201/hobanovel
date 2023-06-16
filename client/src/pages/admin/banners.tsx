import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { ReactNode, useEffect, useRef, useState } from "react";

import Select from "react-select";

import AdminLayout from "@/components/Layout/AdminLayout";
import { addBannersHandle, getMultipleBannersHandle } from "@/services/banners.services";
import { getAccessToken } from "@/services/cookies.servies";
import { BannersType, NovelType } from "@/types";
import { LoadingButton, LoadingSearch } from "@/components/Layout/LoadingLayout";
import BlurImage from "@/components/Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";
import { useDebounce } from "@/hook/useDebounce";
import { getNovelsByDataHandle } from "@/services/novels.services";
import { iconClose, iconPlus } from "../../../public/icons";


type BannersCreateType = Pick<
    BannersType,
    | "novelId"
    | "bannersId"
    | "bannersUrl"
    | "imageBlurHash"
    | "bannersPublicId"
    | "createdAt"
    | "updatedAt"
    | "title"
>;

interface AdminBannersPageProps {
    banners: BannersCreateType[]
    bannersMobile: BannersCreateType[]
}

const dataConditionSearchNovel = [
    { label: "TÊN TRUYỆN", text: "tên truyện", value: "title" },
    { label: "ID TRUYỆN", text: "id truyện",  value: "novelId" },
    { label: "ID TÁC GIẢ", text: "id tác giả", value: "userId" },
];

const AdminBannersPage = ({ banners, bannersMobile }: AdminBannersPageProps) => {
    const [dataImage, setDataImage] = useState(null);
    const [listBanners, setListBanners] = useState<BannersCreateType[]>(banners || []);
    const [listBannersMobile, setListBannersMobile] = useState<BannersCreateType[]>(bannersMobile || []);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [urlNewImage, setUrlNewImage] = useState<null | string>(null);

    const [optionSearchNovel, setOptionSearchNovel] = useState<{
        value: string;
        text: string
        label: string;
    }>({ label: "TÊN TRUYỆN", text: "tên truyện", value: "title" });
    const [valueInputSearch, setValueInputSearch] = useState<string>("");
    const [idNovelSelect, setIdNovelSelect] = useState<string | null>(null)
    const [resultListNovelsSearch, setResultListNovelsSearch] = useState<NovelType[] | null>(null);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isDropdown, setIsDropdown] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false)

    const textDebounce = useDebounce(valueInputSearch, 500);

    //------

    const eventOnChangeBanners = async (e: any) => {
        const dataImage = e.target.files[0];
        setDataImage(dataImage);
        setUrlNewImage(URL.createObjectURL(dataImage));
    };

    const handleUploadBanners = async () => {
        const token = getAccessToken();
        if (!dataImage || !token || !valueInputSearch || !idNovelSelect) {
            console.log("Data not found");
            return;
        }

        setIsLoadingButton(true);

        const formData = new FormData();
        formData.append("file", dataImage);

        try {
            const dataBanners = {
                novelId: idNovelSelect,
                token,
                formData,
                isMobile
            };

            console.log(isMobile)
            const uploadBanners: any = await addBannersHandle(
                dataBanners as Pick<BannersType, 'novelId' | 'isMobile'> & { token: string; formData: FormData }
            );

            if (uploadBanners?.data?.success) {
                const banners  = uploadBanners;
                if(isMobile) {
                    setListBannersMobile([
                        {   
                            title: valueInputSearch || "Lỗi hiển thị",
                            novelId: idNovelSelect || "1",
                            bannersId: banners.bannersId,
                            bannersUrl: urlNewImage || "",
                            imageBlurHash: banners.imageBlurHash,
                            bannersPublicId: banners.bannersPublicId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        ...listBannersMobile,
                    ]) as any;
                }    
                else {
                    setListBanners([
                        {   
                            title: valueInputSearch || "Lỗi hiển thị",
                            novelId: idNovelSelect || "1",
                            bannersId: banners.bannersId,
                            bannersUrl: urlNewImage || "",
                            imageBlurHash: banners.imageBlurHash,
                            bannersPublicId: banners.bannersPublicId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        ...listBanners,
                    ]) as any;
                }
            }

            // SET STATE DEFAULT
            setIsLoadingButton(false);
            setUrlNewImage(null);
            setDataImage(null);
        } catch (error) {
            console.log(error);
            setIsLoadingButton(false);
        }
    };

    // search novels
    const eventSearchNovels = async (value: string) => {
        try {
            setIsLoadingSearch(true);
            const dataNovel: Partial<NovelType> & { page: number } = {
                [optionSearchNovel.value]: value,
                page: 1,
            };
            const novelsRes = await getNovelsByDataHandle(dataNovel as any);

            if (novelsRes?.data?.success) {
                setResultListNovelsSearch(novelsRes?.data.novels);
            }
            else {
                setResultListNovelsSearch([])
            }
            setIsLoadingSearch(false);
            
        } catch (error) {
            setIsLoadingSearch(false);
            setResultListNovelsSearch([])
            console.log(error);
        }
    };
    useEffect(() => {
        if (textDebounce === "") {
            setResultListNovelsSearch(null);
            setIdNovelSelect(null);
        } else if (isDropdown && textDebounce) {
            eventSearchNovels(textDebounce);
            setIsLoadingSearch(true);
            setIdNovelSelect(null);
        }

    }, [textDebounce]);
    const eventDeleteValueInputSearch = () => {
        setValueInputSearch("");
        setResultListNovelsSearch(null);
        setIsLoadingSearch(false);
        setIdNovelSelect(null)
    };
    // ----


    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event : any) => {
        if (
            dropdownRef.current && !dropdownRef.current?.contains(event.target) &&
            inputRef.current && !inputRef.current?.contains(event.target)
        ) {
            setIsDropdown(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    console.log("Banners mobile: ", banners)

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <div>
                    <div className="">
                        <div className="mr-8 mb-7 max-w-2xl w-full">
                            <h3 className="mb-2 ml-2 font-semibold">Tìm kiếm truyện</h3>
                            <div className="relative">
                                <div className="flex w-full">
                                    <Select
                                        isSearchable={false}
                                        defaultValue={dataConditionSearchNovel[0]}
                                        className="h-10 max-w-[150px] w-full text-sm"
                                        options={dataConditionSearchNovel}
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                outline: "none",
                                                boxShadow: "none",
                                                borderRadius: "0px",
                                                height: "40px",
                                            }),
                                        }}
                                        onChange={(select: any) =>{
                                            setOptionSearchNovel(select)
                                            setValueInputSearch("")
                                        }}
                                    />

                                    {/* INPUT SEARCH */}
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            ref={inputRef}
                                            className="group relative border border-gray-300 flex-1 w-full h-10 px-4 focus:border-blue-500 focus:outline-none"
                                            value={valueInputSearch}
                                            placeholder={`Tìm kiếm theo ${optionSearchNovel.text}`}
                                            onFocus={() => setIsDropdown(true)}
                                            onChange={(e: any) =>{
                                                setValueInputSearch(e.target.value);
                                            }}
                                        />
                                        <span className="absolute transition-all w-10 h-10 flex items-center justify-center top-0 right-0">
                                            {valueInputSearch !== "" &&
                                                (!isLoadingSearch ? (
                                                    <button
                                                        onClick={() => {
                                                            eventDeleteValueInputSearch();
                                                            inputRef.current?.focus()
                                                        }}
                                                        className=""
                                                    >
                                                        <i className="w-3 fill-gray-600 block">
                                                            {iconClose}
                                                        </i>
                                                    </button>
                                                ) : (
                                                    <LoadingSearch />
                                                ))}
                                        </span>
                                    </div>
                                    {/* DROPDOWN LIST NOVELS */}
                                    {
                                        resultListNovelsSearch && textDebounce && isDropdown && (
                                            <div
                                                ref={dropdownRef}
                                                className="absolute transition-all top-12 z-10 min-h-[50px] w-full border rounded-md bg-white shadow-md px-2 py-2"
                                            >
                                                {
                                                    resultListNovelsSearch.length > 0 ? (
                                                        <div>
                                                            {resultListNovelsSearch.map((novel) => {
                                                                return (
                                                                    <div
                                                                        key={novel.novelId}
                                                                        onClick={() => {
                                                                            setValueInputSearch(novel.title);
                                                                            setIsDropdown(false)
                                                                            setResultListNovelsSearch([novel])
                                                                            setIdNovelSelect(novel.novelId)
                                                                        }}
                                                                        className="transition-all flex cursor-pointer hover:bg-gray-100 p-3"
                                                                    >
                                                                        <div className="relative w-10 h-16 overflow-hidden shadow">
                                                                            <Image
                                                                                width={85}
                                                                                height={125}
                                                                                alt="Image-novel"
                                                                                className="object-cover h-full w-full"
                                                                                src={
                                                                                    novel.thumbnailUrl ||
                                                                                    "/images/novel-default.png"
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <h3 className="uppercase font-semibold">{novel.title}</h3>
                                                                            <span>{JSON.stringify(novel.novelId)}</span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div>Không tìm thấy truyện</div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }


                                    <Select
                                        isSearchable={false}
                                        defaultValue={{ label: "Banners máy tính", text: "Banners máy tính", value: "BannerMobile" }}
                                        className="h-10 max-w-[180px] w-full text-sm"
                                        options={[
                                            { label: "Banners máy tính", text: "Banners máy tính", value: "0" },
                                            { label: "Banner điện thoại", text: "Banner điện thoại",  value: "1" }
                                        ]}
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                outline: "none",
                                                boxShadow: "none",
                                                borderRadius: "0px",
                                                height: "40px",
                                            }),
                                        }}
                                        onChange={(select: any) =>{
                                            setIsMobile(select.value === '0' ? false : true)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="select-none">
                            <label
                                htmlFor="inputUploadBanners"
                                className={`${idNovelSelect !== null ? "group hover:bg-gray-200 hover:border-[#888] bg-gray-100 cursor-pointer" : "group bg-gray-200"} transition-all relative w-64 h-28 flex justify-center items-center mb-3 border-dashed border-2 rounded-md overflow-hidden`}
                            >
                                {urlNewImage ? (
                                    <Image
                                        width={400}
                                        height={200}
                                        src={urlNewImage}
                                        alt="image new banners"
                                        className="object-cover h-full w-full"
                                    />
                                ) : (
                                    <span className={`${idNovelSelect !== null ? "group-hover:scale-125 fill-gray-500" : "fill-gray-400"} transition-all ease-linear  w-4`}>{iconPlus}</span>
                                )}
                            </label>
                            {idNovelSelect !== null ? (
                                <input
                                    id="inputUploadBanners"
                                    className="hidden"
                                    onChange={eventOnChangeBanners}
                                    type="file"
                                />
                            ) : null}

                            <button
                                className="py-1 px-2 border rounded-md text-white bg-blue-500 flex items-center"
                                onClick={handleUploadBanners}
                            >
                                {isLoadingButton && <LoadingButton />} Upload
                            </button>
                        </div>
                    </div>

                    <div className="flex">
                        {bannersMobile &&
                            listBannersMobile.map((itemBanner) => {
                                return (
                                    <div key={itemBanner.bannersId} className="border-b pb-3">
                                        <div
                                            className="relative w-80 h-40 block border rounded-md shadow overflow-hidden"
                                        >
                                            <BlurImage
                                                width={400}
                                                height={300}
                                                alt="image-demo"
                                                blurDataURL={
                                                    itemBanner.imageBlurHash ||
                                                    placeholderBlurhash
                                                }
                                                className="group-hover:scale-105 group-hover:duration-500 object-cover h-full w-full"
                                                placeholder="blur"
                                                src={
                                                    itemBanner.bannersUrl ||
                                                    "/images/novel-default.png"
                                                }
                                            />
                                        </div>
                                        <h3 className="text-gray-900 text-base text-center font-semibold mt-1">
                                            {itemBanner.title} - {itemBanner.bannersId}
                                        </h3>
                                    </div>
                                );
                            })}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-6">
                        {banners &&
                            listBanners.map((itemBanner) => {
                                return (
                                    <div key={itemBanner.bannersId} className="border-b pb-3">
                                        <div
                                            className="relative w-68 h-28 block border rounded-md shadow overflow-hidden"
                                        >
                                            <BlurImage
                                                width={400}
                                                height={200}
                                                alt="image-demo"
                                                blurDataURL={
                                                    itemBanner.imageBlurHash ||
                                                    placeholderBlurhash
                                                }
                                                className="group-hover:scale-105 group-hover:duration-500 object-cover h-full w-full"
                                                placeholder="blur"
                                                src={
                                                    itemBanner.bannersUrl ||
                                                    "/images/novel-default.png"
                                                }
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.onerror = null;
                                                    target.src = "/images/novel-default.png"
                                                    target.alt = "image default"
                                                }}
                                            />
                                        </div>
                                        <h3 className="text-gray-900 text-base text-center font-semibold mt-1">
                                            {itemBanner.title} - {itemBanner.bannersId}
                                        </h3>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </main>
        </>
    );
};

export default AdminBannersPage;

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const bannersResponse = await getMultipleBannersHandle();
        const bannersMobile = await getMultipleBannersHandle("?isMobile=1");

        if (bannersResponse?.data.success && bannersMobile?.data.success) {
            return {
                props: {
                    banners: JSON.parse(JSON.stringify(bannersResponse.data?.banners)),
                    bannersMobile: JSON.parse(JSON.stringify(bannersMobile.data?.banners)),
                },
            };
        }
        return { notFound: true };
    } catch (error) {
        return { notFound: true };
    }
};

AdminBannersPage.getLayout = (page: ReactNode) => {
    return <AdminLayout>{page}</AdminLayout>;
};
