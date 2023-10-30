import { LinguiConfig } from "@lingui/conf";
// import { formatter } from "@lingui/format-json";


const config: LinguiConfig = {
  locales: ["en", "zh-CN"],
  sourceLocale: "en",
  fallbackLocales: {
    default: "en",
  },
  catalogs: [
    {
      path: "public/locales/{locale}",
      include: ["src/"],
    },
  ],
  // format: formatter({ style: "minimal" }),
};

export default config;