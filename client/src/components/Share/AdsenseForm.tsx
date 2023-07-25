import React from "react";
import { Adsense } from "@ctrl/react-adsense";


interface AdsenseFormProps {
    layout?: string
    format?: string
    slot?: string
    key?: number
}

export const AdsenseForm = ({ layout, format, slot, key = 1 } : AdsenseFormProps) => {

    // if(process.env.NODE_ENV !== "production") {
    //     return null;
    // }
    
    return (
        <div className="relative block overflow-hidden my-3">
            {
                layout && slot && format ? (
                    <Adsense
                        style={{ display: "block", maxWidth: "100%", width: "100%" }}
                        client="ca-pub-6688547661590907"
                        format={format}
                        slot={slot}
                        responsive="true"
                        layout={layout}
                        key={key}
                    />
                ) : (
                    <Adsense
                        style={{ display: "block", maxWidth: "100%", width: "100%" }}
                        client="ca-pub-6688547661590907"
                        format="auto"
                        slot="6844017742"
                        responsive="true"
                        key={key}
                    />
                )
            }
        </div>
    );
}


{/* <ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-6688547661590907"
     data-ad-slot="5472603043"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins> */}

{/* <ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-6688547661590907"
     data-ad-slot="1828871502"></ins>
<script></script> */}