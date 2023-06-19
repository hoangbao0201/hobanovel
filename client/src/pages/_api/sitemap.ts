// import { NextApiRequest, NextApiResponse } from "next";
// import { SitemapStream, streamToPromise } from "sitemap";
// import { Readable } from "stream";
// import { getAllNovelForSeoHandle } from "@/services/novels.services";

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     const getNovelRes = await getAllNovelForSeoHandle(); // Lấy danh sách tiểu thuyết từ hàm getAllNovels
//     console.log(getNovelRes)
//     // Tạo đối tượng SitemapStream
//     const smStream = new SitemapStream({
//         hostname: "http://localhost:3000",
//     });

//     // Thêm các URL vào sơ đồ trang web
//     getNovelRes.novels.forEach((novel : { id: string, title: string, updatedAt: Date }) => {
//         smStream.write({
//             url: `/truyen/${encodeURIComponent(novel.title)}`, // Sử dụng tiêu đề làm phần của URL
//             lastmod: novel.updatedAt, // Thay thế bằng trường lastModified tương ứng trong đối tượng tiểu thuyết của bạn
//         });
//     });

//     // Kết thúc sơ đồ trang web
//     smStream.end();

//     // Chuyển đổi sơ đồ trang web thành chuỗi XML
//     const sitemap = await streamToPromise(Readable.from(smStream)).then((sm) => sm.toString());

//     // Đặt các tiêu đề và gửi phản hồi
//     res.setHeader("Content-Type", "text/xml");
//     res.write(sitemap);
//     res.end();
// };


import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/xml");

    // Instructing the Vercel edge to cache the file
    res.setHeader("Cache-control", "stale-while-revalidate, s-maxage=3600");

    // generate sitemap here
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
      <url>
        <loc>http://www.example.com/foo.html</loc>
        <lastmod>2021-01-01</lastmod>
      </url>
      </urlset>`;

    res.end(xml);
}
