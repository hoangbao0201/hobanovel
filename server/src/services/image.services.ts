import cloudinary from "../library/cloudinary";

export const uploadThumbnailNovelByUrlHandle = async (url: string) => {
    const image = await cloudinary.uploader.upload(url, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
        folder: "hobanovel/novel/thumbnail",
    });

    if (!image) {
        return null;
    }
    
    return image;
};
