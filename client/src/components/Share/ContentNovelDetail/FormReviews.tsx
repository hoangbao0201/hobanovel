import { ChangeEvent, useEffect, useState } from "react";

import { toast } from 'react-toastify';
import { EditorState, convertToRaw } from "draft-js";
import { useSelector } from "react-redux";
import { useMediaQuery } from "usehooks-ts";

import ReviewItem from "./ReviewItem";
import { ReviewType } from "@/types";
import { getAccessToken } from "@/services/cookies.servies";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { iconSend, iconStar } from "../../../../public/icons";
import { addReviewsByDataHandle, destroyReviewsByNovelHandle, getReviewsByNovelHandle } from "@/services/review.services";
import { ListStarLayout } from "@/components/Layout/ListStarLayout";
import { checkValueReviewNovel } from "@/utils/checkValueReviewNovel";





interface StateRatingProps {
    pointPersonality: number
    pointStoryline: number
    pointScene: number
    pointTranslation: number
    isSpoiler: boolean
}

interface FormReviewsProps {
    tab: number;
    novelId: string;
}

// type TypeStateDataValue = Pick<ReviewType, 'pointPersonality' | 'pointSytoryline' | 'pointScene' | 'pointTranslation' | 'isSpoiler'>


const showToastify = (data : any) => {
    return toast.error(<>
        <h4 className="text-base">Lỗi</h4>
        <div dangerouslySetInnerHTML={{ __html: data }} />
    </>, {
        theme: 'colored',
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        className: "text-xs",
        icon: false,
    });
};

