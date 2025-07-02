import React from 'react';

const SelectField = ({ label, name, options, register, className }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <select
        {...register(name,  { required: true })}
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-gray-900 ${className || ''}`}
      >
        {options.map((option) => (
          option.subcategories ? (
            <optgroup key={option.value} label={option.label}>
              {option.subcategories.map((sub) => (
                <option key={sub.value} value={sub.value}>{sub.label}</option>
              ))}
            </optgroup>
          ) : (
            <option key={option.value} value={option.value}>{option.label}</option>
          )
        ))}
      </select>
    </div>
  );
};

export default SelectField;