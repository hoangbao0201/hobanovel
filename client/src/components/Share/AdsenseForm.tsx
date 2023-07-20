import React from "react";
import { Adsense } from "@ctrl/react-adsense";

export const AdsenseForm = () => {
    return (
        <div className="text-center adsbygoogle my-3">
            <Adsense
                client="ca-pub-6688547661590907"
                slot="4236465460"
                style={{ display: "block" }}
                layout="in-article"
                format="auto"
                responsive="true"
            />
        </div>
    );
}
