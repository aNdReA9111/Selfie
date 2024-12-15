// import React, { useState, useEffect } from 'react';
// import { Time, formatTime } from '../utils/pomUtils';
interface circleProps {
    timeLeft: number;
    duration: number;
    size: number;
    color: string;
}

const disappearingCircle: React.FC<circleProps> = ({ timeLeft, duration, size, color }) => {
    const thickness = 11;
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - timeLeft / duration);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
                <svg
                    width={size}
                    height={size}
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={thickness}
                        opacity={0.2}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={thickness}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className='circle-timer'
                    />
                </svg>
                <div>

                </div>
            </div>
        </div>
    );
};

export default disappearingCircle;
