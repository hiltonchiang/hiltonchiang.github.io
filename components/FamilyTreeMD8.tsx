'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD8 = () => {
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
title: 玉明家譜樹
---
    flowchart TD
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000

        %% First Daughter %%

        %% Second Son %%
        蔣玉明((蔣玉明)) e61@--> 玉明家((玉明家<br/>入臺第二代)):::blue
        張美惠((張美惠)) --- 玉明家
        玉明家 e62@--長子--> 蔣昌霖((蔣昌霖)) --- 第三代((入臺第三代)):::blue
        玉明家 e63@--次子--> 蔣昌湛((蔣昌湛)) 
        蔣昌湛 --- 第三代
                
        e61@{ animate: true } 
        e62@{ animate: true } 
        e63@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} mDevice={true} />
}
export default FamilyTreeMD8
