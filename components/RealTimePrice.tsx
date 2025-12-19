'use client'
import React, { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { DefaultApi } from 'finnhub-ts'

const FINNHUB_API_KEY = 'd4v48p1r01qnm7ppe660d4v48p1r01qnm7ppe66g'
const finnhubClient = new DefaultApi({
  apiKey: FINNHUB_API_KEY,
  isJsonMime: (mime: string) => mime === 'application/json',
})

const symbol = 'SOXL'
const resolution = 'D' // Resolution (e.g., '1', '5', '15', '30', 'H', 'D', 'W', 'M')

// Define the date range in UNIX timestamps (seconds)
// Example: From 2 years ago to today
const currentDate = Math.floor(Date.now() / 1000)
const twoYearsAgo = currentDate - 2 * 365 * 24 * 60 * 60

async function fetchHistoricalData() {
  try {
    // Call the stockCandles endpoint
    const response = await finnhubClient.stockCandles(symbol, resolution, twoYearsAgo, currentDate)
    // The response contains 'c' (close prices), 'h' (high), 'l' (low), 'o' (open), 'v' (volume), and 't' (timestamps)
    console.log(`Historical data for ${symbol}:`, response)
    // You can process this data further, e.g., format the timestamps
    /*
    if (response.t) {
      const formattedData = response.t.map((timestamp, index) => {
        return {
          date: new Date(timestamp * 1000).toISOString().split('T')[0],
          open: response.o?.[index],
          high: response.h?.[index],
          low: response.l?.[index],
          close: response.c?.[index],
          volume: response.v?.[index],
        }
      })
      console.log('Formatted Data Sample:', formattedData.slice(0, 5))
    }*/
  } catch (error) {
    console.error('Error fetching historical data:', error)
    // Handle specific errors like rate limits (status code 429)
  }
}

const RealTimePrice = ({ symbol }) => {
  const socketUrl = `wss://ws.finnhub.io?token=d4v48p1r01qnm7ppe660d4v48p1r01qnm7ppe66g`
  const { sendMessage, lastMessage } = useWebSocket(socketUrl)
  const [price, setPrice] = useState(null)

  useEffect(() => {
    // Subscribe to the symbol when the connection opens
    if (sendMessage) {
      sendMessage(JSON.stringify({ type: 'subscribe', symbol: symbol }))
    }
    return () => {
      // Unsubscribe when the component unmounts
      sendMessage(JSON.stringify({ type: 'unsubscribe', symbol: symbol }))
    }
  }, [sendMessage, symbol])

  useEffect(() => {
    if (lastMessage !== null) {
      console.log('lastmessage', lastMessage)
      const data = JSON.parse(lastMessage.data)
      // Update the price if the message type is 'trade'
      if (data.type === 'trade' && data.data && data.data.length > 0) {
        setPrice(data.data[0].p)
      }
    }
    fetchHistoricalData()
  }, [lastMessage])

  return (
    <div>
      Current Price for {symbol}: {price ? `$${price}` : 'Loading...'}
    </div>
  )
}
export default RealTimePrice
