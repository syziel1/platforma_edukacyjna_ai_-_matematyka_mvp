import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const EcoTshirtSimulator = () => {
  const { t } = useLanguage();

  // Startup parameters
  const [budget] = useState(1000);
  const [baseCost] = useState(25);
  const [discountThreshold] = useState(30);
  const [discountRate] = useState(0.15);
  const [targetMargin] = useState(0.35);
  const [vatRate] = useState(0.23);

  // User inputs
  const [quantity, setQuantity] = useState(35);
  const [sellingPriceNet, setSellingPriceNet] = useState(32.31);

  // Centralized calculation function to ensure consistency
  const calculateAllValues = (currentQuantity, currentSellingPriceNet) => {
    // Calculate unit cost with discount
    const unitCost = currentQuantity >= discountThreshold 
      ? baseCost * (1 - discountRate) 
      : baseCost;
    
    // Calculate total cost
    const totalCost = unitCost * currentQuantity;
    
    // Calculate maximum quantity possible with budget
    const costWithDiscount = baseCost * (1 - discountRate);
    const costWithoutDiscount = baseCost;
    
    const maxWithDiscount = Math.floor(budget / costWithDiscount);
    const maxWithoutDiscount = Math.floor(budget / costWithoutDiscount);
    
    const maxQuantity = maxWithDiscount >= discountThreshold 
      ? maxWithDiscount 
      : Math.max(maxWithDiscount, maxWithoutDiscount);
    
    // Calculate selling price with VAT
    const sellingPriceGross = currentSellingPriceNet * (1 + vatRate);
    
    // Calculate actual margin
    const actualMargin = currentSellingPriceNet > 0 
      ? ((currentSellingPriceNet - unitCost) / currentSellingPriceNet) * 100 
      : 0;
    
    // Calculate sales results (3/5 sold)
    const soldQuantity = Math.floor(currentQuantity * (3/5));
    const remainingStock = currentQuantity - soldQuantity;
    const revenue = soldQuantity * currentSellingPriceNet;
    const profit = revenue - totalCost;
    
    return {
      unitCost,
      totalCost,
      maxQuantity,
      sellingPriceGross,
      actualMargin,
      soldQuantity,
      remainingStock,
      revenue,
      profit
    };
  };

  // Calculate all derived values using the centralized function
  const calculatedValues = calculateAllValues(quantity, sellingPriceNet);

  const {
    unitCost,
    totalCost,
    maxQuantity,
    sellingPriceGross,
    actualMargin,
    soldQuantity,
    remainingStock,
    revenue,
    profit
  } = calculatedValues;

  // Calculate optimal selling price for target margin
  const calculateOptimalPrice = () => {
    const optimalPrice = unitCost / (1 - targetMargin);
    setSellingPriceNet(Math.round(optimalPrice * 100) / 100);
  };

  const formatNumber = (num) => {
    return num.toFixed(2).replace('.', ',');
  };

  const formatCurrency = (num) => {
    return `${formatNumber(num)} zł`;
  };

  const formatPercent = (num) => {
    return `${formatNumber(num)}%`;
  };

  return (
    <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
      <h3 className="text-lg font-semibold text-text-color mb-4">
        {t('businessSimulator')} - Eko-Koszulka
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Inputs and Controls */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">💰 {t('startupBudget')}</h4>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(budget)}</div>
            <div className="text-sm text-blue-600 mt-1">
              Koszt bazowy: {formatCurrency(baseCost)} | Rabat: {formatPercent(discountRate * 100)} (powyżej {discountThreshold} szt.)
            </div>
          </div>

          {/* Production Planning */}
          <div>
            <h4 className="font-semibold text-text-color mb-3">📦 {t('calculateProduction')}</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  {t('quantity')}: {quantity} szt.
                </label>
                <input
                  type="range"
                  min="1"
                  max={maxQuantity + 10}
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-nav-bg [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-nav-bg [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-text-color/60 mt-1">
                  <span>1</span>
                  <span>Max: {maxQuantity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="font-semibold text-text-color mb-3">💵 {t('calculatePrice')}</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  {t('netPrice')}: {formatCurrency(sellingPriceNet)}
                </label>
                <input
                  type="range"
                  min={unitCost}
                  max={unitCost * 2}
                  step="0.01"
                  value={sellingPriceNet}
                  onChange={(e) => setSellingPriceNet(parseFloat(e.target.value))}
                  className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-nav-bg [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-nav-bg [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>
              <button
                onClick={calculateOptimalPrice}
                className="w-full bg-nav-bg text-white py-2 px-4 rounded-md hover:bg-nav-bg/90 transition-colors text-sm"
              >
                Ustaw cenę dla marży {formatPercent(targetMargin * 100)}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-4">
          {/* Production Costs */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-3">🏭 Koszty produkcji</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">{t('unitCost')}:</span>
                <span className="font-medium text-orange-800">{formatCurrency(unitCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">{t('totalCost')}:</span>
                <span className="font-medium text-orange-800">{formatCurrency(totalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Pozostały budżet:</span>
                <span className={`font-medium ${budget - totalCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(budget - totalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Analysis */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">💰 Analiza cen</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-700">{t('netPrice')}:</span>
                <span className="font-medium text-purple-800">{formatCurrency(sellingPriceNet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">{t('grossPrice')} (+23% VAT):</span>
                <span className="font-medium text-purple-800">{formatCurrency(sellingPriceGross)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">{t('actualMargin')}:</span>
                <span className={`font-medium ${actualMargin >= targetMargin * 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercent(actualMargin)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">{t('targetMargin')}:</span>
                <span className="font-medium text-purple-600">{formatPercent(targetMargin * 100)}</span>
              </div>
            </div>
          </div>

          {/* Sales Results */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">📊 {t('monthlyResults')} (3/5 sprzedane)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">{t('soldQuantity')}:</span>
                <span className="font-medium text-green-800">{soldQuantity} szt.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">{t('remainingStock')}:</span>
                <span className="font-medium text-green-800">{remainingStock} szt.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">{t('revenue')}:</span>
                <span className="font-medium text-green-800">{formatCurrency(revenue)}</span>
              </div>
              <div className="flex justify-between border-t border-green-200 pt-2">
                <span className="text-green-700 font-medium">{t('profitLoss')}:</span>
                <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Tips */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-md p-4 ${totalCost <= budget ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h4 className={`font-semibold mb-2 ${totalCost <= budget ? 'text-green-800' : 'text-red-800'}`}>
            {totalCost <= budget ? '✅ Produkcja możliwa' : '❌ Przekroczony budżet'}
          </h4>
          <p className={`text-sm ${totalCost <= budget ? 'text-green-700' : 'text-red-700'}`}>
            {totalCost <= budget 
              ? `Możesz wyprodukować ${quantity} koszulek w ramach budżetu.`
              : `Zmniejsz ilość lub znajdź tańszego dostawcę.`
            }
          </p>
        </div>

        <div className={`rounded-md p-4 ${actualMargin >= targetMargin * 100 ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <h4 className={`font-semibold mb-2 ${actualMargin >= targetMargin * 100 ? 'text-blue-800' : 'text-yellow-800'}`}>
            {actualMargin >= targetMargin * 100 ? '🎯 Marża osiągnięta' : '⚠️ Niska marża'}
          </h4>
          <p className={`text-sm ${actualMargin >= targetMargin * 100 ? 'text-blue-700' : 'text-yellow-700'}`}>
            {actualMargin >= targetMargin * 100 
              ? `Marża ${formatPercent(actualMargin)} jest wyższa od docelowej.`
              : `Zwiększ cenę lub zmniejsz koszty produkcji.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcoTshirtSimulator;