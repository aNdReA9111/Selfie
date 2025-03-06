interface circleProps {
    timeLeft: number;
    duration: number;
    size: number;
    color: string;
}

const disappearingCircle: React.FC<circleProps> = ({ timeLeft, duration, size, color }) => {
    const thickness = 11;
    size = size;
    const sizeEm = `${size/14}em`;
    const r = (size - thickness) / 2;
    const circ = 2 *Math.PI *r;    
    const strokeDashoffset = circ * (1 - timeLeft / duration);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
                <svg width={sizeEm} height={sizeEm} viewBox={`0 0 ${size} ${size}`} >
                    <circle 
                        cx={size/2}
                        cy={size/2}
                        r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth={thickness}
                        strokeDasharray={circ}
                        strokeDashoffset={strokeDashoffset}
                        className='circle-timer'
                    />
                </svg>
            </div>
        </div>
    );
};

export default disappearingCircle;
