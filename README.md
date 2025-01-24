
# Hilton's Blog using Tailwind Nextjs Starter

This is a [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) blogging starter template. Version 2 is based on Next App directory with [React Server Component](https://nextjs.org/docs/getting-started/react-essentials#server-components) and uses [Contentlayer](https://www.contentlayer.dev/) to manage markdown content.


## Credits

This project is forked from [Timothy Lin](https://www.timlrx.com)

## ChangeLogs

1. Added [rehypeMermaid](https://github.com/natikgadzhi/respawn-io/blob/main/lib/rehypeMermaid.ts) from [respawn](https://github.com/natikgadzhi/respawn-io) to add a new feature that converts [mermaid](https://mermaid.js.org/) diagram into a svg element in mdx file. See [voip](https://hiltonchiang.github.io/blog/voip).

2. Added a component `ExtLink` to append an icon to anchor reference. Its usage like this 

```
    This is a [EXtLink< text="reftext" />](refurl)
```

And it will look like [reftext ](refurl)![](/public/static/images/extlink.svg)

## Licence

[MIT](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/main/LICENSE) 
