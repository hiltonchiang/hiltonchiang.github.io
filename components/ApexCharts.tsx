'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import YahooFinance from 'yahoo-finance2'
import React, { useState } from 'react'
import { ApexOptions } from 'apexcharts'
import { ChartResultArray } from 'yahoo-finance2/esm/src/modules/chart.js'
import useWindowDimensions from '@/components/WindowDimension'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})
const YFD3Buttons = dynamic(() => import('@/components/YFD3Buttons'), {
  ssr: false,
})
// Define the type for a single data point (OHLC: Open, High, Low, Close)
interface CandlestickDataPoint {
  x: Date
  y: [number | null, number | null, number | null, number | null]
}
interface LineDataPoint {
  x: Date
  y: number | null
}
interface LineVolumePoint {
  x: Date
  y: number | null
  v: number | null
}
// Define the type for the series data array
interface CandlestickSeries {
  name: string
  data: CandlestickDataPoint[]
}
interface LineSeries {
  name: string
  data: LineDataPoint[]
}
interface LineVolumeSeries {
  name: string
  data: LineVolumePoint[]
}
export interface CandlestickChartProps {
  title: string
  D: ChartResultArray
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ title, D }) => {
  const { height, width } = useWindowDimensions()
  const breakpoint = 768 // Example breakpoint for mobile/desktop
  const isMobile = width && width <= breakpoint ? true : false
  const [buttonClicked, setButtonClicked] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  // console.log('ApexChart', title, 'data', D)
  const quotesData: CandlestickDataPoint[] = [] as CandlestickDataPoint[]
  const lineData: LineDataPoint[] = [] as LineDataPoint[]
  const lineVolumeData: LineVolumePoint[] = [] as LineVolumePoint[]
  console.log('CandlestickChart theme', resolvedTheme)
  for (let i = 0; i < D.quotes.length; i++) {
    const Q = D.quotes[i]
    const X = new Date(Q.date.getTime() - 13 * 60 * 60 * 1000) // US ET
    const open = Q && Q.open ? Math.round(Q.open * 100) / 100 : null
    const high = Q && Q.high ? Math.round(Q.high * 100) / 100 : null
    const low = Q && Q.low ? Math.round(Q.low * 100) / 100 : null
    const close = Q && Q.close ? Math.round(Q.close * 100) / 100 : null
    const volume = Q && Q.volume ? Math.round(Q.volume * 100) / 100 : null
    quotesData.push({ x: X, y: [open, high, low, close] })
    lineData.push({ x: X, y: close })
    lineVolumeData.push({ x: X, y: close, v: volume })
  }
  const [series1] = useState<CandlestickSeries[]>([
    {
      name: 'Stock Price',
      data: quotesData,
    },
  ])
  const [series2] = useState<LineSeries[]>([
    {
      name: 'Stock Price',
      data: lineData,
    },
  ])
  const [options1] = useState<ApexOptions>({
    chart: {
      type: 'candlestick',
      height: 600,
      toolbar: {
        show: true, // Enable toolbar for zoom/pan
      },
    },
    title: {
      text: title,
      align: 'left',
    },
    xaxis: {
      type: 'datetime', // Important: use 'datetime' type for date objects
      labels: {
        datetimeUTC: false, // Set to false to use local time zone
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#00B746', // Customize colors if desired
          downward: '#EF403C',
        },
      },
    },
  })
  const [options2] = useState<ApexOptions>({
    chart: {
      type: 'line',
      height: 600,
      toolbar: {
        show: true, // Enable toolbar for zoom/pan
      },
    },
    title: {
      text: title,
      align: 'center',
    },
    xaxis: {
      type: 'datetime', // Important: use 'datetime' type for date objects
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#00B746', // Customize colors if desired
          downward: '#EF403C',
        },
      },
    },
    stroke: {
      curve: ['smooth', 'monotoneCubic'],
      lineCap: 'round',
      width: 3,
    },
  })
  const [options3, setOptions3] = useState<ApexOptions>({
    chart: {
      height: 'auto',
      type: 'line', // Default type, can be overridden in series
      stacked: false,
    },
    series: [
      {
        name: 'Stock Price',
        type: 'line',
        data: lineVolumeData.map((item) => ({ x: item.x, y: item.y })), // Map data for price line
        color: '#008FFB',
      },
      {
        name: 'Volume',
        type: 'column',
        data: lineVolumeData.map((item) => ({ x: item.x, y: item.v })), // Map data for volume columns
        color: '#00E396',
      },
    ],
    stroke: {
      lineCap: 'round',
      curve: ['smooth', 'monotoneCubic'],
      width: [2, 0], // Line width for price series, 0 for volume series
    },
    title: {
      text: title,
      align: 'left',
    },
    subtitle: {
      text: D.meta.longName,
      align: 'center',
    },
    xaxis: {
      type: 'datetime', // X-axis is time-series
      labels: {
        datetimeUTC: false, // Set to false to use local time zone
      },
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB',
        },
        labels: {
          style: {
            colors: '#008FFB',
          },
        },
        title: {
          text: 'Price ($)',
          style: {
            color: '#008FFB',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396',
        },
        labels: {
          style: {
            colors: '#00E396',
          },
          formatter: function (val) {
            if (val && val > 1000000) val = val / 10000000
            return val?.toFixed(2)
          },
        },
        title: {
          text: 'Volume (M)',
          style: {
            color: '#00E396',
          },
        },
        opposite: true, // Place this Y-axis on the right side
      },
    ],
    tooltip: {
      theme: resolvedTheme,
      fillSeriesColor: true,
      fixed: {
        enabled: true,
        position: 'topLeft', // or 'topRight', 'bottomLeft', 'bottomRight'
        offsetY: 30,
        offsetX: 60,
      },
      y: {
        formatter: function (val, opts) {
          if (opts.seriesIndex === 0) {
            return '$' + val?.toFixed(2)
          } else {
            return val?.toFixed(0)
          }
        },
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
    responsive: [
      {
        breakpoint: 768, // Adjust options when screen width is 480px or less
        options: {
          chart: {
            height: 300, // New height for mobile devices
            width: '100%', // Ensure it takes the full width of its container
            toolbar: {
              show: false,
            },
          },
          tooltip: {
            enabled: false,
          },
          series: [
            {
              name: '',
            },
            {
              name: '',
            },
          ],
          subtitle: {
            text: undefined,
          },
          yaxis: [
            {
              title: {
                text: undefined,
              },
              labels: {
                show: false,
              },
            },
            {
              title: {
                text: undefined,
              },
              labels: {
                show: false,
              },
            },
          ],
          dataLabels: {
            enabled: false, // Hide data labels (names/values)
          },
          markers: {
            size: 0, // Hide markers (dots)
          },
          legend: {
            show: false,
            formatter: function (seriesName, opts) {
              if (seriesName === 'Stock Price' || seriesName === 'Volume') {
                return null
              }
              return seriesName
            },
          },
        },
      },
    ],
  })
  /**
   *
   */
  function handleButtonClicked(O: CandlestickChartProps) {
    console.log('ApxCharters handleBuffonClicked')
    // CandlestickChart(O.title, O.D)
    const opt: ApexOptions = options3
    const lineVolumeData: LineVolumePoint[] = [] as LineVolumePoint[]
    for (let i = 0; i < O.D.quotes.length; i++) {
      const Q = O.D.quotes[i]
      const X = new Date(Q.date.getTime() - 13 * 60 * 60 * 1000)
      const close = Q && Q.close ? Math.round(Q.close * 100) / 100 : null
      const volume = Q && Q.volume ? Math.round(Q.volume * 100) / 100 : null
      lineVolumeData.push({ x: X, y: close, v: volume })
    }
    interface LVProps {
      x: Date
      y: number | null
    }
    if (opt.series) {
      const D1: LVProps[] = [] as LVProps[]
      const D2: LVProps[] = [] as LVProps[]
      for (let i = 0; i < lineVolumeData.length; i++) {
        const L = lineVolumeData[i]
        D1.push({ x: L.x, y: L.y })
        D2.push({ x: L.x, y: L.v })
      }
      opt.series = [
        {
          name: 'Stock Price',
          type: 'line',
          data: D1,
          color: '#008FFB',
        },
        {
          name: 'Volume',
          type: 'column',
          data: D2,
          color: '#00E396',
        },
      ]
      setOptions3(opt)
    }
  }
  /**
   *
   */
  return (
    <div id="chart">
      <ReactApexChart options={options3} series={options3.series} type="line" />
      <YFD3Buttons onButtonClicked={handleButtonClicked} />
    </div>
  )
}

export default CandlestickChart
