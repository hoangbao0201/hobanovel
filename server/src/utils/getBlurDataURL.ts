import axios from "axios";

export const getBlurDataURL = async (url: string | null) => {
    if (!url) {
        return null;
    }
    const prefix = `http://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/`;
    const suffix = url.split(prefix)[1];
    const response = await axios.get(`${prefix}w_210,e_blur:5000,q_auto,f_auto/${suffix}`, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64}`;
};
