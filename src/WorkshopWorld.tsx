import { memo, useId, type ReactNode } from 'react';

// A single connected isometric set. Every camera position uses this same geometry.
export const project = (x: number, y: number, z = 0): [number, number] => [660 + x - y, 55 + (x + y) * .5 - z];
const points = (...vertices: number[][]) => vertices.map(([x, y, z = 0]) => project(x, y, z).join(',')).join(' ');

function Plane({ vertices, fill, stroke = 'none', opacity = 1 }: { vertices: number[][]; fill: string; stroke?: string; opacity?: number }) {
  return <polygon points={points(...vertices)} fill={fill} stroke={stroke} strokeWidth="1" opacity={opacity} />;
}

function Box({ x, y, w, d, h, z = 0, color = '#eaf2f2', side = '#9eb4bc', front = '#c8d6d9', children }: { x: number; y: number; w: number; d: number; h: number; z?: number; color?: string; side?: string; front?: string; children?: ReactNode }) {
  return <g>
    <Plane vertices={[[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]} fill={front} />
    <Plane vertices={[[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]} fill={side} />
    <Plane vertices={[[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]} fill={color} />
    {children}
  </g>;
}

function Line({ from, to, color = '#245675', width = 2 }: { from: number[]; to: number[]; color?: string; width?: number }) {
  const [x1, y1] = project(from[0], from[1], from[2]);
  const [x2, y2] = project(to[0], to[1], to[2]);
  return <line {...{ x1, y1, x2, y2 }} stroke={color} strokeWidth={width} strokeLinecap="round" />;
}

function Person({ x, y, color = '#08b7c8', helmet = true }: { x: number; y: number; color?: string; helmet?: boolean }) {
  const [px, py] = project(x, y, 12);
  return <g transform={`translate(${px} ${py})`}>
    <ellipse cy="1" rx="12" ry="5" fill="#143854" opacity=".16" />
    <path d="m-5-18-2 19m10-19 3 17" stroke="#18384e" strokeWidth="5" strokeLinecap="round" />
    <path d="M-8-35Q0-40 8-35L6-15H-6Z" fill={color} />
    <path className="world-worker-arms" d="m-8-32-5 15m21-15 6 11" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    <circle cy="-44" r="7" fill="#d6a383" />
    {helmet ? <path d="M-9-44Q-9-56 0-55T9-44Z" fill="#f4cb70" /> : <path d="M-7-45Q-7-54 0-53T7-46L3-47Z" fill="#163b51" />}
  </g>;
}

function Plant({ x, y }: { x: number; y: number }) {
  const [px, py] = project(x, y, 10);
  return <g transform={`translate(${px} ${py})`}>
    <ellipse rx="17" ry="7" cy="6" fill="#1a5865" opacity=".12" />
    <path d="M-10-7H10L7 8H-7Z" fill="#d8e4df" />
    <path d="M0-6V-35" stroke="#4e887c" strokeWidth="3" />
    <ellipse cx="-7" cy="-29" rx="8" ry="15" transform="rotate(-28 -7 -29)" fill="#83ab96" />
    <ellipse cx="7" cy="-23" rx="7" ry="14" transform="rotate(30 7 -23)" fill="#548b7c" />
    <ellipse cy="-38" rx="6" ry="12" fill="#9cbd9b" />
  </g>;
}

function Desk({ x, y, screen = true }: { x: number; y: number; screen?: boolean }) {
  return <g>
    {[[0, 0], [56, 0], [0, 28], [56, 28]].map(([dx, dy]) => <Box key={`${dx}-${dy}`} x={x + dx} y={y + dy} w={4} d={4} h={32} color="#899aa1" />)}
    <Box x={x - 3} y={y - 3} w={68} d={42} h={5} z={32} color="#e4d5b7" front="#b7ac94" side="#b8aa90" />
    {screen && <><Box x={x + 14} y={y + 2} w={29} d={3} h={23} z={37} color="#547b89" front="#163d56" side="#0c2a42" /><Plane vertices={[[x + 17, y + 5, 41], [x + 40, y + 5, 41], [x + 40, y + 5, 57], [x + 17, y + 5, 57]]} fill="#49c9d7" /><Box x={x + 18} y={y + 18} w={24} d={10} h={1} z={37} color="#e8f2f1" /></>}
  </g>;
}

function Glass({ x, y, w = 54, h = 87, z = 12, front = false }: { x: number; y: number; w?: number; h?: number; z?: number; front?: boolean }) {
  const end = front ? [x + w, y] : [x, y + w];
  return <g>
    <Plane vertices={[[x, y, z], [...end, z], [...end, h + z], [x, y, h + z]]} fill="#89d7dd" stroke="#426a7b" opacity={.58} />
    <Line from={[x, y, z]} to={[x, y, h + z]} width={3} />
    <Line from={[...end, z]} to={[...end, h + z]} width={3} />
    <Line from={[x, y, h + z]} to={[...end, h + z]} width={3} />
    <Line from={[x, y, z]} to={[...end, z]} width={3} />
    <Line from={[x, y, z + h * .45]} to={[...end, z + h * .45]} color="#dbf6f4" width={1} />
    <Line from={front ? [x + w * .2, y, z + 10] : [x, y + w * .2, z + 10]} to={front ? [x + w * .8, y, z + h - 10] : [x, y + w * .8, z + h - 10]} color="#e1faf5" width={3} />
  </g>;
}

function Station({ x, y, w, d, stage, children }: { x: number; y: number; w: number; d: number; stage: number; children: ReactNode }) {
  return <g className="world-station" data-world-station={stage}>
    <Plane vertices={[[x - 10, y, -2], [x + w + 22, y, -2], [x + w + 22, y + d + 24, -2], [x - 10, y + d + 24, -2]]} fill="#143e58" opacity={.08} />
    <Box {...{ x, y, w, d }} h={12} color="#f1f5ee" front="#b9cdcd" side="#98b5c0" />
    {children}
  </g>;
}

function WorldArtwork({ className = '' }: { className?: string }) {
  const id = useId().replaceAll(':', '');
  return <svg className={`workshop-world ${className}`} viewBox="-80 -80 1380 920" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-base`} x1="500" y1="80" x2="500" y2="790" gradientUnits="userSpaceOnUse"><stop stopColor="#e0ece9" /><stop offset="1" stopColor="#bed6d4" /></linearGradient>
      <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%"><feGaussianBlur stdDeviation="22" /></filter>
    </defs>
    <ellipse cx="615" cy="671" rx="484" ry="100" fill="#163f56" opacity=".14" filter={`url(#${id}-shadow)`} />
    <Box x={-15} y={-15} w={615} d={700} h={18} z={-23} color={`url(#${id}-base)`} front="#9ebbbc" side="#82a6ad" />
    {Array.from({ length: 13 }, (_, i) => <g key={i} opacity=".32"><Line from={[i * 48, 0, -4]} to={[i * 48, 680, -4]} color="#a4bfbd" width={.7} /><Line from={[0, i * 54, -4]} to={[590, i * 54, -4]} color="#a4bfbd" width={.7} /></g>)}
    <polyline points={points([155, 390], [265, 390], [265, 110], [295, 110], [295, 265], [470, 265], [470, 500], [265, 500], [265, 605], [180, 605])} stroke="#9cbcc1" strokeWidth="31" strokeLinejoin="round" />
    <polyline points={points([155, 390], [265, 390], [265, 110], [295, 110], [295, 265], [470, 265], [470, 500], [265, 500], [265, 605], [180, 605])} stroke="#eff7f2" strokeWidth="25" strokeLinejoin="round" />
    <polyline className="world-route" points={points([155, 390], [265, 390], [265, 110], [295, 110], [295, 265], [470, 265], [470, 500], [265, 500], [265, 605], [180, 605])} stroke="#0dabbc" strokeWidth="3" strokeLinejoin="round" strokeDasharray="6 9" />
    <g className="world-order-packet" opacity="0"><circle r="12" fill="#05acb9" opacity=".15" /><circle r="5" fill="#05acb9" stroke="#fff" strokeWidth="2" /></g>

    {/* 02 / On-site survey: a cutaway room and framed glazing. */}
    <Station x={30} y={25} w={200} d={172} stage={1}>
      <Box x={30} y={25} w={200} d={8} h={105} z={12} color="#f6f6ed" side="#91a9b0" front="#d8e3dd" />
      <Box x={30} y={25} w={7} d={172} h={105} z={12} color="#f6f6ed" side="#ceddd7" front="#a5bcb9" />
      <Glass x={78} y={35} w={104} h={78} z={24} front />
      <Box x={53} y={80} w={55} d={55} h={18} z={12} color="#d0ded8" side="#9eb4ae" front="#b3c8bd" />
      <Box x={53} y={77} w={55} d={9} h={36} z={12} color="#b3cbc3" front="#b3cbc3" />
      <Person x={164} y={105} />
      <Line from={[195, 38, 16]} to={[195, 143, 16]} color="#09aabd" width={2} />
      {[40, 140].map(y => <Line key={y} from={[190, y, 16]} to={[200, y, 16]} color="#09aabd" />)}
      <Plant x={63} y={165} />
    </Station>

    {/* 03 / Workshop: structural beams, aluminium racks and workbench. */}
    <Station x={320} y={30} w={234} d={192} stage={2}>
      <Box x={320} y={30} w={234} d={7} h={122} z={12} color="#f1f4ec" front="#cfddd7" side="#92a9a9" />
      <Box x={320} y={30} w={7} d={192} h={122} z={12} color="#f1f4ec" side="#c0d2cb" />
      {[340, 535].map(x => <Box key={x} x={x} y={194} w={5} d={5} h={122} z={12} color="#537d89" front="#477381" side="#33546a" />)}
      {[42, 112, 195].map(y => <Box key={y} x={320} y={y} w={234} d={4} h={6} z={134} color="#b6c9c7" front="#839e9f" side="#6c8d95" />)}
      {[0, 1, 2, 3].map(n => <Glass key={n} x={344 + n * 9} y={49} w={66} h={73} />)}
      <Desk x={440} y={115} screen={false} />
      <Box x={444} y={119} w={48} d={3} h={2} z={50} color="#3f8c9e" />
      <Box x={462} y={125} w={20} d={4} h={2} z={50} color="#0db5c3" />
      <Person x={456} y={177} color="#f5c768" />
      <Box x={507} y={57} w={28} d={46} h={36} z={12} color="#729eaa" side="#365c70" front="#547d8c" />
      <Box x={510} y={62} w={20} d={20} h={7} z={48} color="#234c65" />
      <Person x={568} y={240} />
    </Station>

    {/* 01 / Customer desk: the beginning of every connected order. */}
    <Station x={30} y={278} w={198} d={180} stage={0}>
      <Box x={30} y={278} w={198} d={7} h={97} z={12} color="#f6f6ed" front="#d8e3dd" side="#91a9b0" />
      <Box x={30} y={278} w={7} d={180} h={97} z={12} color="#f6f6ed" side="#c9dcd7" />
      <Plane vertices={[[62, 286, 59], [128, 286, 59], [128, 286, 94], [62, 286, 94]]} fill="#185570" />
      <Line from={[72, 286, 84]} to={[114, 286, 84]} color="#5ed0d5" width={3} />
      <Line from={[72, 286, 73]} to={[101, 286, 73]} color="#e0eeed" width={2} />
      <Desk x={96} y={325} />
      <Person x={137} y={314} color="#183f5a" helmet={false} />
      <Person x={141} y={395} color="#12adbe" helmet={false} />
      <Box x={53} y={394} w={43} d={36} h={24} z={12} color="#a1c6c4" front="#6a9e9f" side="#557f8d" />
      <Box x={53} y={390} w={43} d={7} h={45} z={12} color="#a1c6c4" front="#8ab8b6" />
      <Plant x={193} y={307} />
      <Plant x={49} y={448} />
    </Station>

    {/* 04 / Installation: finished frames arrive at the customer's home. */}
    <Station x={330} y={333} w={226} d={150} stage={3}>
      <Box x={330} y={333} w={226} d={8} h={122} z={12} color="#f8f5e8" front="#e1ded1" side="#b7b8aa" />
      <Box x={330} y={333} w={8} d={150} h={122} z={12} color="#f8f5e8" side="#d5d9cc" />
      <Glass x={370} y={343} w={68} h={94} z={18} front />
      <Glass x={438} y={343} w={68} h={94} z={18} front />
      <Glass x={340} y={358} w={80} h={94} z={18} />
      <Person x={455} y={399} />
      <Box x={489} y={429} w={35} d={24} h={18} z={12} color="#eacd8b" front="#bda26b" side="#9d885e" />
      <Line from={[502, 439, 30]} to={[513, 439, 30]} color="#405d68" width={3} />
      <Plant x={544} y={465} />
    </Station>

    {/* 05 / Payment: the final handoff, still part of the same order. */}
    <Station x={40} y={535} w={190} d={120} stage={4}>
      <Box x={40} y={535} w={190} d={7} h={87} z={12} color="#f3f5eb" front="#cfddd5" side="#9badab" />
      <Desk x={99} y={567} />
      <Person x={133} y={551} color="#183f5a" helmet={false} />
      <Box x={179} y={550} w={31} d={36} h={41} z={12} color="#d2e1d9" front="#b0c5bb" side="#97b1aa" />
      {[0, 1, 2].map(n => <Line key={n} from={[185, 586, 23 + n * 12]} to={[203, 586, 23 + n * 12]} color="#789d98" />)}
      <Plant x={65} y={630} />
    </Station>

    {/* A small delivery van on the shared route. */}
    <g className="world-delivery-van">
      <Box x={340} y={535} w={92} d={43} h={39} z={10} color="#eaf2ec" front="#c7dcda" side="#b0c8ca" />
      <Box x={407} y={535} w={25} d={43} h={25} z={49} color="#f6f7ee" front="#d4e2da" side="#aac6c7" />
      <Plane vertices={[[409, 578, 52], [428, 578, 52], [428, 578, 69], [409, 578, 69]]} fill="#3c8096" />
      <Plane vertices={[[352, 578, 26], [390, 578, 26], [390, 578, 38], [352, 578, 38]]} fill="#12adbc" />
      {[355, 416].map(x => { const [px, py] = project(x, 579, 10); return <g key={x}><ellipse cx={px} cy={py} rx="8" ry="11" fill="#214258" /><ellipse cx={px} cy={py} rx="3.5" ry="5" fill="#a6bcbd" /></g>; })}
    </g>
    {[[568, 40], [580, 113], [286, 640], [540, 640], [15, 230]].map(([x, y]) => <Plant key={`${x}-${y}`} x={x} y={y} />)}
    <Person x={284} y={443} color="#183f5a" helmet={false} />
  </svg>;
}

export default memo(WorldArtwork);
