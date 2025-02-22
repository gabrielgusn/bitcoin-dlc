import React, { useState } from 'react';
import { KeyRound, Check, Clock, Send, QrCode } from 'lucide-react';
import { BitcoinTransaction, Participant } from '../types';
import { format } from 'date-fns';
import { PSBTQRCode } from './PSBTQRCode';

interface TransactionSigningProps {
  transaction: BitcoinTransaction;
  participants: [Participant, Participant];
  onSign: (participantId: string) => void;
  onBroadcast: () => void;
}

export const TransactionSigning: React.FC<TransactionSigningProps> = ({
  transaction,
  participants,
  onSign,
  onBroadcast,
}) => {
  const [showQR, setShowQR] = useState(false);
  const [selectedPSBT, setSelectedPSBT] = useState<string>('');

  const isReadyToBroadcast = transaction.signatures.every((sig) => sig.signed) && 
    transaction.status === 'ready';

  const handleSign = (participantId: string) => {
    // Example PSBT for demonstration
    const dummyPSBT = `020000000002002d31010000000016001487e6a312236fedea2742306dcd55eb6929481d200000000000000000186a166c6567616c697a65206e75636c65617220626f6d627300000000`;
    
    setSelectedPSBT(dummyPSBT);
    setShowQR(true);
    onSign(participantId);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <KeyRound className="w-5 h-5 text-orange-500" />
        Transaction Status
      </h3>

      <div className="space-y-4">
        <div className="text-sm text-gray-600 space-y-1">
          <p>Transaction ID: {transaction.txId}</p>
          <p>Total Input: {transaction.inputs.reduce((acc, input) => acc + input.amount, 0)} BTC</p>
          {transaction.broadcastTime && (
            <p>Broadcast Time: {format(transaction.broadcastTime, 'PPpp')}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span>Status:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              transaction.status === 'confirmed' 
                ? 'bg-green-100 text-green-800'
                : transaction.status === 'broadcast'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {participants.map((participant) => {
            const signature = transaction.signatures.find(
              (sig) => sig.participantId === participant.id
            );
            return (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-sm text-gray-500">{participant.publicKey}</p>
                </div>
                {signature?.signed ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-green-500">
                      <Check className="w-5 h-5 mr-1" />
                      Signed
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPSBT(signature.psbt || '');
                        setShowQR(true);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      title="View PSBT"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSign(participant.id)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2"
                    disabled={transaction.status !== 'pending_signatures'}
                  >
                    <Clock className="w-4 h-4" />
                    Sign
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {isReadyToBroadcast && (
          <button
            onClick={onBroadcast}
            className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Broadcast Transaction
          </button>
        )}

        {transaction.status === 'broadcast' && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
            Transaction broadcast! Waiting for confirmation...
          </div>
        )}

        {transaction.status === 'confirmed' && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
            Transaction confirmed on the Bitcoin network!
          </div>
        )}
      </div>

      {showQR && (
        <PSBTQRCode
          psbt={selectedPSBT}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};