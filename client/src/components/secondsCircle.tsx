interface circleProps {
    timeLeft: number;
    duration: number;
    size: number;
    color: string;
}

const SecondsCircle: React.FC<circleProps> = ({ timeLeft, duration, size, color }) => {
    const sizeEm = `${size/14}em`;
    const thickness = 11;
    const r = (size - thickness) / 2;
    const circ = 2 *Math.PI *r;   

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
                
                <svg width={sizeEm} height={sizeEm} viewBox={`0 0 ${size} ${size}`}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth={thickness}
                        strokeDasharray={circ}
                        strokeDashoffset={timeLeft==0? (circ * (1- timeLeft / duration)) :  (-circ * (timeLeft / duration))}
                        className="circle-timer"
                    />
                </svg>
            </div>
        </div>
    );
};

export default SecondsCircle;
