'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTreeMD4 = () => {
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
title: 玉華家譜樹
---
    flowchart TD
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000

        %%  First Son %%
        蔣玉華((蔣玉華)):::green e21@--> 玉華家((玉華家<br />入臺第二代)):::blue
        楊鴻娟((楊鴻娟)) --- 玉華家
        玉華家 e22@--長女--> 蔣欣潔((蔣欣潔)) e23@---> 明同家((明同家)):::blue
        謝明同((謝明同)) --- 明同家
        明同家 e24@--長女--> 謝詠真((謝詠真))
        明同家 e25@--次女--> 謝妍廷((謝妍廷))
        玉華家 e26@--長子--> 蔣昌翰((蔣昌翰)) e27@--> 昌翰家((昌翰家<br />入臺第三代)):::blue
        林思吟((林思吟))--- 昌翰家
        昌翰家 e28@--長子--> 蔣允傑((蔣允傑)) --- 第四代((入臺第四代)):::blue
        昌翰家 e29@--次子--> 蔣翊弘((蔣翊弘)) --- 第四代

        click 昌翰家 "昌字輩"
        click 第四代 "有字輩"
                
        e21@{ animate: true } 
        e22@{ animate: true } 
        e23@{ animate: true } 
        e24@{ animate: true } 
        e25@{ animate: true } 
        e26@{ animate: true } 
        e27@{ animate: true } 
        e28@{ animate: true } 
        e29@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} mDevice={true} />
}
export default FamilyTreeMD4
