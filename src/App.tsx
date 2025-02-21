import React, { useState, useEffect } from 'react';
import { ContractCreation } from './components/ContractCreation';
import { OracleDisplay } from './components/OracleDisplay';
import { TransactionSigning } from './components/TransactionSigning';
import { ContractExecution } from './components/ContractExecution';
import { DLCContract } from './types';
import { Bitcoin, Users } from 'lucide-react';

function App() {
  const [contracts, setContracts] = useState<DLCContract[]>([]);

  const handleCreateContract = (contractData: any) => {
    const newContract: DLCContract = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: contractData.createdAt,
      expiresAt: contractData.expiresAt,
      participant1: {
        id: '1',
        name: 'Alice',
        publicKey: '02abc...def',
        balance: 1.5
      },
      participant2: {
        id: '2',
        name: 'Bob',
        publicKey: '03def...abc',
        balance: 2.0
      },
      oracle: {
        name: 'Price Oracle',
        publicKey: '02xyz...789'
      },
      terms: {
        targetPrice: contractData.targetPrice,
        collateral: contractData.collateral,
        outcome1Payout: contractData.collateral * 2,
        outcome2Payout: 0,
        priceThreshold: 100
      },
      currentPrice: 30000,
      transaction: {
        txId: Math.random().toString(36).substr(2, 9),
        inputs: [
          {
            txid: '1234...5678',
            vout: 0,
            amount: contractData.collateral,
            witnessUtxo: {
              script: '0014d85c2b71d0060b09c9886aeb815e50991dda124d',
              amount: contractData.collateral * 100000000 // Convert to satoshis
            },
            ownerPubkey: '02abc...def'
          },
          {
            txid: '5678...1234',
            vout: 1,
            amount: contractData.collateral,
            witnessUtxo: {
              script: '0014d85c2b71d0060b09c9886aeb815e50991dda124d',
              amount: contractData.collateral * 100000000
            },
            ownerPubkey: '03def...abc'
          }
        ],
        signatures: [
          { participantId: '1', signed: false },
          { participantId: '2', signed: false }
        ],
        status: 'pending_signatures'
      }
    };

    setContracts([...contracts, newContract]);
  };

  const handleSign = (contractId: string, participantId: string) => {
    setContracts(contracts.map(contract => {
      if (contract.id === contractId && contract.transaction) {
        const updatedSignatures = contract.transaction.signatures.map(sig => {
          if (sig.participantId === participantId) {
            // Generate a unique PSBT for each signature
            const dummyPSBT = `cHNidP8BAHECAAAAASaBcTce3/KF6Tet7qSze3gADAz9+glycJUYXpvRzCsAAAAA/////wGgWuoLAAAAABl2qRT/+${Math.random().toString(36).substring(2)}`;
            return { ...sig, signed: true, psbt: dummyPSBT };
          }
          return sig;
        });
        const allSigned = updatedSignatures.every(sig => sig.signed);

        return {
          ...contract,
          status: allSigned ? 'active' : 'pending',
          transaction: {
            ...contract.transaction,
            signatures: updatedSignatures,
            status: allSigned ? 'ready' : 'pending_signatures',
            serializedPsbt: allSigned ? 'cHNidP8BAHECAAAAASaBcTce3/KF6Tet7qSze3gADAz9+glycJUYXpvRzCsAAAAA' : undefined
          }
        };
      }
      return contract;
    }));
  };

  const handleBroadcast = (contractId: string) => {
    setContracts(contracts.map(contract => {
      if (contract.id === contractId && contract.transaction) {
        return {
          ...contract,
          transaction: {
            ...contract.transaction,
            status: 'broadcast',
            broadcastTime: new Date()
          }
        };
      }
      return contract;
    }));

    setTimeout(() => {
      setContracts(contracts.map(contract => {
        if (contract.id === contractId && contract.transaction) {
          return {
            ...contract,
            transaction: {
              ...contract.transaction,
              status: 'confirmed'
            }
          };
        }
        return contract;
      }));
    }, 5000);
  };

  const handleExecute = (contractId: string) => {
    setContracts(contracts.map(contract => {
      if (contract.id === contractId) {
        const priceDiff = Math.abs(contract.currentPrice - contract.terms.targetPrice);
        const winner = priceDiff <= contract.terms.priceThreshold
          ? contract.participant1
          : contract.participant2;

        return {
          ...contract,
          status: 'executed',
          executedAt: new Date(),
          winner,
          finalPayout: {
            participant1Amount: winner.id === contract.participant1.id 
              ? contract.terms.outcome1Payout 
              : contract.terms.outcome2Payout,
            participant2Amount: winner.id === contract.participant2.id 
              ? contract.terms.outcome1Payout 
              : contract.terms.outcome2Payout
          }
        };
      }
      return contract;
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setContracts(contracts.map(contract => ({
        ...contract,
        currentPrice: contract.currentPrice + (Math.random() - 0.5) * 200
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [contracts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bitcoin className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-900">Bitcoin DLC Demo</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">2 Participants</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <OracleDisplay />
            <ContractCreation onCreateContract={handleCreateContract} />
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Active Contracts</h2>
              {contracts.length === 0 ? (
                <p className="text-gray-500">No active contracts. Create one to get started!</p>
              ) : (
                <div className="space-y-6">
                  {contracts.map((contract) => (
                    <div key={contract.id} className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">Contract #{contract.id}</h3>
                            <p className="text-sm text-gray-500">
                              Target Price: ${contract.terms.targetPrice}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            contract.status === 'executed' 
                              ? 'bg-green-100 text-green-800'
                              : contract.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Collateral</p>
                            <p className="font-medium">{contract.terms.collateral} BTC</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Expires</p>
                            <p className="font-medium">
                              {new Date(contract.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {contract.transaction && (
                        <TransactionSigning
                          transaction={contract.transaction}
                          participants={[contract.participant1, contract.participant2]}
                          onSign={(participantId) => handleSign(contract.id, participantId)}
                          onBroadcast={() => handleBroadcast(contract.id)}
                        />
                      )}

                      <ContractExecution
                        contract={contract}
                        onExecute={() => handleExecute(contract.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;