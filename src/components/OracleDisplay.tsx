import React, { useEffect, useState } from 'react';
import { LineChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

export const OracleDisplay: React.FC = () => {
  const [price, setPrice] = useState<number>(30000);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 200;
      const newPrice = price + change;
      setPrice(newPrice);
      setPriceChange(change);
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <LineChart className="w-6 h-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-800">Bitcoin Price Oracle</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
          <div className={`flex items-center ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? (
              <ArrowUpRight className="w-5 h-5" />
            ) : (
              <ArrowDownRight className="w-5 h-5" />
            )}
            <span className="font-medium">${Math.abs(priceChange).toFixed(2)}</span>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Last updated: {format(lastUpdate, 'HH:mm:ss')}
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            This is a simulated oracle for demonstration purposes. In a real DLC,
            the oracle would sign messages with its private key to attest to the
            actual Bitcoin price.
          </p>
        </div>
      </div>
    </div>
  );
};