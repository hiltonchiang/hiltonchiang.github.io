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
      <div className="md:max-w-1xl mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto md:grid md:grid-cols-7">
          {/*<div className="flex justify-center space-x-4">*/}
          <button
            id="button-1D"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700"
          >
            1 D
          </button>
          <button
            id="button-5D"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700"
          >
            5 D
          </button>
          <button
            id="button-1M"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700"
          >
            1 M
          </button>
          <button
            id="button-6M"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700"
          >
            6 M
          </button>
          <button
            id="button-YTD"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700"
          >
            YTD
          </button>
          <button
            id="button-1Y"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700"
          >
            1 Y
          </button>
          <button
            id="button-5Y"
            data-name={symbol}
            className="flex-shrink-0 snap-center rounded-md bg-slate-50 px-4 py-2 font-bold text-black md:w-full md:bg-blue-500 md:text-white md:hover:bg-blue-700"
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
    const M = results.meta
    console.log('YahooFinance', symbol, options)
    console.log('YahooFinance results', symbol, results)
    console.log('YahooFinance Q', symbol, Q)
    const fiftyTwoWeekDelta =
      M.fiftyTwoWeekHigh !== undefined && M.fiftyTwoWeekLow !== undefined
        ? M.fiftyTwoWeekHigh - M.fiftyTwoWeekLow
        : NaN
    const dayDelta =
      M.regularMarketDayHigh !== undefined && M.regularMarketDayLow !== undefined
        ? M.regularMarketDayHigh - M.regularMarketDayLow
        : NaN
    const fiftyT: number =
      fiftyTwoWeekDelta > 0
        ? M.fiftyTwoWeekLow !== undefined
          ? ((M.regularMarketPrice - M.fiftyTwoWeekLow) / fiftyTwoWeekDelta) * 100
          : NaN
        : NaN
    const fiftyTwoP = isNaN(fiftyT) ? NaN : `${fiftyT.toFixed(0)}%`
    const dayCloseT =
      dayDelta > 0
        ? M.regularMarketDayLow !== undefined
          ? ((M.regularMarketPrice - M.regularMarketDayLow) / dayDelta) * 100
          : NaN
        : NaN
    const dayCloseP = isNaN(dayCloseT) ? NaN : `${dayCloseT.toFixed(0)}%`
    const dayOpenT =
      dayDelta > 0
        ? M.regularMarketDayLow !== undefined
          ? ((Q.regularMarketOpen - M.regularMarketDayLow) / dayDelta) * 100
          : NaN
        : NaN
    const dayOpenP = isNaN(dayOpenT) ? NaN : `${dayOpenT.toFixed(0)}%`
    const openCloseDelta = dayOpenT - dayCloseT
    const openCloseColor = openCloseDelta > 0 ? 'green' : 'red'
    const openCloseT = openCloseDelta > 0 ? openCloseDelta : -openCloseDelta
    const openCloseP = `${openCloseT.toFixed(0)}%`
    const intraDayDelta = M.regularMarketPrice - Q.regularMarketPreviousClose
    const intraDayP = (intraDayDelta / Q.regularMarketPreviousClose) * 100
    const intraDayDiff =
      intraDayDelta > 0
        ? `+${intraDayDelta.toFixed(2)}/${intraDayP.toFixed(2)}%`
        : `-${intraDayDelta.toFixed(2)}/${intraDayP.toFixed(2)}%`
    const ninetyDAvg =
      Q.averageDailyVolume3Month > 1000000
        ? `${(Q.averageDailyVolume3Month / 1000000).toFixed(2)}M`
        : `${(Q.averageDailyVolume3Month / 1000).toFixed(2)}K`
    const tenDAvg =
      Q.averageDailyVolume10Day > 1000000
        ? `${(Q.averageDailyVolume10Day / 1000000).toFixed(2)}M`
        : `${(Q.averageDailyVolume10Day / 1000).toFixed(2)}K`
    const DVol = M.regularMarketVolume
    const DAvg =
      DVol !== null && DVol !== undefined
        ? DVol > 1000000
          ? `${(DVol / 1000000).toFixed(2)}M`
          : `${(DVol / 1000).toFixed(2)}K`
        : 'NaN'
    const priceUp = intraDayDiff
    return (
      <>
        <CandlestickChart title={symbol} D={results} />
        <div className="space-y-4">
          <Buttons />
          <div className="text-sm md:text-base">Core Data</div>
          {/* Intraday compare*/}
          <div className="relative grid grid-rows-2 gap-1">
            <div className="absolute bottom-0 left-0 -ml-0.5 h-px w-full translate-y-2 transform bg-blue-300" />
            <div className="absolute left-0 top-0 -ml-0.5 h-px w-full -translate-y-1 transform bg-blue-300" />
            <div className="grid grid-cols-3">
              <div className="text-left text-xs md:text-base">preClose</div>
              <div className="text-center text-xs md:text-base">IntraDay</div>
              <div className="text-right text-xs md:text-base">Quote</div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-left text-xs md:text-base">{Q.regularMarketPreviousClose}</div>
              {intraDayDelta > 0 ? (
                <div className="text-center text-xs text-red-700 md:text-base">{intraDayDiff}</div>
              ) : (
                <div className="text-center text-xs text-green-700 md:text-base">
                  {intraDayDiff}
                </div>
              )}
              <div className="text-right text-xs md:text-base">
                {M.regularMarketPrice.toFixed(2)}
              </div>
            </div>
          </div>
          {/* Volumtecompare*/}
          <div className="relative grid grid-rows-2 gap-1">
            <div className="absolute bottom-0 left-0 -ml-0.5 h-px w-full translate-y-2 transform bg-blue-300" />
            <div className="grid grid-cols-3">
              <div className="text-left text-xs md:text-base">90D Avg</div>
              <div className="text-center text-xs md:text-base">10D Avg</div>
              <div className="text-right text-xs md:text-base">Volume</div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-left text-xs md:text-base">{ninetyDAvg}</div>
              <div className="text-center text-xs md:text-base">{tenDAvg}</div>
              <div className="text-right text-xs md:text-base">{DAvg}</div>
            </div>
          </div>
          <div className="relative grid grid-rows-2 gap-6">
            {/* 52Week Range*/}
            <div id="fiftyTwoWeekRange" className="relative grid grid-cols-3">
              <div className="absolute bottom-0 left-0 -ml-0.5 h-1 w-full translate-y-2 transform bg-blue-300" />
              <div className="text-left text-xs md:text-base">{M.fiftyTwoWeekLow}</div>
              <div className="text-center text-xs md:text-base">52WK</div>
              <div className="text-right text-xs md:text-base">{M.fiftyTwoWeekHigh}</div>
              <div
                className="absolute size-3 translate-y-4 transform rounded-full bg-red-500 md:size-4 md:translate-y-5"
                style={{ left: fiftyTwoP }}
              />
            </div>
            {/* Day Range*/}
            <div id="dayRange" className="relative grid grid-cols-3">
              <div className="absolute bottom-0 left-0 -ml-0.5 h-1 w-full translate-y-2 transform bg-blue-300" />
              <div
                className="absolute bottom-0 -ml-0.5 h-1 translate-y-2 transform"
                style={{ left: dayOpenP, backgroundColor: openCloseColor, width: openCloseP }}
              />
              <div className="text-left text-xs md:text-base">{M.regularMarketDayLow}</div>
              <div className="text-center text-xs md:text-base">InterDay</div>
              <div className="text-right text-xs md:text-base">{M.regularMarketDayHigh}</div>
              <div
                className="absolute size-3 translate-y-4 transform rounded-full bg-red-500 md:size-4 md:translate-y-6"
                style={{ left: dayCloseP }}
              />
              <div
                className="absolute size-3 translate-y-4 transform rounded-full bg-green-500 md:size-4 md:translate-y-6"
                style={{ left: dayOpenP }}
              />
            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching historical data:', error)
    return <></>
  }
}

export default YF
