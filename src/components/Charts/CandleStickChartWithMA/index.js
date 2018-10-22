import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { ChartCanvas, Chart } from 'react-stockcharts'
import { BarSeries, CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series'
// import { BarSeries, AreaSeries, CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
import { CrossHairCursor, CurrentCoordinate, MouseCoordinateX, MouseCoordinateY } from 'react-stockcharts/lib/coordinates'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import { OHLCTooltip, MovingAverageTooltip } from 'react-stockcharts/lib/tooltip'
import { ema, sma } from 'react-stockcharts/lib/indicator'
// import { ema, wma, sma, tma } from 'react-stockcharts/lib/indicator'
import { fitWidth } from 'react-stockcharts/lib/helper'
import { last } from 'react-stockcharts/lib/utils'

class CandleStickChartWithMA extends React.Component {
  // constructor(props) {
  //   super(props)
  // }
  // componentDidMount() {
  //   // for testing the Sentry ErrorBoundary logic, just throw one error
  //   // errorCount is set by ChartsView as a prop for each generated Chartcell and is passed on to here
  //   if (this.props.errorCount === 1) {
  //     throw new Error('A forced error has occured in CandleStickChartWithMA component!')
  //   }
  // }

  render() {
    console.log('CandleStickChartWithMA rendered')
    const ema20 = ema()
      .options({
        windowSize: 20, // optional will default to 10
        sourcePath: 'close', // optional will default to close as the source
      })
      .skipUndefined(true) // defaults to true
      .merge((d, c) => {
        d.ema20 = c
      }) // Required, if not provided, log a error
      .accessor((d) => d.ema20) // Required, if not provided, log an error during calculation
      .stroke('blue') // Optional

    const sma200 = sma()
      .options({ windowSize: 200 })
      .merge((d, c) => {
        d.sma200 = c
      })
      .accessor((d) => d.sma200)

    //   const sma20 = sma()
    //   .options({ windowSize: 20 })
    //   .merge((d, c) => {
    //     d.sma20 = c
    //   })
    //   .accessor((d) => d.sma20)

    // const wma20 = wma()
    //   .options({ windowSize: 20 })
    //   .merge((d, c) => {
    //     d.wma20 = c
    //   })
    //   .accessor((d) => d.wma20)

    // const tma20 = tma()
    //   .options({ windowSize: 20 })
    //   .merge((d, c) => {
    //     d.tma20 = c
    //   })
    //   .accessor((d) => d.tma20)

    const ema50 = ema()
      .options({ windowSize: 50 })
      .merge((d, c) => {
        d.ema50 = c
      })
      .accessor((d) => d.ema50)

    const smaVolume50 = sma()
      .options({ windowSize: 20, sourcePath: 'volume' })
      .merge((d, c) => {
        d.smaVolume50 = c
      })
      .accessor((d) => d.smaVolume50)
      .stroke('#4682B4')
      .fill('#4682B4')

    const { type, chartId, data: initialData, width, ratio } = this.props
    const { height } = this.props
    const { symbol } = this.props
    const { clamp } = this.props
    const volBarHeight = height / 5
    const { mouseMoveEvent, panEvent, zoomEvent, zoomAnchor } = this.props

    // const calculatedData = tma20(wma20(sma20(ema20(ema50(smaVolume50(initialData))))))
    const calculatedData = sma200(ema20(ema50(smaVolume50(initialData))))
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d) => d.date)
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData)

    const start = xAccessor(last(data))
    const end = xAccessor(data[Math.max(0, data.length - 150)])
    const xExtents = [start, end]

    return (
      <ChartCanvas
        height={height}
        width={width}
        ratio={ratio}
        margin={{ left: 8, right: 60, top: 10, bottom: 30 }}
        mouseMoveEvent={mouseMoveEvent}
        panEvent={panEvent}
        zoomEvent={zoomEvent}
        clamp={clamp}
        zoomAnchor={zoomAnchor}
        type={type}
        seriesName={symbol}
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}>
        <Chart id={chartId + '1'} yExtents={[(d) => [d.high, d.low], sma200.accessor(), ema20.accessor(), ema50.accessor()]} padding={{ top: 10, bottom: 20 }}>
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="right" orient="right" ticks={5} />

          <MouseCoordinateY at="right" orient="right" displayFormat={format('.1f')} />

          <CandlestickSeries />
          {/* <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} /> */}
          {/* <LineSeries yAccessor={wma20.accessor()} stroke={wma20.stroke()} /> */}
          {/* <LineSeries yAccessor={tma20.accessor()} stroke={tma20.stroke()} /> */}

          <LineSeries yAccessor={sma200.accessor()} stroke={sma200.stroke()} />
          <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
          <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />

          {/* <CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} /> */}
          {/* <CurrentCoordinate yAccessor={wma20.accessor()} fill={wma20.stroke()} /> */}
          {/* <CurrentCoordinate yAccessor={tma20.accessor()} fill={tma20.stroke()} /> */}

          <CurrentCoordinate yAccessor={sma200.accessor()} fill={sma200.stroke()} />
          <CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
          <CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />

          <OHLCTooltip origin={[-36, 0]} />
          <MovingAverageTooltip
            onClick={(e) => console.log(e)}
            origin={[-6, 15]}
            options={[
              // {
              //   yAccessor: sma20.accessor(),
              //   type: 'SMA',
              //   stroke: sma20.stroke(),
              //   windowSize: sma20.options().windowSize,
              //   echo: 'some echo here',
              // },
              // {
              //   yAccessor: wma20.accessor(),
              //   type: 'WMA',
              //   stroke: wma20.stroke(),
              //   windowSize: wma20.options().windowSize,
              //   echo: 'some echo here',
              // },
              // {
              //   yAccessor: tma20.accessor(),
              //   type: 'TMA',
              //   stroke: tma20.stroke(),
              //   windowSize: tma20.options().windowSize,
              //   echo: 'some echo here',
              // },
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
        </Chart>
        <Chart id={chartId + '2'} yExtents={[(d) => d.volume, smaVolume50.accessor()]} height={volBarHeight} origin={(w, h) => [0, h - volBarHeight]}>
          <YAxis axisAt="left" orient="left" ticks={3} tickFormat={format('.2s')} />

          <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} />
          {/* *ALWAYS COMMENTED OUT* <MouseCoordinateY at="left" orient="left" displayFormat={format('.4s')} /> */}

          <BarSeries yAccessor={(d) => d.volume} fill={(d) => (d.close > d.open ? '#6BA583' : 'red')} />
          {/* <AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()} /> */}
          {/* <CurrentCoordinate yAccessor={smaVolume50.accessor()} fill={smaVolume50.stroke()} /> */}
          {/* <CurrentCoordinate yAccessor={(d) => d.volume} fill="#9B0A47" /> */}
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    )
  }
}

CandleStickChartWithMA.propTypes = {
  data: PropTypes.array.isRequired,
  chartId: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
}

CandleStickChartWithMA.defaultProps = {
  type: 'hybrid',
  panEvent: true, //false,
  zoomEvent: true, //false,
  clamp: false, //true,
  height: 250,
  mouseMoveEvent: false, //true, // 10/20/2018 - fixes exception below in drawOnCanvas() ??
}
// TypeError ocurred randomly:
// undefined is not an object (evaluating 'contexts.axes')
// /static/js/1.chunk.js in getAxisCanvas at line 166434:18
// /static/js/1.chunk.js in drawOnCanvas at line 166328:29

CandleStickChartWithMA = fitWidth(CandleStickChartWithMA)

export default CandleStickChartWithMA
