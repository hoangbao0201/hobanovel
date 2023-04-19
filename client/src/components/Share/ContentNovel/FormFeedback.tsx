import Link from "next/link";
import { useEffect, useState } from "react";

import { ReviewType } from "@/types";
import { useSelector } from "react-redux";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import { getAccessToken } from "@/services/cookies.servies";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { iconPaperPlane, iconSend, iconShare, iconStar, iconTrash } from "../../../../public/icons";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { addReviewsByDataHandle, destroyReviewsByNovelHandle, getReviewsByNovelHandle } from "@/services/review.services";
import ReviewItem from "./ReviewItem";

interface FormFeedbackProps {
    tab?: number;
    novelId?: string;
}

const FormFeedback = ({ tab, novelId }: FormFeedbackProps) => {
    const { currentUser, isAuthenticated } = useSelector((state: any) => state.user);
    // ---
    const [bodyContent, setBodyContent] = useState<Partial<ReviewType[]>>([]);
    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);
    const [tabRepComment, setTabRepComment] = useState<null | string>(null);

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
                            className="py-2 px-4 transition-all bg-yellow-600 hover:bg-yellow-700 absolute bottom-4 right-4"
                        >
                            <i className="w-6 h-6 fill-white block translate-x-[1px]">{iconSend}</i>
                        </button>
                    </div>
                </div>

                <div className="transition-all ease-linear">
                    {bodyContent &&
                        bodyContent?.map((review) => {
                            return (
                                <ReviewItem key={review?.reviewId} review={review} user={currentUser} handleDeleteReview={handleDestroyReview}/>
                            );
                        })}
                </div>
            </div>
            <div className="w-4/12 p-5 -ml-5 relative">r</div>
        </div>
    );
};

export default FormFeedback;
