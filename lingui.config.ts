import { LinguiConfig } from '@lingui/conf'
// import { formatter } from "@lingui/format-json";

const config: LinguiConfig = {
  locales: ['en', 'zh-CN', 'zh-HK'],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src/'],
    },
  ],
  // format: formatter({ style: "minimal" }),
}

export default config
