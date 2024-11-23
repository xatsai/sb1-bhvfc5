import React from 'react';
import { Mic } from 'lucide-react';
import { InvoiceData } from '../types';
import { CurrencySelect } from './CurrencySelect';
import { AdditionalFields } from './AdditionalFields';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  isListening: boolean;
  currentField: keyof InvoiceData | null;
  onInputChange: (field: keyof InvoiceData, value: any) => void;
  startListening: (field: keyof InvoiceData) => void;
  stopListening: () => void;
}

export function InvoiceForm({
  invoiceData,
  isListening,
  currentField,
  onInputChange,
  startListening,
  stopListening
}: InvoiceFormProps) {
  const handleCurrencyChange = (currency: string, customCurrency?: string) => {
    onInputChange('currency', currency);
    if (customCurrency) {
      onInputChange('customCurrency', customCurrency);
    }
  };

  return (
    <div className="px-8 py-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">From:</h3>
          {['fromName', 'fromEmail', 'fromAddress'].map((field) => (
            <div key={field} className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.replace('from', '').replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={invoiceData[field as keyof InvoiceData]}
                  onChange={(e) => onInputChange(field as keyof InvoiceData, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                onMouseDown={() => startListening(field as keyof InvoiceData)}
                onMouseUp={stopListening}
                className={`p-2 rounded-full ${isListening && currentField === field ? 'bg-red-500' : 'bg-gray-200'} hover:bg-gray-300 transition-colors`}
              >
                <Mic className="w-5 h-5 text-[#57BEA4]" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Billed To:</h3>
          {['clientName', 'clientEmail', 'clientAddress'].map((field) => (
            <div key={field} className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.replace('client', '').replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={invoiceData[field as keyof InvoiceData]}
                  onChange={(e) => onInputChange(field as keyof InvoiceData, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                onMouseDown={() => startListening(field as keyof InvoiceData)}
                onMouseUp={stopListening}
                className={`p-2 rounded-full ${isListening && currentField === field ? 'bg-red-500' : 'bg-gray-200'} hover:bg-gray-300 transition-colors`}
              >
                <Mic className="w-5 h-5 text-[#57BEA4]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={invoiceData.date}
            onChange={(e) => onInputChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={invoiceData.dueDate}
            onChange={(e) => onInputChange('dueDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <CurrencySelect
          value={invoiceData.currency}
          customCurrency={invoiceData.customCurrency}
          onChange={handleCurrencyChange}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Items:</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[index].name = e.target.value;
                      onInputChange('items', newItems);
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[index].quantity = parseInt(e.target.value);
                      newItems[index].amount = newItems[index].quantity * newItems[index].price;
                      onInputChange('items', newItems);
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[index].price = parseFloat(e.target.value);
                      newItems[index].amount = newItems[index].quantity * newItems[index].price;
                      onInputChange('items', newItems);
                    }}
                    className="w-24 px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2">${item.amount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      const newItems = invoiceData.items.filter((_, i) => i !== index);
                      onInputChange('items', newItems);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => {
            const newItems = [...invoiceData.items, { name: '', quantity: 1, price: 0, amount: 0 }];
            onInputChange('items', newItems);
          }}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Add Item
        </button>
      </div>

      <div className="mt-6">
        <AdditionalFields
          data={{
            tax: invoiceData.tax,
            discount: invoiceData.discount,
            shipping: invoiceData.shipping
          }}
          onChange={onInputChange}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <input
              type="text"
              value={invoiceData.note}
              onChange={(e) => onInputChange('note', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add a note (optional)"
            />
          </div>
          <button
            onMouseDown={() => startListening('note')}
            onMouseUp={stopListening}
            className={`p-2 rounded-full ${isListening && currentField === 'note' ? 'bg-red-500' : 'bg-gray-200'} hover:bg-gray-300 transition-colors`}
          >
            <Mic className="w-5 h-5 text-[#57BEA4]" />
          </button>
        </div>
      </div>
    </div>
  );
}