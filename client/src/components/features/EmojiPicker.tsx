import { IconTypeProps, iconEmojiData } from "@/constants/data";
import Image from "next/image"
import { useState } from "react";
import LazyLoad from "react-lazy-load";



const EmojiPicker = () => {

    const [iconType, setIconType] = useState<null | keyof IconTypeProps>(null);

    return (
        <>
            <div className="mb-3">
                <div>
                    <span onClick={() => setIconType('iconTrollFace')} className="border w-[40px] h-[40px] block cursor-pointer overflow-hidden">
                        <Image
                            width={40}
                            height={40}
                            src={iconEmojiData.iconTrollFace[0].url}
                            alt="emoji face troll"
                        />
                    </span>
                </div>
            </div>
            {
                iconType && (
                    <div className="border ">
                        <ul className="flex flex-wrap">
                            {
                                iconEmojiData[iconType].map(icon => {
                                    return (
                                        <li key={icon.id}>
                                            <LazyLoad className="h-[40px] block cursor-pointer border overflow-hidden hover:border-blue-600">
                                                <Image
                                                    width={40}
                                                    height={40}
                                                    src={icon.url}
                                                    alt="emoji"
                                                />
                                            </LazyLoad>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                )
            }
        </>
    )
}

export default EmojiPicker;