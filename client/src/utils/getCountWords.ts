export const getCountWords = (str: string) => {
    const plainText = str.replace(/<[^>]+>/g, "");

    const words = plainText.split(" ");

    const wordCount = words.length;

    return wordCount;
};
