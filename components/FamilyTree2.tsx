'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamily'), {
  ssr: false,
})

const FamilyTree2 = () => {
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

        %% First Daughter %%
        G1((文彬家<br/>入臺第一代)):::blue e12@--> 蔣玉芳
        蔣玉芳((蔣玉芳)) e13@--> 玉芳家((玉芳家<br/>入臺第二代)):::blue
        張亞明((張亞明)) --- 玉芳家
        玉芳家 e14@--長女--> 張婷怡((張婷怡)) e15@--> 廷霖家((廷霖家)):::blue
        姜廷霖((姜廷霖)) --- 廷霖家
        廷霖家 e16@--長女--> 姜勻婕((姜勻婕))
        玉芳家 e17@--長子--> 張迺翔((張迺翔))
        %%  First Son %%
        G1 e20@--> 蔣玉華
        蔣玉華((蔣玉華)):::green e21@--> 玉華家((玉華家<br/>入臺第二代)):::blue
        楊鴻娟((楊鴻娟)) --- 玉華家
        玉華家 e22@--長女--> 蔣欣潔((蔣欣潔)) e23@---> 明同家((明同家)):::blue
        謝明同((謝明同)) --- 明同家
        明同家 e24@--長女--> 謝詠真((謝詠真))
        明同家 e25@--次女--> 謝妍廷((謝妍廷))
        玉華家 e26@--長子--> 蔣昌翰((蔣昌翰)) e27@--> 昌翰家((昌翰家<br/>入臺第三代)):::blue
        林思吟((林思吟))--- 昌翰家
        昌翰家 e28@--長子--> 蔣允傑((蔣允傑)) --- 第四代((入臺第四代)):::blue
        昌翰家 e29@--次子--> 蔣翊弘((蔣翊弘)) --- 第四代

        click 昌翰家 "昌字輩"
        click 第四代 "有字輩"
        %% Second Daughter %%
        G1 e31@--> 蔣玉萍
        蔣玉萍((蔣玉萍)) e32@--> 玉萍家((玉萍家<br/>入臺第二代)):::blue
        李興安((李興安)) --- 玉萍家
        玉萍家 e33@--長女--> 李潔((李潔)) e34@--> Camegla((Camegla<br/>Family)):::blue
        Arthur((Arthur<br/>Camegla)) --- Camegla
        Camegla e35@--長子--> River((科李恩<br/>River))
        %% Third Daughter %%
        G1 e40@--> 蔣玉遐
        蔣玉遐((蔣玉遐)) e41@--> 玉遐家((玉遐家<br/>入臺第二代)):::blue
        莊修源((莊修源)) --- 玉遐家
        玉遐家 e42@--長女--> 莊詩詠((莊詩詠)) e43@--> Meurer((Meurer<br/>Family)):::blue
        Chris((Chris<br/>Meurer)) --- Meurer
        Meurer e44@--長子--> Maxwell((莊有珩<br/>Maxwell))
        %% Fourth Daughter %%
        G1 e501@--> 蔣玉蘭
        蔣玉蘭((蔣玉蘭)) e50@--> 玉蘭家((玉蘭家<br/>入臺第二代)):::blue
        林祝弘((林祝弘)) --- 玉蘭家
        玉蘭家 e51@--長子--> 林浩喻((林浩喻))
        玉蘭家 e52@--長女--> 林天惠((林天惠)) e53@--> 奕任家((奕任家)):::blue
        林奕任((林奕任)) --- 奕任家
        奕任家 e54@--長女--> 林芮年((林芮年))
        奕任家 e55@--長子--> 林芮薪((林芮薪))
        %% Second Son %%
        G1 e60@--> 蔣玉明
        蔣玉明((蔣玉明)) e61@--> 玉明家((玉明家<br/>入臺第二代)):::blue
        張美惠((張美惠)) --- 玉明家
        玉明家 e62@--長子--> 蔣昌霖((蔣昌霖)) --- 第三代((入臺第三代)):::blue
        玉明家 e63@--次子--> 蔣昌湛((蔣昌湛)) 
        蔣昌湛 --- 第三代
        %% Fifth Daughter %%
        G1 e70@--> 蔣德純
        蔣德純((蔣德純)) e71@--> 德純家((德純家<br/>入臺第二代)):::blue
        黃俊峯((黃俊峯)) --- 德純家
        德純家 e72@--長女--> 黃茵((黃茵))
        
        e12@{ animate: true } 
        e13@{ animate: true } 
        e14@{ animate: true } 
        e15@{ animate: true } 
        e16@{ animate: true } 
        e17@{ animate: true } 
        e20@{ animate: true } 
        e21@{ animate: true } 
        e22@{ animate: true } 
        e23@{ animate: true } 
        e24@{ animate: true } 
        e25@{ animate: true } 
        e26@{ animate: true } 
        e27@{ animate: true } 
        e28@{ animate: true } 
        e29@{ animate: true } 
        e31@{ animate: true } 
        e32@{ animate: true } 
        e33@{ animate: true } 
        e34@{ animate: true } 
        e35@{ animate: true } 
        e40@{ animate: true } 
        e41@{ animate: true } 
        e42@{ animate: true } 
        e43@{ animate: true } 
        e50@{ animate: true } 
        e501@{ animate: true } 
        e51@{ animate: true } 
        e52@{ animate: true } 
        e53@{ animate: true } 
        e54@{ animate: true } 
        e55@{ animate: true } 
        e60@{ animate: true } 
        e61@{ animate: true } 
        e62@{ animate: true } 
        e63@{ animate: true } 
        e70@{ animate: true } 
        e71@{ animate: true } 
        e72@{ animate: true } 
`
  return <Mermaid chart={familyTreeCode} mDevice={false} />
}
export default FamilyTree2
