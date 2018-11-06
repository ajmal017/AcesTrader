// CandleStickChartWithMACD/index.js

import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { ChartCanvas, Chart } from 'react-stockcharts'
// import { BarSeries, AreaSeries, CandlestickSeries, LineSeries, MACDSeries } from 'react-stockcharts/lib/series'
import { BarSeries, CandlestickSeries, LineSeries, MACDSeries } from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
// import { CrossHairCursor, EdgeIndicator, CurrentCoordinate, MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates'
import { CrossHairCursor, CurrentCoordinate, MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { OHLCTooltip, MovingAverageTooltip, MACDTooltip } from 'react-stockcharts/lib/tooltip'
import { ema, macd, sma } from 'react-stockcharts/lib/indicator'
import { fitWidth } from 'react-stockcharts/lib/helper'
import { last } from 'react-stockcharts/lib/utils'

const macdAppearance = {
  stroke: {
    macd: '#FF0000',
    signal: '#00F300',
  },
  fill: {
    divergence: '#4682B4',
  },
}

const mouseEdgeAppearance = {
  textFill: '#542605',
  stroke: '#05233B',
  strokeOpacity: 1,
  strokeWidth: 1,
  arrowWidth: 0, //5
  fill: '#BCDEFA',
}

class CandleStickChartWithMACD extends React.Component {
  render() {
    const { type, data: initialData, width, ratio, chartId, height, symbol, weekly } = this.props

    const sma40 = sma()
      .id(0)
      .options({ windowSize: 40 })
      .merge((d, c) => {
        d.sma40 = c
      })
      .accessor((d) => d.sma40)

      const ema20 = ema()
      .id(0)
      .options({ windowSize: 20 })
      .merge((d, c) => {
        d.ema20 = c
      })
      .accessor((d) => d.ema20)

    const ema50 = ema()
      .options({ windowSize: 50 })
      .merge((d, c) => {
        d.ema50 = c
      })
      .accessor((d) => d.ema50)

    const sma200 = sma()
      .options({ windowSize: 200 })
      .merge((d, c) => {
        d.sma200 = c
      })
      .accessor((d) => d.sma200)

    const ema26 = ema()
      .id(0)
      .options({ windowSize: 26 })
      .merge((d, c) => {
        d.ema26 = c
      })
      .accessor((d) => d.ema26)

    const ema12 = ema()
      .id(1)
      .options({ windowSize: 12 })
      .merge((d, c) => {
        d.ema12 = c
      })
      .accessor((d) => d.ema12)

    const macdCalculator = macd()
      .options({
        fast: 12,
        slow: 26,
        signal: 9,
      })
      .merge((d, c) => {
        d.macd = c
      })
      .accessor((d) => d.macd)

    // const smaVolume50 = sma()
    //   .id(3)
    //   .options({
    //     windowSize: 50,
    //     sourcePath: 'volume',
    //   })
    //   .merge((d, c) => {
    //     d.smaVolume50 = c
    //   })
    //   .accessor((d) => d.smaVolume50)

    // const calculatedData = smaVolume50(macdCalculator(ema12(ema26(initialData))))
    const calculatedData = weekly ? sma40(macdCalculator(ema12(ema26(initialData)))) : sma200(ema20(ema50(macdCalculator(ema12(ema26(initialData))))))

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date)
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData)
    const { clamp } = this.props

    const start = xAccessor(last(data))
    const end = xAccessor(data[Math.max(0, data.length - 150)])
    const xExtents = [start, end]

    const barChartHeight = 200
    const volumeChartHeight = 50
    const MacdChartHeight = 100

    // {/* <EdgeIndicator
    //   itemType="last"
    //   orient="right"
    //   edgeAt="right"
    //   yAccessor={(d) => d.close}
    //   fill={(d) => (d.close > d.open ? '#A2F5BF' : '#F9ACAA')}
    //   stroke={(d) => (d.close > d.open ? '#0B4228' : '#6A1B19')}
    //   textFill={(d) => (d.close > d.open ? '#0B4228' : '#420806')}
    //   strokeOpacity={1}
    //   strokeWidth={3}
    //   arrowWidth={2}
    // /> */}

    let maLineSeries
    if (weekly) {
      maLineSeries = <LineSeries yAccessor={sma40.accessor()} stroke={sma40.stroke()} />
    } else {
      maLineSeries = (
        <>
            <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
          <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />
          <LineSeries yAccessor={sma200.accessor()} stroke={sma200.stroke()} />
        {/* <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} /> */}
          {/* <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} /> */}
        </>
      )
    }

    let maCurrentCoordinate
    if (weekly) {
      maCurrentCoordinate = <CurrentCoordinate yAccessor={sma40.accessor()} fill={sma40.stroke()} />
    } else {
      maCurrentCoordinate = (
        <>
          <CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
          <CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />
          <CurrentCoordinate yAccessor={sma200.accessor()} fill={sma200.stroke()} />
          {/* <CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} /> */}
          {/* <CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} /> */}
        </>
      )
    }

    let maTooltip
    if (weekly) {
      maTooltip = 
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
    } else {
      maTooltip = 
      <>
      <MovingAverageTooltip
      onClick={(e) => console.log(e)}
      origin={[-30, 15]}
      options={[
        {
          yAccessor: ema20.accessor(),
          type: 'EMA',
          stroke: ema20.stroke(),
          windowSize: ema20.options().windowSize,
          // echo: 'some echo here',
        },
        {
          yAccessor: ema50.accessor(),
          type: 'EMA',
          stroke: ema50.stroke(),
          windowSize: ema50.options().windowSize,
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
        <Chart id={chartId + '1'} height={barChartHeight} yExtents={[(d) => [d.high, d.low], ema26.accessor(), ema12.accessor()]} padding={{ top: 10, bottom: 20 }}>
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
          <YAxis axisAt="right" orient="right" ticks={5} />

          <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} {...mouseEdgeAppearance} />

          <CandlestickSeries />

          {maLineSeries}
          {/* <LineSeries yAccessor={sma40.accessor()} stroke={sma40.stroke()} /> */}
          {/* <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} /> */}
          {/* <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} /> */}

          {maCurrentCoordinate}
          {/* <CurrentCoordinate yAccessor={sma40.accessor()} fill={sma40.stroke()} /> */}
          {/* <CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} /> */}
          {/* <CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} /> */}

          <OHLCTooltip origin={[-36, 0]} />
          {maTooltip}
         {/* <MovingAverageTooltip
            onClick={(e) => console.log(e)}
            origin={[-30, 15]}
            options={[
              {
                yAccessor: sma40.accessor(),
                type: 'SMA',
                stroke: sma40.stroke(),
                windowSize: sma40.options().windowSize,
              },
              // {
              //   yAccessor: ema26.accessor(),
              //   type: 'EMA',
              //   stroke: ema26.stroke(),
              //   windowSize: ema26.options().windowSize,
              // },
              // {
              //   yAccessor: ema12.accessor(),
              //   type: 'EMA',
              //   stroke: ema12.stroke(),
              //   windowSize: ema12.options().windowSize,
              // },
            ]}
          /> */}
        </Chart>
        {/* <Chart id={chartId + '2'} height={volumeChartHeight} yExtents={[(d) => d.volume, smaVolume50.accessor()]} origin={(w, h) => [0, h - volumeChartHeight * 3.22]}> */}
        <Chart id={chartId + '2'} height={volumeChartHeight} yExtents={[(d) => d.volume]} origin={(w, h) => [0, h - volumeChartHeight * 3.22]}>
          <YAxis axisAt="left" orient="left" ticks={2} tickFormat={format('.2s')} />
          <MouseCoordinateY at="left" orient="left" displayFormat={format('.4s')} {...mouseEdgeAppearance} />
          <BarSeries yAccessor={(d) => d.volume} fill={(d) => (d.close > d.open ? '#6BA583' : '#FF0000')} />
          {/* <AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()} /> */}
        </Chart>
        {/* outerTickSize={6}  ticks={2} */}
        <Chart id={chartId + '3'} height={MacdChartHeight} yExtents={macdCalculator.accessor()} origin={(w, h) => [0, h - MacdChartHeight]} padding={{ top: 10, bottom: 10 }}>
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="right" orient="right" ticks={3} />

          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} rectRadius={5} {...mouseEdgeAppearance} />
          <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} {...mouseEdgeAppearance} />

          <MACDSeries yAccessor={(d) => d.macd} {...macdAppearance} />
          <MACDTooltip origin={[-38, 15]} yAccessor={(d) => d.macd} options={macdCalculator.options()} appearance={macdAppearance} />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    )
  }
}

CandleStickChartWithMACD.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
}

CandleStickChartWithMACD.defaultProps = {
  // type: 'svg',
  type: 'hybrid',
  clamp: false, //true,
  height: 350, // 250,
  weekly: true,
}

CandleStickChartWithMACD = fitWidth(CandleStickChartWithMACD)

export default CandleStickChartWithMACD
