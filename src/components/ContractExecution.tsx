import React from 'react';
import { Trophy, AlertTriangle } from 'lucide-react';
import { DLCContract } from '../types';
import { format } from 'date-fns';

interface ContractExecutionProps {
  contract: DLCContract;
  onExecute: () => void;
}

export const ContractExecution: React.FC<ContractExecutionProps> = ({
  contract,
  onExecute,
}) => {
  const isExpired = new Date() > new Date(contract.expiresAt);
  const canExecute = contract.status === 'active' && 
    contract.transaction?.status === 'confirmed' &&
    !isExpired;

  const getOutcomeMessage = () => {
    if (contract.status !== 'executed' || !contract.winner) return null;
    
    return (
      <div className="p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
          <Trophy className="w-5 h-5" />
          Contract Executed
        </div>
        <p className="text-green-600">
          Winner: {contract.winner.name}
        </p>
        {contract.finalPayout && (
          <div className="mt-2 text-sm text-green-600">
            <p>Final Payouts:</p>
            <p>{contract.participant1.name}: {contract.finalPayout.participant1Amount} BTC</p>
            <p>{contract.participant2.name}: {contract.finalPayout.participant2Amount} BTC</p>
          </div>
        )}
        <p className="text-sm text-green-600 mt-2">
          Executed at: {format(new Date(contract.executedAt!), 'PPpp')}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Contract Execution</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Current Price</p>
            <p className="font-medium">${contract.currentPrice}</p>
          </div>
          <div>
            <p className="text-gray-500">Target Price</p>
            <p className="font-medium">${contract.terms.targetPrice}</p>
          </div>
        </div>

        {isExpired && contract.status !== 'executed' && (
          <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Contract has expired
          </div>
        )}

        {canExecute && (
          <button
            onClick={onExecute}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Execute Contract
          </button>
        )}

        {getOutcomeMessage()}
      </div>
    </div>
  );
};