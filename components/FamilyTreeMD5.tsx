'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD5 = () => {
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
title: 玉萍家譜樹
---
    flowchart TD
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000

        %% Second Daughter %%
        蔣玉萍((蔣玉萍)) e32@--> 玉萍家((玉萍家<br />入臺第二代)):::blue
        李興安((李興安)) --- 玉萍家
        玉萍家 e33@--長女--> 李潔((李潔)) e34@--- Camegla((Camegla<br />Family)):::blue
        Arthur((Arthur<br />Camegla)) --- Camegla
        Camegla e35@--長子--> River((科李恩<br />River))
        Camegla e36@--次子--> Caleb((科李迦<br />Caleb))
                
        e32@{ animate: true } 
        e33@{ animate: true } 
        e34@{ animate: true } 
        e35@{ animate: true }
        e36@{ animate: true }
`
  return <Mermaid chart={familyTreeCode} mDevice={true} />
}
export default FamilyTreeMD5
