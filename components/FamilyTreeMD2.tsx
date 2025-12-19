'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD2 = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const textColor = resolvedTheme === 'dark' ? '#bef264' : '#78716c'
  const familyTreeCode = `---
config:
    theme: 'forest'
    securityLevel: 'loose'
    themeVariables:
        primaryColor: '#BB2528'
        primaryTextColor: '#000000'
        primaryBorderColor: '#7C0000'
        lineColor: '#F8B229'
        secondaryColor: '#006100'
        tertiaryColor: '#fff'
title: 文彬家譜樹
---
    flowchart LR
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000
        %% GENERATION 9 %%
        G2((文彬家<br />入臺第一代)):::blue e4@--> S0((蔣大毛)):::green
        click S0 "蔣大毛<br />生於民國35年（1946年）6月13日於重慶<br />然未及7日即夭折"
        G2 e5@--長女--> S1((蔣玉芳))
        click S1 "蔣玉芳<br />生於民國37年（1948年）陰曆9月28日於上海<br />適張亞明、︁育有一女張婷怡、︁一子張廼翔<br />今居台北"
        G2 e6@--長子--> Or((蔣玉華)):::green
        click Or "蔣玉華<br />生於民國40年（1951年）陽曆6月1日於臺北<br />卒於民國91年（2002年）10月1日於雲南<br />葬於臺北五指山國軍公墓<br />配楊鴻娟︁、︁育有一女蔣欣潔、︁一子蔣昌翰"
        click G1 "愈字輩"
        G2 e7@--次女--> S3((蔣玉萍))
        G2 e8@--三女--> S4((蔣玉遐))
        G2 e9@--四女--> S5((蔣玉蘭))
        G2 e10@--次子--> S6((蔣玉明))
        G2 e11@--五女--> S7((蔣德純))
        e4@{ animate: true } 
        e5@{ animate: true } 
        e6@{ animate: true } 
        e7@{ animate: true } 
        e8@{ animate: true } 
        e9@{ animate: true } 
        e10@{ animate: true } 
        e11@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} mDevice={true} />
}
export default FamilyTreeMD2
