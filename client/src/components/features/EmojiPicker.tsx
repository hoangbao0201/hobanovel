import { IconTypeProps, iconEmojiData } from "@/constants/data";
import { useClickOutSide } from "@/hook/useClickOutSide";
import Image from "next/image"
import { useRef, useState } from "react";
import LazyLoad from "react-lazy-load";



interface EmojiPickerProps {
    handleAddEmoji: (value: string) => void
}

const EmojiPicker = ({ handleAddEmoji } : EmojiPickerProps) => {

    const listEmojiRef = useRef(null) 

    const [iconType, setIconType] = useState<null | keyof IconTypeProps>(null);

    const handleIsHiddenListEmoji = () => {
        setIconType(null);
    }

    const eventCallAddEmoji = (emoji: string) => {
        const imgEmoji = `<img src="${emoji}"/>`

        handleAddEmoji(imgEmoji)
        handleIsHiddenListEmoji()
    }

    useClickOutSide(listEmojiRef, handleIsHiddenListEmoji);

    return (
        <>
            <div className="relative border p-2">
                <div>
                    <span onClick={() => setIconType('iconTrollFace')} className="border w-[48px] h-[48px] block cursor-pointer overflow-hidden">
                        <Image
                            width={48}
                            height={48}
                            src={iconEmojiData.iconTrollFace[0].url}
                            alt="emoji face troll"
                        />
                    </span>
                </div>
                {
                    iconType && (
                        <div ref={listEmojiRef} className="border absolute left-0 top-[40px] w-[90%] bg-white z-40">
                            <ul className="flex flex-wrap h-80 overflow-y-auto p-3">
                                {
                                    iconEmojiData[iconType].map(icon => {
                                        return (
                                            <li key={icon.id} onClick={() => eventCallAddEmoji(icon.url)}>
                                                <LazyLoad className="h-[100px] cursor-pointer border overflow-hidden hover:border-blue-600">
                                                    <Image
                                                        width={100}
                                                        height={100}
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
            </div>
        </>
    )
}

export default EmojiPicker;