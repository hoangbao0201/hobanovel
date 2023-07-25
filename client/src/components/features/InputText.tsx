import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef, useState } from "react";

// import ReactQuill from "react-quill";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";
import EmojiPicker from "./EmojiPicker";

// const ReactQuill = dynamic(() => import("react-quill"), {
//     ssr: false,
//     loading: () => <p></p>,
// });

const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill");

        // eslint-disable-next-line react/display-name
        return ({ forwardedRef, ...props } : any) => <RQ ref={forwardedRef} {...props} />;
    },
    { ssr: false }
);

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
        receiverId: string;
        receiverUsername: string;
        receiverName: string;
    };
    handleOnchange: (value: string) => void;
}

const InputText = ({ text, isShow, receiver, handleOnchange }: InputTextProps) => {
    const quillRef : any= useRef(null);

    const [editorLoaded, setEditorLoaded] = useState(false);

    // Handle Add Emoji
    const handleAddEmoji = (emoji: string) => {
        const content = text + "<p>" + emoji + "</p>";
        handleOnchange(content);
    };

    // Handle Focus React Quill
    const handleButtonClick = () => {
        const editor = quillRef.current;
        if (editor) {
            editor.focus();
        }
    };

    const handle = async () => {

        // await ReactQuill

        // console.log(quillRef)

        // if (quillRef?.current) {
            // quillRef.current.getEditor().setText("");
            // quillRef?.current.focus();
            // console.log(quillRef)
        // }
        // console.log(ReactQuill)

    };

    useEffect(() => {
        handle();
    }, [quillRef])

    

    return (
        <>
            <CustomizeReactQuillStyle className="text-base">
                <EmojiPicker handleAddEmoji={handleAddEmoji} />

                {/* <button onClick={handleButtonClick} className="border">
                    focus
                </button> */}

                {receiver && (
                    <div className="border-x py-2 px-3 flex items-center flex-wrap">
                        <span className="mr-2 font-semibold">Người nhận:</span>
                        <span className="text-sm border bg-gray-200 py-1 px-2 select-none">
                            {receiver?.receiverName}
                        </span>
                    </div>
                )}
                
                <ReactQuill
                    forwardedRef={quillRef}
                    theme="snow"
                    value={text}
                    className="max-h-72 overflow-y-auto"
                    oncFocus={() => console.log(123)}
                    onChange={(value: any) => handleOnchange(value)}
                    modules={modules}
                />

                {/* <button className="border" onClick={handle}>
                    test
                </button> */}
            </CustomizeReactQuillStyle>
        </>
    );
};

export default InputText;
