import dynamic from 'next/dynamic'
import YahooFinance from 'yahoo-finance2'
import CandlestickChart from '@/components/ApexCharts'
import { ChartOptionsWithReturnArray } from 'yahoo-finance2/esm/src/modules/chart.js'
import useWindowDimensions from '@/components/WindowDimension'

export interface YFProps {
  symbol: string
  options: ChartOptionsWithReturnArray
}

/**
 *
 */
const YF = async ({ symbol, options }: YFProps) => {
  /**
   *
   */
  const Buttons = () => {
    return (
      <div className="md:max-w-1xl mx-auto flex items-center justify-center px-4 scrollbar-hide sm:px-6 lg:px-8">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide md:grid md:grid-cols-7">
          {/*<div className="flex justify-center space-x-4">*/}
          <button
            id="button-1D"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md px-4 py-2 font-bold text-white md:w-full md:bg-blue-500 md:hover:bg-blue-700"
          >
            1 D
          </button>
          <button
            id="button-5D"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md px-4 py-2 font-bold text-white md:w-full md:bg-blue-500 md:hover:bg-blue-700"
          >
            5 D
          </button>
          <button
            id="button-1M"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md px-4 py-2 font-bold text-white md:w-full md:bg-blue-500 md:hover:bg-blue-700"
          >
            1 M
          </button>
          <button
            id="button-6M"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md px-4 py-2 font-bold text-white md:w-full md:bg-blue-500 md:hover:bg-blue-700"
          >
            6 M
          </button>
          <button
            id="button-YTD"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md px-4 py-2 font-bold text-white md:w-full md:bg-blue-500 md:hover:bg-blue-700"
          >
            YTD
          </button>
          <button
            id="button-1Y"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md px-4 py-2 font-bold text-white md:w-full md:bg-blue-500 md:hover:bg-blue-700"
          >
            1 Y
          </button>
          <button
            id="button-5Y"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md px-4 py-2 font-bold text-white md:w-full md:bg-blue-500 md:hover:bg-blue-700"
          >
            5 Y
          </button>
        </div>
      </div>
    )
  }
  /**
   *
   */
  try {
    const yahooFinance = new YahooFinance()
    const R = await yahooFinance.search(symbol)
    const Q = await yahooFinance.quote(symbol)
    const results = await yahooFinance.chart(symbol, options)
    console.log('YahooFinance', symbol, options)
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
