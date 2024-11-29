import React from 'react';

const CheckboxGroupInput = ({ label, options, selectedOptions, onChange }) => {
  return (
    <div className="mb-4">
      <span className="block text-gray-700 text-sm font-bold mb-2">{label}:</span>
      {options.map(option => (
        <label key={option} className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={() => onChange(option)}
            className="form-checkbox"
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroupInput;
