import { ReviewType } from "@/types";

export const checkValueReviewNovel = (data: Partial<ReviewType>) => {
    const {
        isRating,
        commentText,
        pointPersonality,
        pointStoryline,
        pointScene,
        pointTranslation,
        isSpoiler,
    } = data;

    // return {
    //     success: false,
    //     message: "haha",
    //     // data: JSON.parse(commentText.block. || "")
    // }

    if(!commentText) {
        return {
            success: false,
            message: "Nội dung không được để trống."
        };
    }

    let messageError = ''
    if(isRating) {
        // switch(0) {
        //     case pointPersonality:
        //         messageError.concat("Tính cách nhân vật phải có giá trị nhỏ nhất là 0.5.")
        //     case pointStoryline:
        //         messageError.concat("Nội dung cốt truyện phải có giá trị nhỏ nhất là 0.5. ")
        //     case pointScene:
        //         messageError.concat("Bố cục thế giới phải có giá trị nhỏ nhất là 0.5. ")
        //     case pointTranslation:
        //         messageError.concat("Chất lượng bản dịch phải có giá trị nhỏ nhất là 0.5. ")
        //     default:
        // }
        if(pointPersonality == 0) {
            messageError += "<div>Tính cách nhân vật phải có giá trị nhỏ nhất là 0.5. </div>"
        }
        if(pointStoryline == 0) {
            messageError += "<div>Nội dung cốt truyện phải có giá trị nhỏ nhất là 0.5. </div>"
        }
        if(pointScene == 0) {
            messageError += "<div>Bố cục thế giới phải có giá trị nhỏ nhất là 0.5. </div>"
        }
        if(pointTranslation == 0) {
            messageError += "<div>Chất lượng bản dịch phải có giá trị nhỏ nhất là 0.5. </div>"
        }
        
        if(messageError.length > 0) {
            return {
                success: false,
                message: messageError,
            }
        }
    }

    return {
        success: true
    };
};
