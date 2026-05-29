import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Calendar, Calculator as CalcIcon, RefreshCw, Landmark } from 'lucide-react';

export default function Calculator() {
  const [propertyPrice, setPropertyPrice] = useState(80); // in Lakhs
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // default 20%
  const [interestRate, setInterestRate] = useState(11); // 11% standard
  const [tenureYears, setTenureYears] = useState(15); // 15 years

  // Calculated values
  const [downPaymentAmount, setDownPaymentAmount] = useState(16); // Lakhs
  const [loanAmount, setLoanAmount] = useState(64); // Lakhs
  const [monthlyEmi, setMonthlyEmi] = useState(0); // actual currency
  const [totalInterest, setTotalInterest] = useState(0); // Lakhs
  const [totalPayable, setTotalPayable] = useState(0); // Lakhs

  useEffect(() => {
    // 1. Calculate down payment
    const dp = (propertyPrice * downPaymentPercent) / 100;
    setDownPaymentAmount(dp);

    // 2. Calculate loan amount
    const loan = propertyPrice - dp;
    setLoanAmount(loan);

    // 3. Convert Lakhs to actual currency units for math
    const principal = loan * 100000;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    if (principal <= 0) {
      setMonthlyEmi(0);
      setTotalInterest(0);
      setTotalPayable(0);
      return;
    }

    let emiVal = 0;
    if (monthlyRate === 0) {
      emiVal = principal / totalMonths;
    } else {
      emiVal = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
               (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    setMonthlyEmi(Math.round(emiVal));

    const totalPayableVal = emiVal * totalMonths;
    const totalInterestVal = totalPayableVal - principal;

    setTotalPayable(Math.round(totalPayableVal / 100000 * 100) / 100); // in Lakhs
    setTotalInterest(Math.round(totalInterestVal / 100000 * 100) / 100); // in Lakhs

  }, [propertyPrice, downPaymentPercent, interestRate, tenureYears]);

  const resetCalculator = () => {
    setPropertyPrice(80);
    setDownPaymentPercent(20);
    setInterestRate(11);
    setTenureYears(15);
  };

  // Percentages for chart representation
  const principalPercent = totalPayable > 0 ? Math.round((loanAmount / totalPayable) * 100) : 0;
  const interestPercent = totalPayable > 0 ? 100 - principalPercent : 0;

  return (
    <div className="max-w-[1000px] mx-auto px-gutter py-8 text-left animate-[fadeInUp_0.5s_var(--apple-ease)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-border-subtle pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-[12px] font-bold mb-2">
            <Landmark size={12} />
            <span>Financing Assistant</span>
          </div>
          <h1 className="text-[28px] md:text-[34px] font-bold text-primary tracking-tight">
            EMI Loan Calculator
          </h1>
          <p className="text-on-surface-variant text-[14px] font-medium mt-1">
            Simulate your monthly mortgage payments and financing structure for Nepal real estate.
          </p>
        </div>
        <button
          onClick={resetCalculator}
          className="flex items-center gap-1.5 self-start md:self-auto px-4 py-2 border border-border-subtle bg-white hover:bg-surface-offwhite rounded-full text-[13px] font-bold text-primary transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
        >
          <RefreshCw size={13} />
          Reset Parameters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
        {/* Inputs Column */}
        <div className="bg-white rounded-2xl border border-border-subtle p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          <h2 className="text-[18px] font-bold text-primary mb-4 flex items-center gap-2">
            <CalcIcon size={18} className="text-accent-blue" />
            Financing Inputs
          </h2>

          {/* Property Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[14px] font-bold text-primary">
              <span className="flex items-center gap-1.5">Property Value (Lakhs)</span>
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-on-surface-variant text-[13px] font-semibold">Rs.</span>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={propertyPrice}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setPropertyPrice(val);
                  }}
                  className="w-32 h-8 pl-9 pr-2 bg-surface-offwhite border border-border-strong rounded-lg text-[13px] font-bold text-primary focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue text-right"
                />
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="5"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-accent-blue"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant/80 font-semibold">
              <span>Rs. 10 Lakhs</span>
              <span>Rs. 500 Lakhs</span>
              <span>Rs. 1000 Lakhs</span>
            </div>
          </div>

          {/* Down Payment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[14px] font-bold text-primary">
              <span>Down Payment (%)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={downPaymentPercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setDownPaymentPercent(Math.min(100, Math.max(0, val)));
                  }}
                  className="w-16 h-8 px-2 bg-surface-offwhite border border-border-strong rounded-lg text-[13px] font-bold text-primary focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue text-right"
                />
                <span className="text-on-surface-variant font-semibold text-[13px]">
                  (Rs. {downPaymentAmount.toFixed(1)} Lakhs)
                </span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
              className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-accent-blue"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant/80 font-semibold">
              <span>10%</span>
              <span>50%</span>
              <span>90%</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[14px] font-bold text-primary">
              <span>Annual Interest Rate (%)</span>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={interestRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setInterestRate(Math.min(50, Math.max(0, val)));
                  }}
                  className="w-20 h-8 pr-6 pl-2 bg-surface-offwhite border border-border-strong rounded-lg text-[13px] font-bold text-primary focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue text-right"
                />
                <span className="absolute right-2 text-on-surface-variant text-[12px] font-semibold">%</span>
              </div>
            </div>
            <input
              type="range"
              min="4"
              max="18"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-accent-blue"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant/80 font-semibold">
              <span>4%</span>
              <span>11%</span>
              <span>18%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[14px] font-bold text-primary">
              <span>Tenure Period (Years)</span>
              <input
                type="number"
                min="1"
                max="40"
                value={tenureYears}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setTenureYears(Math.min(40, Math.max(1, val)));
                }}
                className="w-16 h-8 px-2 bg-surface-offwhite border border-border-strong rounded-lg text-[13px] font-bold text-primary focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue text-right"
              />
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value))}
              className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-accent-blue"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant/80 font-semibold">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="flex flex-col gap-6">
          {/* Main EMI Card */}
          <div className="bg-gradient-to-br from-primary-container to-[#0e0e11] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl pointer-events-none" />
            
            <span className="text-[12px] font-bold text-on-primary-container uppercase tracking-wider">
              Estimated Monthly Cost
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-[34px] md:text-[40px] font-bold tracking-tight">
                Rs. {monthlyEmi.toLocaleString('en-NP')}
              </span>
              <span className="text-[14px] text-on-primary-container font-semibold">
                / month
              </span>
            </div>

            <hr className="border-white/10 my-6" />

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-left">
              <div>
                <span className="text-[11px] text-on-primary-container uppercase font-bold tracking-wider">
                  Loan Principal (P)
                </span>
                <p className="text-[16px] font-bold mt-0.5">
                  Rs. {loanAmount.toFixed(1)} Lakhs
                </p>
              </div>
              <div>
                <span className="text-[11px] text-on-primary-container uppercase font-bold tracking-wider">
                  Down Payment
                </span>
                <p className="text-[16px] font-bold mt-0.5">
                  Rs. {downPaymentAmount.toFixed(1)} Lakhs
                </p>
              </div>
              <div>
                <span className="text-[11px] text-on-primary-container uppercase font-bold tracking-wider">
                  Total Interest
                </span>
                <p className="text-[16px] font-bold mt-0.5 text-accent-blue">
                  Rs. {totalInterest.toFixed(1)} Lakhs
                </p>
              </div>
              <div>
                <span className="text-[11px] text-on-primary-container uppercase font-bold tracking-wider">
                  Total Repayable
                </span>
                <p className="text-[16px] font-bold mt-0.5">
                  Rs. {totalPayable.toFixed(1)} Lakhs
                </p>
              </div>
            </div>
          </div>

          {/* Graphical Breakdown */}
          <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-left">
            <h3 className="text-[15px] font-bold text-primary mb-4">
              Repayment Breakdown
            </h3>

            {/* Split Bar */}
            <div className="w-full h-5 rounded-full overflow-hidden flex mb-4 bg-surface-offwhite">
              <div 
                style={{ width: `${principalPercent}%` }} 
                className="bg-primary h-full transition-all duration-500 ease-out" 
                title={`Principal: ${principalPercent}%`}
              />
              <div 
                style={{ width: `${interestPercent}%` }} 
                className="bg-accent-blue h-full transition-all duration-500 ease-out" 
                title={`Interest: ${interestPercent}%`}
              />
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center text-[12px] font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded" />
                <span className="text-primary">Principal: {principalPercent}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent-blue rounded" />
                <span className="text-accent-blue">Interest: {interestPercent}%</span>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-surface-offwhite rounded-xl p-4 border border-border-subtle text-[12px] leading-relaxed text-on-surface-variant font-medium">
            💡 <strong>Disclaimer:</strong> This simulation calculates EMIs assuming constant interest rates. In Nepal, floating home loan interest rates may fluctuate based on base rate reviews by commercial banks.
          </div>
        </div>
      </div>
    </div>
  );
}
