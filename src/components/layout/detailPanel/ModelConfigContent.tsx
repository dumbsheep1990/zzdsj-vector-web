import React from 'react';

interface ModelConfigContentProps {
  selectedItem: any;
}

const ModelConfigContent: React.FC<ModelConfigContentProps> = ({ selectedItem }) => {
  if (!selectedItem || !('provider' in selectedItem)) return null;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">u6a21u578bu914du7f6e</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">u67e5u770bu4f7fu7528u65e5u5fd7</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            APIu5bc6u94a5
          </label>
          <div className="flex">
            <input
              type="password"
              value="u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022u2022"
              className="flex-1 border rounded-l-md px-3 py-2 bg-gray-50"
              disabled
            />
            <button className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md hover:bg-gray-200">
              u67e5u770b
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            u670du52a1u7aefu70b9
          </label>
          <input
            type="text"
            value={selectedItem?.endpoint || "https://api.openai.com/v1/completions"}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            u6a21u578bu7248u672c
          </label>
          <select className="w-full border rounded-md px-3 py-2">
            <option>gpt-4-turbo</option>
            <option>gpt-4</option>
            <option selected>gpt-3.5-turbo</option>
            <option>text-embedding-ada-002</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            u6a21u578bu53c2u6570
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Temperature
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value="0.7"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>0.7</span>
                <span>1</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                value="2048"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            u4fddu5b58u914du7f6e
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
            u6d4bu8bd5u8fdeu63a5
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelConfigContent;
