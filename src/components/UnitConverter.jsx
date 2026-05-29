import React, { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { convertLandUnits, UNIT_OPTIONS } from '../lib/unitConvert';

export default function UnitConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('ropani');

  const results = useMemo(() => {
    const num = parseFloat(inputValue);
    if (isNaN(num) || num <= 0) return null;
    return convertLandUnits(num, fromUnit);
  }, [inputValue, fromUnit]);

  const hillUnits = UNIT_OPTIONS.filter(u => u.system === 'Hill');
  const teraiUnits = UNIT_OPTIONS.filter(u => u.system === 'Terai');
  const universalUnits = UNIT_OPTIONS.filter(u => u.system === 'Universal');

  const formatNum = (val) => {
    if (val === 0) return '0';
    if (val >= 1) return val.toLocaleString('en-NP', { maximumFractionDigits: 4 });
    return val.toFixed(6);
  };

  return (
    <div className="max-w-[800px] mx-auto px-gutter animate-[fadeInUp_0.4s_var(--apple-ease)]">
      {/* Header */}
      <div className="text-left mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <ArrowRightLeft size={20} className="text-white" />
          </div>
          <h2 className="text-[24px] font-bold text-primary">Land Unit Converter</h2>
        </div>
        <p className="text-on-surface-variant text-[14px] font-medium">
          Convert between Nepali land measurement units — Ropani, Aana, Bigha, Kattha, and more.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Enter Value
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 1"
              min="0"
              step="any"
              className="w-full bg-surface-offwhite border border-border-subtle rounded-xl py-3 px-4 text-[16px] font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="sm:w-[200px]">
            <label className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              From Unit
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-surface-offwhite border border-border-subtle rounded-xl py-3 px-4 text-[14px] font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all cursor-pointer appearance-none"
            >
              <optgroup label="Hill System">
                {hillUnits.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
              </optgroup>
              <optgroup label="Terai System">
                {teraiUnits.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
              </optgroup>
              <optgroup label="Universal">
                {universalUnits.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-[fadeInUp_0.3s_var(--apple-ease)]">
          {/* Hill System */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-emerald-600 uppercase tracking-wider mb-3">
              Hill System (पहाडी)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {hillUnits.map(u => (
                <div
                  key={u.key}
                  className={`p-3 rounded-xl text-center transition-all ${
                    fromUnit === u.key
                      ? 'bg-emerald-50 border-2 border-emerald-500'
                      : 'bg-surface-offwhite border border-border-subtle'
                  }`}
                >
                  <div className="text-[18px] font-bold text-primary">{formatNum(results[u.key])}</div>
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">{u.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Terai System */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-amber-600 uppercase tracking-wider mb-3">
              Terai System (तराई)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {teraiUnits.map(u => (
                <div
                  key={u.key}
                  className={`p-3 rounded-xl text-center transition-all ${
                    fromUnit === u.key
                      ? 'bg-amber-50 border-2 border-amber-500'
                      : 'bg-surface-offwhite border border-border-subtle'
                  }`}
                >
                  <div className="text-[18px] font-bold text-primary">{formatNum(results[u.key])}</div>
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">{u.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Universal */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-blue-600 uppercase tracking-wider mb-3">
              Universal
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {universalUnits.map(u => (
                <div
                  key={u.key}
                  className={`p-3 rounded-xl text-center transition-all ${
                    fromUnit === u.key
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-surface-offwhite border border-border-subtle'
                  }`}
                >
                  <div className="text-[18px] font-bold text-primary">{formatNum(results[u.key])}</div>
                  <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mt-1">{u.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!results && (
        <div className="py-16 px-5 bg-white border border-dashed border-border-strong rounded-2xl text-center">
          <ArrowRightLeft size={32} className="mx-auto text-on-surface-variant/30 mb-3" />
          <h3 className="text-primary text-[16px] font-bold mb-1">Enter a value to convert</h3>
          <p className="text-on-surface-variant text-[13px]">
            Select a unit and type a number to see instant conversions across all systems.
          </p>
        </div>
      )}
    </div>
  );
}
