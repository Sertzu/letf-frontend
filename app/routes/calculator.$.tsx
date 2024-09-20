import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import { DatePicker } from "../components/DatePicker";
import { ChartData } from "../components/GraphComponentUPlot";
import { Switch } from "../components/ui/switch";
import axios from "axios";
import type { MetaFunction } from "@remix-run/node";
import { useFunSwitch } from '../lib/SwitchContext';

const GraphComponent = lazy(() => import("../components/GraphComponentUPlot"));

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

export const meta: MetaFunction = () => {
  return [{ title: "Test App" }, { name: "description", content: "Test App" }];
};

interface ApiResponse {
  Date: string;
  "2x_sp500_eu": number;
  "1x_sp500_eu": number;
  SMA_Check: boolean;
  FEDFUNDS: number;
}

const formatDate = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const calculateData = (
  data: ApiResponse[],
  startingAmount: number,
  monthlyContributions: number
): ChartData[] => {
  let currentNoLeverageValue = startingAmount;
  let currentTwoXLeverageValue = startingAmount;
  let currentSMAValue = startingAmount; // Value for SMA strategy
  let totalInvested = startingAmount; // Initialize with the starting amount
  let currentSMAWithFundsValue = startingAmount;

  let smaActive = false;
  let previousMonth = new Date(data[0].Date).getMonth();

  const chartData: ChartData[] = data.map((entry: ApiResponse) => {
    const currentDate = new Date(entry.Date);
    const currentMonth = currentDate.getMonth();

    if (currentMonth !== previousMonth) {
      currentNoLeverageValue += monthlyContributions;
      currentTwoXLeverageValue += monthlyContributions;
      currentSMAValue += monthlyContributions; // Add to SMA value too
      currentSMAWithFundsValue += monthlyContributions;
      totalInvested += monthlyContributions; // Add to the total invested amount
      previousMonth = currentMonth;
    }

    // Apply daily return for no leverage
    currentNoLeverageValue =
      currentNoLeverageValue * (1 + entry["1x_sp500_eu"] / 100);

    // Apply daily return for 2x leverage
    currentTwoXLeverageValue =
      currentTwoXLeverageValue * (1 + entry["2x_sp500_eu"] / 100);

    // Apply SMA strategy: if SMA_Check is true, apply the 2x return; otherwise, keep the value the same
    if (smaActive) {
      currentSMAValue = currentSMAValue * (1 + entry["2x_sp500_eu"] / 100);
      currentSMAWithFundsValue =
        currentSMAWithFundsValue * (1 + entry["2x_sp500_eu"] / 100);
    } else {
      currentSMAWithFundsValue =
        currentSMAWithFundsValue * (1 + entry.FEDFUNDS / 100 / 365);
    }

    smaActive = entry.SMA_Check;

    return {
      day: entry.Date,
      no_leverage: currentNoLeverageValue,
      two_x_leverage: currentTwoXLeverageValue,
      total_invested: totalInvested,
      SMA_Strategy: currentSMAValue, // Include the SMA strategy value
      SMA_Strategy_With_Funds: currentSMAWithFundsValue,
    };
  });

  return chartData;
};

export default function CalculatorPage() {
  const [filteredData, setFilteredData] = useState<ChartData[]>([]);
  const [fetchedData, setFetchedData] = useState<ApiResponse[]>([]);
  const [isLogScale, toggleLogScale] = useState<boolean>(false);

  // Set your default values for start, end, starting amount, and monthly contribution
  const [startingAmount, setStartingAmount] = useState<number>(10000);
  const [monthlyContributions, setMonthlyContributions] = useState<number>(500);
  const [dateBegin, setDateBegin] = useState<Date | undefined>(
    new Date(2001, 8, 11)
  );
  const [dateEnd, setDateEnd] = useState<Date | undefined>(
    new Date(2021, 0, 6)
  );
  const memoizedData = useMemo(() => filteredData, [filteredData]);

  // Fetch data when dates change
  useEffect(() => {
    const fetchData = debounce(async () => {
      if (!dateBegin || !dateEnd) return;

      const formattedStartDate = formatDate(dateBegin);
      const formattedEndDate = formatDate(dateEnd);

      try {
        const response = await axios.get<ApiResponse[]>(
          `http://172.27.133.114:5000/api/data?start=${formattedStartDate}&end=${formattedEndDate}`
        );
        setFetchedData(response.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }, 500); // 500ms debounce delay

    fetchData();
  }, [dateBegin, dateEnd]);

  // Recalculate chart data when amounts or fetched data change
  useEffect(() => {
    if (
      !fetchedData.length ||
      startingAmount <= 0 ||
      monthlyContributions <= 0
    )
      return;

    const calculatedData = calculateData(
      fetchedData,
      startingAmount,
      monthlyContributions
    );
    setFilteredData(calculatedData);
  }, [fetchedData, startingAmount, monthlyContributions]);

  return (
    <>
      <div className="relative container mx-auto flex flex-col items-center justify-center space-y-4 pt-12 z-3">
        <Card className="w-full max-w-6xl p-5 bg-white bg-opacity-40 shadow-lg backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Hebel?... Ja, bitte.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Start Date Picker */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-center p-1"
                >
                  Start Datum
                </label>
                <DatePicker date={dateBegin} setDate={setDateBegin} />
              </div>

              {/* End Date Picker */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium text-center p-1"
                >
                  End Datum
                </label>
                <DatePicker date={dateEnd} setDate={setDateEnd} />
              </div>

              {/* Starting Investment Input */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="startingAmount"
                  className="text-sm font-medium text-center p-1"
                >
                  Startsumme
                </label>
                <input
                  type="number"
                  id="startingAmount"
                  className="border p-2 rounded w-full max-w-xs"
                  value={startingAmount}
                  onChange={(e) =>
                    setStartingAmount(Math.max(0, Number(e.target.value)))
                  }
                />
              </div>

              {/* Monthly Contributions Input */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="monthlyContributions"
                  className="text-sm font-medium text-center p-1"
                >
                  {"Sparplan? (Anspielung auf /r/Finanzen)"}
                </label>
                <input
                  type="number"
                  id="monthlyContributions"
                  className="border p-2 rounded w-full max-w-xs"
                  value={monthlyContributions}
                  onChange={(e) =>
                    setMonthlyContributions(Math.max(0, Number(e.target.value)))
                  }
                />
              </div>
              <div className="flex flex-col items-center">
                <Switch checked={isLogScale} onCheckedChange={() => toggleLogScale(prev => !prev)}/>
                <span>Log Skala</span>
              </div>
            </div>
            <div className="w-full h-full pt-5 pb-8">
              <Suspense fallback={<div>Loading graph...</div>}>
                <GraphComponent data={memoizedData} logScale={isLogScale} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
