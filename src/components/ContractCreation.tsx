import React, { useState } from 'react';
import { Bitcoin } from 'lucide-react';

interface ContractCreationProps {
  onCreateContract: (contract: any) => void;
}

export const ContractCreation: React.FC<ContractCreationProps> = ({ onCreateContract }) => {
  const [targetPrice, setTargetPrice] = useState<number>(30000);
  const [collateral, setCollateral] = useState<number>(0.1);
  const [duration, setDuration] = useState<number>(24);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contract = {
      targetPrice,
      collateral,
      duration,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 60 * 60 * 1000),
    };
    onCreateContract(contract);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        <Bitcoin className="w-8 h-8 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Create DLC Contract</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target BTC Price (USD)
          </label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="0"
            step="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collateral (BTC)
          </label>
          <input
            type="number"
            value={collateral}
            onChange={(e) => setCollateral(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="0.01"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (hours)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="1"
            max="168"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
        >
          Create Contract
        </button>
      </form>
    </div>
  );
};