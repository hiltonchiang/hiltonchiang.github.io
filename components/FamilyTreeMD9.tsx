'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD9 = () => {
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
title: 德純家譜樹
---
    flowchart TD
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000

        %% Fifth Daughter %%
        蔣德純((蔣德純)) e71@--> 德純家((德純家<br/>入臺第二代)):::blue
        黃俊峯((黃俊峯)) --- 德純家
        德純家 e72@--長女--> 黃茵((黃茵))
        
        e71@{ animate: true } 
        e72@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} mDevice={true} />
}
export default FamilyTreeMD9
