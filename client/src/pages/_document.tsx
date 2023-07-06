import { Html, Head, Main, NextScript } from "next/document";
import Script from 'next/script';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,900;1,400;1,500;1,600&display=swap" rel="stylesheet" />

                <link rel="text" href="/ads.txt" />

                <meta name="google-site-verification" content="VYr3U568eAPsZHYVfVtVFkF_41bHeGdekZrs2mV7PQk" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6688547661590907" crossOrigin="anonymous"></script>
                {/* <script
                    async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6688547661590907"
                    crossOrigin="anonymous">    
                </script> */}

                {/* <Script
                    async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6688547661590907"
                    strategy="lazyOnload"
                    crossOrigin="anonymous"
                /> */}

                {/* First Ad */}
                {/* <ins className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-6688547661590907"
                    data-ad-slot="1661752529"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script> */}


            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
