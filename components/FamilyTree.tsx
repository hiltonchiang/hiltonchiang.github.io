'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/Mermaid'), {
  ssr: false,
})
export {} // This makes the file a module, preventing global scope pollution issues
declare global {
  interface Window {
    callAlert: (message: string) => {
      alert(message)
    }
  }
}

const callAlert = () => {
  console.log('callAlert')
}

const FamilyTree = () => {
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
---
    flowchart LR
        %% Colors %%
        classDef blue fill:#66deff,stroke:#000,color:#000
        classDef green fill:#6ad98b,stroke:#000,color:#000
        classDef pink fill:#ffc0cb,stroke:#000,color:#000
        %% GENERATION 7 %%
        Fa1(蔣超元):::green --> G3(入川第七代):::blue
        click Fa1 "譜名仁孝,生於1870年2月24日,歿於民國32年（1943年）陰曆11月11日,葬於雙江鎮老鸛嘴新房子山後"
        
        Mo1(蔣胡氏):::green --- G3 
        click Mo1 "生於1880年6月14日,歿於民國46年（1957年),葬於雙江鎮老鸛嘴新房子山後"
    
        %% GENERATION 8 %%
        G3 --長子--> Fa(蔣文彬):::green --- G2(入臺第一代):::blue
        click Fa "譜名必兵,生於民國11年（1922年）陰曆1月1日於四川潼南雙江鎮老鸛嘴新房子,歿於民國73年（1984年）陽曆10月19日於臺北榮總,葬於臺北觀音山,配劉文筠,育有二子五女"

        Mo(劉文筠):::green --- G2
        click Mo "譜名祖貞,生於民國14年（1925年）陰曆6月15日於雙江鎮外北街10號,歿於民國110年（2021年）陰曆1月14日於臺北家中,與夫同葬於台北觀音山"
        
        %% GENERATION 9 %%
        G2 --> S0(蔣大毛)
        G2 --長女--> S1(蔣玉芳)
        G2 --長子--> Or(蔣玉華):::green
        S0 --- G1
        S1 --- G1
        Or --- G1(入臺第二代):::blue
        G2 --次女--> S3(蔣玉萍)
        G2 --三女--> S4(蔣玉遐)
        G2 --四女--> S5(蔣玉蘭)
        G2 --次子--> S6(蔣玉明)
        G2 --五女--> S7(蔣德純)
        S3 --- G1
        S4 --- G1
        S5 --- G1
        S6 --- G1
        S7 --- G1

        %% First Daughter %%
        G1 --> 蔣玉芳
        蔣玉芳(蔣玉芳) --> 玉芳家(玉芳家):::blue
        張亞明(張亞明) --- 玉芳家
        玉芳家 --長女--> 張婷怡(張婷怡) --- 廷霖家(廷霖家):::blue
        姜廷霖(姜廷霖) --- 廷霖家
        廷霖家--長女--> 姜勻婕(姜勻婕)
        玉芳家 --長子--> 張迺翔(張迺翔)

        %%  First Son %%
        G1 --> 蔣玉華
        蔣玉華(蔣玉華):::green --> 玉華家(玉華家):::blue
        楊鴻娟(楊鴻娟) --- 玉華家
        玉華家 --長女--> 蔣欣潔(蔣欣潔) --- 明同家(明同家):::blue
        謝明同(謝明同) --- 明同家
        明同家 --長女--> 謝詠真(謝詠真)
        明同家 --次女--> 謝延庭(謝延庭)
        玉華家 --長子--> 蔣昌翰(蔣昌翰) --- 昌翰家(入臺第三代):::blue
        昌翰家 --長子--> 蔣允傑(蔣允傑) --- 第四代(入臺第四代):::blue
        昌翰家 --次子--> 蔣翊弘(蔣翊弘) --- 第四代
        蔣欣潔 --- 昌翰家
        %% Second Daughter %%
        G1 --> 蔣玉萍
        蔣玉萍(蔣玉萍) --> 玉萍家(玉萍家):::blue
        李興安(李興安) --- 玉萍家
        玉萍家 --長女--> 李潔(李潔) --- Camegla(Camegla):::blue
        Arthur(Arthur Camegla) --- Camegla
        Camegla --長子--> River(科李恩)
        %% Third Daughter %%
        G1 --> 蔣玉遐
        蔣玉遐(蔣玉遐) --> 玉遐家(玉遐家):::blue
        莊修源(莊修源) --- 玉遐家
        玉遐家 --長女--> 莊詩詠(莊詩詠) --- Meurer(Meurer):::blue
        Chris(Chris Meurer) --- Meurer
        Meurer --長子--> Maxwell(莊有珩)
        %% Fourth Daughter %%
        G1 --> 蔣玉蘭
        蔣玉蘭(蔣玉蘭) --> 玉蘭家(玉蘭家):::blue
        林祝弘(林祝弘) --- 玉蘭家
        玉蘭家 --長子--> 林浩喻(林浩喻)
        玉蘭家 --長女--> 林天惠(林天惠) --- 奕任家(奕任家):::blue
        林奕任(林奕任) --- 奕任家
        奕任家--長女--> 林芮年(林芮年)
        奕任家--長子--> 林芮薪(林芮薪)
        %% Second Son %%
        G1 --> 蔣玉明
        蔣玉明(蔣玉明) --> 玉明家(玉明家):::blue
        張美惠(張美惠) --- 玉明家
        玉明家 --長子--> 蔣昌霖(蔣昌霖) --- 第三代(入臺第三代):::blue
        玉明家 --次子--> 蔣昌湛(蔣昌湛) 
        蔣昌湛 --- 第三代
        %% Fifth Daughter %%
        G1 --> 蔣德純
        蔣德純(蔣德純) --> 德純家(德純家):::blue
        黃俊峯(黃俊峯) --- 德純家
        德純家 --長女--> 黃茵(黃茵)
  `
  return <Mermaid chart={familyTreeCode} />
}
export default FamilyTree
