
import React from 'react';
import { useGameContext } from '../hooks/useGameContext';

const RawDataPanel: React.FC = () => {
  const { rawData, setRawData, handleParse, handleBuild } = useGameContext();

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg shadow-inner flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-gray-300">Raw Tables (Parser/Builder)</h2>
      <div className="flex space-x-2">
        <button
          onClick={handleParse}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
        >
          Parse
        </button>
        <button
          onClick={handleBuild}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-150"
        >
          Build
        </button>
      </div>
      <textarea
        value={rawData}
        onChange={(e) => setRawData(e.target.value)}
        className="flex-grow w-full p-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-md font-mono text-xs focus:ring-blue-500 focus:border-blue-500"
        placeholder="Paste raw table data here..."
      />
    </div>
  );
};

export default RawDataPanel;
