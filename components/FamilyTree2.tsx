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
title: 文彬家譜樹
---
    flowchart LR
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000

        %% First Daughter %%
        G1((文彬家<br/>入臺第一代)):::blue L_G1_蔣玉芳_0@--> 蔣玉芳
        蔣玉芳((蔣玉芳)) L_蔣玉芳_玉芳家_0@--> 玉芳家((玉芳家<br/>入臺第二代)):::blue
        張亞明((張亞明)) --- 玉芳家
        玉芳家 L_玉芳家_張婷怡_0@--長女--> 張婷怡((張婷怡)) L_張婷怡_廷霖家_0@--> 廷霖家((廷霖家)):::blue
        姜廷霖((姜廷霖)) --- 廷霖家
        廷霖家 L_廷霖家_姜勻婕_0@--長女--> 姜勻婕((姜勻婕))
        玉芳家 L_玉芳家_張迺翔_0@--長子--> 張迺翔((張迺翔))
        %%  First Son %%
        G1 L_G1_蔣玉華_0@--> 蔣玉華
        蔣玉華((蔣玉華)):::green L_蔣玉華_玉華家_0@--> 玉華家((玉華家<br/>入臺第二代)):::blue
        楊鴻娟((楊鴻娟)) --- 玉華家
        玉華家 L_玉華家_蔣欣潔_0@--長女--> 蔣欣潔((蔣欣潔)) L_蔣欣潔_明同家_0@---> 明同家((明同家)):::blue
        謝明同((謝明同)) --- 明同家
        明同家 L_明同家_謝詠真_0@--長女--> 謝詠真((謝詠真))
        明同家 L_明同家_謝妍廷_0@--次女--> 謝妍廷((謝妍廷))
        玉華家 L_玉華家_蔣昌翰_0@--長子--> 蔣昌翰((蔣昌翰)) L_蔣昌翰_昌翰家_0@--> 昌翰家((昌翰家<br/>入臺第三代)):::blue
        林思吟((林思吟))--- 昌翰家
        昌翰家 L_昌翰家_蔣允傑_0@--長子--> 蔣允傑((蔣允傑)) --- 第四代((入臺第四代)):::blue
        昌翰家 L_昌翰家_蔣翊弘_0@--次子--> 蔣翊弘((蔣翊弘)) --- 第四代

        click 昌翰家 "昌字輩"
        click 第四代 "有字輩"
        %% Second Daughter %%
        G1 L_G1_蔣玉萍_0@--> 蔣玉萍
        蔣玉萍((蔣玉萍)) L_蔣玉萍_玉萍家_0@--> 玉萍家((玉萍家<br/>入臺第二代)):::blue
        李興安((李興安)) --- 玉萍家
        玉萍家 L_玉萍家_李潔_0@--長女--> 李潔((李潔)) L_李潔_Camegla_0@--> Camegla((Camegla<br/>Family)):::blue
        Arthur((Arthur<br/>Camegla)) --- Camegla
        Camegla L_Camegla_River_0@--長子--> River((科李恩<br/>River))
        %% Third Daughter %%
        G1 L_G1_蔣玉遐_0@--> 蔣玉遐
        蔣玉遐((蔣玉遐)) L_蔣玉遐_玉遐家_0@--> 玉遐家((玉遐家<br/>入臺第二代)):::blue
        莊修源((莊修源)) --- 玉遐家
        玉遐家 L_玉遐家_莊詩詠_0@--長女--> 莊詩詠((莊詩詠)) L_莊詩詠_Meurer_0@--> Meurer((Meurer<br/>Family)):::blue
        Chris((Chris<br/>Meurer)) --- Meurer
        Meurer L_Meurer_Maxwell_0@--長子--> Maxwell((莊有珩<br/>Maxwell))
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
        click 第三代 "昌字輩"
        %% Fifth Daughter %%
        G1 e70@--> 蔣德純
        蔣德純((蔣德純)) e71@--> 德純家((德純家<br/>入臺第二代)):::blue
        黃俊峯((黃俊峯)) --- 德純家
        德純家 e72@--長女--> 黃茵((黃茵))
        
        L_G1_蔣玉芳_0@{ animate: true } 
        L_蔣玉芳_玉芳家_0@{ animate: true } 
        L_玉芳家_張婷怡_0@{ animate: true } 
        L_張婷怡_廷霖家_0@{ animate: true } 
        L_廷霖家_姜勻婕_0@{ animate: true } 
        L_玉芳家_張迺翔_0@{ animate: true } 
        L_G1_蔣玉華_0@{ animate: true } 
        L_蔣玉華_玉華家_0@{ animate: true } 
        L_玉華家_蔣欣潔_0@{ animate: true } 
        L_蔣欣潔_明同家_0@{ animate: true } 
        L_明同家_謝詠真_0@{ animate: true } 
        L_明同家_謝妍廷_0@{ animate: true } 
        L_玉華家_蔣昌翰_0@{ animate: true } 
        L_蔣昌翰_昌翰家_0@{ animate: true } 
        L_昌翰家_蔣允傑_0@{ animate: true } 
        L_昌翰家_蔣翊弘_0@{ animate: true } 
        L_G1_蔣玉萍_0@{ animate: true } 
        L_蔣玉萍_玉萍家_0@{ animate: true } 
        L_玉萍家_李潔_0@{ animate: true } 
        L_李潔_Camegla_0@{ animate: true } 
        L_Camegla_River_0@{ animate: true } 
        L_G1_蔣玉遐_0@{ animate: true } 
        L_蔣玉遐_玉遐家_0@{ animate: true } 
        L_玉遐家_莊詩詠_0@{ animate: true } 
        L_莊詩詠_Meurer_0@{ animate: true } 
        L_Meurer_Maxwell_0@{ animate: true }
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
