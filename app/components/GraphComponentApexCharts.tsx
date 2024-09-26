import { useEffect, useState, useRef, Suspense, lazy } from "react";
//import ReactApexChart from 'react-apexcharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

const ReactApexChart = lazy(() => import('react-apexcharts'));

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
  const [options, setOptions] = useState<any | null>(null);
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

    // Prepare the data for ApexCharts
    const series = [
      {
        name: chartConfig.total_investment.label,
        data: data.map((d) => [new Date(d.day).getTime(), d.total_invested])
      },
      {
        name: chartConfig.no_leverage.label,
        data: data.map((d) => [new Date(d.day).getTime(), d.no_leverage])
      },
      {
        name: chartConfig.two_x_leverage.label,
        data: data.map((d) => [new Date(d.day).getTime(), d.two_x_leverage])
      },
      {
        name: chartConfig.SMA_strategy.label,
        data: data.map((d) => [new Date(d.day).getTime(), d.SMA_Strategy])
      },
      {
        name: chartConfig.SMA_strategy_with_funds.label,
        data: data.map((d) => [new Date(d.day).getTime(), d.SMA_Strategy_With_Funds])
      }
    ];

    // Helper function to format numbers
    const formatNumber = (value) => {
      if (value >= 1e9) {
        return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'B €';
      } else if (value >= 1e6) {
        return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M €';
      } else if (value >= 1e3) {
        return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'k €';
      } else {
        return Math.round(value) + ' €';
      }
    };

    const options = {
      chart: {
        type: 'line',
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        },
        animations: {
          enabled: true // Disable animations for smoother resizing
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight',
        width: 2
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return formatNumber(value);
          }
        },
        logarithmic: logScale,
        min: minValue * 0.9,
        max: maxValue * 1.1
      },
      tooltip: {
        shared: false,
        x: {
          format: 'dd MMM yyyy'
        },
        y: {
          formatter: function (value) {
            return formatNumber(value);
          }
        }
      },
      colors: [
        chartConfig.total_investment.color,
        chartConfig.no_leverage.color,
        chartConfig.two_x_leverage.color,
        chartConfig.SMA_strategy.color,
        chartConfig.SMA_strategy_with_funds.color
      ],
      responsive: [
        {
          breakpoint: 768, // Example breakpoint for mobile devices
          options: {
            chart: {
              height: 300
            }
          }
        }
      ]
    };

    setOptions(options);
    setChartData(series);
    setLoading(false);

  }, [data, logScale, minValue, maxValue]);

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
            <ReactApexChart
              options={options}
              series={chartData}
              type="line"
              height="100%"
              width="100%"
            />
          )
        )}
      </div>
      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
    </ChartContainer>
  );
}
