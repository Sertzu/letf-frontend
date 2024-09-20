import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import React, { useEffect } from 'react';

export interface ChartComponentProps {
  data: ChartData[];
}

export interface ChartData {
  day: string;
  no_leverage: number;
  two_x_leverage: number;
}

const chartConfig = {
  no_leverage: {
    label: "no_leverage",
    color: "hsl(var(--chart-1))",
  },
  two_x_leverage: {
    label: "two_x_leverage",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function GraphComponent({ data }: ChartComponentProps) {
  const [minValue, setMinValue] = React.useState<number>(0);

  useEffect(() => {
    const calculateMinValue = async () => {
      if (data.length > 0) {
        const minVal = Math.min(...data.map((d) => d.two_x_leverage));
        setMinValue(minVal);
      }
    };

    calculateMinValue();
  }, [data]);

  // Define the Y-axis domain starting at 90% of the minimum value
  const yAxisDomain: [number, string] = [minValue * 0.9, "auto"];
  //console.log(data);
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={true}
          axisLine={true}
          tickMargin={8}
          interval={Math.floor(data.length / 10)} // Limit to 10 ticks
          tickFormatter={(value) => {
            //console.log(value);
            const date = new Date(value);
            //console.log(date);
            return date.toLocaleDateString(); // Format date as desired (e.g., 'MM/DD/YYYY')
          }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          dataKey="two_x_leverage"
          domain={yAxisDomain}
          label={{
            value: "Value (€)",
            angle: -90,
            position: "insideLeft",
            offset: -10, // Adjusts the position slightly
            style: { fontSize: 14 },
          }}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="no_leverage"
          type="monotone"
          stroke="var(--line-no-leverage)"
          strokeWidth={5}
          dot={false}
        />
        <Line
          dataKey="two_x_leverage"
          type="monotone"
          stroke="var(--line-leverage)"
          strokeWidth={5}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
