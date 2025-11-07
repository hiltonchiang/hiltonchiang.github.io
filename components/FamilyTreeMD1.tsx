'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD1 = () => {
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
    flowchart TD
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000
        %% GENERATION 7 %%
        蔣以懋((蔣以懋)):::green e0@-->G4((以懋家<br/>入川第六代)):::blue
        周氏((周氏)):::green ---G4
        G4 e01@-->Fa1
        click G4 "以字輩"
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
        
        e0@{ animate: true } 
        e01@{ animate: true } 
        e1@{ animate: true } 
        e2@{ animate: true } 
        e3@{ animate: true } 
         
`
  return <Mermaid chart={familyTreeCode} mDevice={true} />
}
export default FamilyTreeMD1
