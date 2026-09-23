import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';

// A cute chibi dog with a flame tail and a little flame tuft on its head —
// the "fire type" party pet.
const FlameCreature = (props) => (
  <Svg
    width={props.width || 200}
    height={props.height || 200}
    viewBox="80 45 370 430"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Defs>
      <LinearGradient id="flameGradient" x1="330" y1="420" x2="410" y2="260" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#FF7A00" />
        <Stop offset="1" stopColor="#FFD54A" />
      </LinearGradient>
      <LinearGradient id="tuftGradient" x1="256" y1="130" x2="256" y2="60" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#FF7A00" />
        <Stop offset="1" stopColor="#FFD54A" />
      </LinearGradient>
    </Defs>

    {/* Tail — a little flame curling up from behind the body */}
    <Path
      d="M338 400c24-6 46-24 58-50 12-26 8-54-8-74 6 34-12 58-30 74-14 12-18 30-20 50z"
      fill="url(#flameGradient)"
    />

    {/* Back paws peeking out */}
    <Ellipse cx="196" cy="428" rx="26" ry="16" fill="#FFE0B2" />
    <Ellipse cx="300" cy="432" rx="26" ry="16" fill="#FFE0B2" />

    {/* Body */}
    <Ellipse cx="248" cy="340" rx="112" ry="92" fill="#FF9142" />
    {/* Belly patch */}
    <Ellipse cx="248" cy="366" rx="66" ry="52" fill="#FFE9C7" />

    {/* Ears (floppy, behind the head) */}
    <Path
      d="M170 165c-30-10-56 4-64 30-8 26 4 56 30 70 14 8 26-2 26-18 0-30 4-58 8-82z"
      fill="#E8721E"
    />
    <Path
      d="M334 165c30-10 56 4 64 30 8 26-4 56-30 70-14 8-26-2-26-18 0-30-4-58-8-82z"
      fill="#E8721E"
    />

    {/* Head */}
    <Circle cx="252" cy="206" r="98" fill="#FF9142" />

    {/* Flame tuft on top of the head */}
    <Path
      d="M252 130c10-16 8-36-4-52 4 22-8 34-16 44-6 8-6 20 2 28 6-8 14-14 18-20z"
      fill="url(#tuftGradient)"
    />

    {/* Muzzle */}
    <Ellipse cx="252" cy="232" rx="58" ry="42" fill="#FFE9C7" />

    {/* Blush */}
    <Circle cx="186" cy="226" r="11" fill="#FF9B95" opacity="0.55" />
    <Circle cx="318" cy="226" r="11" fill="#FF9B95" opacity="0.55" />

    {/* Eyes */}
    <Circle cx="218" cy="200" r="15" fill="#2A2A2A" />
    <Circle cx="286" cy="200" r="15" fill="#2A2A2A" />
    <Circle cx="222" cy="195" r="4.5" fill="#FFFFFF" />
    <Circle cx="290" cy="195" r="4.5" fill="#FFFFFF" />

    {/* Nose */}
    <Ellipse cx="252" cy="240" rx="10" ry="7" fill="#2A2A2A" />

    {/* Mouth */}
    <Path
      d="M252 247v8M228 268c8 10 18 14 24 14s16-4 24-14"
      stroke="#2A2A2A"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Tongue */}
    <Path d="M244 272c0 8 6 14 8 14s8-6 8-14z" fill="#FF8FA3" />
  </Svg>
);

export default FlameCreature;
