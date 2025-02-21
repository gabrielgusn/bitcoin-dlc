import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PSBTQRCodeProps {
  psbt: string;
  onClose: () => void;
}

export const PSBTQRCode: React.FC<PSBTQRCodeProps> = ({ psbt, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scan PSBT</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <QRCodeSVG
            value={psbt}
            size={256}
            level="H"
            includeMargin={true}
            className="border-4 border-white rounded-lg"
          />
          
          <div className="w-full">
            <p className="text-sm text-gray-600 mb-2">PSBT Data:</p>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-xs font-mono break-all">{psbt}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};