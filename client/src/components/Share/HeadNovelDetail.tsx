import NextHead from 'next/head';


interface HeadNovelDetailProps {
    novel: any
}
const HeadNovelDetail = ({ novel } : HeadNovelDetailProps) => {

    const { slug, title, thumbnailUrl, chapterCount } = novel;

    return (
        <NextHead>

            <title>{title} [Tới Chap ${chapterCount}] Tiếng Việt - hobanovel</title>
            <meta
                name="description"
                content={`❶✔️ Đọc truyện ${title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại hobanovel`}
            /><meta property="og:title" content={title} /><meta
                property="og:site_name"
                content="hobanovel"
            /><meta
                property="og:url"
                content={`https://hobanovel.online/truyen/${slug}`}
            /><meta property="og:type" content="article" /><meta
                property="og:image"
                content={thumbnailUrl}
            /><meta
                property="og:description"
                content={`❶✔️ Đọc truyện tranh ${title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại hobanovel`}
            /><meta itemProp="name" content={title} /><meta
                itemProp="description"
                content={`❶✔️ Đọc truyện ${title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại hobanovel`}
            /><meta
                itemProp="image"
                content={thumbnailUrl}
            /><meta
                name="thumbnail"
                content={thumbnailUrl}
            /><link
                rel="amphtml"
                href={thumbnailUrl}
            /><link
                rel="canonical"
                href={thumbnailUrl}
            />
            <script type="application/ld+json">
                {
                    `
                        {
                            "@context": "http://schema.org",
                            "@type": "Article",
                            "mainEntityOfPage": https://hobanovel.online/truyen/${slug},
                            "headline": title,
                            "datePublished": createdAt,
                            "dateModified": updatedAt,
                            "description": ❶✔️ Đọc truyện ${title} Tiếng Việt bản dịch Full mới nhất, ảnh đẹp chất lượng cao, cập nhật nhanh và sớm nhất tại hobanovel,
                            "author": { "@type": "Person", "name": ${title} },
                            "publisher": {
                                "@type": "Organization",
                                "name": "NetTruyen",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "//st.nettruyenmax.com/data/logos/logo-nettruyen.png",
                                    "width": 150,
                                    "height": 30
                                }
                            },
                            "image": {
                                "@type": "ImageObject",
                                "url": ${thumbnailUrl},
                                "height": 904,
                                "width": 696
                            }
                        }
                    `
                }
            </script>
            <script type="application/ld+json">
                {
                    `
                        {
                            "@context": "http://schema.org",
                            "@type": "ItemList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "url": "https://hobanovel.online/truyen/${slug}/chapter-1"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "url": "https://hobanovel.online/truyen/${slug}/chapter-2"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "url": "https://hobanovel.online/truyen/${slug}/chapter-3"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 4,
                                    "url": "https://hobanovel.online/truyen/${slug}/chapter-4"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 5,
                                    "url": "https://hobanovel.online/truyen/${slug}/chapter-5"
                                }
                            ]
                        }
                    `
                }
            </script>
            <meta property="fb:app_id" content="745819368841087" />
            <script type="application/ld+json">
                {
                    `
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Trang chủ",
                                    "item": "https://hobanovel.online/"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "✅Website chính thức",
                                    "item": "https://hobanovel.online/tim-truyen"
                                }
                            ]
                        }
                    `
                }
            </script>
            <link
                rel="icon"
                type="image/png"
                href="//st.nettruyenmax.com/data/logos/favicon-nettruyen.png"
            /><meta
                name="copyright"
                content="Copyright © 2022 Truyện hoanovel"
            /><meta name="Author" content="Truyện hoanovel" /><meta
                property="fb:pages"
                content="1083441428356869"
            /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta
                http-equiv="X-UA-Compatible"
                content="IE=Edge"
            /><meta name="color-scheme" content="light only" /><meta
                name="google"
                content="notranslate"
            />
            <link
                rel="apple-touch-icon"
                href="//st.nettruyenmax.com/data/app/icons/icon-72x72.png"
            /><link
                rel="apple-touch-icon"
                sizes="96x96"
                href="//st.nettruyenmax.com/data/app/icons/icon-96x96.png"
            /><link
                rel="apple-touch-icon"
                sizes="144x144"
                href="//st.nettruyenmax.com/data/app/icons/icon-144x144.png"
            /><link
                rel="apple-touch-icon"
                sizes="192x192"
                href="//st.nettruyenmax.com/data/app/icons/icon-192x192.png"
            />
            <script type="application/ld+json">
                {
                    `
                        {
                            "@context": "http://schema.org",
                            "@type": "WebSite",
                            "url": "https://hobanovel.online",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": "https://hobanovel.online/tim-truyen?keyword={search_term_string}",
                                "query-input": "required name=search_term_string"
                            }
                        }
                    `
                }
            </script>
            <script type="application/ld+json">
                {
                    `
                        {
                            "@context": "http://schema.org",
                            "@type": "Person",
                            "name": "HobaNovel",
                            "url": "https://hobanovel.online",
                            "sameAs": ["https://www.facebook.com/hobanovel"]
                        }
                    `
                }
            </script>
        </NextHead>
    )
}

export default HeadNovelDetail;