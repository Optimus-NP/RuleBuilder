import React from 'react';

const DropdownInput = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}:
        <select value={value} onChange={onChange} className="mt-1 block w-full p-2 border border-gray-300 rounded">
          <option value="">Select...</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default DropdownInput;
