
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import type { PriceHistoryPoint, PricePredictionPoint } from '../types';

interface PriceChartProps {
    history: PriceHistoryPoint[];
    prediction: PricePredictionPoint[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ history, prediction }) => {
    const combinedData = [
        ...history.map(p => ({ date: p.date, price: p.price })),
        ...prediction.map(p => ({ 
            date: p.date, 
            predictedPrice: p.predictedPrice, 
            confidence: [p.confidenceMin, p.confidenceMax] 
        })),
    ];
    
    // Custom Tooltip to fix bug and handle different payload types gracefully
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const pricePayload = payload.find((p: any) => p.dataKey === 'price');
            const predictedPricePayload = payload.find((p: any) => p.dataKey === 'predictedPrice');
            const confidencePayload = payload.find((p: any) => p.dataKey === 'confidence');

            return (
                <div className="p-2 bg-gray-700/80 border border-gray-600 rounded-md backdrop-blur-sm text-sm">
                    <p className="label text-gray-300">{`Date: ${label}`}</p>
                    {pricePayload && <p style={{ color: pricePayload.color }}>{`Price: ₹${pricePayload.value.toFixed(0)}`}</p>}
                    {predictedPricePayload && <p style={{ color: predictedPricePayload.color }}>{`Predicted: ₹${predictedPricePayload.value.toFixed(0)}`}</p>}
                    {confidencePayload && Array.isArray(confidencePayload.value) && (
                        <p style={{ color: '#F6E05E', opacity: 0.8 }}>
                            {`Confidence: ₹${confidencePayload.value[0].toFixed(0)} - ₹${confidencePayload.value[1].toFixed(0)}`}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };
    
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={combinedData}
                    margin={{
                        top: 5, right: 30, left: 0, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#A0AEC0', fontSize: 12 }} 
                      tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                      />
                    <YAxis 
                      tick={{ fill: '#A0AEC0', fontSize: 12 }} 
                      domain={['dataMin - 100', 'dataMax + 100']}
                      tickFormatter={(tick) => `₹${tick}`}
                      />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    
                    <Line type="monotone" dataKey="price" name="Historical Price" stroke="#38B2AC" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="predictedPrice" name="AI Predicted Price" stroke="#F6E05E" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Area type="monotone" dataKey="confidence" name="Confidence Range" stroke={false} fill="#F6E05E" fillOpacity={0.1} legendType="none"/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
