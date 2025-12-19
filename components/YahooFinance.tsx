import dynamic from 'next/dynamic'
import YahooFinance from 'yahoo-finance2'
import CandlestickChart from '@/components/ApexCharts'
import { ChartOptionsWithReturnArray } from 'yahoo-finance2/esm/src/modules/chart.js'

const todayUTC = new Date().toISOString().slice(0, 10)

const queryOptions: ChartOptionsWithReturnArray = {
  period1: new Date(todayUTC),
  //period2: '2025-11-30', // Optional, defaults to today
  interval: '5m',
  // Optional,   '1m',  '2m',  '5m','15m', '30m', '60m',
  // '90m', '1h',  '1d',
  // '5d',  '1wk', '1mo',
  // '3mo'
  // '1d', '1wk', '1mo'
}

export interface YFProps {
  symbol: string
  options: ChartOptionsWithReturnArray
}

/**
 *
 */
const YF = async ({ symbol, options }: YFProps) => {
  const Buttons = () => {
    return (
      <div className="flex justify-center space-x-4">
        <button
          id="button-1D"
          data-name={symbol}
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          1 D
        </button>
        <button
          id="button-5D"
          data-name={symbol}
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          5 D
        </button>
        <button
          id="button-1M"
          data-name={symbol}
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          1 M
        </button>
        <button
          id="button-6M"
          data-name={symbol}
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          6 M
        </button>
        <button
          id="button-YTD"
          data-name={symbol}
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          YTD
        </button>
        <button
          id="button-1Y"
          data-name={symbol}
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          1 Y
        </button>
        <button
          id="button-5Y"
          data-name={symbol}
          className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          5 Y
        </button>
      </div>
    )
  }
  try {
    const yahooFinance = new YahooFinance()
    const R = await yahooFinance.search(symbol)
    const Q = await yahooFinance.quote(symbol)
    const results = await yahooFinance.chart(symbol, options)
    console.log('YahooFinance', symbol, options)
    //console.log('YahooFinance search ', symbol, R)
    //console.log('YahooFinance quote ', symbol, Q)
    console.log('YahooFinance results', symbol, results)
    return (
      <>
        <CandlestickChart title={symbol} D={results} />
        <Buttons />
      </>
    )
  } catch (error) {
    console.error('Error fetching historical data:', error)
    return <></>
  }
}

export default YF
