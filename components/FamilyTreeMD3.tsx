'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD3 = () => {
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

        %% First Daughter %%
        蔣玉芳((蔣玉芳)) e13@--> 玉芳家((玉芳家<br/>入臺第二代)):::blue
        張亞明((張亞明)) --- 玉芳家
        玉芳家 e14@--長女--> 張婷怡((張婷怡)) e15@--> 廷霖家((廷霖家)):::blue
        姜廷霖((姜廷霖)) --- 廷霖家
        廷霖家 e16@--長女--> 姜勻婕((姜勻婕))
        玉芳家 e17@--長子--> 張迺翔((張迺翔))
        
        e13@{ animate: true } 
        e14@{ animate: true } 
        e15@{ animate: true } 
        e16@{ animate: true } 
        e17@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} />
}
export default FamilyTreeMD3
