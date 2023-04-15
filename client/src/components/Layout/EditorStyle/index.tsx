import { useRef } from "react";
import styles from "./EditorStyle.module.scss"
import classNames from "classnames/bind";

import { EditorState, Editor } from "draft-js"
// import PerfectScrollbar from "react-perfect-scrollbar";
// import 'react-perfect-scrollbar/dist/css/styles.css';

const cx = classNames.bind(styles)

interface EditorStyleProps {
    name?: string
    text?: EditorState;
    handleOnchange?: (text: EditorState) => void;
}

export const EditorStyle = ({ name, text, handleOnchange = () => {} } : EditorStyleProps ) => {
    const editorRef = useRef<Editor>(null);

    const handleButtonClick = () => {
        editorRef.current?.focus();
    };
    
    return (
        // <PerfectScrollbar style={{ width: "100%" }} onClick={handleButtonClick} options={{ wheelPropagation: true, wheelSpeed: 0.5, minScrollbarLength: 10, suppressScrollX: true }}>
        <div className={name ? name : "wrapper-editor"}>
            <Editor ref={editorRef} editorState={text ?? EditorState.createEmpty()} onChange={handleOnchange} />
        </div>
        // </PerfectScrollbar>
    )
}