import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef } from "react";

// import ReactQuill from "react-quill";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";
import EmojiPicker from "./EmojiPicker";

const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

// ---
const CustomizeReactQuillStyle = styled.div`
    .ql-editor {
        min-height: 150px;
    }
    .ql-container {
        font-size: 17px;
    }
`;
const modules = {
    toolbar: false,
};

// ---
interface InputTextProps {
    text: string;
    isShow: boolean;
    receiver?: {
        receiverId: string,
        receiverUsername: string,
        receiverName: string
    }
    handleOnchange: (value: string) => void;
}

const InputText = ({ text, isShow, receiver, handleOnchange }: InputTextProps) => {
    const quillRef: any = useRef(null);

    // Handle Add Emoji
    const handleAddEmoji = (emoji: string) => {
        const content = text + '<p>' + emoji + '</p>';
        handleOnchange(content);
    };

    // Handle Focus React Quill
    const handleButtonClick = () => {
        const editor = quillRef.current;
        if (editor) {
            editor.focus();
        }
    };

    return (
        <>
            <CustomizeReactQuillStyle className="text-base">
                <EmojiPicker handleAddEmoji={handleAddEmoji} />

                {/* <button onClick={handleButtonClick} className="border">
                    focus
                </button> */}

                {
                    receiver && (
                        <div className="border-x py-2 px-3 flex items-center flex-wrap">
                            <span className="mr-2 font-semibold">Người nhận:</span>
                            <span className="text-sm border bg-gray-200 py-1 px-2 select-none">{receiver?.receiverName}</span>
                        </div>
                    )
                }

                <ReactQuill
                    // ref={quillRef}
                    theme="snow"
                    value={text}
                    onChange={(value : any) => handleOnchange(value)}
                    modules={modules}
                />

            </CustomizeReactQuillStyle>
        </>
    );
};

export default InputText;
