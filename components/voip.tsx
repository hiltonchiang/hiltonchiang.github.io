'use client'
import { WheelEvent } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Mermaid = dynamic(() => import('@/components/MermaidVoip'), {
  ssr: false,
})

const VoIPComponent = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const textColor = resolvedTheme === 'dark' ? '#777' : '#777'
  const actorColor = resolvedTheme === 'dark' ? '#cde498' : '#94a3b8'
  const sequenceColor = resolvedTheme === 'dark' ? '#777' : '#777'
  const voipCode_1 = `---
config:
    theme: 'forest'
    securityLevel: 'loose'
    themeVariables:
        primaryColor: '#BB2528'
        primaryTextColor: '${textColor}'
        primaryBorderColor: '#7C0000'
        lineColor: '#F8B229'
        secondaryColor: '#006100'
        tertiaryColor: '#fff'
    themeCSS: |
        .messageLine1:nth-of-type(1) { stroke: red; }; 
        .messageLine0:nth-of-type(2) { stroke: red; }; 
        .messageLine0:nth-of-type(3) { stroke: red; }; 
        .messageLine0:nth-of-type(4) { stroke: red; }; 
        .messageLine0:nth-of-type(5) { stroke: red; }; 
        .messageLine0:nth-of-type(6) { stroke: red; }; 
        .messageLine0:nth-of-type(7) { stroke: red; }; 
        .messageLine0:nth-of-type(8) { stroke: red; }; 
        .messageText:nth-of-type(1) { fill: green; font-size: 30px !important;};
        .messageText:nth-of-type(3) { fill: red; !important;};
        .messageText:nth-of-type(5) { fill: red; !important;};
        .messageText:nth-of-type(7) { fill: red; !important;};
        g:nth-of-type(1) text.actor.actor-box tspan { fill: ${textColor}; !important;};
        g:nth-of-type(3) text.actor.actor-box tspan { fill: ${textColor}; !important;};
        g:nth-of-type(5) text.actor.actor-box tspan { fill: ${textColor}; !important;};
        g:nth-of-type(7) text.actor.actor-box tspan { fill: ${textColor}; !important;};
        .sequenceNumber:nth-of-type(2) { fill: ${textColor}; !important; };
        .sequenceNumber:nth-of-type(4) { fill: ${textColor}; !important; };
        .sequenceNumber:nth-of-type(6) { fill: ${textColor}; !important; };
        .sequenceNumber:nth-of-type(8) { fill: ${textColor}; !important; };
        g:nth-of-type(10) text.noteText tspan { fill: ${textColor}; !important;};
        text:nth-of-type(9) { fill: ${textColor}; !important;};
        g:nth-of-type(5) .note { stroke:blue;fill: crimson; }; #arrowhead path {stroke: blue; fill:red;};
---
sequenceDiagram
    autonumber
    title Fig. 1 - Port Forwarding
    participant A as Alice <br/> 192.168.0.100
    participant B as NAT-1 <br/> 1.1.1.1
    participant C as NAT-2 <br/> 2.2.2.2
    participant D as Bob <br/> 192.168.0.99
    A-->D: Hello!
    A->>B: (192.168.0.100,SP,2.2.2.2,DP)
    B->>C: (1.1.1.1,SPx,2.2.2.2,DP)
    Note right of C: Port Forwarding
    C->>D: (1.1.1.1,SPx,192.168.0.99,DP)
  `
  const voipCode_2 = `---
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
    themeCSS: |
        .messageLine0:nth-of-type(1) { stroke: red; }; 
        .messageLine0:nth-of-type(3) { stroke: red; }; 
        .messageLine0:nth-of-type(5) { stroke: red; }; 
        .messageLine0:nth-of-type(7) { stroke: red; }; 
        .messageLine0:nth-of-type(9) { stroke: red; }; 
        .messageLine0:nth-of-type(11) { stroke: red; }; 
        .messageLine0:nth-of-type(13) { stroke: red; }; 
        .messageLine0:nth-of-type(15) { stroke: red; }; 

---
sequenceDiagram
    autonumber
    title Fig. 2 - private-to-public
    participant A as Alice <br/> 192.168.0.100
    participant B as Bob <br/> 192.168.0.101
    participant C as NAT-1 <br/> 1.1.1.1
    participant D as Charles <br/> 2.2.2.2
    A->>C: (192.168.0.100,SP,2.2.2.2,DP)
    C->>D: (1.1.1.1,SPx,2.2.2.2,DP)
    activate D
    D->>C: (2.2.2.2,DP,1.1.1.1, SPx)
    deactivate D
    C->>A: (2.2.2.2,DP,192.168.0.100,SP)
    B->>C: (192.168.0.101,SP,2.2.2.2,DP)
    C->>D: (1.1.1.1,SPy,2.2.2.2,DP)
    activate D
    D->>C: (2.2.2.2,DP, 1.1.1.1, SPy)
    deactivate D
    C->>B: (2.2.2.2,DP,192.168.0.101,SP)
    `
  const voipCode_3 = `---
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
    themeCSS: |
        .messageLine0:nth-of-type(1) { stroke: red; }; 
        .messageLine0:nth-of-type(3) { stroke: red; }; 
        .messageLine0:nth-of-type(5) { stroke: red; }; 
        .messageLine0:nth-of-type(7) { stroke: red; }; 
        .messageLine0:nth-of-type(9) { stroke: red; }; 
        .messageLine0:nth-of-type(11) { stroke: red; }; 
        .messageLine0:nth-of-type(13) { stroke: red; }; 

        .messageLine1:nth-of-type(1) { stroke: red; }; 
        .messageLine1:nth-of-type(3) { stroke: red; }; 
        .messageLine1:nth-of-type(5) { stroke: red; }; 
        .messageLine1:nth-of-type(7) { stroke: red; }; 

---
sequenceDiagram
    autonumber
    title Fig. 3 - Port Predicition & Hole Punching
    participant A as Alice <br/> 192.168.0.100
    participant B as NAT-1 <br/> 1.1.1.1
    participant E as Server <br/> 3.3.3.3
    participant C as NAT-2 <br/> 2.2.2.2
    participant D as Bob <br/> 192.168.0.99
    Note over A, E:Alice to call Bob 1 
    A->>B: (192.168.0.100,SPa,3.3.3.3,DPa)
    B->>E: (1.1.1.1,SP1,3.3.3.3,DPa)
    Note over A,D: Call Bob
    A->>B: (192.168.0.100,SPb,2.2.2.2,DPb)
    B--xC: (1.1.1.1,SP2,2.2.2.2,DPb)
    Note over A, E: Aclice to call Bob 2  
    A->>B: (192.168.0.100,SPc,3.3.3.3,DPc)
    B->>E: (1.1.1.1,SP3,3.3.3.3,DPc)
    Note over D, E: A Call from Alice with port range (SP1, SP3)
    Note over A, D: sending with port number within (SP1, SP3)
    D--xB: (2.2.2.2,DPb,1.1.1.1,SP1+1)
    D--xB: (2.2.2.2,DPb,1.1.1.1,SP1+2)
    D-->B: (2.2.2.2,DPb,1.1.1.1,SP1+3)
    D->>B: (2.2.2.2,DPb,1.1.1.1,SP1+x)
    B->>A: pass through with SP2
    D--xB: (2.2.2.2,DPb,1.1.1.1,SP3-1)
    `
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
      <div className="prose-xl max-w-none pb-8 pt-10 dark:prose-invert">
        <div className="group">
          <span className="inline-flex justify-between group-hover:-translate-x-2">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 1C4.22386 1 4 1.22386 4 1.5C4 1.77614 4.22386 2 4.5 2H12V13H4.5C4.22386 13 4 13.2239 4 13.5C4 13.7761 4.22386 14 4.5 14H12C12.5523 14 13 13.5523 13 13V2C13 1.44772 12.5523 1 12 1H4.5ZM6.60355 4.89645C6.40829 4.70118 6.09171 4.70118 5.89645 4.89645C5.70118 5.09171 5.70118 5.40829 5.89645 5.60355L7.29289 7H0.5C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H7.29289L5.89645 9.39645C5.70118 9.59171 5.70118 9.90829 5.89645 10.1036C6.09171 10.2988 6.40829 10.2988 6.60355 10.1036L8.85355 7.85355C9.04882 7.65829 9.04882 7.34171 8.85355 7.14645L6.60355 4.89645Z"
                fill="#fcd34d"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <span className="text-stone-500 dark:text-amber-300">STX</span>
        </div>
        <p>
          I initiated a VoIP company in 2000. It operated successfully until the introduction of
          free Skype. Our modest start-up was entirely impacted. Yet, the P2P NAT traversal
          technique we employed was quite innovative in the early 2000s. I will endeavor to briefly
          describe UDP/IP packet exchanges for devices located behind their configured NATs.
        </p>
        <h3 className="content-header" id="what-is-nat">
          <a className="break-words" href="#what-is-nat" aria-hidden="true" tabIndex={-1}>
            <span className="content-header-link">
              <svg
                className="linkicon h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"></path>
                <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"></path>
              </svg>
            </span>
          </a>
          What is NAT?
        </h3>
        <p>
          NAT (Network Address Translation) is needed for sending/receiving packets to/from outside.
          An IP packet has four tuples (Source Address, Source Port, Destination Address,
          Destination Port) for identifying the address and application for the packet. It's better
          to see a sequence diagram as depicted in the figure below.
        </p>
        <div id="figure1" className="md max-w-[1088px] transform-gpu p-4 hover:scale-150 md:w-full">
          <span id="figure1"></span>
          <div className="relative">
            <Mermaid chart={voipCode_1} />
          </div>
        </div>
        <p>
          As can be seen in the{' '}
          <a className="break-words" href="#figure1">
            Figure 1
          </a>
          , Alice has a private local IP address, 192.168.0.100; NAT-1 changes two tuples (Source
          Address, Source Port) of the packet before sending out, the packet reaches NAT-2, and
          NAT-2 can check (Destination Port) to see if is is a well-know port number and forwards
          the packet to its pre-assigned destination. This scenario is called{' '}
          <a
            className="break-words"
            target="_blank"
            rel="noopener noreferrer"
            href="https://en.wikipedia.org/wiki/Port_forwarding"
          >
            <span className="group inline-flex justify-between">
              port forwarding
              <span className="group-hover:translate-y-2">
                <svg
                  className="mr-2 flex-shrink-0"
                  height="16"
                  strokeLinejoin="round"
                  version="1.1"
                  viewBox="0 0 16 16"
                  width="16"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
                  ></path>
                </svg>
              </span>
            </span>
          </a>
          .
        </p>
        <p>
          Let's see another scenario, two clients sending different packets to the same server with
          a public IP address.
        </p>
        <div className="md max-w-[1088px] transform-gpu p-4 hover:scale-150 md:w-full">
          <span id="figure2"></span>
          <div className="relative">
            <Mermaid chart={voipCode_2} />
          </div>
        </div>
        <p>
          As can be seen in the{' '}
          <a className="break-words" href="#figure2">
            Figure 2
          </a>
          , NAT assigns two different Source Port, SPx and SPy for each packet. The reason is simple
          , NAT needs to send replied packets back to the source. NAT needs to keep track of the
          session, translated source port is the key.
        </p>
        <h3 className="content-header" id="nat-traversal">
          <a className="break-words" href="#nat-traversal" aria-hidden="true" tabIndex={-1}>
            <span className="content-header-link">
              <svg
                className="linkicon h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"></path>
                <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"></path>
              </svg>
            </span>
          </a>
          NAT Traversal
        </h3>
        <p>
          The method I used in my P2P VoIP network can be explained by this lengthy article{' '}
          <a
            className="break-words"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/P2PSP/core/blob/master/doc/NTS/NAT_traversal.md"
          >
            <span className="group inline-flex justify-between">
              NAT Traversal Techniques{' '}
              <span className="group-hover:translate-y-2">
                <svg
                  className="mr-2 flex-shrink-0"
                  height="16"
                  strokeLinejoin="round"
                  version="1.1"
                  viewBox="0 0 16 16"
                  width="16"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
                  ></path>
                </svg>
              </span>
            </span>
          </a>
          . I try to use a simplified figure to depict it.
        </p>
        <div className="md max-w-[1088px] transform-gpu p-4 hover:scale-150 md:w-full">
          <span id="figure3"></span>
          <div className="relative">
            <Mermaid chart={voipCode_3} />
          </div>
        </div>
        <p>
          The key is to have a server with a public IP address to help Alice and Bob who are sitting
          behind NATs with strict port checking rules. Alice sends three packets out to 'punch a
          hole'. Its sending order is important; first to server, second to Bob and third to server.
          So Server collects two packets with assigned source port number. This info is forwarded to
          Bob. Bob can use it to predict second packet's source port number by sending number of
          packets to Alice. Most of the time, it works.
        </p>
        <p>
          As seen in the{' '}
          <a className="break-words" href="#figure3">
            Figure 3
          </a>
          , Bob predicts SP2 by sending out many packets within the reang of (SP1, SP3).
        </p>
        <div className="group">
          <span className="inline-flex rotate-180 group-hover:-translate-x-2">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z"
                fill="#fcd34d"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </span>
          <span className="text-stone-500 dark:text-amber-300">-30-</span>
        </div>
      </div>
      <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
        <a
          className="break-words"
          target="_blank"
          rel="nofollow"
          href="https://github.com/hiltonchiang/hiltonchiang.github.io/discussions/"
        >
          Discuss on Github
        </a>
        •
        <a
          className="break-words"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/hiltonchiang/hiltonchiang.github.io/blob/main/data/blog/voip.mdx"
        >
          View on GitHub
        </a>
      </div>
      <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
        <span className="relative inline-flex">
          <button className="uppercase hover:text-primary-500">Load Comments &nbsp;</button>
          <span className="absolute right-0 top-0 -mr-1.5 -mt-1.5 ms-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
          </span>
        </span>
      </div>
    </div>
  )
}
export default VoIPComponent
