// CandleStickChartWithMA/index.js

import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { ChartCanvas, Chart } from 'react-stockcharts'
// import { BarSeries, AreaSeries, CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series'
import { BarSeries, CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
// import { CrossHairCursor, EdgeIndicator, CurrentCoordinate, MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates'
import { CrossHairCursor, CurrentCoordinate, MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { OHLCTooltip, MovingAverageTooltip } from 'react-stockcharts/lib/tooltip'
import { sma } from 'react-stockcharts/lib/indicator'
// import { ema, wma, sma, tma } from 'react-stockcharts/lib/indicator'
import { fitWidth } from 'react-stockcharts/lib/helper'
import { last } from 'react-stockcharts/lib/utils'

class CandleStickChartWithMA extends React.Component {
  render() {

    const mouseEdgeAppearance = {
      textFill: '#542605',
      stroke: '#05233B',
      strokeOpacity: 1,
      strokeWidth: 1,
      arrowWidth: 0, //5
      fill: '#BCDEFA',
    }

    const sma200 = sma()
      .id(3)
      .options({ windowSize: 200 })
      .merge((d, c) => {
        d.sma200 = c
      })
      .accessor((d) => d.sma200)

    const sma40 = sma()
      .id(0)
      .options({ windowSize: 40 })
      .merge((d, c) => {
        d.sma40 = c
      })
      .accessor((d) => d.sma40)

    const sma50 = sma()
      .id(2)
      .options({ windowSize: 50 })
      .merge((d, c) => {
        d.sma50 = c
      })
      .accessor((d) => d.sma50)

    const { type, data: initialData, width, ratio, chartId, height, symbol, weekly, validShortSma, validLongSma } = this.props

    let calculatedData
    if (validLongSma && weekly) {
      calculatedData = sma40(initialData)
    } else if (validLongSma && !weekly) {
      calculatedData = sma200(sma50(initialData))
    } else if (validShortSma && weekly) {
      calculatedData = sma50(initialData)
    } else if (validShortSma && !weekly) {
      calculatedData = sma50(initialData)
    } else {
      calculatedData = initialData
    }


    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date)
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData)
    const { clamp } = this.props

    const start = xAccessor(last(data))
    const end = xAccessor(data[Math.max(0, data.length - 150)])
    const xExtents = [start, end]

    const volBarHeight = height / 5

    const barChartHeight = 200
    const volumeChartHeight = 50

    let maLineSeries
    // This draws the available MA lines
    if (validLongSma && weekly) {
      maLineSeries = <LineSeries yAccessor={sma40.accessor()} stroke={sma40.stroke()} />
    } else if (validLongSma && !weekly) {
      maLineSeries = (
        <>
          <LineSeries yAccessor={sma50.accessor()} stroke={sma50.stroke()} />
          <LineSeries yAccessor={sma200.accessor()} stroke={sma200.stroke()} />
        </>
      )
    } else if (validShortSma) {
      maLineSeries = <LineSeries yAccessor={sma50.accessor()} stroke={sma50.stroke()} />
      // } else {
      //     maLineSeries = (
      //       <>
      //         <LineSeries yAccessor={sma50.accessor()} stroke={sma50.stroke()} />
      //         <LineSeries yAccessor={sma200.accessor()} stroke={sma200.stroke()} />
      //         {/* <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} /> */}
      //         {/* <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} /> */}
      //       </>
      //     )
    }

    let maCurrentCoordinate
    if (validLongSma && weekly) {
      maCurrentCoordinate = <CurrentCoordinate yAccessor={sma40.accessor()} fill={sma40.stroke()} />
    } else if (validLongSma && !weekly) {
      maCurrentCoordinate = (
        <>
          <CurrentCoordinate yAccessor={sma50.accessor()} fill={sma50.stroke()} />
          <CurrentCoordinate yAccessor={sma200.accessor()} fill={sma200.stroke()} />
        </>
      )
    } else if (validShortSma) {
      maCurrentCoordinate = <CurrentCoordinate yAccessor={sma50.accessor()} fill={sma50.stroke()} />
    }

    let maTooltip
    if (validLongSma && weekly) {
      maTooltip = (
        <>
          <MovingAverageTooltip
            onClick={(e) => console.log(e)}
            origin={[-30, 15]}
            options={[
              {
                yAccessor: sma40.accessor(),
                type: 'SMA',
                stroke: sma40.stroke(),
                windowSize: sma40.options().windowSize,
              },
            ]}
          />
        </>
      )
    } else if (validLongSma && !weekly) {
      maTooltip = (
        <>
          <MovingAverageTooltip
            onClick={(e) => console.log(e)}
            origin={[-30, 15]}
            options={[
              {
                yAccessor: sma50.accessor(),
                type: 'SMA',
                stroke: sma50.stroke(),
                windowSize: sma50.options().windowSize,
                // echo: 'some echo here',
              },
              {
                yAccessor: sma200.accessor(),
                type: 'SMA',
                stroke: sma200.stroke(),
                windowSize: sma200.options().windowSize,
                // echo: 'some echo here',
              },
            ]}
          />
        </>
      )
    } else if (validShortSma && !weekly) {
      maTooltip = (
        <>
          <MovingAverageTooltip
            onClick={(e) => console.log(e)}
            origin={[-30, 15]}
            options={[
              {
                yAccessor: sma50.accessor(),
                type: 'SMA',
                stroke: sma50.stroke(),
                windowSize: sma50.options().windowSize,
                // echo: 'some echo here',
              },
            ]}
          />
        </>
      )
    }

    const chartChildren = () => {
      return (
        <>
          {/* <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} /> */}
          <YAxis axisAt="right" orient="right" ticks={5} />
          <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} {...mouseEdgeAppearance} />
          <CandlestickSeries />
          {maLineSeries}
          {maCurrentCoordinate}
          <OHLCTooltip origin={[-36, 0]} />
          {maTooltip}
        </>

      )
    }

    return (
      <ChartCanvas
        height={height}
        width={width}
        ratio={ratio}
        margin={{ left: 40, right: 60, top: 10, bottom: 30 }}
        clamp={clamp}
        type={type}
        seriesName={symbol}
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}>


        {/* <Chart id={chartId + '1'} yExtents={[(d) => [d.high, d.low], sma200.accessor(), sma50.accessor()]} padding={{ top: 10, bottom: 20 }}> */}

        {(validLongSma && weekly ? (
          <Chart id={chartId + '1'} height={barChartHeight} yExtents={[(d) => [d.high, d.low], sma40.accessor()]} padding={{ top: 10, bottom: 20 }}>
            {chartChildren()}
          </Chart>)
          : (validLongSma && !weekly ? (
            <Chart id={chartId + '1'} height={barChartHeight} yExtents={[(d) => [d.high, d.low], sma200.accessor(), sma50.accessor()]} padding={{ top: 10, bottom: 20 }}>
              {chartChildren()}
            </Chart>)
            : (validShortSma && !weekly ? (
              <Chart id={chartId + '1'} height={barChartHeight} yExtents={[(d) => [d.high, d.low], sma50.accessor()]} padding={{ top: 10, bottom: 20 }}>
                {chartChildren()}
              </Chart>)
              :
              <Chart id={chartId + '1'} height={barChartHeight} yExtents={[(d) => [d.high, d.low],]} padding={{ top: 10, bottom: 20 }}>
                {chartChildren()}
              </Chart>)))
        }

        {/* <Chart id={chartId + '2'} yExtents={[(d) => d.volume, smaVolume50.accessor()]} height={volBarHeight} origin={(w, h) => [0, h - volBarHeight]}> */}
        <Chart id={chartId + '2'} yExtents={[(d) => d.volume]} height={volBarHeight} origin={(w, h) => [0, h - volBarHeight]}>
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="left" orient="left" ticks={3} tickFormat={format('.2s')} />
          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} {...mouseEdgeAppearance} />
          <MouseCoordinateY at="left" orient="left" displayFormat={format('.2s')} {...mouseEdgeAppearance} />
          <BarSeries yAccessor={(d) => d.volume} fill={(d) => (d.close > d.open ? '#6BA583' : 'red')} />
        </Chart>

        <CrossHairCursor />
      </ChartCanvas>
    )
  }
}

CandleStickChartWithMA.propTypes = {
  data: PropTypes.array.isRequired,
  // weekly: PropTypes.bool.isRequired,
  // chartId: PropTypes.string.isRequired,
  // symbol: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
}

CandleStickChartWithMA.defaultProps = {
  type: 'svg',
  // type: 'hybrid',
  // panEvent: true, //false,
  // zoomEvent: true, //false,
  clamp: false, //true,
  height: 250,
  // mouseMoveEvent: false, //true, // 10/20/2018 - fixes exception below in drawOnCanvas() ??
}

CandleStickChartWithMA = fitWidth(CandleStickChartWithMA)

export default CandleStickChartWithMA
