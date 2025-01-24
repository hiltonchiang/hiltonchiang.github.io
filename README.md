
# Hilton's Blog using Tailwind Nextjs Starter

This is a [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) blogging starter template. Version 2 is based on Next App directory with [React Server Component](https://nextjs.org/docs/getting-started/react-essentials#server-components) and uses [Contentlayer](https://www.contentlayer.dev/) to manage markdown content.


## Credits

This project is forked from [Timothy Lin](https://www.timlrx.com)

## ChangeLogs

1. Added [rehypeMermaid](https://github.com/natikgadzhi/respawn-io/blob/main/lib/rehypeMermaid.ts) from [respawn](https://github.com/natikgadzhi/respawn-io) to add a new feature that converts [mermaid](https://mermaid.js.org/) diagram into a svg element in mdx file. See [voip](https://hiltonchiang.github.io/blog/voip).

    Its usage is like this:

```
```mermaid
   sequenceDiagram
     balabala
    
```

2. Added a component `ExtLink` to append an ![icon](/public/static/images/extlink.png) to anchor reference.

    Its usage is like this:

```
    This is a [ExtLink< text="reftext" />](refurl)

    And it will look like [reftext](refurl) ![icon](/public/static/images/extlink.png)
```


3. Added profile catagories


## Licence

[MIT](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/main/LICENSE) 
