
import { useEffect } from "react";

export function AdsenseForm() {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <div className="text-center my-3">
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-6688547661590907"
                data-ad-slot="1661752529"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
