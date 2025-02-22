import React, { useEffect, useState, useRef } from "react";
import { LineChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";

export const OracleDisplay: React.FC = () => {
  const [price, setPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const latestPrice = useRef<number>(0);

  useEffect(() => {
    // Fetch initial price
    const fetchInitialPrice = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
        );
        const data = await response.json();
        const initialPrice = parseFloat(data.price);
        latestPrice.current = initialPrice;
        setPrice(initialPrice);
      } catch (error) {
        console.error("Error fetching initial price:", error);
      }
    };

    fetchInitialPrice();

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      latestPrice.current = parseFloat(data.p);
    };

    const interval = setInterval(() => {
      setPrice((prev) => {
        const change = latestPrice.current - prev;
        setPriceChange(change);
        return latestPrice.current;
      });
      setLastUpdate(new Date());
    }, 5000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <LineChart className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-800">
          Bitcoin Price Oracle
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold">
            $
            {price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="flex items-center w-full justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {format(lastUpdate, "HH:mm:ss")}
          </div>

          <div
            className={cn(
              "flex items-center",
              priceChange >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {priceChange >= 0 ? (
              <ArrowUpRight className="w-5 h-5" />
            ) : (
              <ArrowDownRight className="w-5 h-5" />
            )}
            <span className="font-medium">
              $
              {Math.abs(priceChange).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
