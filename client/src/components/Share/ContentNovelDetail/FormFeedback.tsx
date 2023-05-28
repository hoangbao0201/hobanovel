import { useEffect, useState } from "react";

import ReviewItem from "./ReviewItem";
import { useSelector } from "react-redux";
import { ReviewType } from "@/types";
import { EditorState, convertToRaw } from "draft-js";
import { getAccessToken } from "@/services/cookies.servies";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { iconSend, iconStar } from "../../../../public/icons";
import { addReviewsByDataHandle, destroyReviewsByNovelHandle, getReviewsByNovelHandle } from "@/services/review.services";
import { ListStarLayout } from "@/components/Layout/ListStarLayout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkValueReviewNovel } from "@/utils/checkValueReviewNovel";
import { useMediaQuery } from "usehooks-ts";

interface FormFeedbackProps {
    tab?: number;
    novelId?: string;
}

type TypeStateDataValue = Pick<ReviewType, 'pointPersonality' | 'pointStoryline' | 'pointScene' | 'pointTranslation' | 'isSpoiler'>

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

const FormFeedback = ({ tab, novelId }: FormFeedbackProps) => {
    const matchesMobile = useMediaQuery('(max-width: 640px)')
    const matchesTablet = useMediaQuery('(max-width: 1024px)')

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

    const [dataValue, setDataValue] = useState<TypeStateDataValue>({
        pointPersonality: 0,
        pointStoryline: 0,
        pointScene: 0,
        pointTranslation: 0,
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

            const data = {
                ...dataValue,
                commentText: JSON.stringify(convertToRaw(commentText.getCurrentContent())),
            };

            const reviewResponse = await addReviewsByDataHandle(
                novelId as string,
                data as ReviewType,
                token
            );
            if (!reviewResponse?.success) {
                // console.log("new: ", reviewResponse?.data)
                showToastify(reviewResponse?.message || "Lỗi trang");
                // setCommentText(EditorState.createEmpty());
                return
            }

            setBodyContent([
                {
                    ...reviewResponse.reviews,
                    name: currentUser.name,
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
            console.log(reviewResponse)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="flex">
                <div className="lg:w-8/12 relative flex-1">
                    <div className="px-3">

                        <div className="bg-orange-800/5">
                            <table className="grid py-3 px-3 w-full">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="w-1/2 whitespace-nowrap pr-3">Tính cách nhân vật</td>
                                        <td className="w-3/4">
                                            <input
                                                onChange={eventOnchangeDataValue}
                                                name="pointPersonality"
                                                className="lg:w-full h-1 cursor-pointer bg-orange-200 rounded-full appearance-none w-full"
                                                value={dataValue.pointPersonality}
                                                min="0"
                                                max="5"
                                                step="0.5"
                                                type="range"
                                            />
                                        </td>
                                        <td className="w-1/4 text-right flex items-center">
                                            <span className="font-semibold text-yellow-500 text-lg ml-3 min-w-[30px]">
                                                {dataValue.pointPersonality}
                                            </span>
                                            <i className="lg:block w-4 ml-2 hidden fill-yellow-400">{iconStar}</i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/2 whitespace-nowrap pr-3">Nội dung cốt truyện</td>
                                        <td className="w-3/4">
                                            <input
                                                onChange={eventOnchangeDataValue}
                                                name="pointStoryline"
                                                className="lg:w-full h-1 cursor-pointer bg-orange-200 rounded-full appearance-none w-full"
                                                value={dataValue.pointStoryline}
                                                min="0"
                                                max="5"
                                                step="0.5"
                                                type="range"
                                            />
                                        </td>
                                        <td className="w-1/4 text-right flex items-center">
                                            <span className="font-semibold text-yellow-500 text-lg ml-3 min-w-[30px]">
                                                {dataValue.pointStoryline}
                                            </span>
                                            <i className="lg:block w-4 ml-2 hidden fill-yellow-400">{iconStar}</i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/2 whitespace-nowrap pr-3">Bố cục thế giới</td>
                                        <td className="w-3/4">
                                            <input
                                                onChange={eventOnchangeDataValue}
                                                name="pointScene"
                                                className="lg:w-full h-1 cursor-pointer bg-orange-200 rounded-full appearance-none w-full"
                                                value={dataValue.pointScene}
                                                min="0"
                                                max="5"
                                                step="0.5"
                                                type="range"
                                            />
                                        </td>
                                        <td className="w-1/4 text-right flex items-center">
                                            <span className="font-semibold text-yellow-500 text-lg ml-3 min-w-[30px]">
                                                {dataValue.pointScene}
                                            </span>
                                            <i className="lg:block w-4 ml-2 hidden fill-yellow-400">{iconStar}</i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/2 whitespace-nowrap pr-3">Chất lượng bản dịch</td>
                                        <td className="w-3/4">
                                            <input
                                                onChange={eventOnchangeDataValue}
                                                name="pointTranslation"
                                                className="lg:w-full h-1 cursor-pointer bg-orange-200 rounded-full appearance-none w-full"
                                                value={dataValue.pointTranslation}
                                                min="0"
                                                max="5"
                                                step="0.5"
                                                type="range"
                                            />
                                        </td>
                                        <td className="w-1/4 text-right flex items-center">
                                            <span className="font-semibold text-yellow-500 text-lg ml-3 min-w-[30px]">
                                                {dataValue.pointTranslation}
                                            </span>
                                            <i className="lg:block w-4 ml-2 hidden fill-yellow-400">{iconStar}</i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
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

                    </div>
    
                    <div className="transition-all ease-linear px-3 grid">
                        {bodyContent &&
                            bodyContent?.map((review) => {
                                return (
                                    review ? (
                                        <ReviewItem key={review?.reviewId} novelId={novelId} review={review} user={currentUser} handleDeleteReview={handleDestroyReview}/>
                                    ) : (
                                        <div></div>
                                    )   
                                );
                            })}
                    </div>
                </div>

                <div className="lg:block hidden w-4/12 relative px-3">
                    <div className="bg-pink-100 px-5 py-4 mb-7">
                        <div className="flex items-center py-2 text-base">
                            <span>Đã có 3 đánh giá</span>
                            <ListStarLayout className="ml-auto mr-2"/>
                            <span className="w-9 text-end">5.00</span>
                        </div>
                        <div className="flex items-center py-2 text-sm">
                            <span>Tính cách nhân vật</span>
                            <ListStarLayout className="ml-auto mr-2"/>
                            <span className="w-9 text-end">4.71</span>
                        </div>
                        <div className="flex items-center py-2 text-sm">
                            <span>Nội dung cốt truyện</span>
                            <ListStarLayout className="ml-auto mr-2"/>
                            <span className="w-9 text-end">4.78</span>
                        </div>
                        <div className="flex items-center py-2 text-sm">
                            <span>Bố cục thế giới</span>
                            <ListStarLayout className="ml-auto mr-2"/>
                            <span className="w-9 text-end">4.85</span>
                        </div>
                        <div className="flex items-center py-2 text-sm">
                            <span>Chất lượng bản dịch</span>
                            <ListStarLayout className="ml-auto mr-2"/>
                            <span className="w-9 text-end">4.98</span>
                        </div>
                    </div>
    
                    <div className="bg-pink-100 px-5 py-4 text-sm">
                        <h3 className="mb-5 text-base font-semibold">Lưu ý khi đánh giá</h3>
                        <h4 className="mb-5">1. Không được dẫn link hoặc nhắc đến website khác</h4>
    
                        <h4 className="mb-5">2. Không được có những từ ngữ gay gắt, đả kích, xúc phạm người khác</h4>
    
                        <h4 className="mb-5">3. Đánh giá hoặc bình luận không liên quan tới truyện sẽ bị xóa</h4>
    
                        <h4 className="mb-5">4. Đánh giá hoặc bình luận chê truyện một cách chung chung không mang lại giá trị cho người đọc sẽ bị xóa</h4>
    
                        <h4 className="mb-5">5. Đánh giá có điểm số sai lệch với nội dung sẽ bị xóa</h4>
    
                        <i>Vui lòng xem và tuân theo đầy đủ các quy định tại Điều Khoản Dịch Vụ khi sử dụng website</i>
                    </div>
                </div>

            </div>
        </>
    );
};

export default FormFeedback;
