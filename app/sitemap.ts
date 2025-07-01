import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://warframebaro.com",
            lastModified: new Date(),
        },
        {
            url: "https://barotracker.com/terms",
            lastModified: new Date(),
        },
        {
            url: "https://barotracker.com/privacy",
            lastModified: new Date(),
        },
        {
            url: "https://barotracker.com/view-all",
            lastModified: new Date(),
        },
    ];
}
