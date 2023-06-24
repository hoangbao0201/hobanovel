const siteUrl = "https://hobanovel.online";

module.exports = {
    siteUrl,
    generateRobotsTxt: true, // Create robots.txt
    robotsTxtOptions: {
        // policies: [
        //     { userAgent: "*", disallow: "/secret" },
        //     { userAgent: "*", allow: "/" },
        // ],
        additionalSitemaps: [`${siteUrl}/sitemap.xml`, `${siteUrl}/server-sitemap.xml`],
    },
    // exclude: ["/secret"],
};
