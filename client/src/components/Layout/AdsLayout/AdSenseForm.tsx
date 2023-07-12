import { useEffect, useState } from "react";

export function AdsenseForm() {

    const [isClient, setIsClient] = useState(false);

    // useEffect(() => {
    //     try {
    //         // @ts-ignore
    //         (window.adsbygoogle = window.adsbygoogle || []).push({});
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }, []);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="text-center my-3">
            {isClient && (
                <ins
                    className=""
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-6688547661590907"
                    data-ad-slot="4236465460"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                ></ins>
            )}
        </div>
    );
}   