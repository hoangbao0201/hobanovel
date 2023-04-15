export const convertCommentText = (text : string) => {

    text.replace(/\n/g, '<br>')

    return text;
}
