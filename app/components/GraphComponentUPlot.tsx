import { useEffect, useState, useRef } from "react";
import uPlot from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Skeleton } from "./ui/skeleton";

export interface ChartComponentProps {
  data: ChartData[];
}

export interface ChartData {
  day: string;
  no_leverage: number;
  two_x_leverage: number;
  total_invested: number;
  SMA_Strategy: number;
  SMA_Strategy_With_Funds: number;
}

const chartConfig = {
  no_leverage: {
    label: "S&P 500",
    color: "#7DDA58",
  },
  two_x_leverage: {
    label: "Amumbo Pur",
    color: "#FE9900",
  },
  total_investment: {
    label: "Investment",
    color: "#000000",
  },
  SMA_strategy: {
    label: "200D SMA",
    color: "#34d8eb",
  },
  SMA_strategy_with_funds: {
    label: "200D SMA + Zinsen",
    color: "#eb071e",
  },
};

export default function GraphComponent({ data, logScale }: { data: ChartData[], logScale: boolean }) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [options, setOptions] = useState<uPlot.Options | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Recalculate min and max values based on the data
  useEffect(() => {
    if (data.length > 0) {
      const minVal = Math.min(
        Math.min(...data.map((d) => d.two_x_leverage)),
        Math.min(...data.map((d) => d.SMA_Strategy)),
        Math.min(...data.map((d) => d.no_leverage)),
        Math.min(...data.map((d) => d.total_invested)),
        Math.min(...data.map((d) => d.SMA_Strategy_With_Funds))
      );
      const maxVal = Math.max(
        Math.max(...data.map((d) => d.two_x_leverage)),
        Math.max(...data.map((d) => d.SMA_Strategy)),
        Math.max(...data.map((d) => d.no_leverage)),
        Math.max(...data.map((d) => d.total_invested)),
        Math.max(...data.map((d) => d.SMA_Strategy_With_Funds))
      );
      setMinValue(minVal);
      setMaxValue(maxVal);
    }
  }, [data]);

  // Set the options and chart data
  useEffect(() => {
    if (!data || data.length === 0) return;

    setLoading(true);

    const dayValues = data.map((d) => Math.floor(new Date(d.day).getTime() / 1000));
    //console.log(`${dayValues}`)
    const noLeverageValues = data.map((d) => Math.floor(d.no_leverage));
    const twoXLeverageValues = data.map((d) => Math.floor(d.two_x_leverage));
    const totalInvestedValues = data.map((d) => Math.floor(d.total_invested));
    const smaStrategyValues = data.map((d) => Math.floor(d.SMA_Strategy));
    const smaStrategyFundValues = data.map((d) => Math.floor(d.SMA_Strategy_With_Funds));

    const fmtVal = (u, v, sidx, didx) => (
      didx == null ? '--' :
      v    == null ?   '' :
                     v + " €"
    );

    const options: uPlot.Options = {
      title: "",
      width: chartRef.current?.offsetWidth || 800,
      height: chartRef.current?.offsetHeight || 400,
      series: [
        {},
        {
          label: chartConfig.total_investment.label,
          stroke: chartConfig.total_investment.color,
          width: 2,
          value: fmtVal,
        },
        {
          label: chartConfig.no_leverage.label,
          stroke: chartConfig.no_leverage.color,
          width: 2,
          value: fmtVal,
        },
        {
          label: chartConfig.two_x_leverage.label,
          stroke: chartConfig.two_x_leverage.color,
          width: 2,
          value: fmtVal,
        },
        {
          label: chartConfig.SMA_strategy.label,
          stroke: chartConfig.SMA_strategy.color,
          width: 2,
          value: fmtVal,
        },
        {
          label: chartConfig.SMA_strategy_with_funds.label,
          stroke: chartConfig.SMA_strategy_with_funds.color,
          width: 2,
          value: fmtVal,
        },
      ],
      axes: [
        {
          stroke: "#000",
          grid: { show: true },
          scale: "x",
        },
        {
          stroke: "#000",
          scale: "y",
          grid: { show: true },
          values: (u, vals) => vals.map(v => Math.round(v) ? Math.round(v) + " €" : "" )
        },
      ],
      scales: {
        y: {
          range: [minValue * 0.9, maxValue * 1.1],
          distr: logScale ? 3 : 1, // Logarithmic scale
        },
      },
      padding: [10, 10, 10, 60],
      cursor: {
        drag: {
          x: false, // Disable drag/zoom on x-axis
          y: false, // Disable drag/zoom on y-axis
        },
      },
    };

    setOptions(options);
    setChartData([
      dayValues,
      totalInvestedValues,
      noLeverageValues,
      twoXLeverageValues,
      smaStrategyValues,
      smaStrategyFundValues,
    ]);

    setLoading(false);
  }, [data, minValue, maxValue, logScale]);

  // Handle resizing of the chart
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setOptions((prevOptions) => ({
          ...prevOptions,
          width: chartRef.current?.offsetWidth || 800,
          height: chartRef.current?.offsetHeight || 400,
        }));
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ChartContainer config={chartConfig}>
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {loading ? (
          <div
            className="skeleton-loader"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                border: "4px solid #ccc",
                borderTop: "4px solid #000",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginRight: "10px", // Space between the arrow and the text
              }}
            />
            {"Ich lade :D"}
          </div>
        ) : (
          options && (
            <UplotReact
              options={options}
              data={chartData}
            />
          )
        )}
      </div>
      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    </ChartContainer>
  );
}
