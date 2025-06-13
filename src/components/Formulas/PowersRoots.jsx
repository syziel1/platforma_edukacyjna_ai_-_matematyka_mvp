import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const PowersRoots = () => {
    const [base, setBase] = useState(2);
    const [exponent, setExponent] = useState(3);

    const wzory = [
        { name: 'Potęga o wykładniku naturalnym', wzor: `aⁿ = a ⋅ a ⋅ ... ⋅ a (n razy)`, example: `${base}<sup>${exponent}</sup> = ${Math.pow(base, exponent)}` },
        { name: 'Potęga o wykładniku całkowitym ujemnym', wzor: 'a⁻ⁿ = 1/aⁿ', example: `${base}<sup>-${exponent}</sup> = 1/${Math.pow(base, exponent)} = ${1 / Math.pow(base, exponent)}` },
        { name: 'Potęga o wykładniku wymiernym', wzor: 'a^(m/n) = ⁿ√aᵐ', example: `8¹ᐟ³ = ³√8 = 2` },
        { name: 'Iloczyn potęg o tych samych podstawach', wzor: 'aʳ ⋅ aˢ = aʳ⁺ˢ', example: `${base}² ⋅ ${base}³ = ${base}⁵ = ${Math.pow(base, 5)}` },
        { name: 'Iloraz potęg o tych samych podstawach', wzor: 'aʳ / aˢ = aʳ⁻ˢ', example: `${base}⁵ / ${base}³ = ${base}² = ${Math.pow(base, 2)}` },
        { name: 'Potęga potęgi', wzor: '(aʳ)ˢ = aʳˢ', example: `(${base}²)³ = ${base}⁶ = ${Math.pow(base, 6)}` },
    ];

    return (
        <div className="p-6 bg-bg-main min-h-screen">
            <h1 className="text-3xl font-bold text-text-color mb-6 flex items-center"><Zap className="mr-2" />Potęgi i pierwiastki</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {wzory.map((item, index) => (
                    <div key={index} className="bg-bg-card p-4 rounded-lg shadow-sm border border-nav-bg/20">
                        <h2 className="text-lg font-semibold text-nav-bg mb-2">{item.name}</h2>
                        <p className="text-lg text-text-color font-mono" dangerouslySetInnerHTML={{ __html: item.wzor }} />
                        <p className="text-md text-text-color/80 mt-2" dangerouslySetInnerHTML={{ __html: `Przykład: ${item.example}` }} />
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-bg-card p-6 rounded-lg shadow-sm border border-accent-primary/20">
                <h2 className="text-xl font-bold text-accent-primary mb-4">Interaktywny przykład</h2>
                <div className="flex items-center gap-4 mb-4">
                    <div>
                        <label htmlFor="base" className="block text-sm font-medium text-text-color">Podstawa (a)</label>
                        <input
                            id="base"
                            type="range"
                            min="2"
                            max="10"
                            value={base}
                            onChange={(e) => setBase(Number(e.target.value))}
                            className="w-full"
                        />
                        <span className="text-text-color font-bold">{base}</span>
                    </div>
                    <div>
                        <label htmlFor="exponent" className="block text-sm font-medium text-text-color">Wykładnik (n)</label>
                        <input
                            id="exponent"
                            type="range"
                            min="2"
                            max="10"
                            value={exponent}
                            onChange={(e) => setExponent(Number(e.target.value))}
                            className="w-full"
                        />
                        <span className="text-text-color font-bold">{exponent}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PowersRoots;