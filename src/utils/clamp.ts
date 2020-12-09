const clamp = (value: number, lowBound: number, highBound: number) => Math.max(lowBound, Math.min(highBound, value));

export default clamp;
