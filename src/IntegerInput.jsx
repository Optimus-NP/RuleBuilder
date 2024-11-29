import React from 'react';

const IntegerInput = ({ label, min, max, value, onChange}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label} Value:
      </label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="mr-2 border border-gray-300 rounded p-1"
      />
    </div>
  );
};

export default IntegerInput;
