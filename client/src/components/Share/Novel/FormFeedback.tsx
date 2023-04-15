import Link from "next/link";
import { useEffect, useState } from "react";

import { ReviewType } from "@/types";
import { useSelector } from "react-redux";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import { getAccessToken } from "@/services/cookies.servies";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { iconPaperPlane, iconStar, iconTrash } from "../../../../public/icons";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { addReviewsByDataHandle, destroyReviewsByNovelHandle, getReviewsByNovelHandle } from "@/services/review.services";

interface FormFeedbackProps {
    tab?: number;
    novelId?: string;
}

const FormFeedback = ({ tab, novelId }: FormFeedbackProps) => {
    const { currentUser, isAuthenticated } = useSelector((state: any) => state.user);
    // ---
    const [bodyContent, setBodyContent] = useState<Partial<ReviewType[]>>([]);
    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

    const getListReviews = async () => {
        const reviewsResponse = await getReviewsByNovelHandle(novelId as string);
        if (reviewsResponse?.data.success) {
            console.log(reviewsResponse.data.reviews);
            setBodyContent(reviewsResponse.data.reviews);
        }
        setHasLoadedData(true);
    };

    useEffect(() => {
        if (tab === 2 && !hasLoadedData) {
            getListReviews();
            setHasLoadedData(true);
        }
    }, [tab, hasLoadedData]);
    // ---

    const [dataValue, setDataValue] = useState<Partial<ReviewType>>({
        pointPersonality: 5,
        pointStoryline: 5,
        pointScene: 5,
        pointTranslation: 5,
        isSpoiler: false,
    });
    const [commentText, setCommentText] = useState(() => EditorState.createEmpty());

    const eventOnchangeDataValue = (e: any) => {
        setDataValue({
            ...dataValue,
            [e.target.name]: e.target.value,
        });
    };

    const handleSendReviews = async () => {
        if (!isAuthenticated) {
            console.log("Bạn chưa đăng nhập");
            return;
        }
        if (!commentText) {
            console.log("Data not found");
            return;
        }

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const data = {
                ...dataValue,
                commentText: JSON.stringify(convertToRaw(commentText.getCurrentContent())),
            };

            const reviewResponse = await addReviewsByDataHandle(
                novelId as string,
                data as ReviewType,
                token
            );
            if (reviewResponse?.data.success) {
                console.log("insert review: ", reviewResponse.data)
                setBodyContent([
                    {
                        ...reviewResponse.data.reviews,
                        name: currentUser.name,
                    },
                    ...bodyContent,
                ]);
                console.log(reviewResponse.data);
            }

            setCommentText(EditorState.createEmpty());
        } catch (error) {
            setCommentText(EditorState.createEmpty());
            console.log(error);
        }
    };

    const handleDestroyReview = async (userId: string, reviewId: string) => {
        if(currentUser?.userId !== userId) {
            return;
        }
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const reviewResponse = await destroyReviewsByNovelHandle(reviewId, token);
            if(reviewResponse?.data.success) {
                const filterReviews = bodyContent.filter((review) => review?.reviewId !== reviewId)
                setBodyContent(filterReviews);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex">
            <div className="w-8/12 p-5 -ml-5 relative">
                <div className="bg-orange-800 bg-opacity-5 mb-7">
                    <div className="p-5">
                        <div className="flex items-center transition-all ease-linear mb-4">
                            <h4 className="min-w-[30%]">Tính cách nhân vật</h4>
                            <input
                                onChange={eventOnchangeDataValue}
                                name="pointPersonality"
                                id="my-range"
                                style={{}}
                                className="w-full h-1 flex-1 cursor-pointer bg-orange-200 rounded-full appearance-none my-range"
                                value={dataValue.pointPersonality}
                                min="0"
                                max="5"
                                step="0.5"
                                type="range"
                            />
                            <span className="flex items-center font-semibold text-yellow-500 text-lg ml-3 text-center min-w-[30px]">
                                {dataValue.pointPersonality}
                            </span>
                            <i className="w-4 ml-2 block fill-yellow-400">{iconStar}</i>
                        </div>
                        <div className="flex items-center transition-all ease-linear mb-4">
                            <h4 className="min-w-[30%]">Nội dung cốt truyện</h4>
                            <input
                                onChange={eventOnchangeDataValue}
                                name="pointStoryline"
                                className="w-full h-1 flex-1 cursor-pointer bg-orange-200 rounded-full appearance-none"
                                value={dataValue.pointStoryline}
                                min="0"
                                max="5"
                                step="0.5"
                                type="range"
                            />
                            <span className="flex items-center font-semibold text-yellow-500 text-lg ml-3 text-center min-w-[30px]">
                                {dataValue.pointStoryline}
                            </span>
                            <i className="w-4 ml-2 block fill-yellow-400">{iconStar}</i>
                        </div>
                        <div className="flex items-center transition-all ease-linear mb-4">
                            <h4 className="min-w-[30%]">Bố cục thế giới</h4>
                            <input
                                onChange={eventOnchangeDataValue}
                                name="pointScene"
                                className="w-full h-1 flex-1 cursor-pointer bg-orange-200 rounded-full appearance-none"
                                value={dataValue.pointScene}
                                min="0"
                                max="5"
                                step="0.5"
                                type="range"
                            />
                            <span className="flex items-center font-semibold text-yellow-500 text-lg ml-3 text-center min-w-[30px]">
                                {dataValue.pointScene}
                            </span>
                            <i className="w-4 ml-2 block fill-yellow-400">{iconStar}</i>
                        </div>
                        <div className="flex items-center transition-all ease-linear mb-4">
                            <h4 className="min-w-[30%]">Chất lượng bản dịch</h4>
                            <input
                                onChange={eventOnchangeDataValue}
                                name="pointTranslation"
                                className="w-full h-1 flex-1 cursor-pointer bg-orange-200 rounded-full appearance-none"
                                value={dataValue.pointTranslation}
                                min="0"
                                max="5"
                                step="0.5"
                                type="range"
                            />
                            <span className="flex items-center font-semibold text-yellow-500 text-lg ml-3 text-center min-w-[30px]">
                                {dataValue.pointTranslation}
                            </span>
                            <i className="w-4 ml-2 block fill-yellow-400">{iconStar}</i>
                        </div>
                    </div>
                    <div className="py-3 pl-4 pr-24 border-4 border-orange-800 border-opacity-5 rounded-md relative">
                        <EditorStyle
                            name="comment"
                            text={commentText}
                            handleOnchange={setCommentText}
                        />
                        <button
                            onClick={handleSendReviews}
                            className="p-3 bg-yellow-600 rounded-full absolute bottom-4 right-4"
                        >
                            <i className="w-8 h-8 fill-white block">{iconPaperPlane}</i>
                        </button>
                    </div>
                </div>

                <div className="transition-all ease-linear">
                    {
                        // JSON.stringify(commentText.getCurrentContent())
                        // <div dangerouslySetInnerHTML={{__html: convertToHTML(commentText.getCurrentContent())}}></div>
                        // <div dangerouslySetInnerHTML={{__html: JSON.stringify(convertFromHTML(commentText.getCurrentContent()))}}></div>
                        // <div>{convertToHTML()}</div>
                    }

                    {bodyContent &&
                        bodyContent?.map((review) => {
                            return (
                                <div
                                    key={review?.reviewId || ""}
                                    className="border-b-2 border-gray-100"
                                >
                                    <div className="p-4 rounded-lg bg-gray-100 border my-4">
                                        <div className="flex mb-6">
                                            <Link
                                                href={`/user/1`}
                                                className="w-11 h-11 mt-2 rounded-full overflow-hidden shadow align-middle inline-block"
                                            >
                                                <BlurImage
                                                    width={500}
                                                    height={500}
                                                    alt="image-demo"
                                                    blurDataURL={placeholderBlurhash}
                                                    className="group-hover:scale-105 group-hover:duration-500 object-cover w-11 h-11"
                                                    placeholder="blur"
                                                    src="/images/avatar-default-2.png"
                                                />
                                            </Link>
                                            <div className="flex-1 ml-4">
                                                <h2 className="line-clamp-1 text-base w-full font-semibold mb-2">
                                                    <Link href={""}>{review?.name || ""}</Link>
                                                </h2>
                                                <div className="flex items-center mb-4 w">
                                                    <div className="gap-1 relative">
                                                        <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                                            {iconStar}
                                                        </i>
                                                        <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                                            {iconStar}
                                                        </i>
                                                        <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                                            {iconStar}
                                                        </i>
                                                        <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                                            {iconStar}
                                                        </i>
                                                        <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                                            {iconStar}
                                                        </i>

                                                        <div
                                                            style={{
                                                                width: `${
                                                                    review
                                                                        ? (review?.mediumScore * 20) ?? 100
                                                                        : 100
                                                                }%`,
                                                            }}
                                                            className="max-w-full block whitespace-nowrap overflow-hidden absolute gap-1 top-0 left-0 right-0 bottom-0"
                                                        >
                                                            <i className="w-4 mx-1 inline-block fill-yellow-500">
                                                                {iconStar}
                                                            </i>
                                                            <i className="w-4 mx-1 inline-block fill-yellow-500">
                                                                {iconStar}
                                                            </i>
                                                            <i className="w-4 mx-1 inline-block fill-yellow-500">
                                                                {iconStar}
                                                            </i>
                                                            <i className="w-4 mx-1 inline-block fill-yellow-500">
                                                                {iconStar}
                                                            </i>
                                                            <i className="w-4 mx-1 inline-block fill-yellow-500">
                                                                {iconStar}
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-gray-600 text-base">
                                                    {convertFromRaw(
                                                        JSON.parse(review?.commentText || "")
                                                    ).getPlainText()}
                                                    {/* <div dangerouslySetInnerHTML={{__html: convertFromRaw(JSON.parse(review?.commentText || "")).getCurrentContent().getPlainText("\n")}} /> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {
                                                currentUser?.userId == review?.userId && (
                                                    <div className="flex justify-end">
                                                        <button onClick={() => handleDestroyReview(review?.userId as string, review?.reviewId as string)} className="p-2 border rounded">
                                                            <i className="w-4 h-4 block fill-gray-700">{iconTrash}</i>
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
            <div className="w-4/12 p-5 -ml-5 relative">r</div>
        </div>
    );
};

export default FormFeedback;