const FormReviews = ({ tab, novelId }: FormReviewsProps) => {
    const matchesMobile = useMediaQuery('(max-width: 640px)')

    const { currentUser, isAuthenticated } = useSelector((state: any) => state.user);
    // ---
    const [bodyContent, setBodyContent] = useState<ReviewType[]>([]);
    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

    const getListReviews = async () => {
        if(!novelId) {
            return
        }
        const reviewsResponse = await getReviewsByNovelHandle(`${novelId}?page=1`);
        if (reviewsResponse?.data.success) {
            console.log(reviewsResponse.data.reviews);
            setBodyContent(reviewsResponse.data.reviews);
        }
        setHasLoadedData(true);
    };

    useEffect(() => {
        if (tab === 1 && !hasLoadedData) {
            getListReviews();
            setHasLoadedData(true);
        }
    }, [tab, hasLoadedData]);
    // ---

    const [dataValue, setDataValue] = useState<StateRatingProps>({
        pointPersonality: 0,
        pointStoryline: 0,
        pointScene: 0,
        pointTranslation: 0,
        isSpoiler: false,
    });
    const [commentText, setCommentText] = useState(() => EditorState.createEmpty());

    const eventOnchangeDataValue = (e: ChangeEvent<HTMLInputElement>) => {
        setDataValue({
            ...dataValue,
            [e.target.name]: Number(e.target.value),
        });
    };

    const handleSendReviews = async () => {
        if (!isAuthenticated) {
            console.log("Bạn chưa đăng nhập");
            return;
        }
        
        const isCheckValue = checkValueReviewNovel({ ...dataValue, commentText: JSON.stringify(convertToRaw(commentText.getCurrentContent())) , isRating: true })
        if(!isCheckValue?.success) {
            console.log(isCheckValue)
            showToastify(isCheckValue?.message || "Lỗi trang");
            return
        }

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const commentTextCV = JSON.stringify(convertToRaw(commentText.getCurrentContent()))
            const data = {
                ...dataValue,
                commentText: commentTextCV,
            };

            const reviewResponse = await addReviewsByDataHandle(
                novelId as string,
                data as ReviewType,
                token
            );
            if (!reviewResponse?.success) {reviewResponse
                showToastify(reviewResponse?.message || "Lỗi trang");
                return
            }

            setBodyContent([
                {   
                    ...dataValue,
                    isRating: false,
                    mediumScore: ((dataValue.pointPersonality + dataValue.pointScene + dataValue.pointStoryline + dataValue.pointTranslation)/4),

                    reviewId: reviewResponse.reviewsId,
                    novelId: novelId,
                    name: currentUser.name,
                    userId: currentUser.userId,
                    username: currentUser.username,
                    rank: currentUser.rank,
                    commentText: commentTextCV,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                ...bodyContent,
            ]);

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
            <div className="lg:w-8/12 w-full px-4">

                <div className="mb-5">
                    <ul className="table py-3 mb-4 w-full">
                        <li className="py-2 flex items-center">
                            <span className="w-5/12 line-clamp-1">
                                {
                                    matchesMobile ? "Tính cách" : "Tính cách nhân vật"
                                }
                            </span>
                            <span className="w-full">
                                <input
                                    onChange={eventOnchangeDataValue}
                                    name="pointPersonality"
                                    className="cursor-pointer bg-orange-200 rounded-full appearance-none h-1"
                                    value={dataValue.pointPersonality}
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    type="range"
                                />
                            </span>
                            <span className="flex items-center justify-end font-semibold text-yellow-500 ml-2">
                                <span className="w-[26px] text-end mr-2">{dataValue.pointPersonality}</span>
                                <i className="w-4 h-4 block fill-yellow-400">{iconStar}</i>
                            </span>
                        </li>
                        <li className="py-2 flex items-center">
                            <span className="w-5/12 line-clamp-1">
                                {
                                    matchesMobile ? "Nội dung" : "Nội dung cốt truyện"
                                }
                            </span>
                            <span className="w-full">
                                <input
                                    onChange={eventOnchangeDataValue}
                                    name="pointStoryline"
                                    className="cursor-pointer bg-orange-200 rounded-full appearance-none h-1"
                                    value={dataValue.pointStoryline}
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    type="range"
                                />
                            </span>
                            <span className="flex items-center justify-end font-semibold text-yellow-500 ml-2">
                                <span className="w-[26px] text-end mr-2">{dataValue.pointStoryline}</span>
                                <i className="w-4 h-4 block fill-yellow-400">{iconStar}</i>
                            </span>
                        </li>
                        <li className="py-2 flex items-center">
                            <span className="w-5/12 line-clamp-1">
                                {
                                    matchesMobile ? "Bố cục" : "Bố cục thế giới"
                                }
                            </span>
                            <span className="w-full">
                                <input
                                    onChange={eventOnchangeDataValue}
                                    name="pointScene"
                                    className="cursor-pointer bg-orange-200 rounded-full appearance-none h-1"
                                    value={dataValue.pointScene}
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    type="range"
                                />
                            </span>
                            <span className="flex items-center justify-end font-semibold text-yellow-500 ml-2">
                                <span className="w-[26px] text-end mr-2">{dataValue.pointScene}</span>
                                <i className="w-4 h-4 block fill-yellow-400">{iconStar}</i>
                            </span>
                        </li>
                        <li className="py-2 flex items-center">
                            <span className="w-5/12 line-clamp-1">
                                {
                                    matchesMobile ? "Bản dịch" : "Chất lượng bản dịch"
                                }
                            </span>
                            <span className="w-full">
                                <input
                                    onChange={eventOnchangeDataValue}
                                    name="pointTranslation"
                                    className="cursor-pointer bg-orange-200 rounded-full appearance-none h-1"
                                    value={dataValue.pointTranslation}
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    type="range"
                                />
                            </span>
                            <span className="flex items-center justify-end font-semibold text-yellow-500 ml-2">
                                <span className="w-[26px] text-end mr-2">{dataValue.pointTranslation}</span>
                                <i className="w-4 h-4 block fill-yellow-400">{iconStar}</i>
                            </span>
                        </li>
                        
                        {/* Statistical */}
                        <li className="border-t border-gray-200 mt-4 py-2 flex items-center justify-between">
                            <span className="line-clamp-1 mr-2">Thống kê</span>
                            <div className="font-semibold text-yellow-500 text-lg">
                                <p>{((dataValue.pointPersonality + dataValue.pointScene + dataValue.pointStoryline + dataValue.pointTranslation)/4).toFixed(1)}/5</p>
                                <p> điểm</p>
                            </div>
                        </li>
                    </ul>

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


                <ul className="">
                    {bodyContent &&
                        bodyContent?.map((review) => {
                            return (
                                review ? (
                                    <li key={review?.reviewId}>
                                        <ReviewItem novelId={novelId} review={review} user={currentUser} handleDeleteReview={handleDestroyReview}/>
                                    </li>
                                ) : (
                                    <li></li>
                                )   
                            );
                        })}
                </ul>
            </div>

            <div className="max-lg:hidden lg:w-4/12 px-4">
                <div className="p-4 mb-4 bg-pink-100 rounded">
                    <h3 className="mb-4 text-base font-semibold">Điểm đánh giá</h3>
                    <ul className="lg:text-xs">
                        <li className="flex items-center mb-4">
                            <span className="line-clamp-1">Đã có 3 đánh giá</span>
                            <ListStarLayout size={3} className="ml-auto mr-2"/>
                            <span className="w-9 text-end">5.00</span>
                        </li>
                        <li className="flex items-center mb-4">
                            <span className="line-clamp-1">Tính cách nhân vật</span>
                            <ListStarLayout size={3} className="ml-auto mr-2"/>
                            <span className="w-9 text-end">4.71</span>
                        </li>
                        <li className="flex items-center mb-4">
                            <span className="line-clamp-1">Nội dung cốt truyện</span>
                            <ListStarLayout size={3} className="ml-auto mr-2"/>
                            <span className="w-9 text-end">4.78</span>
                        </li>
                        <li className="flex items-center mb-4">
                            <span className="line-clamp-1">Bố cục thế giới</span>
                            <ListStarLayout size={3} className="ml-auto mr-2"/>
                            <span className="w-9 text-end">4.85</span>
                        </li>
                        <li className="flex items-center mb-4">
                            <span className="line-clamp-1">Chất lượng bản dịch</span>
                            <ListStarLayout size={3} className="ml-auto mr-2"/>
                            <span className="w-9 text-end">4.98</span>
                        </li>
                    </ul>
                </div>
                <div className="bg-pink-100 px-4 py-4">
                    <h3 className="mb-4 text-base font-semibold">Lưu ý khi đánh giá</h3>
                    <ul className="text-sm">
    
                        <li className="mb-5">1. Không được dẫn link hoặc nhắc đến website khác</li>
    
                        <li className="mb-5">2. Không được có những từ ngữ gay gắt, đả kích, xúc phạm người khác</li>
    
                        <li className="mb-5">3. Đánh giá hoặc bình luận không liên quan tới truyện sẽ bị xóa</li>
    
                        <li className="mb-5">4. Đánh giá hoặc bình luận chê truyện một cách chung chung không mang lại giá trị cho người đọc sẽ bị xóa</li>
    
                        <li className="mb-5">5. Đánh giá có điểm số sai lệch với nội dung sẽ bị xóa</li>
    
                        <li>
                            <i>Vui lòng xem và tuân theo đầy đủ các quy định tại Điều Khoản Dịch Vụ khi sử dụng website</i>
                        </li>
                    </ul>
                </div>
                {/* <div className="">
                </div>

                <div className="">
                    <div className="bg-pink-100 px-4 py-4 text-sm">
                        <h3 className="mb-5 text-base font-semibold">Lưu ý khi đánh giá</h3>
                        <h4 className="mb-5">1. Không được dẫn link hoặc nhắc đến website khác</h4>
    
                        <h4 className="mb-5">2. Không được có những từ ngữ gay gắt, đả kích, xúc phạm người khác</h4>
    
                        <h4 className="mb-5">3. Đánh giá hoặc bình luận không liên quan tới truyện sẽ bị xóa</h4>
    
                        <h4 className="mb-5">4. Đánh giá hoặc bình luận chê truyện một cách chung chung không mang lại giá trị cho người đọc sẽ bị xóa</h4>
    
                        <h4 className="mb-5">5. Đánh giá có điểm số sai lệch với nội dung sẽ bị xóa</h4>
    
                        <i>Vui lòng xem và tuân theo đầy đủ các quy định tại Điều Khoản Dịch Vụ khi sử dụng website</i>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default FormReviews;
