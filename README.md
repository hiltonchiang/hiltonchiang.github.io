
# Hilton's Blog using Tailwind Nextjs Starter

This is a [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) blogging starter template. Version 2 is based on Next App directory with [React Server Component](https://nextjs.org/docs/getting-started/react-essentials#server-components) and uses [Contentlayer](https://www.contentlayer.dev/) to manage markdown content.


## Credits

This project is forked from [Timothy Lin](https://www.timlrx.com)

## ChangeLogs

1. Added [rehypeMermaid](https://github.com/natikgadzhi/respawn-io/blob/main/lib/rehypeMermaid.ts) from [respawn](https://github.com/natikgadzhi/respawn-io) to add a new feature that converts [mermaid](https://mermaid.js.org/) diagram into a svg element in mdx file. See [voip](https://hiltonchiang.github.io/blog/voip).

2. Added a component `ExtLink` to append an icon to anchor reference. Its usage like this 
<svg class="mr-2 flex-shrink-0" height="16" stroke-linejoin="round" version="1.1" viewBox="0 0 16 16" width="16" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"></path></svg>


```
    This is a EXtLink< text="reftext" />](refurl)
```

## Licence

[MIT](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/main/LICENSE) 
