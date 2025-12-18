import React from 'react';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
  prefix?: string;
  helpText?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, suffix, prefix, helpText }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-0.5">{label}</label>
      {helpText && (
        <span className="text-[10px] leading-tight text-gray-400 font-medium mb-1 italic">
          {helpText}
        </span>
      )}
    </div>
    <div className="relative flex items-center group">
      {prefix && (
        <span className="absolute left-3 text-gray-400 text-sm font-semibold pointer-events-none">{prefix}</span>
      )}
      <input
        type="number"
        inputMode="decimal"
        step="any"
        value={value === 0 ? '' : value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === '' ? 0 : parseFloat(val));
        }}
        className={`w-full border border-gray-200 rounded-lg py-3 text-gray-800 text-base font-medium focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all shadow-sm appearance-none ${prefix ? 'pl-10' : 'pl-4'} ${suffix ? 'pr-12' : 'pr-4'}`}
        placeholder="Toque para inserir..."
      />
      {suffix && (
        <span className="absolute right-3 text-gray-400 text-xs font-bold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

interface InputCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const InputCard: React.FC<InputCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5 md:p-6 md:mb-6">
      <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-4">
        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
          {icon}
        </div>
        <h2 className="text-lg font-extrabold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default InputField;