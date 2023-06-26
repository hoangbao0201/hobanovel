// pages/sitemap.xml.js

import { getAllNovelForSeoHandle } from "@/services/novels.services";

const URL = "https://hobanovel.online";
 
function generateSiteMap(novels : any) {

    // console.log(`<url>
    //     <loc>${URL}/truyen/${novels[1].slug}</loc>
    //     <lastmod>${novels[1].updatedAt}</lastmod>

    //     <changefreq>Thường xuyên</changefreq>
    //     <priority>0.8</priority>

    //     <image:image>
    //     <image:loc>${novels[1].thumbnailUrl}</image:loc>
    //     <image:caption>hobanovel - ${novels[1].title}</image:caption>
    //     </image:image>

    //     <news:news>
    //     <news:publication>
    //     <news:name>hobanovel</news:name>
    //     <news:language>Việt Nam</news:language>
    //     </news:publication>
    //     <news:publication_date>${novels[1].createdAt}</news:publication_date>
    //     <news:title>${novels[1].title}</news:title>
    //     <news:keywords>hobanovel ${novels[1].title}</news:keywords>
    // </url>`)

    return (
        `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
                <!-- Add the static URLs manually -->

            <url>
                <loc>${URL}</loc>
            </url>

            ${novels.map((novel : any) => {
                return (
                    `
                        <url>
                            <loc>${URL}/truyen/${novel.slug}</loc>
                            <lastmod>${novel.updatedAt}</lastmod>
                            <changefreq>daily</changefreq>
                            <priority>0.5</priority>
                        </url>
                    `
                );
            }).join("")}    
        </urlset>`
    );
}

export async function getServerSideProps({ res } : any) {
    const dataRes = await getAllNovelForSeoHandle();

    // Generate the XML sitemap with the blog data
    const sitemap = generateSiteMap(dataRes);

    res.setHeader("Content-Type", "text/xml");
    // Send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default function SiteMap() {
    return null
}
