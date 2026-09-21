// meltan-hugging-rope.jsx
// (Mascot header illustration: Cute Meltan hugging a vertical rope strand)
//
// Requires react-native-svg:
//   npx expo install react-native-svg

import Svg, {
  Circle,
  Defs,
  Ellipse,
  FeDropShadow,
  Filter,
  G,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

export default function MeltanHuggingRope({ width = 120 }) {
  // Calculates height dynamically based on the 500x500 square viewBox aspect ratio
  const height = (width * 500) / 500;

  return (
    <Svg width={width} height={height} viewBox="0 0 500 500">
      {/* Definitions for gradients and shadows */}
      <Defs>
        {/* Gold gradient for the hex nut head */}
        <LinearGradient id="goldNut" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFE57F" />
          <Stop offset="40%" stopColor="#FFD54F" />
          <Stop offset="80%" stopColor="#FFB300" />
          <Stop offset="100%" stopColor="#FF6F00" />
        </LinearGradient>
        
        {/* Deep gold for nut inner depth */}
        <LinearGradient id="darkGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFB300" />
          <Stop offset="100%" stopColor="#FF8F00" />
        </LinearGradient>

        {/* Liquid metal silver gradient for the body */}
        <LinearGradient id="liquidSilver" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="30%" stopColor="#E2E8F0" />
          <Stop offset="70%" stopColor="#CBD5E1" />
          <Stop offset="100%" stopColor="#94A3B8" />
        </LinearGradient>

        {/* Soft Pink Blush Radial Gradient */}
        <RadialGradient id="blush" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor="#FF8A8A" stopOpacity={0.6} />
          <Stop offset="100%" stopColor="#FF8A8A" stopOpacity={0} />
        </RadialGradient>

        {/* Rope texture gradient */}
        <LinearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#8D6E63" />
          <Stop offset="30%" stopColor="#D7CCC8" />
          <Stop offset="70%" stopColor="#A1887F" />
          <Stop offset="100%" stopColor="#5D4037" />
        </LinearGradient>

        {/* Shadow drop filter */}
        <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <FeDropShadow dx="2" dy="6" stdDeviation="5" floodOpacity={0.15} />
        </Filter>
      </Defs>

      {/* Background Rope */}
      <G id="rope">
        <Rect x="235" y="0" width="30" height="500" fill="url(#ropeGrad)" />
        <Path 
          d="M235,20 Q250,5 265,20 M235,60 Q250,45 265,60 M235,100 Q250,85 265,100 M235,140 Q250,125 265,140 M235,180 Q250,165 265,180 M235,220 Q250,205 265,220 M235,260 Q250,245 265,260 M235,300 Q250,285 265,300 M235,340 Q250,325 265,340 M235,380 Q250,365 265,380 M235,420 Q250,405 265,420 M235,460 Q250,445 265,460" 
          stroke="#4E342E" 
          strokeWidth={3} 
          fill="none" 
          opacity={0.3}
        />
      </G>

      {/* Tail (Red Electrical Wire) - Peeking from behind lower body */}
      <Path 
        d="M 220 370 Q 155 385 135 340 Q 115 295 150 280" 
        fill="none" 
        stroke="#E11D48" 
        strokeWidth={14} 
        strokeLinecap="round" 
      />
      <Circle cx="150" cy="280" r="7" fill="#2563EB" />

      {/* MELTAN BODY (Chubbier hugging pose) */}
      {/* Left arm wrapping forward over the rope */}
      <Path 
        d="M 210 240 C 160 235, 150 360, 225 360 C 275 360, 270 305, 245 300" 
        fill="url(#liquidSilver)" 
        stroke="#CBD5E1" 
        strokeWidth={3} 
        filter="url(#shadow)"
      />

      {/* Right arm wrapping around the back / side */}
      <Path 
        d="M 250 230 C 320 235, 310 340, 255 350 C 235 352, 225 305, 245 300" 
        fill="url(#liquidSilver)" 
        stroke="#CBD5E1" 
        strokeWidth={3} 
      />

      {/* Main Central Body Liquid Mass overlapping the rope center */}
      <Path 
        d="M 195 230 Q 250 210 285 240 Q 295 310 250 355 Q 195 345 195 280 Z" 
        fill="url(#liquidSilver)" 
        stroke="#CBD5E1" 
        strokeWidth={2.5} 
      />

      {/* Body Highlights (Soft fluid metallic sheen) */}
      <Ellipse cx="212" cy="255" rx="12" ry="6" transform="rotate(-25 212 255)" fill="#FFFFFF" opacity={0.75}/>
      <Ellipse cx="272" cy="275" rx="9" ry="4.5" transform="rotate(35 272 275)" fill="#FFFFFF" opacity={0.6}/>
      <Path d="M 205 325 A 35 35 0 0 0 245 350" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.5} />

      {/* Head (Hexagonal Nut) - Cute tilted layout */}
      <G transform="translate(242, 165) rotate(-18)">
        {/* Outer Hexagon Head */}
        <Polygon points="0,-75 65,-38 65,38 0,75 -65,38 -65,-38" fill="url(#goldNut)" stroke="#FF8F00" strokeWidth={5} strokeLinejoin="round" filter="url(#shadow)" />
        
        {/* Inner Nut Hole */}
        <Circle cx="0" cy="0" r="42" fill="url(#darkGold)" stroke="#FF6F00" strokeWidth={3} />
        <Circle cx="0" cy="0" r="35" fill="#1E293B" />

        {/* Blush indicators beneath the eye zone */}
        <Circle cx="-20" cy="22" r="14" fill="url(#blush)" />
        <Circle cx="20" cy="22" r="14" fill="url(#blush)" />

        {/* Floating Big Anime Eye */}
        <Circle cx="0" cy="6" r="20" fill="#0F172A" />
        {/* Main large glint */}
        <Circle cx="-6" cy="0" r="6.5" fill="#FFFFFF" />
        {/* Extra cute secondary baby twinkle */}
        <Circle cx="5" cy="12" r="2.5" fill="#FFFFFF" />
      </G>
    </Svg>
  );
}
