import * as React from "react";
import { Chart, ChartCanvas } from "react-financial-charts";
import { XAxis, YAxis } from "react-financial-charts/lib/axes";
import { discontinuousTimeScaleProviderBuilder } from "react-financial-charts/lib/scale";
import { LineSeries } from "react-financial-charts/lib/series";
import { withDeviceRatio } from "react-financial-charts/lib/utils";
import { IOHLCData, withOHLCData, withSize } from "../../data";

interface BasicLineSeriesProps {
    readonly data: IOHLCData[];
    readonly height: number;
    readonly width: number;
    readonly ratio: number;
}

class BasicLineSeries extends React.Component<BasicLineSeriesProps> {

    private readonly margin = { left: 0, right: 40, top: 0, bottom: 24 };
    private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder()
        .inputDateAccessor((d: IOHLCData) => d.date);

    public render() {

        const {
            data: initialData,
            height,
            ratio,
            width,
        } = this.props;

        const { margin, xScaleProvider } = this;

        const {
            data,
            xScale,
            xAccessor,
            displayXAccessor,
        } = xScaleProvider(initialData);

        const start = xAccessor(data[data.length - 1]);
        const end = xAccessor(data[Math.max(0, data.length - 100)]);
        const xExtents = [start, end];

        return (
            <ChartCanvas
                height={height}
                ratio={ratio}
                width={width}
                margin={margin}
                type="hybrid"
                data={data}
                displayXAccessor={displayXAccessor}
                seriesName="Data"
                xScale={xScale}
                xAccessor={xAccessor}
                xExtents={xExtents}>
                <Chart
                    id={1}
                    yExtents={this.candleChartExtents}>
                    <LineSeries yAccessor={this.areaSeriesAccessor} />
                    <XAxis
                        axisAt="bottom"
                        orient="bottom"
                        ticks={6} />
                    <YAxis
                        axisAt="right"
                        orient="right"
                        ticks={5} />
                </Chart>
            </ChartCanvas>
        );
    }

    private readonly areaSeriesAccessor = (data: IOHLCData) => {
        return data.close;
    }

    private readonly candleChartExtents = (data: IOHLCData) => {
        return [data.high, data.low];
    }
}

export default withOHLCData()(withSize()(withDeviceRatio()(BasicLineSeries)));