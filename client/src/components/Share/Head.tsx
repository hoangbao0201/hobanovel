import { WEBSITE_URL } from '@/constants';
import { NovelType } from '@/types';
import NextHead from 'next/head';
import { useRouter } from 'next/router';

// interface NovelsType {
//     url: string
// }

interface HeadProps {
    title?: string;
    description?: string;
    image?: string;
    fallbackImage?: string
    novels?: NovelType[]
}

export default function Head({
    title = 'Đọc Truyện Chữ Online - Website chính thức - HobaNovel',
    description = 'Website đọc truyện chữ miễn phí!',
    image = 'https://res.cloudinary.com/djrbd6ftt/image/upload/v1686325713/hobanovel/Capture_zxigta.png',
    fallbackImage = "https://res.cloudinary.com/djrbd6ftt/image/upload/v1686325713/hobanovel/Capture_zxigta.png",
    novels
}: HeadProps) {
    const { asPath } = useRouter();

    return (
        <NextHead>
            <title>{title}</title>
            <link rel="manifest" href="/manifest.json" />

            <meta name="title" content={title} />
            <meta name="description" content={description} />

            <meta property="og:image" content={fallbackImage}></meta>
            <meta property="og:type" content="website" />
            <meta property="og:url" content={WEBSITE_URL + asPath} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={WEBSITE_URL + asPath} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="application-name" content="Hoba Novel" />
            <meta name="apple-mobile-web-app-title" content="Hoba Novel" />
            <meta name="theme-color" content="#ffff" />
            <meta name="msapplication-navbutton-color" content="#ffff" />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="black-translucent"
            />
            <meta name="msapplication-starturl" content="/" />


            <script type="application/ld+json">
                {
                    JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "ItemList",
                        "itemListElement": `[
                            ${novels && novels.map((novel, index) => {
                                return (
                                    `{
                                        @type: ListItem,
                                        position: ${index + 1},
                                        url: https://hobanovel.online/truyen/${novel?.slug},
                                    },`
                                )
                            })}
                        ]`
                    })
                }
            </script>
            
            <script type="application/ld+json">
                {
                    JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Trang chủ",
                                "item": "https://hobanovel/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "✅Website chính thức",
                                "item": "https://hobanovel/tim-truyen"
                            }
                        ]
                    })
                }
            </script>
            <script type="application/ld+json">
                {
                    JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "WebSite",
                        "url": "https://hobanovel.online",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://hobanovel/tim-truyen?keyword={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    })
                }
            </script>
            <script type="application/ld+json">
                {
                    JSON.stringify({
                        "@context": "http://schema.org",
                        "@type": "Person",
                        "name": "hobanovel",
                        "url": "https://www.nettruyenmax.com",
                        "sameAs": ["https://www.facebook.com/hobanovel"]
                    })
                }
            </script>
        </NextHead>
    );
}
