import React from "react";
import { Adsense } from "@ctrl/react-adsense";

export const AdsenseForm = () => {

    if(process.env.NODE_ENV !== "production") {
        return null;
    }
    
    return (
        <div className="relative block overflow-hidden my-3">
            <Adsense
                style={{ display: "block", maxWidth: "100%", width: "100%" }}
                client="ca-pub-6688547661590907"
                slot="6844017742"
                format="auto"
                responsive="true"
            />
        </div>
    );
}
