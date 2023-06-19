import { apiUrl } from "@/constants";
import { GetServerSideProps } from "next";

const EXTERNAL_DATA_URL = "http://localhost:4000/api/novels/get/all/seo";

type NovelType = {
    id: string;
    title: string;
    slug: string;
    updatedAt: Date;
};

interface generateSiteMap {
    novels: NovelType[];
}

export const generateSiteMap = ({ novels } : generateSiteMap) => {
    return  (
        `
            <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

                <!--We manually set the two URLs we know already-->
                <url>
                    <loc>${apiUrl}</loc>
                </url>

                <url>
                    <loc>${apiUrl}/guide</loc>
                </url>

                ${novels.map(({ id }) => {
                    return (
                        `
                            <url>
                                <loc>${`${apiUrl}/truyen/${id}`}</loc>
                            </url>
                        `
                    )
                })
                .join("")}

            </urlset>
        `
    ) 
};

function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    // We make an API call to gather the URLs for our site
    const request = await fetch(EXTERNAL_DATA_URL);
    const posts = await request.json();

    const sitemap = generateSiteMap(posts);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default SiteMap;
