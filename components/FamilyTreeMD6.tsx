'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD6 = () => {
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


        %% Third Daughter %%
        蔣玉遐((蔣玉遐)) e41@--> 玉遐家((玉遐家<br/>入臺第二代)):::blue
        莊修源((莊修源)) --- 玉遐家
        玉遐家 e42@--長女--> 莊詩詠((莊詩詠)) e43@--> Meurer((Meurer<br/>Family)):::blue
        Chris((Chris<br/>Meurer)) --- Meurer
        Meurer e44@--長子--> Maxwell((莊有珩<br/>Maxwell))
                
        e41@{ animate: true } 
        e42@{ animate: true } 
        e43@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} mDevice={true} />
}
export default FamilyTreeMD6
