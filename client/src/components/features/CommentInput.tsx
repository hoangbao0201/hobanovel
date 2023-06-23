import { useState } from "react";

import EmojiPicker from "./EmojiPicker";
import { ContentState, Editor, EditorState, convertToRaw } from "draft-js";


const CommentInput = () => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [text, setText] = useState();

    const onEditorStateChange = (editorState: any) => {
        setEditorState(editorState);
        const { blocks } = convertToRaw(editorState.getCurrentContent());
        let text = editorState.getCurrentContent().getPlainText("\u0001");
        setText(text);

        // console.log("blocks: ", blocks);
        // console.log("editorState: ", editorState.getCurrentContent().getPlainText("<br />"));
    };

    const handleAddText = () => {

        // const updatedContent = text + "Nguyễn ";
        // const contentStateWithNguyen = ContentState.createFromText(updatedContent);
        // const editorStateWithNguyen = EditorState.push(editorState, contentStateWithNguyen);

        // console.log(editorState.())
    }

    return (
        <>
            <div className="w-full">
                <EmojiPicker />
                
                
                <div className="border p-3">
                    <Editor editorState={editorState} onChange={onEditorStateChange} />
                </div>

                <button onClick={handleAddText} className="py-1 px-3 border rounded-md">thêm</button>

            </div>
        </>
    )
}

export default CommentInput;