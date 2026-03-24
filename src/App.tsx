import { useState } from 'react'
import WrenchDiagram from './WrenchDiagram'
import './App.css'

const GRAVITY = 9.80665

type Tab = 'torque' | 'mass'
type LengthUnit = 'cm' | 'm'

function App() {
  const [tab, setTab] = useState<Tab>('mass')
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('cm')

  const [mass, setMass] = useState('')
  const [lengthA, setLengthA] = useState('')

  const [targetTorque, setTargetTorque] = useState('')
  const [lengthB, setLengthB] = useState('')

  // Convert input to meters for calculation
  const toMeters = (val: number) => lengthUnit === 'cm' ? val / 100 : val
  // Convert input to cm for diagram scaling
  const toCm = (val: number) => lengthUnit === 'm' ? val * 100 : val

  const massNum = parseFloat(mass)
  const lengthANum = parseFloat(lengthA)
  const torqueValid = !isNaN(massNum) && !isNaN(lengthANum) && massNum > 0 && lengthANum > 0
  const torqueResult = torqueValid ? massNum * GRAVITY * toMeters(lengthANum) : null

  const targetTorqueNum = parseFloat(targetTorque)
  const lengthBNum = parseFloat(lengthB)
  const massValid = !isNaN(targetTorqueNum) && !isNaN(lengthBNum) && targetTorqueNum > 0 && lengthBNum > 0
  const massResult = massValid ? targetTorqueNum / (GRAVITY * toMeters(lengthBNum)) : null

  const placeholder = lengthUnit === 'cm' ? 'e.g. 25' : 'e.g. 0.25'

  const unitToggle = (
    <span className="unit-toggle-label">
      Lever length{' '}
      <span className="unit-toggle">
        <button
          className={lengthUnit === 'cm' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); setLengthUnit('cm') }}
        >cm</button>
        <button
          className={lengthUnit === 'm' ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); setLengthUnit('m') }}
        >m</button>
      </span>
    </span>
  )

  return (
    <div className="calculator">
      <h1>Torque Calculator</h1>

      <div className="tabs">
        <button
          className={`tab ${tab === 'mass' ? 'active' : ''}`}
          onClick={() => setTab('mass')}
        >
          Find Mass
        </button>
        <button
          className={`tab ${tab === 'torque' ? 'active' : ''}`}
          onClick={() => setTab('torque')}
        >
          Find Torque
        </button>
      </div>

      {tab === 'torque' && (
        <>
          <p className="subtitle">
            Calculate torque from lever length and applied mass
          </p>
          <div className="formula">
            <code>T = m &times; g &times; L</code>
          </div>
          <div className="inputs">
            <label>
              <span>Mass (kg)</span>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 10"
                value={mass}
                onChange={(e) => setMass(e.target.value)}
              />
            </label>
            <label>
              {unitToggle}
              <input
                type="number"
                min="0"
                step="any"
                placeholder={placeholder}
                value={lengthA}
                onChange={(e) => setLengthA(e.target.value)}
              />
            </label>
          </div>
          <WrenchDiagram
            leverLengthCm={!isNaN(lengthANum) && lengthANum > 0 ? toCm(lengthANum) : null}
            mass={!isNaN(massNum) && massNum > 0 ? massNum : null}
            torque={torqueResult}
          />
          {torqueResult !== null && (
            <div className="result">
              <span className="result-label">Torque</span>
              <span className="result-value">{torqueResult.toFixed(2)}</span>
              <span className="result-unit">N&middot;m</span>
            </div>
          )}
        </>
      )}

      {tab === 'mass' && (
        <>
          <p className="subtitle">
            Find the required mass to achieve a target torque
          </p>
          <div className="formula">
            <code>m = T &divide; (g &times; L)</code>
          </div>
          <div className="inputs">
            <label>
              <span>Target torque (N&middot;m)</span>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 50"
                value={targetTorque}
                onChange={(e) => setTargetTorque(e.target.value)}
              />
            </label>
            <label>
              {unitToggle}
              <input
                type="number"
                min="0"
                step="any"
                placeholder={placeholder}
                value={lengthB}
                onChange={(e) => setLengthB(e.target.value)}
              />
            </label>
          </div>
          <WrenchDiagram
            leverLengthCm={!isNaN(lengthBNum) && lengthBNum > 0 ? toCm(lengthBNum) : null}
            mass={massResult}
            torque={!isNaN(targetTorqueNum) && targetTorqueNum > 0 ? targetTorqueNum : null}
          />
          {massResult !== null && (
            <div className="result">
              <span className="result-label">Required mass</span>
              <span className="result-value">{massResult.toFixed(2)}</span>
              <span className="result-unit">kg</span>
            </div>
          )}
        </>
      )}

      <div className="legend">
        <p><strong>T</strong> &mdash; torque (N&middot;m)</p>
        <p><strong>m</strong> &mdash; mass (kg)</p>
        <p><strong>g</strong> &mdash; gravitational acceleration (9.80665 m/s&sup2;)</p>
        <p><strong>L</strong> &mdash; lever length</p>
      </div>
    </div>
  )
}

export default App
