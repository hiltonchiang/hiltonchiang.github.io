'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidFamilyRoot'), {
  ssr: false,
})

const FamilyTreeRoot = () => {
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
    logLevel: debug
title: 蔣氏家譜樹
---
    flowchart LR
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        classDef TransparentSubgraph fill:#00000000,stroke-width:0
        classDef invisible fill:#0000, stroke:#0000, color:#0000
        %% GENERATION 7 %%
        蔣以懋((蔣以懋)):::green -->G4((以懋家<br />入川第六代)):::blue
        L_蔣以懋_G4_0@{ animate: true }
        周氏((周氏)):::green ---G4
        G4 -->Fa1
        L_G4_Fa1_0@{ animate: true }
        click G4 "以字輩"
        Fa1((蔣超元)):::green --> G3((超元家<br />入川第七代)):::blue
        click Fa1 "蔣超元:譜名仁孝<br />生於1870年2月24日<br />歿於民國32年（1943年）陰曆11月11日<br />葬於雙江鎮老鸛嘴新房子山後"
        L_Fa1_G3_0@{ animate: true }
        
        Mo1((蔣胡氏)):::green --- G3 
        click Mo1 "蔣胡氏<br />生於1880年6月14日<br />歿於民國46年（1957年)<br />葬於雙江鎮老鸛嘴新房子山後"
    
        click G3 "仁字輩"
        %% GENERATION 8 %%
        G3 --長子--> Fa((蔣文彬)):::green --> G2((文彬家<br />入川第八代<br />入臺第一代)):::blue
        click Fa "蔣文彬:譜名必兵<br />生於民國11年（1922年）陰曆1月1日於四川潼南雙江鎮老鸛嘴新房子<br />歿於民國73年（1984年）陽曆10月19日於臺北榮總<br />葬於臺北觀音山<br />配劉文筠,育有二子五女"
        L_G3_Fa_0@{ animate: true }
        L_Fa_G2_0@{ animate: true }
        Mo((劉文筠)):::green --- G2
        click Mo "劉文筠:譜名祖貞<br />生於民國14年（1925年）陰曆6月15日於雙江鎮外北街10號<br />歿於民國110年（2021年）陰曆1月14日於臺北家中<br />與夫同葬於台北觀音山"

        click G2 "必字輩"
        %% GENERATION 9 %%
        G2 --> S0((蔣大毛)):::green
        L_G2_S0_0@{ animate: true }
        click S0 "蔣大毛<br />生於民國35年（1946年）6月13日於重慶<br />然未及7日即夭折"
        G2 --長女--> S1((蔣玉芳))
        click S1 "蔣玉芳<br />生於民國37年於上海<br />適張亞明、︁育有一女張婷怡、︁一子張廼翔<br />今居台北"
        L_G2_S1_0@{ animate: true }
        G2 --長子--> Or((蔣玉華)):::green
        click Or "蔣玉華<br />生於民國40年（1951年）陽曆6月1日於臺北<br />卒於民國91年（2002年）10月1日於雲南<br />葬於臺北五指山國軍公墓<br />配楊鴻娟︁、︁育有一女蔣欣潔、︁一子蔣昌翰"
        L_G2_Or_0@{ animate: true }
        S0 --> G1
        L_S0_G1_0@{ animate: true }
        S1 --> G1
        L_S1_G1_0@{ animate: true }
        Or --> G1((入臺第二代)):::blue
        L_Or_G1_0@{ animate: true }
        click G1 "愈字輩"
        G2 --次女--> S3((蔣玉萍))
        L_G2_S3_0@{ animate: true }
        G2 --三女--> S4((蔣玉遐))
        L_G2_S4_0@{ animate: true }
        G2 --四女--> S5((蔣玉蘭))
        L_G2_S5_0@{ animate: true }
        G2 --次子--> S6((蔣玉明))
        L_G2_S6_0@{ animate: true }
        G2 --五女--> S7((蔣德純))
        L_G2_S7_0@{ animate: true }
        S3 --> G1
        S4 --> G1
        S5 --> G1
        S6 --> G1
        S7 --> G1
         
        L_S3_G1_0@{ animate: true }
        L_S4_G1_0@{ animate: true }
        L_S5_G1_0@{ animate: true }
        L_S6_G1_0@{ animate: true }
        L_S7_G1_0@{ animate: true }
         
        %% First Daughter %%
        G1((文彬家<br />入臺第一代)):::blue L_G1_蔣玉芳_0@--> 蔣玉芳
        蔣玉芳((蔣玉芳)) L_蔣玉芳_玉芳家_0@--> 玉芳家((玉芳家<br />入臺第二代)):::blue
        張亞明((張亞明)) --- 玉芳家
        玉芳家 L_玉芳家_張婷怡_0@--長女--> 張婷怡((張婷怡)) L_張婷怡_廷霖家_0@--> 廷霖家((廷霖家)):::blue
        姜廷霖((姜廷霖)) --- 廷霖家
        廷霖家 L_廷霖家_姜勻婕_0@--長女--> 姜勻婕((姜勻婕))
        玉芳家 L_玉芳家_張迺翔_0@--長子--> 張迺翔((張迺翔))
        %%  First Son %%
        G1 L_G1_蔣玉華_0@--> 蔣玉華
        蔣玉華((蔣玉華)):::green L_蔣玉華_玉華家_0@--> 玉華家((玉華家<br />入臺第二代)):::blue
        楊鴻娟((楊鴻娟)) --- 玉華家
        玉華家 L_玉華家_蔣欣潔_0@--長女--> 蔣欣潔((蔣欣潔)) L_蔣欣潔_明同家_0@---> 明同家((明同家)):::blue
        謝明同((謝明同)) --- 明同家
        明同家 L_明同家_謝詠真_0@--長女--> 謝詠真((謝詠真))
        明同家 L_明同家_謝妍廷_0@--次女--> 謝妍廷((謝妍廷))
        玉華家 L_玉華家_蔣昌翰_0@--長子--> 蔣昌翰((蔣昌翰)) L_蔣昌翰_昌翰家_0@--> 昌翰家((昌翰家<br />入臺第三代)):::blue
        林思吟((林思吟))--- 昌翰家
        昌翰家 L_昌翰家_蔣允傑_0@--長子--> 蔣允傑((蔣允傑)) --- 第四代((入臺第四代)):::blue
        昌翰家 L_昌翰家_蔣翊弘_0@--次子--> 蔣翊弘((蔣翊弘)) --- 第四代

        click 昌翰家 "昌字輩"
        click 第四代 "有字輩"
        %% Second Daughter %%
        G1 L_G1_蔣玉萍_0@--> 蔣玉萍
        蔣玉萍((蔣玉萍)) L_蔣玉萍_玉萍家_0@--> 玉萍家((玉萍家<br />入臺第二代)):::blue
        李興安((李興安)) --- 玉萍家
        玉萍家 L_玉萍家_李潔_0@--長女--> 李潔((李潔)) L_李潔_Camegla_0@--> Camegla((Camegla<br />Family)):::blue
        Arthur((Arthur<br />Camegla)) --- Camegla
        Camegla L_Camegla_River_0@--長子--> River((科李恩<br />River))
        Camegla L_Camegla_River_0@--次子--> xx((科李仁))
        %% Third Daughter %%
        G1 L_G1_蔣玉遐_0@--> 蔣玉遐
        蔣玉遐((蔣玉遐)) L_蔣玉遐_玉遐家_0@--> 玉遐家((玉遐家<br />入臺第二代)):::blue
        莊修源((莊修源)) --- 玉遐家
        玉遐家 L_玉遐家_莊詩詠_0@--長女--> 莊詩詠((莊詩詠)) L_莊詩詠_Meurer_0@--> Meurer((Meurer<br />Family)):::blue
        Chris((Chris<br />Meurer)) --- Meurer
        Meurer L_Meurer_Maxwell_0@--長子--> Maxwell((莊有珩<br />Maxwell))
        %% Fourth Daughter %%
        G1 L_G1_蔣玉蘭_0@--> 蔣玉蘭
        蔣玉蘭((蔣玉蘭)) L_蔣玉蘭_玉蘭家_0@--> 玉蘭家((玉蘭家<br />入臺第二代)):::blue
        林祝弘((林祝弘)) --- 玉蘭家
        玉蘭家 L_玉蘭家_林浩喻_0@--長子--> 林浩喻((林浩喻))
        玉蘭家 L_玉蘭家_林天惠_0@--長女--> 林天惠((林天惠)) L_林天惠_奕任家_0@--> 奕任家((奕任家)):::blue
        林奕任((林奕任)) --- 奕任家
        奕任家 L_奕任家_林芮年_0@--長女--> 林芮年((林芮年))
        奕任家 L_奕任家_林芮薪_0@--長子--> 林芮薪((林芮薪))
        %% Second Son %%
        G1 e60@--> 蔣玉明
        蔣玉明((蔣玉明)) e61@--> 玉明家((玉明家<br />入臺第二代)):::blue
        張美惠((張美惠)) --- 玉明家
        玉明家 e62@--長子--> 蔣昌霖((蔣昌霖)) --- 第三代((入臺第三代)):::blue
        玉明家 e63@--次子--> 蔣昌湛((蔣昌湛)) 
        蔣昌湛 --- 第三代
        click 第三代 "昌字輩"
        %% Fifth Daughter %%
        G1 e70@--> 蔣德純
        蔣德純((蔣德純)) e71@--> 德純家((德純家<br />入臺第二代)):::blue
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
        L_G1_蔣玉蘭_0@{ animate: true } 
        L_蔣玉蘭_玉蘭家_0@{ animate: true } 
        L_玉蘭家_林浩喻_0@{ animate: true } 
        L_玉蘭家_林天惠_0@{ animate: true } 
        L_林天惠_奕任家_0@{ animate: true } 
        L_奕任家_林芮年_0@{ animate: true } 
        L_奕任家_林芮薪_0@{ animate: true } 
        e60@{ animate: true } 
        e61@{ animate: true } 
        e62@{ animate: true } 
        e63@{ animate: true } 
        e70@{ animate: true } 
        e71@{ animate: true } 
        e72@{ animate: true } 

`
  console.log('FamilyTreeRoot')
  return (
    <>
      <Mermaid chart={familyTreeCode} mDevice={false} />
    </>
  )
}
export default FamilyTreeRoot
