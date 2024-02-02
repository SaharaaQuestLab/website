/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="bowser"/>
// / <reference types="astro-imagetools"/>

declare module "astro-imagetools/components"

interface ImportMetaEnv {
  readonly API_TOKEN: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


declare global {

}

interface Window {
  env: Bowser.Parser.ParsedResult
}
