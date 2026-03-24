interface WrenchDiagramProps {
  leverLengthCm: number | null
  mass: number | null
  torque: number | null
}

function clampLerp(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const t = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)))
  return outMin + t * (outMax - outMin)
}

const BOLT_X = 60
const BOLT_Y = 75
const ARC_RADIUS = 38

const transition = 'all 0.4s ease'

export default function WrenchDiagram({ leverLengthCm, mass, torque }: WrenchDiagramProps) {
  const handleLen = leverLengthCm != null
    ? clampLerp(leverLengthCm, 5, 50, 80, 280)
    : 160

  const weightW = mass != null
    ? clampLerp(mass, 0.5, 100, 18, 50)
    : 18

  const weightH = mass != null
    ? clampLerp(mass, 0.5, 100, 16, 40)
    : 16

  const sweepDeg = torque != null
    ? clampLerp(torque, 1, 500, 40, 280)
    : 0

  const handleEndX = BOLT_X + handleLen
  const cableLen = 28
  const weightTopY = BOLT_Y + cableLen
  const dimY = BOLT_Y + 18

  // Hex nut points
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${BOLT_X + 12 * Math.cos(angle)},${BOLT_Y + 12 * Math.sin(angle)}`
  }).join(' ')

  // Torque arc (using stroke-dasharray on a circle)
  const circumference = 2 * Math.PI * ARC_RADIUS
  const arcLen = (sweepDeg / 360) * circumference
  const dashArray = `${arcLen} ${circumference - arcLen}`
  // Start from top-right (rotate -90 so 0° is at top)
  const dashOffset = circumference * 0.25

  // Arrowhead position
  const arcEndAngleRad = ((sweepDeg - 90) * Math.PI) / 180
  const arrowX = BOLT_X + ARC_RADIUS * Math.cos(arcEndAngleRad)
  const arrowY = BOLT_Y + ARC_RADIUS * Math.sin(arcEndAngleRad)
  const arrowRotation = sweepDeg - 90 + 90 // tangent direction

  // Open-end wrench head using arcs
  const outerR = 22
  const innerR = 15
  const jawAngle = 30 * Math.PI / 180
  const cosA = Math.cos(jawAngle)
  const sinA = Math.sin(jawAngle)

  const topOutX = BOLT_X - outerR * cosA
  const topOutY = BOLT_Y - outerR * sinA
  const topInX = BOLT_X - innerR * cosA
  const topInY = BOLT_Y - innerR * sinA
  const botOutX = BOLT_X - outerR * cosA
  const botOutY = BOLT_Y + outerR * sinA
  const botInX = BOLT_X - innerR * cosA
  const botInY = BOLT_Y + innerR * sinA

  const jawPath = `
    M ${topOutX} ${topOutY}
    A ${outerR} ${outerR} 0 1 1 ${botOutX} ${botOutY}
    L ${botInX} ${botInY}
    A ${innerR} ${innerR} 0 1 0 ${topInX} ${topInY}
    Z
  `
  const headConnectX = BOLT_X + outerR - 4

  const massOpacity = mass != null ? 1 : 0.25
  const torqueOpacity = torque != null ? 1 : 0

  return (
    <div className="wrench-diagram">
      <svg viewBox="0 15 400 150" width="100%">
        {/* Torque arc */}
        <circle
          cx={BOLT_X}
          cy={BOLT_Y}
          r={ARC_RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.5}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          opacity={torqueOpacity}
          style={{ transition }}
        />
        {/* Arrowhead */}
        {sweepDeg > 0 && (
          <polygon
            points="-5,-4 5,-4 0,5"
            fill="var(--accent)"
            opacity={torqueOpacity}
            transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowRotation})`}
            style={{ transition }}
          />
        )}
        {/* Torque label */}
        {torque != null && (
          <text
            x={BOLT_X}
            y={BOLT_Y - ARC_RADIUS - 10}
            textAnchor="middle"
            fill="var(--accent)"
            fontSize={13}
            fontWeight={600}
            style={{ transition }}
          >
            {torque.toFixed(1)} N·m
          </text>
        )}

        {/* Wrench handle */}
        <rect
          x={headConnectX}
          y={BOLT_Y - 4.5}
          width={Math.max(0, handleEndX - headConnectX)}
          height={9}
          rx={2}
          fill="var(--text)"
          opacity={0.5}
          style={{ transition }}
        />
        {/* Handle grip lines */}
        <line
          x1={handleEndX - 14}
          y1={BOLT_Y - 3}
          x2={handleEndX - 14}
          y2={BOLT_Y + 3}
          stroke="var(--bg)"
          strokeWidth={1}
          opacity={0.5}
          style={{ transition }}
        />
        <line
          x1={handleEndX - 10}
          y1={BOLT_Y - 3}
          x2={handleEndX - 10}
          y2={BOLT_Y + 3}
          stroke="var(--bg)"
          strokeWidth={1}
          opacity={0.5}
          style={{ transition }}
        />
        <line
          x1={handleEndX - 6}
          y1={BOLT_Y - 3}
          x2={handleEndX - 6}
          y2={BOLT_Y + 3}
          stroke="var(--bg)"
          strokeWidth={1}
          opacity={0.5}
          style={{ transition }}
        />

        {/* Wrench jaw */}
        <path
          d={jawPath}
          fill="var(--text)"
          opacity={0.55}
        />

        {/* Hex nut */}
        <polygon
          points={hexPoints}
          fill="var(--code-bg)"
          stroke="var(--text)"
          strokeWidth={1.5}
        />
        {/* Bolt center */}
        <circle cx={BOLT_X} cy={BOLT_Y} r={3} fill="var(--text-h)" />

        {/* Dimension line (lever length) */}
        <g opacity={0.8}>
          {/* Line */}
          <line
            x1={BOLT_X}
            y1={dimY}
            x2={handleEndX}
            y2={dimY}
            stroke="var(--accent)"
            strokeWidth={1}
            strokeDasharray="4 3"
            style={{ transition }}
          />
          {/* Left tick */}
          <line
            x1={BOLT_X}
            y1={dimY - 4}
            x2={BOLT_X}
            y2={dimY + 4}
            stroke="var(--accent)"
            strokeWidth={1}
          />
          {/* Right tick */}
          <line
            x1={handleEndX}
            y1={dimY - 4}
            x2={handleEndX}
            y2={dimY + 4}
            stroke="var(--accent)"
            strokeWidth={1}
            style={{ transition }}
          />
          {/* Label */}
          <text
            x={(BOLT_X + handleEndX) / 2}
            y={dimY + 16}
            textAnchor="middle"
            fill="var(--accent)"
            fontSize={12}
            fontWeight={500}
            style={{ transition }}
          >
            {leverLengthCm != null ? `${leverLengthCm} cm` : '-- cm'}
          </text>
        </g>

        {/* Weight cable */}
        <line
          x1={handleEndX}
          y1={BOLT_Y}
          x2={handleEndX}
          y2={weightTopY}
          stroke="var(--text)"
          strokeWidth={1.5}
          opacity={massOpacity}
          style={{ transition }}
        />

        {/* Weight block */}
        <rect
          x={handleEndX - weightW / 2}
          y={weightTopY}
          width={weightW}
          height={weightH}
          rx={3}
          fill="var(--accent-bg)"
          stroke="var(--accent)"
          strokeWidth={1.5}
          opacity={massOpacity}
          style={{ transition }}
        />

        {/* Mass label */}
        <text
          x={handleEndX}
          y={weightTopY + weightH + 15}
          textAnchor="middle"
          fill="var(--text-h)"
          fontSize={12}
          fontWeight={500}
          opacity={massOpacity}
          style={{ transition }}
        >
          {mass != null ? `${mass.toFixed(1)} kg` : '-- kg'}
        </text>

        {/* Gravity arrow */}
        <line
          x1={handleEndX + weightW / 2 + 10}
          y1={weightTopY + 4}
          x2={handleEndX + weightW / 2 + 10}
          y2={weightTopY + weightH - 2}
          stroke="var(--text)"
          strokeWidth={1}
          opacity={massOpacity * 0.6}
          style={{ transition }}
        />
        <polygon
          points={`${handleEndX + weightW / 2 + 7},${weightTopY + weightH - 2} ${handleEndX + weightW / 2 + 13},${weightTopY + weightH - 2} ${handleEndX + weightW / 2 + 10},${weightTopY + weightH + 4}`}
          fill="var(--text)"
          opacity={massOpacity * 0.6}
          style={{ transition }}
        />
        <text
          x={handleEndX + weightW / 2 + 20}
          y={weightTopY + weightH / 2 + 4}
          fill="var(--text)"
          fontSize={11}
          opacity={massOpacity * 0.6}
          style={{ transition }}
        >
          g
        </text>
      </svg>
    </div>
  )
}
