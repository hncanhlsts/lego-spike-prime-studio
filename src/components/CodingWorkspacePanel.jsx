import React, { useState, useEffect } from 'react';
import {
  Blocks,
  Code2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Play,
  Square,
  Copy,
  Check,
  Terminal,
  HelpCircle,
  BookOpen,
  RotateCw,
  RotateCcw
} from 'lucide-react';
import {
  SPIKE_CATEGORIES,
  BLOCK_DEFINITIONS,
  BLOCK_SHAPE_GUIDE,
  REPORTER_AND_BOOLEAN_BLOCKS,
  generateSpikePythonCode
} from '../data/spikeData';

const PORT_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Component hiển thị biểu tượng ma trận 5x5 thu nhỏ giống hệt trên khối lệnh Light của SPIKE App
function MiniMatrixIcon({ pattern = 'SMILE' }) {
  const dots =
    pattern === 'HEART'
      ? [0,1,0,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,1,1,1,0, 0,0,1,0,0]
      : pattern === 'YES'
      ? [0,0,0,0,1, 0,0,0,1,0, 1,0,1,0,0, 0,1,0,0,0, 0,0,0,0,0]
      : pattern === 'ARROW_UP'
      ? [0,0,1,0,0, 0,1,1,1,0, 1,0,1,0,1, 0,0,1,0,0, 0,0,1,0,0]
      : [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0];

  return (
    <span className="inline-grid grid-cols-5 gap-[1.5px] bg-[#451d99] p-1 rounded border border-white/25 align-middle">
      {dots.map((on, idx) => (
        <span
          key={idx}
          className={`w-1.5 h-1.5 rounded-[1px] ${on ? 'bg-white' : 'bg-purple-900/70'}`}
        />
      ))}
    </span>
  );
}

