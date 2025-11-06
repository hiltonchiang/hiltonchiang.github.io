'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTree1 = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const textColor = resolvedTheme === 'dark' ? 'fill-lime-300' : 'fill-stone-500'
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
title: 蔣氏家譜樹
---
    flowchart LR
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000
        %% GENERATION 7 %%
        Fa1((蔣超元)):::green e1@--> G3((超元家<br/>入川第七代)):::blue
        click Fa1 "蔣超元:譜名仁孝<br/>生於1870年2月24日<br/>歿於民國32年（1943年）陰曆11月11日<br/>葬於雙江鎮老鸛嘴新房子山後"
        
        Mo1((蔣胡氏)):::green --- G3 
        click Mo1 "蔣胡氏<br/>生於1880年6月14日<br/>歿於民國46年（1957年)<br/>葬於雙江鎮老鸛嘴新房子山後"
    
        click G3 "仁字輩"
        %% GENERATION 8 %%
        G3 e2@--長子--> Fa((蔣文彬)):::green e3@--> G2((文彬家<br/>入川第八代<br/>入臺第一代)):::blue
        click Fa "蔣文彬:譜名必兵<br/>生於民國11年（1922年）陰曆1月1日於四川潼南雙江鎮老鸛嘴新房子<br/>歿於民國73年（1984年）陽曆10月19日於臺北榮總<br/>葬於臺北觀音山<br/>配劉文筠,育有二子五女"

        Mo((劉文筠)):::green --- G2
        click Mo "劉文筠:譜名祖貞<br/>生於民國14年（1925年）陰曆6月15日於雙江鎮外北街10號<br/>歿於民國110年（2021年）陰曆1月14日於臺北家中<br/>與夫同葬於台北觀音山"

        click G2 "必字輩"
        %% GENERATION 9 %%
        G2 e4@--> S0((蔣大毛)):::green
        click S0 "蔣大毛<br/>生於民國35年（1946年）6月13日於重慶<br/>然未及7日即夭折"
        G2 e5@--長女--> S1((蔣玉芳))
        click S1 "蔣玉芳<br/>生於民國37年（1948年）陰曆9月28日於上海<br/>適張亞明、︁育有一女張婷怡、︁一子張廼翔<br/>今居台北"
        G2 e6@--長子--> Or((蔣玉華)):::green
        click Or "蔣玉華<br/>生於民國40年（1951年）陽曆6月1日於臺北<br/>卒於民國91年（2002年）10月1日於雲南<br/>葬於臺北五指山國軍公墓<br/>配楊鴻娟︁、︁育有一女蔣欣潔、︁一子蔣昌翰"
        S0 e18@--> G1
        S1 e19@--> G1
        Or e20@--> G1((入臺第二代)):::blue
        click G1 "愈字輩"
        G2 e7@--次女--> S3((蔣玉萍))
        G2 e8@--三女--> S4((蔣玉遐))
        G2 e9@--四女--> S5((蔣玉蘭))
        G2 e10@--次子--> S6((蔣玉明))
        G2 e11@--五女--> S7((蔣德純))
        S3 e21@--> G1
        S4 e22@--> G1
        S5 e23@--> G1
        S6 e24@--> G1
        S7 e25@--> G1
        e1@{ animate: true } 
        e2@{ animate: true } 
        e3@{ animate: true } 
        e4@{ animate: true } 
        e5@{ animate: true } 
        e6@{ animate: true } 
        e7@{ animate: true } 
        e8@{ animate: true } 
        e9@{ animate: true } 
        e10@{ animate: true } 
        e11@{ animate: true } 
        e19@{ animate: true } 
        e20@{ animate: true } 
        e21@{ animate: true } 
        e22@{ animate: true } 
        e23@{ animate: true } 
        e24@{ animate: true } 
        e25@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} />
}
export default FamilyTree1
