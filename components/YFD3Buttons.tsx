import * as d3 from 'd3'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOpenCloseTime, updateButton } from '@/lib/actions'
import { YFProps } from '@/components/YahooFinance'
import { CandlestickChartProps } from '@/components/ApexCharts'
import {
  ChartResultArray,
  ChartResultArrayQuote,
  ChartOptionsWithReturnArray,
} from 'yahoo-finance2/esm/src/modules/chart.js'

/*
params: {
  enum: [
    '1m',  '2m',  '5m',
    '15m', '30m', '60m',
    '90m', '1h',  '1d',
    '5d',  '1wk', '1mo',
    '3mo'
  ]
}
*/
async function handleButton1D(name, callback) {
  console.log('button1D clicked')
  const today = new Date()
  const [estTime1, estTime2] = await getOpenCloseTime()
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '5m',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
async function handleButton5D(name, callback) {
  console.log('button5D clicked')
  const interval = 30 * 60 * 1000
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 4 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '30m',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results: ChartResultArray = (await updateButton(O)) as ChartResultArray
  if (results !== null) {
    const Quotes: ChartResultArrayQuote[] = [] as ChartResultArrayQuote[]
    let preDate: Date = new Date()
    for (let i = 0; i < results.quotes.length; i++) {
      const Q = results.quotes[i]
      if (i == 0) {
        preDate = Q.date
      }
      /*
      if (Q.date.getTime() - preDate.getTime() > interval) {
        Quotes.push({
          date: new Date(preDate.getTime() + interval),
          high: null,
          low: null,
          open: null,
          close: null,
          volume: null,
        })
      }
      Quotes.push(Q)
      preDate = Q.date
      */
      if (Q.volume !== 0) {
        Quotes.push(Q)
      }
    }
    console.log('button5D imputioned data', Quotes)
    results.quotes = Quotes
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
async function handleButton1M(name, callback) {
  console.log('button1M clicked')
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 30 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1d',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
async function handleButton6M(name, callback) {
  console.log('button6M clicked')
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 180 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '5d',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
async function handleButtonYTD(name, callback) {
  console.log('buttonYTD clicked')
  const year = new Date().getFullYear()
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(year + '-01-01')
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '5d',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
async function handleButton1Y(name, callback) {
  console.log('button1Y clicked')
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 365 * 24 * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1wk',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
async function handleButton5Y(name, callback) {
  console.log('button5Y clicked')
  const [tmp, estTime2] = await getOpenCloseTime()
  const estTime1 = new Date(tmp.getTime() - 5 * 365 * (24 + 5) * 60 * 60 * 1000)
  const queryOptions: ChartOptionsWithReturnArray = {
    period1: estTime1,
    period2: estTime2,
    interval: '1mo',
  }
  const O: YFProps = { symbol: name, options: queryOptions }
  const results = await updateButton(O)
  console.log('YFD3Buttons actions replied results', results)
  if (results !== null) {
    const R: CandlestickChartProps = { title: name, D: results }
    callback(R)
  }
}
interface YFD3ButtonsProps {
  onButtonClicked: (O: CandlestickChartProps) => void
}
const YFD3Buttons: React.FC<YFD3ButtonsProps> = ({ onButtonClicked }) => {
  const [buttonClicked, setButtonClicked] = useState('button-1D')
  const router = useRouter()
  const buttons = d3.selectAll('main').selectAll('button')
  const nodes = buttons.nodes()
  const cls =
    'flex-shrink-0 snap-center rounded-md bg-slate-50 px-1 py-0 md:px-2 md:py-1 font-bold text-black text-xs md:text-base md:w-full md:bg-blue-500 md-text-white md:hover:bg-blue-700'
  const clsH =
    'flex-shrink-0 snap-center rounded-md bg-slate-50 px-1 py-0 md:px-2 md:py-1 font-bold text-red-500 text-xs md:text-base underline md:no-underline md:w-full md:bg-pink-500 md-text-white md:hover:bg-pink-700'
  for (let i = 0; i < nodes.length; i++) {
    const id = d3.select(nodes[i]).attr('id')
    switch (id) {
      case 'button-1D':
        d3.select(nodes[i]).on('click', function (event, d) {
          const name = d3.select(this).attr('data-name')
          handleButton1D(name, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-1D')
          router.refresh()
          d3.select(this).attr('class', clsH)
        })
        if (buttonClicked === 'button-1D') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-5D':
        d3.select(nodes[i]).on('click', function (event, d) {
          const name = d3.select(this).attr('data-name')
          handleButton5D(name, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-5D')
          router.refresh()
        })
        if (buttonClicked === 'button-5D') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-1M':
        d3.select(nodes[i]).on('click', function (event, d) {
          const name = d3.select(this).attr('data-name')
          handleButton1M(name, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-1M')
          router.refresh()
        })
        if (buttonClicked === 'button-1M') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-6M':
        d3.select(nodes[i]).on('click', function (event, d) {
          const name = d3.select(this).attr('data-name')
          handleButton6M(name, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-6M')
          router.refresh()
        })
        if (buttonClicked === 'button-6M') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-YTD':
        d3.select(nodes[i]).on('click', function (event, d) {
          const name = d3.select(this).attr('data-name')
          handleButtonYTD(name, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-YTD')
          router.refresh()
        })
        if (buttonClicked === 'button-YTD') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-1Y':
        d3.select(nodes[i]).on('click', function (event, d) {
          const name = d3.select(this).attr('data-name')
          handleButton1Y(name, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-1Y')
          router.refresh()
        })
        if (buttonClicked === 'button-1Y') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      case 'button-5Y':
        d3.select(nodes[i]).on('click', function (event, d) {
          const name = d3.select(this).attr('data-name')
          handleButton5Y(name, onButtonClicked)
          d3.select(this).attr('class', clsH)
          setButtonClicked('button-5Y')
          router.refresh()
        })
        if (buttonClicked === 'button-5Y') {
          d3.select(nodes[i]).attr('class', clsH)
        } else {
          d3.select(nodes[i]).attr('class', cls)
        }
        break
      default:
        break
    }
  }
  return <></>
}

export default YFD3Buttons