export default function CodingWorkspacePanel({
  blocks,
  setBlocks,
  ports,
  activeBlockId,
  isRunning,
  onRunProgram,
  onStopProgram,
  logs,
  telemetry
}) {
  const [codingTab, setCodingTab] = useState('both'); // 'blocks' | 'both' | 'python'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showShapeGuideModal, setShowShapeGuideModal] = useState(false);
  const [hoveredBlockDesc, setHoveredBlockDesc] = useState(null);
  const [pythonCode, setPythonCode] = useState('');
  const [customPythonEdited, setCustomPythonEdited] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!customPythonEdited) {
      setPythonCode(generateSpikePythonCode(blocks));
    }
  }, [blocks, ports, customPythonEdited]);

  const addBlock = (typeKey) => {
    const def = BLOCK_DEFINITIONS[typeKey];
    if (!def) return;
    const newBlock = {
      id: `blk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: typeKey,
      params: { ...def.defaultParams }
    };
    setCustomPythonEdited(false);
    // Nếu là Hat block thì đặt ở đầu chồng lệnh
    if (def.shape === 'hat') {
      setBlocks((prev) => [newBlock, ...prev.filter((b) => BLOCK_DEFINITIONS[b.type]?.shape !== 'hat')]);
    } else {
      setBlocks((prev) => [...prev, newBlock]);
    }
  };

  const updateParam = (id, key, val) => {
    setCustomPythonEdited(false);
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, params: { ...b.params, [key]: val } } : b))
    );
  };

  const removeBlock = (id) => {
    setCustomPythonEdited(false);
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (idx, dir) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    setCustomPythonEdited(false);
    const next = [...blocks];
    const [item] = next.splice(idx, 1);
    next.splice(targetIdx, 0, item);
    setBlocks(next);
  };

  const handleCopyPython = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Render nội dung tiếng Anh chuẩn xác của từng khối lệnh theo đúng hình ảnh trong tài liệu LEGO Education SPIKE Prime
  const renderAuthenticSpikeBlockContent = (block) => {
    const { id, type, params } = block;

    // Helper styles giống y hệt ô nhập liệu của phần mềm SPIKE Prime
    const portPillClass =
      'bg-black/25 hover:bg-black/35 text-white font-extrabold px-2.5 py-0.5 rounded-full border border-white/30 text-xs cursor-pointer focus:outline-none';
    const whiteOvalInputClass =
      'bg-white text-slate-900 font-extrabold px-2.5 py-0.5 rounded-full text-xs text-center w-14 shadow-inner border border-black/20 focus:outline-none';
    const rectDropdownClass =
      'bg-black/20 hover:bg-black/30 text-white font-bold px-2 py-0.5 rounded-md border border-white/30 text-xs cursor-pointer focus:outline-none';

    switch (type) {
      // 5. EVENT BLOCKS (HAT BLOCKS)
      case 'when_program_starts':
        return (
          <div className="flex items-center gap-2.5 font-extrabold text-white text-sm tracking-tight">
            <span className="w-4 h-5 border-r border-black/20" />
            <span>when program starts</span>
          </div>
        );

      case 'when_color_is':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-3 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>when color is</span>
            <select
              value={params.color}
              onChange={(e) => updateParam(id, 'color', e.target.value)}
              className="bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-full border-2 border-white text-xs cursor-pointer"
            >
              <option value="RED">red (9)</option>
              <option value="BLACK">black (0)</option>
              <option value="BLUE">blue (3)</option>
              <option value="GREEN">green (6)</option>
              <option value="YELLOW">yellow (7)</option>
              <option value="WHITE">white (10)</option>
            </select>
          </div>
        );

      case 'when_pressed':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-3 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>when</span>
            <select
              value={params.state}
              onChange={(e) => updateParam(id, 'state', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="pressed" className="text-slate-900">pressed</option>
              <option value="hard-pressed" className="text-slate-900">hard-pressed</option>
              <option value="released" className="text-slate-900">released</option>
            </select>
          </div>
        );

      case 'when_closer_than':
        return (
          <div className="flex flex-wrap items-center gap-1.5 font-extrabold text-white text-xs">
            <span className="w-3 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>when</span>
            <select
              value={params.comparator}
              onChange={(e) => updateParam(id, 'comparator', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="closer than" className="text-slate-900">closer than</option>
              <option value="farther than" className="text-slate-900">farther than</option>
            </select>
            <input
              type="number"
              value={params.value}
              onChange={(e) => updateParam(id, 'value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit}
              onChange={(e) => updateParam(id, 'unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="cm" className="text-slate-900">cm</option>
              <option value="%" className="text-slate-900">%</option>
              <option value="inches" className="text-slate-900">inches</option>
            </select>
          </div>
        );

      // 1. MOTOR BLOCKS (BLUE #0090FF)
      case 'motor_run_for_duration':
        return (
          <div className="flex flex-wrap items-center gap-1.5 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>run</span>
            <button
              type="button"
              onClick={() =>
                updateParam(
                  id,
                  'direction',
                  params.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
                )
              }
              className={`${rectDropdownClass} inline-flex items-center gap-1`}
              title="Click to toggle clockwise / counterclockwise"
            >
              {params.direction === 'clockwise' ? (
                <RotateCw className="w-3.5 h-3.5" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>▾</span>
            </button>
            <span>for</span>
            <input
              type="number"
              step="0.5"
              value={params.value}
              onChange={(e) => updateParam(id, 'value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit}
              onChange={(e) => updateParam(id, 'unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="rotations" className="text-slate-900">rotations</option>
              <option value="degrees" className="text-slate-900">degrees</option>
              <option value="seconds" className="text-slate-900">seconds</option>
            </select>
          </div>
        );

      case 'motor_go_to_position':
        return (
          <div className="flex flex-wrap items-center gap-1.5 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>go</span>
            <select
              value={params.direction}
              onChange={(e) => updateParam(id, 'direction', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="shortest path" className="text-slate-900">shortest path</option>
              <option value="clockwise" className="text-slate-900">clockwise</option>
              <option value="counterclockwise" className="text-slate-900">counterclockwise</option>
            </select>
            <span>to position</span>
            <input
              type="number"
              value={params.position}
              onChange={(e) => updateParam(id, 'position', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'motor_start':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>start motor</span>
            <button
              type="button"
              onClick={() =>
                updateParam(
                  id,
                  'direction',
                  params.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
                )
              }
              className={`${rectDropdownClass} inline-flex items-center gap-1`}
            >
              {params.direction === 'clockwise' ? (
                <RotateCw className="w-3.5 h-3.5" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>▾</span>
            </button>
          </div>
        );

      case 'motor_stop':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>stop motor</span>
          </div>
        );

      case 'motor_set_speed':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>set speed to</span>
            <input
              type="number"
              value={params.speed}
              onChange={(e) => updateParam(id, 'speed', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>%</span>
          </div>
        );

      // 2. MOVEMENT BLOCKS (MAGENTA #EA3396)
      case 'move_for_duration':
        return (
          <div className="flex flex-wrap items-center gap-1.5 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>move</span>
            <select
              value={params.direction}
              onChange={(e) => updateParam(id, 'direction', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="forward" className="text-slate-900">↑ (forward)</option>
              <option value="backward" className="text-slate-900">↓ (backward)</option>
            </select>
            <span>for</span>
            <input
              type="number"
              value={params.value}
              onChange={(e) => updateParam(id, 'value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit}
              onChange={(e) => updateParam(id, 'unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="cm" className="text-slate-900">cm</option>
              <option value="rotations" className="text-slate-900">rotations</option>
              <option value="degrees" className="text-slate-900">degrees</option>
              <option value="seconds" className="text-slate-900">seconds</option>
              <option value="inches" className="text-slate-900">inches</option>
            </select>
          </div>
        );

      case 'move_with_steering':
        return (
          <div className="flex flex-wrap items-center gap-1.5 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>move</span>
            <select
              value={params.steering}
              onChange={(e) => {
                const v = Number(e.target.value);
                updateParam(id, 'steering', v);
                updateParam(
                  id,
                  'steeringText',
                  v > 0 ? `right: ${v}` : v < 0 ? `left: ${Math.abs(v)}` : 'straight: 0'
                );
              }}
              className="bg-white text-slate-900 font-extrabold px-2.5 py-0.5 rounded-full text-xs border border-black/20 cursor-pointer"
            >
              <option value={90}>right: 90</option>
              <option value={45}>right: 45</option>
              <option value={30}>right: 30</option>
              <option value={0}>straight: 0</option>
              <option value={-30}>left: 30</option>
              <option value={-45}>left: 45</option>
              <option value={-90}>left: 90</option>
            </select>
            <span>for</span>
            <input
              type="number"
              step="0.5"
              value={params.value}
              onChange={(e) => updateParam(id, 'value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit}
              onChange={(e) => updateParam(id, 'unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="rotations" className="text-slate-900">rotations</option>
              <option value="cm" className="text-slate-900">cm</option>
              <option value="degrees" className="text-slate-900">degrees</option>
              <option value="seconds" className="text-slate-900">seconds</option>
            </select>
          </div>
        );

      case 'start_moving':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>start moving</span>
            <select
              value={params.direction}
              onChange={(e) => updateParam(id, 'direction', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="forward" className="text-slate-900">↑</option>
              <option value="backward" className="text-slate-900">↓</option>
            </select>
          </div>
        );

      case 'stop_moving':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>stop moving</span>
          </div>
        );

      case 'set_movement_speed':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>set movement speed to</span>
            <input
              type="number"
              value={params.speed}
              onChange={(e) => updateParam(id, 'speed', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>%</span>
          </div>
        );

      case 'set_movement_motors':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>set movement motors to</span>
            <select
              value={params.ports}
              onChange={(e) => updateParam(id, 'ports', e.target.value)}
              className={portPillClass}
            >
              <option value="A+B" className="text-slate-900">A+B</option>
              <option value="C+D" className="text-slate-900">C+D</option>
              <option value="E+F" className="text-slate-900">E+F</option>
            </select>
          </div>
        );

      case 'set_motor_rotation_distance':
        return (
          <div className="flex flex-wrap items-center gap-1.5 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>set 1 motor rotation to</span>
            <input
              type="number"
              step="0.5"
              value={params.distance}
              onChange={(e) => updateParam(id, 'distance', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit}
              onChange={(e) => updateParam(id, 'unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="cm" className="text-slate-900">cm</option>
              <option value="inches" className="text-slate-900">inches</option>
            </select>
            <span>moved</span>
          </div>
        );

      // 3. LIGHT BLOCKS (PURPLE #7C4DFF)
      case 'light_matrix_turn_on_for_seconds':
        return (
          <div className="flex flex-wrap items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>turn on</span>
            <div className="inline-flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-full border border-white/30">
              <MiniMatrixIcon pattern={params.pattern} />
              <select
                value={params.pattern}
                onChange={(e) => updateParam(id, 'pattern', e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="SMILE" className="text-slate-900">SMILE</option>
                <option value="HEART" className="text-slate-900">HEART</option>
                <option value="ARROW_UP" className="text-slate-900">ARROW</option>
                <option value="YES" className="text-slate-900">YES</option>
              </select>
            </div>
            <span>for</span>
            <input
              type="number"
              step="0.5"
              value={params.seconds}
              onChange={(e) => updateParam(id, 'seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>seconds</span>
          </div>
        );

      case 'light_matrix_turn_on':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>turn on</span>
            <div className="inline-flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-full border border-white/30">
              <MiniMatrixIcon pattern={params.pattern} />
              <select
                value={params.pattern}
                onChange={(e) => updateParam(id, 'pattern', e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="HEART" className="text-slate-900">HEART</option>
                <option value="SMILE" className="text-slate-900">SMILE</option>
                <option value="ARROW_UP" className="text-slate-900">ARROW</option>
                <option value="YES" className="text-slate-900">YES</option>
              </select>
            </div>
          </div>
        );

      case 'light_matrix_write':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>write</span>
            <input
              type="text"
              value={params.text}
              onChange={(e) => updateParam(id, 'text', e.target.value)}
              className="bg-white text-slate-900 font-extrabold px-3 py-0.5 rounded-full text-xs w-24 text-center shadow-inner"
            />
          </div>
        );

      case 'light_matrix_turn_off':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>turn off pixels</span>
          </div>
        );

      case 'set_center_button_light':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>set Power Button light to</span>
            <select
              value={params.color}
              onChange={(e) => updateParam(id, 'color', e.target.value)}
              className="bg-red-500 text-white font-bold px-2.5 py-0.5 rounded-full border-2 border-white text-xs cursor-pointer"
            >
              <option value="RED">red</option>
              <option value="GREEN">green</option>
              <option value="BLUE">blue</option>
              <option value="YELLOW">yellow</option>
              <option value="MAGENTA">magenta</option>
            </select>
          </div>
        );

      case 'light_up_distance_sensor':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>light up</span>
            <span className="inline-flex items-center gap-1 bg-black/25 px-2.5 py-0.5 rounded-full border border-white/30">
              <span>◯ ◯</span>
              <span>▾</span>
            </span>
          </div>
        );

      // 4. SOUND BLOCKS (#B548C6)
      case 'play_beep_for_seconds':
        return (
          <div className="flex flex-wrap items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>play beep</span>
            <input
              type="number"
              value={params.note}
              onChange={(e) => updateParam(id, 'note', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>for</span>
            <input
              type="number"
              step="0.1"
              value={params.seconds}
              onChange={(e) => updateParam(id, 'seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>seconds</span>
          </div>
        );

      case 'play_sound_until_done':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span>play sound</span>
            <select
              value={params.soundName}
              onChange={(e) => updateParam(id, 'soundName', e.target.value)}
              className={portPillClass}
            >
              <option value="Cat Meow 1" className="text-slate-900">Cat Meow 1</option>
              <option value="Robot Beep" className="text-slate-900">Robot Beep</option>
              <option value="Goal Cheer" className="text-slate-900">Goal Cheer</option>
            </select>
            <span>until done</span>
          </div>
        );

      case 'stop_all_sounds':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span>stop all sounds</span>
          </div>
        );

      // 6. CONTROL BLOCKS (#FFAB19)
      case 'wait_seconds':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span>wait</span>
            <input
              type="number"
              step="0.2"
              value={params.seconds}
              onChange={(e) => updateParam(id, 'seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>seconds</span>
          </div>
        );

      case 'wait_until_sensor':
        return (
          <div className="flex flex-wrap items-center gap-2 font-extrabold text-white text-xs">
            <span>wait until</span>
            {/* Ô Boolean hình lục giác nhọn 2 đầu màu xanh Cyan chuẩn Mục 6.6 & 7.7 */}
            <div className="spike-boolean-slot bg-[#0EB8D6] px-4 py-1 flex items-center gap-1.5 shadow-inner border border-white/30">
              <select
                value={params.port}
                onChange={(e) => updateParam(id, 'port', e.target.value)}
                className="bg-black/25 text-white font-extrabold px-1.5 py-0.5 rounded-full text-[11px]"
              >
                {PORT_OPTIONS.map((p) => (
                  <option key={p} value={p} className="text-slate-900">
                    {p}
                  </option>
                ))}
              </select>
              <span>is</span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded text-[11px]">closer than</span>
              <input
                type="number"
                value={params.value}
                onChange={(e) => updateParam(id, 'value', Number(e.target.value))}
                className="bg-white text-slate-900 font-extrabold w-11 rounded-full text-center text-[11px] py-0.5"
              />
              <span className="bg-black/20 px-1.5 py-0.5 rounded text-[11px]">{params.unit}</span>
              <span>?</span>
            </div>
          </div>
        );

      case 'repeat_loop_line_follow':
        return (
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-2 font-extrabold text-white text-xs">
              <span>repeat</span>
              <input
                type="number"
                value={params.times}
                onChange={(e) => updateParam(id, 'times', Number(e.target.value))}
                className={whiteOvalInputClass}
              />
            </div>
            {/* Khe chữ C chứa khối lệnh con bên trong */}
            <div className="ml-4 pl-3 py-2 bg-slate-900/80 rounded-l-lg border-l-4 border-amber-600 flex flex-wrap items-center gap-1.5">
              <div className="bg-[#EA3396] px-3 py-1.5 rounded-lg text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow">
                <span>start moving</span>
                <span className="bg-[#0EB8D6] px-2.5 py-0.5 rounded-full text-[11px] border border-white/40">
                  D reflected light - 50
                </span>
              </div>
            </div>
            <div className="h-2 bg-[#FFAB19] rounded-b-md w-28" />
          </div>
        );

      case 'stop_all_cap':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span>stop</span>
            <select
              value={params.target}
              onChange={(e) => updateParam(id, 'target', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="all" className="text-slate-900">all</option>
              <option value="this stack" className="text-slate-900">this stack</option>
              <option value="all and exit program" className="text-slate-900">all and exit program</option>
            </select>
          </div>
        );

      // 7. SENSORS (#0EB8D6)
      case 'set_yaw_angle_to_0':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>set yaw angle to 0</span>
          </div>
        );

      case 'reset_timer':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span>reset timer</span>
          </div>
        );

      // 9. VARIABLES (#FF8C1A)
      case 'set_variable_to':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span>set</span>
            <input
              type="text"
              value={params.varName}
              onChange={(e) => updateParam(id, 'varName', e.target.value)}
              className="bg-black/20 text-white font-bold px-2 py-0.5 rounded border border-white/30 w-16 text-center"
            />
            <span>to</span>
            <input
              type="number"
              value={params.value}
              onChange={(e) => updateParam(id, 'value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'change_variable_by':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span>change</span>
            <input
              type="text"
              value={params.varName}
              onChange={(e) => updateParam(id, 'varName', e.target.value)}
              className="bg-black/20 text-white font-bold px-2 py-0.5 rounded border border-white/30 w-16 text-center"
            />
            <span>by</span>
            <input
              type="number"
              value={params.delta}
              onChange={(e) => updateParam(id, 'delta', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      // 11-17. MORE BLOCKS & EXTENSIONS
      case 'more_motor_go_relative':
        return (
          <div className="flex flex-wrap items-center gap-1.5 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <select
              value={params.port}
              onChange={(e) => updateParam(id, 'port', e.target.value)}
              className={portPillClass}
            >
              {PORT_OPTIONS.map((p) => (
                <option key={p} value={p} className="text-slate-900">
                  {p}
                </option>
              ))}
            </select>
            <span>go to relative position</span>
            <input
              type="number"
              value={params.position}
              onChange={(e) => updateParam(id, 'position', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>at</span>
            <input
              type="number"
              value={params.speed}
              onChange={(e) => updateParam(id, 'speed', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>% speed</span>
          </div>
        );

      case 'music_play_note':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>play note</span>
            <input
              type="number"
              value={params.note}
              onChange={(e) => updateParam(id, 'note', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>for</span>
            <input
              type="number"
              step="0.25"
              value={params.beats}
              onChange={(e) => updateParam(id, 'beats', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>beats</span>
          </div>
        );

      case 'display_write':
        return (
          <div className="flex items-center gap-2 font-extrabold text-white text-xs">
            <span className="w-2.5 h-5 border-r border-black/20" />
            <span>write</span>
            <input
              type="text"
              value={params.text}
              onChange={(e) => updateParam(id, 'text', e.target.value)}
              className="bg-white text-slate-900 font-extrabold px-2.5 py-0.5 rounded-full text-xs w-32 text-center"
            />
            <span>for</span>
            <input
              type="number"
              value={params.seconds}
              onChange={(e) => updateParam(id, 'seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>seconds</span>
          </div>
        );

      default:
        return null;
    }
  };

  // Lấy giá trị trực tiếp cho các khối Reporter / Boolean
  const getLiveReporterValue = (liveKey) => {
    if (!telemetry) return '';
    switch (liveKey) {
      case 'motorA_pos':
        return `${Math.round(((telemetry.motors?.A?.angle || 0) % 360 + 360) % 360)}°`;
      case 'motorA_spd':
        return `${Math.round(telemetry.motors?.A?.speed || 0)}%`;
      case 'isColorRed':
        return telemetry.colorSensor?.color === 'RED' ? 'true' : 'false';
      case 'colorName':
        return telemetry.colorSensor?.color || 'BLACK';
      case 'isReflectionLow':
        return (telemetry.colorSensor?.reflection || 0) < 50 ? 'true' : 'false';
      case 'reflectionVal':
        return `${telemetry.colorSensor?.reflection || 0}%`;
      case 'isForcePressed':
        return telemetry.forceSensor?.pressed ? 'true' : 'false';
      case 'forceVal':
        return `${telemetry.forceSensor?.newton || 0} N`;
      case 'isCloser25':
        return (telemetry.distanceSensor?.cm || 100) < 25 ? 'true' : 'false';
      case 'distanceVal':
        return `${Math.round(telemetry.distanceSensor?.cm || 0)} cm`;
      case 'yawVal':
        return `${Math.round(telemetry.gyroYaw || 0)}°`;
      default:
        return 'true';
    }
  };

  const filteredPaletteBlocks = Object.entries(BLOCK_DEFINITIONS).filter(
    ([, def]) => selectedCategory === 'all' || def.category === selectedCategory
  );

  return (
    <div className="flex flex-col h-full bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden relative">
      {/* HEADER KHU VỰC 2: Ô LẬP TRÌNH */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-black text-[11px]">
            KHU VỰC 2
          </span>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">
            Ô Lập Trình Chuẩn LEGO® SPIKE™ (Word Blocks EN + Python)
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Nút bật Bảng giải thích 6 loại hình dạng khối lệnh (Phần 1 Tài liệu) */}
          <button
            onClick={() => setShowShapeGuideModal((v) => !v)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            6 Loại Khối Lệnh (Block Shapes)
          </button>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setCodingTab('blocks')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                codingTab === 'blocks'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Word Blocks
            </button>
            <button
              onClick={() => setCodingTab('both')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                codingTab === 'both'
                  ? 'bg-yellow-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Song Song
            </button>
            <button
              onClick={() => setCodingTab('python')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                codingTab === 'python'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python
            </button>
          </div>
        </div>
      </div>

      {/* MODAL / PANEL GIẢI THÍCH 6 LOẠI KHỐI LỆNH (PHẦN 1 TRONG TÀI LIỆU CỦA GIÁO VIÊN) */}
      {showShapeGuideModal && (
        <div className="bg-slate-950/95 border-b-2 border-amber-400 p-3 space-y-2 z-20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              PHẦN 1: CÁC LOẠI KHỐI LỆNH TRONG LEGO® SPIKE™ PRIME (BLOCK TYPES)
            </span>
            <button
              onClick={() => setShowShapeGuideModal(false)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-0.5 rounded font-bold"
            >
              Đóng ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BLOCK_SHAPE_GUIDE.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-extrabold text-white mb-1">{item.nameVi}</div>
                  {/* Hình minh họa khối */}
                  <div
                    className={`text-[10px] font-mono font-extrabold text-white px-2.5 py-1 mb-1.5 inline-block ${
                      item.id === 'hat'
                        ? 'rounded-t-2xl rounded-b-md'
                        : item.id === 'reporter'
                        ? 'rounded-full'
                        : item.id === 'boolean'
                        ? 'spike-boolean-slot px-3'
                        : 'rounded-md'
                    }`}
                    style={{ backgroundColor: item.color }}
                  >
                    {item.sampleText}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BỐ CỤC CHÍNH CỦA Ô LẬP TRÌNH */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* CỘT 1: THANH DANH MỤC 10 NHÓM MÀU CHUẨN LEGO SPIKE PRIME (BÊN TRÁI) */}
        {(codingTab === 'blocks' || codingTab === 'both') && (
          <div className="col-span-3 bg-slate-950/90 border-r border-slate-800 flex flex-col overflow-y-auto p-1.5 space-y-1">
            <div className="text-[10px] font-bold uppercase text-slate-400 px-1.5 py-1">
              Block Palette
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-[11px] font-bold transition ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-yellow-300 border border-yellow-400/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-blue-500 via-pink-500 to-yellow-400 shrink-0" />
              <span className="truncate">Tất cả (All)</span>
            </button>

            {SPIKE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-[11px] font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-white ring-1 ring-white/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm border border-white/20"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="leading-tight truncate">
                  <div className="text-[11px] text-slate-100 font-extrabold">{cat.nameEn}</div>
                  <div className="text-[9px] text-slate-400">{cat.nameVi}</div>
                </div>
              </button>
            ))}

            {/* Khay thêm nhanh Khối lệnh theo danh mục đang chọn */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <div className="text-[10px] font-bold text-yellow-400 px-1">
                + Nhấn để thêm khối (Add Block):
              </div>
              {filteredPaletteBlocks.map(([typeKey, def]) => (
                <button
                  key={typeKey}
                  onClick={() => addBlock(typeKey)}
                  onMouseEnter={() => setHoveredBlockDesc(def)}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-white text-[11px] font-extrabold shadow hover:brightness-110 active:scale-[0.98] transition flex items-center justify-between gap-1"
                  style={{ backgroundColor: def.color }}
                >
                  <span className="truncate">
                    <span className="opacity-75 font-mono text-[9px] mr-1">[{def.sectionCode}]</span>
                    {def.nameEn}
                  </span>
                  <Plus className="w-3 h-3 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CỘT 2: CHỒNG LỆNH (PROGRAMMING STACK) VỚI KHỚP NỐI SCRATCH / SPIKE CHÍNH GỐC */}
        {(codingTab === 'blocks' || codingTab === 'both') && (
          <div
            className={`${
              codingTab === 'both'
                ? 'col-span-5 border-r border-slate-800'
                : 'col-span-9'
            } flex flex-col h-full overflow-y-auto p-3 bg-[#111827]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Chồng lệnh (Programming Stack - Tiếng Anh chuẩn SPIKE)
              </span>
              {!isRunning ? (
                <button
                  onClick={onRunProgram}
                  className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-xs shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  RUN
                </button>
              ) : (
                <button
                  onClick={onStopProgram}
                  className="flex items-center gap-1 bg-rose-600 hover:bg-rose-500 text-white font-black px-2.5 py-1 rounded-lg text-xs shadow"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  STOP
                </button>
              )}
            </div>

            {/* Danh sách các khối lệnh ghép nối vào nhau */}
            <div className="space-y-0.5 pb-4">
              {blocks.map((block, index) => {
                const def = BLOCK_DEFINITIONS[block.type];
                if (!def) return null;
                const isCurrent = activeBlockId === block.id;
                const shapeClass =
                  def.shape === 'hat'
                    ? 'spike-hat-block'
                    : def.shape === 'cap'
                    ? 'spike-cap-block'
                    : 'spike-stack-block';

                return (
                  <div
                    key={block.id}
                    onMouseEnter={() => setHoveredBlockDesc(def)}
                    className={`${shapeClass} px-3.5 py-2.5 text-white transition-all border border-black/20 ${
                      isCurrent ? 'ring-4 ring-yellow-300 z-10 brightness-110' : ''
                    }`}
                    style={{ backgroundColor: def.color }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      {/* Nội dung khối lệnh bằng tiếng Anh chuẩn phần mềm SPIKE */}
                      <div className="flex-1">{renderAuthenticSpikeBlockContent(block)}</div>

                      {/* Nút thao tác nhanh (Lên / Xuống / Xóa) */}
                      <div className="flex items-center gap-0.5 opacity-80 hover:opacity-100 shrink-0">
                        <span className="text-[9px] font-mono bg-black/25 px-1 rounded mr-0.5">
                          {def.sectionCode}
                        </span>
                        <button
                          onClick={() => moveBlock(index, -1)}
                          title="Di chuyển lên"
                          className="p-0.5 rounded bg-black/20 hover:bg-black/40"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveBlock(index, 1)}
                          title="Di chuyển xuống"
                          className="p-0.5 rounded bg-black/20 hover:bg-black/40"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeBlock(block.id)}
                          title="Xóa khối"
                          className="p-0.5 rounded bg-black/20 hover:bg-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Khay các Khối Báo Giá Trị (Reporter Pills) & Khối Boolean Lục Giác trực tiếp */}
            <div className="mt-auto pt-3 border-t border-slate-800">
              <div className="text-[10px] font-extrabold uppercase text-slate-400 mb-1.5">
                Khối Báo Giá Trị (Reporter Blocks) & Boolean (Giá trị trực tiếp từ Robot):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {REPORTER_AND_BOOLEAN_BLOCKS.slice(0, 7).map((rb) => (
                  <div
                    key={rb.sectionCode}
                    title={rb.nameVi}
                    className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold text-white px-2.5 py-1 shadow-sm border border-white/25 ${
                      rb.shape === 'boolean' ? 'spike-boolean-slot px-3.5' : 'spike-reporter-pill'
                    }`}
                    style={{ backgroundColor: rb.color }}
                  >
                    <span>{rb.syntaxEn}</span>
                    <span className="bg-slate-950/80 text-yellow-300 font-mono px-1.5 py-0.2 rounded-full text-[10px]">
                      = {getLiveReporterValue(rb.liveKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CỘT 3: MÃ NGUỒN PYTHON TƯƠNG ỨNG */}
        {(codingTab === 'python' || codingTab === 'both') && (
          <div
            className={`${
              codingTab === 'both' ? 'col-span-4' : 'col-span-12'
            } flex flex-col h-full bg-slate-950 overflow-hidden`}
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px]">
              <span className="font-mono text-emerald-400 font-bold">SPIKE™ Python 3</span>
              <button
                onClick={handleCopyPython}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              value={pythonCode}
              onChange={(e) => {
                setCustomPythonEdited(true);
                setPythonCode(e.target.value);
              }}
              spellCheck={false}
              className="code-editor flex-1 w-full bg-slate-950 text-emerald-300 p-2.5 text-[11px] leading-relaxed focus:outline-none resize-none overflow-y-auto"
            />
          </div>
        )}
      </div>

      {/* THANH GIẢI THÍCH SONG NGỮ ANH - VIỆT (THEO ĐÚNG TÀI LIỆU HƯỚNG DẪN HỌC SINH) + CONSOLE */}
      <div className="bg-slate-950 border-t border-slate-800 px-3 py-2 flex flex-col gap-1.5 shrink-0">
        {hoveredBlockDesc ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-start justify-between gap-2">
            <div className="text-[11px]">
              <span
                className="inline-block text-white font-extrabold px-1.5 py-0.2 rounded text-[10px] mr-1.5"
                style={{ backgroundColor: hoveredBlockDesc.color }}
              >
                Mục {hoveredBlockDesc.sectionCode}
              </span>
              <strong className="text-yellow-300">{hoveredBlockDesc.nameVi}: </strong>
              <span className="text-slate-300">{hoveredBlockDesc.description}</span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400">
            💡 Di chuột vào bất kỳ khối lệnh nào để xem giải thích Tiếng Việt theo Tài liệu Hướng dẫn Học sinh.
          </div>
        )}

        {/* Dòng nhật ký thực thi ngắn gọn */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800/80">
          <Terminal className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span className="truncate">
            {logs.length > 0
              ? `[${logs[logs.length - 1].time}] ${logs[logs.length - 1].text}`
              : 'Ready. Nhấn nút RUN màu xanh lá để chạy chồng lệnh!'}
          </span>
        </div>
      </div>
    </div>
  );
}
