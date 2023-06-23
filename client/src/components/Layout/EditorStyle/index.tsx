import { useRef, useState } from "react";
import styles from "./EditorStyle.module.scss";
import classNames from "classnames/bind";

import { EditorState, Editor, convertToRaw, ContentState } from "draft-js";
// import PerfectScrollbar from "react-perfect-scrollbar";
// import 'react-perfect-scrollbar/dist/css/styles.css';

const cx = classNames.bind(styles);

interface EditorStyleProps {
    name?: string;
    text?: EditorState;
    handleOnchange?: (text: EditorState) => void;
}

export const EditorStyle = ({ name, text, handleOnchange = () => {} }: EditorStyleProps) => {
    const editorRef = useRef<Editor>(null);

    return (
        <div className={name ? name : "wrapper-editor"}>
            <Editor
                ref={editorRef}
                customStyleMap={{ BLUE: { color: "blue" } }}
                editorState={text ?? EditorState.createEmpty()}
                onChange={handleOnchange}
            />

            {/* <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
                onContentStateChange={onEditorStateChange}
                mention={{
                separator: ' ',
                trigger: '@',
                suggestions: [
                    { text: 'APPLE', value: 'apple' },
                    { text: 'BANANA', value: 'banana', url: 'banana' },
                    { text: 'CHERRY', value: 'cherry', url: 'cherry' },
                    { text: 'DURIAN', value: 'durian', url: 'durian' },
                    { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
                    { text: 'FIG', value: 'fig', url: 'fig' },
                    { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
                    { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' }
                ]
                }}
            /> */}
        </div>
    );
};
