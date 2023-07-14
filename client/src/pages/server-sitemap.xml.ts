// pages/sitemap.xml.js

import { getAllNovelForSeoHandle } from "@/services/novels.services";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const URL = "https://hobanovel.online";
 
function generateSiteMap(novels : any) {

    return (
        `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
                <!-- Add the static URLs manually -->

<<<<<<< HEAD
            <url>
                <loc>${URL}</loc>
                <lastmod>${new Date()}</lastmod>
                <changefreq>hourly</changefreq>
                <priority>1</priority>
            </url>
            <url>
                <loc>${URL}/tim-truyen</loc>
                <lastmod>${new Date()}</lastmod>
                <changefreq>hourly</changefreq>
                <priority>1</priority>
            </url>

=======
>>>>>>> 966bb17a9562e52c0f56760962a0d08359057f32
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

export const getServerSideProps : GetServerSideProps = async ({ res } : GetServerSidePropsContext) => {
    const dataRes = await getAllNovelForSeoHandle();

    const sitemap = generateSiteMap(dataRes);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default function SiteMap() {
    return null
}
