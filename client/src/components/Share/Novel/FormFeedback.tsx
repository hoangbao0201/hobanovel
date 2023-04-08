
import { useState } from "react";
import { iconStar } from "../../../../public/icons";

interface FormFeedbackProps {
    tab?: number;
    slug?: string;
}

const FormFeedback = ({ tab, slug }: FormFeedbackProps) => {
    const [dataValue, setDataValue] = useState({
        personality: 0,
        content: 0,
        scene: 0,
        translationQuality: 0,
    });

    const eventOnchangeDataValue = (e: any) => {
        setDataValue({
            ...dataValue,
            [e.target.name]: e.target.value,
        });
    };


    return (
        <div className="flex">
            <div className="w-8/12">
                <div className="p-5">
                    <div className="p-5 bg-orange-800 bg-opacity-5">
                        <div className="flex items-center transition-all ease-linear mb-4">
                            <h4 className="min-w-[30%]">Tính cách nhân vật</h4>
                            <input
                                onChange={eventOnchangeDataValue}
                                name="personality"
                                className="w-full h-1 flex-1 cursor-pointer bg-orange-200 rounded-full appearance-none"
                                value={dataValue.personality}
                                min="0"
                                max="5"
                                step="0.5"
                                type="range"
                            />
                            <span className="flex items-center font-semibold text-yellow-500 text-lg ml-3 text-center min-w-[30px]">
                                {dataValue.personality}
                            </span>
                            <i className="w-4 ml-2 block fill-yellow-400">{iconStar}</i>
                        </div>
                        <div className="flex items-center transition-all ease-linear mb-4">
                            <h4 className="min-w-[30%]">Nội dung cốt truyện</h4>
                            <input
                                onChange={eventOnchangeDataValue}
                                name="content"
                                className="w-full h-1 flex-1 cursor-pointer bg-orange-200 rounded-full appearance-none"
                                value={dataValue.content}
                                min="0"
                                max="5"
                                step="0.5"
                                type="range"
                            />
                            <span className="flex items-center font-semibold text-yellow-500 text-lg ml-3 text-center min-w-[30px]">
                                {dataValue.content}
                            </span>
                            <i className="w-4 ml-2 block fill-yellow-400">{iconStar}</i>
                        </div>
                        <div className="flex items-center transition-all ease-linear mb-4">
                            <h4 className="min-w-[30%]">Bố cục thế giới</h4>
                            <input
                                onChange={eventOnchangeDataValue}
                                name="scene"
                                className="w-full h-1 flex-1 cursor-pointer bg-orange-200 rounded-full appearance-none"
                                value={dataValue.scene}
                                min="0"
                                max="5"
                                step="0.5"
                                type="range"
                            />
                            <span className="flex items-center font-semibold text-yellow-500 text-lg ml-3 text-center min-w-[30px]">
                                {dataValue.scene}
                            </span>
                            <i className="w-4 ml-2 block fill-yellow-400">{iconStar}</i>
                        </div>
                        <div className="flex items-center transition-all ease-linear mb-4">
                            <h4 className="min-w-[30%]">Chất lượng bản dịch</h4>
                            <input
                                onChange={eventOnchangeDataValue}
                                name="translationQuality"
                                className="w-full h-1 flex-1 cursor-pointer bg-orange-200 rounded-full appearance-none"
                                value={dataValue.translationQuality}
                                min="0"
                                max="5"
                                step="0.5"
                                type="range"
                            />
                            <span className="flex items-center font-semibold text-yellow-500 text-lg ml-3 text-center min-w-[30px]">
                                {dataValue.translationQuality}
                            </span>
                            <i className="w-4 ml-2 block fill-yellow-400">{iconStar}</i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-4/12">r</div>
        </div>
    );
};

export default FormFeedback;
