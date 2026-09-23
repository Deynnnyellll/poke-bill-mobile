import Svg, { Circle, Path } from 'react-native-svg';

const FlameCreature = (props) => (
  <Svg
    width={props.width || 200}
    height={props.height || 200}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body */}
    <Path
      d="M320 300c-40 0-80-40-80-100 0-60 40-100 80-100s80 40 80 100c0 60-40 100-80 100z"
      fill="#FF7A00"
    />
    {/* Belly */}
    <Path
      d="M320 300c-30 0-60-30-60-80 0-50 30-80 60-80s60 30 60 80c0 50-30 80-60 80z"
      fill="#FFE0B2"
    />
    {/* Eyes */}
    <Circle cx="300" cy="220" r="12" fill="#000" />
    <Circle cx="340" cy="220" r="12" fill="#000" />
    {/* Mouth */}
    <Path
      d="M305 250c10 10 30 10 40 0"
      stroke="#000"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Flame Tail */}
    <Path
      d="M400 320c20-10 40-30 50-60 10-30 0-60-20-80 10 40-10 70-30 90-10 10-10 30 0 50z"
      fill="url(#flameGradient)"
    />
    <defs>
      <linearGradient id="flameGradient" x1="400" y1="320" x2="450" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF7A00" />
        <stop offset="1" stopColor="#FFD700" />
      </linearGradient>
    </defs>
  </Svg>
);

export default FlameCreature;
