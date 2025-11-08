'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD7 = () => {
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

        %% Fourth Daughter %%
        蔣玉蘭((蔣玉蘭)) e50@--> 玉蘭家((玉蘭家<br/>入臺第二代)):::blue
        林祝弘((林祝弘)) --- 玉蘭家
        玉蘭家 e51@--長子--> 林浩喻((林浩喻))
        玉蘭家 e52@--長女--> 林天惠((林天惠)) e53@--> 奕任家((奕任家)):::blue
        林奕任((林奕任)) --- 奕任家
        奕任家 e54@--長女--> 林芮年((林芮年))
        奕任家 e55@--長子--> 林芮薪((林芮薪))
        
        
        e50@{ animate: true } 
        e51@{ animate: true } 
        e52@{ animate: true } 
        e53@{ animate: true } 
        e54@{ animate: true } 
        e55@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} mDevice={true} />
}
export default FamilyTreeMD7
