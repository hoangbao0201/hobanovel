import pool from "../library/connectMySQL";
import cloudinary from "../library/cloudinary";
import { getBlurDataURL } from "../utils/getBlurDataURL";

export const uploadThumbnailHandle = async (urlImage: string) => {
    const image = await cloudinary.uploader.upload(urlImage, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
        folder: "hobanovel/novel/thumbnail",
    });
    if (!image) {
        return {
            imageUrl: null,
            imagePublicId: null,
            imageBlur: null,
        };
    }

    return {
        imageUrl: image?.url || null,
        imagePublicId: image?.public_id || null,
        imageBlur: getBlurDataURL(image?.url)
    };
};

export const uploadThumbnailNovelHandle = async ({ slug, urlImage } : { slug : string, urlImage: string }) => {
    
    try {
        // const { imageUrl, imagePublicId, imageBlur } = await uploadThumbnailHandle(urlImage);

        const image = await cloudinary.uploader.upload(urlImage, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "hobanovel/novel/thumbnail",
        });
        if (!image) {
            throw new Error('Upload Image Error')
        }
        const imageBlur = await getBlurDataURL(image.url)

        const connection = await pool.getConnection();

        const qGetNovel = `
            UPDATE novels
            SET thumbnailUrl = ? , thumbnailPublicId = ? , imageBlurHash = ?
            WHERE slug = ?
        `;

        const [rows] = await connection.query(qGetNovel, [image.url, image.public_id, imageBlur, slug]);

        connection.release();

        return {
            success: true,
            data: rows
            // test: image
        }
    } catch (error) {
        return {
            success: false,
            error: error?.message
        }
    }
};


export const uploadBannersDataHandle = async (data: string) => {
    const image = await cloudinary.uploader.upload(data, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
        folder: "hobanovel/admin/banners",
    });

    if (!image) {
        return null;
    }
    
    return image;
};
