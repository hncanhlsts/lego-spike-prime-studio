import React from 'react';
import {
  Play,
  RotateCw,
  RotateCcw,
  Copy,
  Trash2
} from 'lucide-react';
import { BLOCK_DEFINITIONS } from '../data/spikeData';

const PORT_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const STEERING_OPTIONS = [
  { val: -100, label: 'spin left: 100' },
  { val: -90, label: 'left: 90' },
  { val: -60, label: 'left: 60' },
  { val: -50, label: 'left: 50' },
  { val: -45, label: 'left: 45' },
  { val: -40, label: 'left: 40' },
  { val: -30, label: 'left: 30' },
  { val: -20, label: 'left: 20' },
  { val: -15, label: 'left: 15' },
  { val: -10, label: 'left: 10' },
  { val: 0, label: 'straight: 0' },
  { val: 10, label: 'right: 10' },
  { val: 15, label: 'right: 15' },
  { val: 20, label: 'right: 20' },
  { val: 30, label: 'right: 30' },
  { val: 40, label: 'right: 40' },
  { val: 45, label: 'right: 45' },
  { val: 50, label: 'right: 50' },
  { val: 60, label: 'right: 60' },
  { val: 90, label: 'right: 90' },
  { val: 100, label: 'spin right: 100' }
];

export function SteeringSelect({ value, onChange, className }) {
  const currentVal = Number(value ?? 30);
  const exists = STEERING_OPTIONS.some((o) => o.val === currentVal);
  return (
    <select
      value={currentVal}
      onChange={(e) => onChange(Number(e.target.value))}
      className={className || "bg-white text-[#575E75] font-semibold px-2.5 h-[24px] rounded-full text-[11px] border border-black/20 cursor-pointer"}
    >
      {!exists && (
        <option value={currentVal}>
          {currentVal > 0 ? `right: ${currentVal}` : currentVal < 0 ? `left: ${Math.abs(currentVal)}` : 'straight: 0'}
        </option>
      )}
      {STEERING_OPTIONS.map((opt) => (
        <option key={opt.val} value={opt.val}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// 1. Icon bánh xe Technic chuẩn giống hệt bên trái khối lệnh Motors & Movement trong SPIKE 3.5.1
export function SpikeWheelBadge({ bg = 'rgba(0,0,0,0.18)' }) {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full shrink-0 border border-white/40 pointer-events-none"
      style={{ backgroundColor: bg }}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
        <circle cx="12" cy="12" r="9" fill="none" stroke="white" strokeWidth="2.2" />
        <circle cx="12" cy="7" r="1.8" />
        <circle cx="12" cy="17" r="1.8" />
        <circle cx="7" cy="12" r="1.8" />
        <circle cx="17" cy="12" r="1.8" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    </span>
  );
}

// 2. Icon ma trận 5x5 thu nhỏ trên khối lệnh Light
export function MiniMatrixIcon({ pattern = 'SMILE' }) {
  const dots =
    pattern === 'HEART'
      ? [0,1,0,1,0, 1,1,1,1,1, 1,1,1,1,1, 0,1,1,1,0, 0,0,1,0,0]
      : pattern === 'YES'
      ? [0,0,0,0,1, 0,0,0,1,0, 1,0,1,0,0, 0,1,0,0,0, 0,0,0,0,0]
      : pattern === 'ARROW_UP'
      ? [0,0,1,0,0, 0,1,1,1,0, 1,0,1,0,1, 0,0,1,0,0, 0,0,1,0,0]
      : pattern === 'OFF'
      ? [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0]
      : [0,1,0,1,0, 0,1,0,1,0, 0,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0];

  return (
    <span className="inline-grid grid-cols-5 gap-[1.5px] bg-[#451d99] p-1 rounded border border-white/30 align-middle pointer-events-none shrink-0">
      {dots.map((on, idx) => (
        <span
          key={idx}
          className={`w-1.5 h-1.5 rounded-[1px] ${on ? 'bg-white' : 'bg-purple-900/70'}`}
        />
      ))}
    </span>
  );
}

// 3. Icon Cảm biến Màu sắc (Color Sensor) chuẩn SPIKE
export function ColorSensorBadge() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-black/15 border border-white/35 shrink-0 pointer-events-none">
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <rect x="3" y="4" width="18" height="16" rx="4" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.5" fill="white" />
      </svg>
    </span>
  );
}

// 4. Icon Cảm biến Khoảng cách 2 mắt siêu âm (Distance Sensor) chuẩn SPIKE
export function DistanceSensorBadge() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-black/15 border border-white/35 shrink-0 pointer-events-none">
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="8" cy="12" r="3" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="16" cy="12" r="3" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    </span>
  );
}

// 5. Icon Cảm biến Lực (Force Sensor) chuẩn SPIKE
export function ForceSensorBadge() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-black/15 border border-white/35 shrink-0 pointer-events-none">
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <rect x="5" y="6" width="14" height="14" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <path d="M9 6V3h6v3" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="13" r="2.5" fill="white" />
      </svg>
    </span>
  );
}

// 6. Icon Bộ não Hub (Hub Gyro / Button / Speaker) chuẩn SPIKE
export function HubDeviceBadge() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-black/15 border border-white/35 shrink-0 pointer-events-none">
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <rect x="5" y="3" width="14" height="18" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <rect x="8" y="6" width="8" height="7" rx="1" fill="white" fillOpacity="0.85" />
        <circle cx="12" cy="17" r="2" fill="white" />
      </svg>
    </span>
  );
}

const COLOR_HEX_MAP = {
  RED: '#e11d48',
  BLACK: '#1e293b',
  BLUE: '#2563eb',
  GREEN: '#16a34a',
  YELLOW: '#eab308',
  WHITE: '#f8fafc',
  VIOLET: '#7c3aed'
};

export default function SpikeBlockItem({
  block,
  index,
  parentId = 'root',
  parentBranch = 'root',
  isPalette = false,
  isEmbeddedBoolean = false,
  isCurrent = false,
  activeBlockId = null,
  isDragging = false,
  dragState = null,
  onUpdateParam,
  onClearCondition,
  onDuplicate,
  onRemove,
  onHover,
  onPointerDragStart
}) {
  const def = BLOCK_DEFINITIONS[block.type];
  if (!def) return null;

  const { id, type, params = {} } = block;

  const update = (key, val) => {
    if (onUpdateParam) {
      onUpdateParam(id, key, val);
    }
  };

  // Không kích hoạt kéo khối khi người dùng đang bấm vào các ô input / select bên trong khối
  const handlePointerDown = (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'option' || tag === 'button') {
      return;
    }
    if (e.button !== 0) return;
    e.stopPropagation();
    if (isEmbeddedBoolean) return;
    if (onPointerDragStart) {
      onPointerDragStart(e, {
        source: isPalette ? 'palette' : 'canvas',
        block,
        index,
        parentId,
        parentBranch
      });
    }
  };

  const shapeClass =
    def.shape === 'hat'
      ? 'spike-hat-block'
      : def.shape === 'cap'
      ? 'spike-cap-block'
      : def.shape === 'boolean'
      ? 'spike-boolean-block'
      : def.shape === 'reporter'
      ? 'spike-reporter-pill'
      : 'spike-stack-block';

  // Các class chuẩn SPIKE 3.5.1
  const portPillClass =
    'bg-black/20 hover:bg-black/30 text-white font-bold px-2.5 h-[24px] rounded-full border border-white/25 text-[11px] cursor-pointer focus:outline-none inline-flex items-center';
  const whiteOvalInputClass =
    'spike-oval-input bg-white text-[#575E75] font-semibold px-2 h-[24px] min-w-[34px] w-11 rounded-full text-[12px] text-center border border-black/20 focus:outline-none focus:ring-2 focus:ring-yellow-300';
  const emptyWhiteOvalClass =
    'spike-oval-input bg-white text-[#575E75] font-semibold px-1.5 h-[24px] w-[36px] rounded-full text-[12px] text-center border border-black/25 focus:outline-none focus:ring-2 focus:ring-yellow-300';
  const textWhiteOvalClass =
    'spike-oval-input bg-white text-[#575E75] font-semibold px-2.5 h-[24px] min-w-[48px] w-14 rounded-full text-[12px] text-center border border-black/20 focus:outline-none focus:ring-2 focus:ring-yellow-300';
  const rectDropdownClass =
    'bg-black/15 hover:bg-black/25 text-white font-semibold px-2 h-[24px] rounded-[4px] border border-black/20 text-[11px] cursor-pointer focus:outline-none inline-flex items-center';
  const darkBooleanHoleClass =
    'spike-boolean-slot bg-black/30 w-[38px] h-[24px] inline-block shrink-0';

  const renderPortSelect = (paramKey = 'port', defaultPort = 'A') => (
    <select
      value={params[paramKey] || defaultPort}
      onChange={(e) => update(paramKey, e.target.value)}
      className={portPillClass}
    >
      {PORT_OPTIONS.map((p) => (
        <option key={p} value={p} className="text-slate-900">
          {p}
        </option>
      ))}
    </select>
  );

  const renderColorPill = (paramKey = 'color', defaultColor = 'RED') => {
    const cur = params[paramKey] || defaultColor;
    return (
      <select
        value={cur}
        onChange={(e) => update(paramKey, e.target.value)}
        style={{ backgroundColor: COLOR_HEX_MAP[cur] || '#e11d48' }}
        className="text-white font-bold px-2.5 h-[24px] rounded-full border-2 border-white text-[11px] cursor-pointer focus:outline-none shadow-sm"
      >
        <option value="RED" className="bg-white text-slate-900">red</option>
        <option value="BLACK" className="bg-white text-slate-900">black</option>
        <option value="BLUE" className="bg-white text-slate-900">blue</option>
        <option value="GREEN" className="bg-white text-slate-900">green</option>
        <option value="YELLOW" className="bg-white text-slate-900">yellow</option>
        <option value="WHITE" className="bg-white text-slate-900">white</option>
      </select>
    );
  };

  // Ô lục giác chứa khối điều kiện Boolean (< >)
  const renderBooleanSlot = () => {
    if (isPalette) {
      return <span className={darkBooleanHoleClass} />;
    }
    const isBoolTarget =
      dragState &&
      dragState.hasMoved &&
      dragState.targetBooleanBlockId === id;

    if (block.conditionBlock) {
      return (
        <div
          data-boolean-target-block-id={id}
          className={`inline-flex items-center gap-1 rounded-full transition ${
            isBoolTarget ? 'ring-2 ring-white scale-105' : ''
          }`}
        >
          <SpikeBlockItem
            block={block.conditionBlock}
            isPalette={false}
            isEmbeddedBoolean={true}
            onUpdateParam={onUpdateParam}
            onHover={onHover}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClearCondition && onClearCondition(id);
            }}
            title="Gỡ khối điều kiện lục giác"
            className="w-4 h-4 rounded-full bg-black/35 hover:bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center leading-none"
          >
            ×
          </button>
        </div>
      );
    }

    return (
      <div
        data-boolean-target-block-id={id}
        title="Kéo một khối lục giác (Sensors / Operators) thả vào ô điều kiện < > này"
        className={`spike-boolean-slot min-w-[54px] h-[25px] px-2.5 inline-flex items-center justify-center text-[10px] font-bold transition ${
          isBoolTarget
            ? 'bg-yellow-300 text-slate-950 ring-2 ring-white scale-110 shadow-md'
            : 'bg-black/30 text-white/75 hover:bg-black/40'
        }`}
      >
        {isBoolTarget ? '↳ Thả < >' : '< >'}
      </div>
    );
  };

  // Khe chữ C (C-mouth) cho phép kéo thả lồng nhiều khối lệnh vào bên trong repeat / forever / if / else / repeat until
  const renderNestedBranch = (branchKey = 'children', emptyLabel = '↳ Kéo thả khối lệnh vào đây') => {
    if (isPalette) {
      return (
        <div className="ml-3 h-4 bg-[#f8f9fa] rounded-l-md border-l-4 border-amber-600/40" />
      );
    }

    const list = Array.isArray(block[branchKey]) ? block[branchKey] : [];
    const isTargetContainer =
      dragState &&
      dragState.hasMoved &&
      dragState.overCanvas &&
      !dragState.overTrash &&
      !dragState.targetBooleanBlockId &&
      dragState.targetContainerId === id &&
      dragState.targetBranch === branchKey;

    const renderNestedDropLine = (childIdx) => {
      if (!isTargetContainer || dragState.dropIndex !== childIdx) return null;
      const draggedDef = BLOCK_DEFINITIONS[dragState.block?.type];
      return (
        <div className="my-1 flex items-center animate-pulse">
          <div className="h-3 w-48 rounded-md border-2 border-dashed border-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.85)] flex items-center px-2 text-[10px] font-extrabold text-amber-900 bg-amber-100">
            <span>↳ Ghép [{draggedDef?.nameEn}] vào đây</span>
          </div>
        </div>
      );
    };

    return (
      <div
        data-c-container-id={id}
        data-c-branch={branchKey}
        className={`ml-3 pl-2.5 pr-2 py-1.5 min-h-[36px] min-w-[210px] rounded-l-lg border-l-4 transition-colors ${
          isTargetContainer
            ? 'bg-amber-50/95 border-amber-400 ring-2 ring-amber-300'
            : 'bg-[#f3f4f6]/95 border-amber-600/60'
        }`}
      >
        {list.length === 0 ? (
          <div className="min-h-[24px] flex items-center">
            {isTargetContainer ? (
              renderNestedDropLine(0)
            ) : (
              <span className="text-[10px] font-bold text-slate-400 italic select-none pointer-events-none">
                {emptyLabel}
              </span>
            )}
          </div>
        ) : (
          <div className="space-y-0.5">
            {list.map((childBlock, childIdx) => (
              <React.Fragment key={childBlock.id}>
                {renderNestedDropLine(childIdx)}
                <SpikeBlockItem
                  block={childBlock}
                  index={childIdx}
                  parentId={id}
                  parentBranch={branchKey}
                  isPalette={false}
                  isCurrent={activeBlockId === childBlock.id}
                  activeBlockId={activeBlockId}
                  isDragging={
                    dragState &&
                    dragState.hasMoved &&
                    dragState.source === 'canvas' &&
                    dragState.block.id === childBlock.id
                  }
                  dragState={dragState}
                  onUpdateParam={onUpdateParam}
                  onClearCondition={onClearCondition}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                  onHover={onHover}
                  onPointerDragStart={onPointerDragStart}
                />
              </React.Fragment>
            ))}
            {renderNestedDropLine(list.length)}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      // =====================================================================
      // 1. MOTORS (1.1 -> 1.7)
      // =====================================================================
      case 'motor_run_for_duration':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>run</span>
            <button
              type="button"
              onClick={() =>
                update(
                  'direction',
                  params.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
                )
              }
              className={`${rectDropdownClass} gap-0.5`}
            >
              {params.direction === 'counterclockwise' ? (
                <RotateCcw className="w-3.5 h-3.5" />
              ) : (
                <RotateCw className="w-3.5 h-3.5" />
              )}
              <span className="text-[9px]">▾</span>
            </button>
            <span>for</span>
            <input
              type="number"
              step="0.5"
              value={params.value ?? 1}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit || 'rotations'}
              onChange={(e) => update('unit', e.target.value)}
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
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>go</span>
            <select
              value={params.direction || 'shortest path'}
              onChange={(e) => update('direction', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="shortest path" className="text-slate-900">shortest path</option>
              <option value="clockwise" className="text-slate-900">clockwise</option>
              <option value="counterclockwise" className="text-slate-900">counterclockwise</option>
            </select>
            <span>to position</span>
            <input
              type="number"
              value={params.position ?? 0}
              onChange={(e) => update('position', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'motor_start':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>start motor</span>
            <button
              type="button"
              onClick={() =>
                update(
                  'direction',
                  params.direction === 'clockwise' ? 'counterclockwise' : 'clockwise'
                )
              }
              className={`${rectDropdownClass} gap-0.5`}
            >
              {params.direction === 'counterclockwise' ? (
                <RotateCcw className="w-3.5 h-3.5" />
              ) : (
                <RotateCw className="w-3.5 h-3.5" />
              )}
              <span className="text-[9px]">▾</span>
            </button>
          </div>
        );

      case 'motor_stop':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>stop motor</span>
          </div>
        );

      case 'motor_set_speed':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>set speed to</span>
            <input
              type="number"
              value={params.speed ?? 75}
              onChange={(e) => update('speed', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>%</span>
          </div>
        );

      case 'motor_position':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>position</span>
          </div>
        );

      case 'motor_speed':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>speed</span>
          </div>
        );

      // =====================================================================
      // 2. MOVEMENT (2.1 -> 2.8)
      // =====================================================================
      case 'move_for_duration':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>move</span>
            <select
              value={params.direction || 'forward'}
              onChange={(e) => update('direction', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="forward" className="text-slate-900">↑</option>
              <option value="backward" className="text-slate-900">↓</option>
            </select>
            <span>for</span>
            <input
              type="number"
              value={params.value ?? 10}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit || 'rotations'}
              onChange={(e) => update('unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="cm" className="text-slate-900">cm</option>
              <option value="in" className="text-slate-900">in</option>
              <option value="seconds" className="text-slate-900">seconds</option>
              <option value="degrees" className="text-slate-900">degrees</option>
              <option value="rotations" className="text-slate-900">rotations</option>
            </select>
          </div>
        );

      case 'start_moving':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>start moving</span>
            <select
              value={params.direction || 'forward'}
              onChange={(e) => update('direction', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="forward" className="text-slate-900">↑</option>
              <option value="backward" className="text-slate-900">↓</option>
            </select>
          </div>
        );

      case 'move_with_steering':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>move</span>
            <SteeringSelect
              value={params.steering ?? 30}
              onChange={(v) => {
                update('steering', v);
                update('steeringText', v >= 0 ? `right: ${v}` : `left: ${Math.abs(v)}`);
              }}
            />
            <span>for</span>
            <input
              type="number"
              value={params.value ?? 10}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit || 'rotations'}
              onChange={(e) => update('unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="cm" className="text-slate-900">cm</option>
              <option value="in" className="text-slate-900">in</option>
              <option value="seconds" className="text-slate-900">seconds</option>
              <option value="degrees" className="text-slate-900">degrees</option>
              <option value="rotations" className="text-slate-900">rotations</option>
            </select>
          </div>
        );

      case 'start_moving_steering':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>start moving</span>
            <SteeringSelect
              value={params.steering ?? 30}
              onChange={(v) => {
                update('steering', v);
                update('steeringText', v >= 0 ? `right: ${v}` : `left: ${Math.abs(v)}`);
              }}
            />
          </div>
        );

      case 'stop_moving':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>stop moving</span>
          </div>
        );

      case 'set_movement_speed':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set movement speed to</span>
            <input
              type="number"
              value={params.speed ?? 50}
              onChange={(e) => update('speed', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>%</span>
          </div>
        );

      case 'set_movement_motors':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set movement motors to</span>
            <select
              value={params.ports || 'A+B'}
              onChange={(e) => update('ports', e.target.value)}
              className="bg-[#b8006b] text-white font-bold px-2.5 h-[24px] rounded-full border border-white/30 text-[11px] cursor-pointer"
            >
              <option value="A+B">A+B</option>
              <option value="C+D">C+D</option>
              <option value="E+F">E+F</option>
            </select>
          </div>
        );

      case 'set_motor_rotation_distance':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set 1 motor rotation to</span>
            <input
              type="number"
              step="0.5"
              value={params.distance ?? 17.5}
              onChange={(e) => update('distance', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit || 'cm'}
              onChange={(e) => update('unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="cm" className="text-slate-900">cm</option>
              <option value="in" className="text-slate-900">in</option>
            </select>
            <span>moved</span>
          </div>
        );

      // =====================================================================
      // 3. LIGHT (3.1 -> 3.17)
      // =====================================================================
      case 'light_matrix_turn_on_for_seconds':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>turn on</span>
            <MiniMatrixIcon pattern={params.pattern} />
            <select
              value={params.pattern || 'SMILE'}
              onChange={(e) => update('pattern', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="SMILE" className="text-slate-900">Smile ▾</option>
              <option value="HEART" className="text-slate-900">Heart ▾</option>
              <option value="ARROW_UP" className="text-slate-900">Arrow ▾</option>
              <option value="YES" className="text-slate-900">Yes ▾</option>
            </select>
            <span>for</span>
            <input
              type="number"
              step="0.5"
              value={params.seconds ?? 2}
              onChange={(e) => update('seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>seconds</span>
          </div>
        );

      case 'light_matrix_turn_on':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>turn on</span>
            <MiniMatrixIcon pattern={params.pattern} />
            <select
              value={params.pattern || 'HEART'}
              onChange={(e) => update('pattern', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="HEART" className="text-slate-900">Heart ▾</option>
              <option value="SMILE" className="text-slate-900">Smile ▾</option>
              <option value="ARROW_UP" className="text-slate-900">Arrow ▾</option>
              <option value="YES" className="text-slate-900">Yes ▾</option>
            </select>
          </div>
        );

      case 'light_matrix_write':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>write</span>
            <input
              type="text"
              value={params.text ?? 'Hello'}
              onChange={(e) => update('text', e.target.value)}
              className={textWhiteOvalClass}
            />
          </div>
        );

      case 'light_matrix_turn_off':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>turn off pixels</span>
          </div>
        );

      case 'light_matrix_set_brightness':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set pixel brightness to</span>
            <input
              type="number"
              value={params.brightness ?? 100}
              onChange={(e) => update('brightness', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>%</span>
          </div>
        );

      case 'light_matrix_set_pixel':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set pixel at</span>
            <input
              type="number"
              min="1"
              max="5"
              value={params.x ?? 1}
              onChange={(e) => update('x', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>,</span>
            <input
              type="number"
              min="1"
              max="5"
              value={params.y ?? 1}
              onChange={(e) => update('y', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>to</span>
            <input
              type="number"
              value={params.brightness ?? 100}
              onChange={(e) => update('brightness', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>%</span>
          </div>
        );

      case 'light_matrix_rotate':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>rotate orientation</span>
            <select
              value={params.direction || 'clockwise'}
              onChange={(e) => update('direction', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="clockwise" className="text-slate-900">clockwise</option>
              <option value="counterclockwise" className="text-slate-900">counterclockwise</option>
            </select>
          </div>
        );

      case 'light_matrix_set_orientation':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set orientation to</span>
            <select
              value={params.orientation || 'upright'}
              onChange={(e) => update('orientation', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="upright" className="text-slate-900">upright</option>
              <option value="left" className="text-slate-900">left</option>
              <option value="right" className="text-slate-900">right</option>
              <option value="upside down" className="text-slate-900">upside down</option>
            </select>
          </div>
        );

      case 'set_center_button_light':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set Center Button light to</span>
            {renderColorPill('color', 'RED')}
          </div>
        );

      case 'light_up_distance_sensor':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <DistanceSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'E')}
            <span>light up</span>
            <span className={portPillClass}>◐ ◐ ▾</span>
          </div>
        );

      // =====================================================================
      // 4. SOUND (4.1 -> 4.11)
      // =====================================================================
      case 'play_sound_until_done':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>play sound</span>
            <span className={portPillClass}>{params.soundName || 'Cat Meow 1'} ▾</span>
            <span>until done</span>
          </div>
        );

      case 'start_sound':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>start sound</span>
            <span className={portPillClass}>{params.soundName || 'Cat Meow 1'} ▾</span>
          </div>
        );

      case 'play_beep_for_seconds':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>play beep</span>
            <input
              type="number"
              value={params.note ?? 60}
              onChange={(e) => update('note', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>for</span>
            <input
              type="number"
              step="0.1"
              value={params.seconds ?? 0.2}
              onChange={(e) => update('seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>seconds</span>
          </div>
        );

      case 'start_playing_beep':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>start playing beep</span>
            <input
              type="number"
              value={params.note ?? 60}
              onChange={(e) => update('note', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'stop_all_sounds':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>stop all sounds</span>
          </div>
        );

      case 'change_sound_effect':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>change</span>
            <select
              value={params.effect || 'pitch'}
              onChange={(e) => update('effect', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="pitch" className="text-slate-900">pitch</option>
              <option value="pan left/right" className="text-slate-900">pan left/right</option>
            </select>
            <span>effect by</span>
            <input
              type="number"
              value={params.value ?? 10}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'set_sound_effect':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>set</span>
            <select
              value={params.effect || 'pitch'}
              onChange={(e) => update('effect', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="pitch" className="text-slate-900">pitch</option>
              <option value="pan left/right" className="text-slate-900">pan left/right</option>
            </select>
            <span>effect to</span>
            <input
              type="number"
              value={params.value ?? 100}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'clear_sound_effects':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>clear sound effects</span>
          </div>
        );

      case 'change_volume_by':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>change volume by</span>
            <input
              type="number"
              value={params.delta ?? -10}
              onChange={(e) => update('delta', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'set_volume_to':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>set volume to</span>
            <input
              type="number"
              value={params.volume ?? 100}
              onChange={(e) => update('volume', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>%</span>
          </div>
        );

      case 'sound_volume':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap px-1">
            <span>volume</span>
          </div>
        );

      // =====================================================================
      // 5. EVENTS (5.1 -> 5.13)
      // =====================================================================
      case 'when_program_starts':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-black/15">
              <Play className="w-3.5 h-3.5 fill-white" />
            </span>
            <span className="h-4 border-r border-black/15" />
            <span>when program starts</span>
          </div>
        );

      case 'when_color_is':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ColorSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'D')}
            <span>when color is</span>
            {renderColorPill('color', 'RED')}
          </div>
        );

      case 'when_pressed':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ForceSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'F')}
            <span>when</span>
            <select
              value={params.state || 'pressed'}
              onChange={(e) => update('state', e.target.value)}
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
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <DistanceSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'E')}
            <span>when</span>
            <select
              value={params.comparator || 'closer than'}
              onChange={(e) => update('comparator', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="closer than" className="text-slate-900">closer than</option>
              <option value="farther than" className="text-slate-900">farther than</option>
            </select>
            <input
              type="number"
              value={params.value ?? 15}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit || '%'}
              onChange={(e) => update('unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="%" className="text-slate-900">%</option>
              <option value="cm" className="text-slate-900">cm</option>
              <option value="in" className="text-slate-900">in</option>
            </select>
          </div>
        );

      case 'when_tilted_dir':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>when tilted</span>
            <select
              value={params.direction || 'any'}
              onChange={(e) => update('direction', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="any" className="text-slate-900">any</option>
              <option value="front" className="text-slate-900">front</option>
              <option value="back" className="text-slate-900">back</option>
              <option value="left" className="text-slate-900">left</option>
              <option value="right" className="text-slate-900">right</option>
            </select>
          </div>
        );

      case 'when_tilted':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>when</span>
            <select
              value={params.side || 'front'}
              onChange={(e) => update('side', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="front" className="text-slate-900">front</option>
              <option value="back" className="text-slate-900">back</option>
              <option value="top" className="text-slate-900">top</option>
              <option value="bottom" className="text-slate-900">bottom</option>
              <option value="left side" className="text-slate-900">left side</option>
              <option value="right side" className="text-slate-900">right side</option>
            </select>
            <span>is up</span>
          </div>
        );

      case 'when_shaken':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>when</span>
            <select
              value={params.gesture || 'shaken'}
              onChange={(e) => update('gesture', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="shaken" className="text-slate-900">shaken</option>
              <option value="tapped" className="text-slate-900">tapped</option>
              <option value="falling" className="text-slate-900">falling</option>
            </select>
          </div>
        );

      case 'when_hub_button':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>when</span>
            <select
              value={params.button || 'left'}
              onChange={(e) => update('button', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="left" className="text-slate-900">left</option>
              <option value="right" className="text-slate-900">right</option>
            </select>
            <span>Button</span>
            <select
              value={params.action || 'pressed'}
              onChange={(e) => update('action', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="pressed" className="text-slate-900">pressed</option>
              <option value="released" className="text-slate-900">released</option>
            </select>
          </div>
        );

      case 'when_timer_gt':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>when timer &gt;</span>
            <input
              type="number"
              value={params.seconds ?? 10}
              onChange={(e) => update('seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'when_condition':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>when</span>
            {renderBooleanSlot()}
          </div>
        );

      case 'when_i_receive':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>when I receive</span>
            <span className={rectDropdownClass}>{params.message || 'message1'} ▾</span>
          </div>
        );

      case 'broadcast_message':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>broadcast</span>
            <input
              type="text"
              value={params.message || 'message1'}
              onChange={(e) => update('message', e.target.value)}
              className="bg-black/20 text-white font-semibold px-2.5 h-[24px] rounded-full text-[11px] w-20 text-center border border-white/25"
            />
          </div>
        );

      case 'broadcast_and_wait':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>broadcast</span>
            <input
              type="text"
              value={params.message || 'message1'}
              onChange={(e) => update('message', e.target.value)}
              className="bg-black/20 text-white font-semibold px-2.5 h-[24px] rounded-full text-[11px] w-20 text-center border border-white/25"
            />
            <span>and wait</span>
          </div>
        );

      // =====================================================================
      // 6. CONTROL (6.1 -> 6.9)
      // =====================================================================
      case 'wait_seconds':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>wait</span>
            <input
              type="number"
              step="0.2"
              value={params.seconds ?? 1}
              onChange={(e) => update('seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>seconds</span>
          </div>
        );

      case 'repeat_loop_line_follow':
        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
              <span>repeat</span>
              <input
                type="number"
                value={params.times ?? 10}
                onChange={(e) => update('times', Number(e.target.value))}
                className={whiteOvalInputClass}
              />
            </div>
            {renderNestedBranch('children', '↳ Kéo thả khối lệnh cần lặp vào đây')}
          </div>
        );

      case 'forever_loop':
        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
              <span>forever</span>
            </div>
            {renderNestedBranch('children', '↳ Kéo thả khối lệnh lặp mãi mãi vào đây')}
          </div>
        );

      case 'if_then_block':
        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
              <span>if</span>
              {renderBooleanSlot()}
              <span>then</span>
            </div>
            {renderNestedBranch('children', '↳ Kéo khối lệnh thực hiện khi Đúng (then) vào đây')}
          </div>
        );

      case 'if_else_block':
        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
              <span>if</span>
              {renderBooleanSlot()}
              <span>then</span>
            </div>
            {renderNestedBranch('children', '↳ Nhánh Đúng (then): Kéo khối lệnh vào đây')}
            <div className="text-[12px] font-semibold text-white py-0.5">else</div>
            {renderNestedBranch('elseChildren', '↳ Nhánh Sai (else): Kéo khối lệnh vào đây')}
          </div>
        );

      case 'wait_until_sensor':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>wait until</span>
            {renderBooleanSlot()}
          </div>
        );

      case 'repeat_until_block':
        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
              <span>repeat until</span>
              {renderBooleanSlot()}
            </div>
            {renderNestedBranch('children', '↳ Kéo thả khối lệnh lặp cho đến khi < > vào đây')}
          </div>
        );

      case 'stop_other_stacks':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>stop</span>
            <span className={rectDropdownClass}>other stacks ▾</span>
          </div>
        );

      case 'stop_all_cap':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>stop</span>
            <select
              value={params.target || 'all'}
              onChange={(e) => update('target', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="all" className="text-slate-900">all</option>
              <option value="this stack" className="text-slate-900">this stack</option>
              <option value="all and exit program" className="text-slate-900">all and exit program</option>
            </select>
          </div>
        );

      // =====================================================================
      // 7. SENSORS (7.1 -> 7.16)
      // =====================================================================
      case 'sensor_is_color':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ColorSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'D')}
            <span>is color</span>
            {renderColorPill('color', 'RED')}
            <span>?</span>
          </div>
        );

      case 'sensor_color':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ColorSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'D')}
            <span>color</span>
          </div>
        );

      case 'sensor_is_reflection':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ColorSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'D')}
            <span>reflection</span>
            <select
              value={params.comp || '<'}
              onChange={(e) => update('comp', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="<" className="text-slate-900">&lt;</option>
              <option value="=" className="text-slate-900">=</option>
              <option value=">" className="text-slate-900">&gt;</option>
            </select>
            <input
              type="number"
              value={params.value ?? 50}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>% ?</span>
          </div>
        );

      case 'sensor_reflected_light':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ColorSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'D')}
            <span>reflected light</span>
          </div>
        );

      case 'sensor_is_pressed':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ForceSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'F')}
            <span>is</span>
            <select
              value={params.state || 'pressed'}
              onChange={(e) => update('state', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="pressed" className="text-slate-900">pressed</option>
              <option value="hard-pressed" className="text-slate-900">hard-pressed</option>
              <option value="released" className="text-slate-900">released</option>
            </select>
            <span>?</span>
          </div>
        );

      case 'sensor_pressure':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ForceSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'F')}
            <span>pressure in</span>
            <select
              value={params.unit || '%'}
              onChange={(e) => update('unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="%" className="text-slate-900">%</option>
              <option value="newton" className="text-slate-900">newton</option>
            </select>
          </div>
        );

      case 'sensor_is_closer_than':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <DistanceSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'E')}
            <span>is</span>
            <select
              value={params.comp || 'closer than'}
              onChange={(e) => update('comp', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="closer than" className="text-slate-900">closer than</option>
              <option value="farther than" className="text-slate-900">farther than</option>
            </select>
            <input
              type="number"
              value={params.value ?? 15}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <select
              value={params.unit || '%'}
              onChange={(e) => update('unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="%" className="text-slate-900">%</option>
              <option value="cm" className="text-slate-900">cm</option>
              <option value="in" className="text-slate-900">in</option>
            </select>
            <span>?</span>
          </div>
        );

      case 'sensor_distance':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <DistanceSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'E')}
            <span>distance in</span>
            <select
              value={params.unit || '%'}
              onChange={(e) => update('unit', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="%" className="text-slate-900">%</option>
              <option value="cm" className="text-slate-900">cm</option>
              <option value="in" className="text-slate-900">in</option>
            </select>
          </div>
        );

      case 'sensor_is_tilted':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>is tilted</span>
            <select
              value={params.dir || 'any'}
              onChange={(e) => update('dir', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="any" className="text-slate-900">any</option>
              <option value="front" className="text-slate-900">front</option>
              <option value="back" className="text-slate-900">back</option>
              <option value="left" className="text-slate-900">left</option>
              <option value="right" className="text-slate-900">right</option>
            </select>
            <span>?</span>
          </div>
        );

      case 'sensor_is_orientation':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>is</span>
            <select
              value={params.side || 'front'}
              onChange={(e) => update('side', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="front" className="text-slate-900">front</option>
              <option value="back" className="text-slate-900">back</option>
              <option value="top" className="text-slate-900">top</option>
              <option value="bottom" className="text-slate-900">bottom</option>
            </select>
            <span>up ?</span>
          </div>
        );

      case 'sensor_is_shaken':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>is</span>
            <select
              value={params.gesture || 'shaken'}
              onChange={(e) => update('gesture', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="shaken" className="text-slate-900">shaken</option>
              <option value="tapped" className="text-slate-900">tapped</option>
              <option value="falling" className="text-slate-900">falling</option>
            </select>
            <span>?</span>
          </div>
        );

      case 'sensor_angle':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <select
              value={params.axis || 'pitch'}
              onChange={(e) => update('axis', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="pitch" className="text-slate-900">pitch</option>
              <option value="roll" className="text-slate-900">roll</option>
              <option value="yaw" className="text-slate-900">yaw</option>
            </select>
            <span>angle</span>
          </div>
        );

      case 'set_yaw_angle_to_0':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set yaw angle to 0</span>
          </div>
        );

      case 'sensor_is_button':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>is</span>
            <select
              value={params.button || 'left'}
              onChange={(e) => update('button', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="left" className="text-slate-900">left</option>
              <option value="right" className="text-slate-900">right</option>
            </select>
            <span>Button</span>
            <select
              value={params.state || 'pressed'}
              onChange={(e) => update('state', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="pressed" className="text-slate-900">pressed</option>
              <option value="released" className="text-slate-900">released</option>
            </select>
            <span>?</span>
          </div>
        );

      case 'sensor_timer':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap px-1">
            <span>timer</span>
          </div>
        );

      case 'reset_timer':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>reset timer</span>
          </div>
        );

      // =====================================================================
      // 8. OPERATORS (ĐỦ 19 KHỐI GIỐNG HỆT ẢNH CHỤP SPIKE PRIME)
      // =====================================================================
      case 'op_random':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>pick random</span>
            <input
              type="number"
              value={params.from ?? 1}
              onChange={(e) => update('from', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>to</span>
            <input
              type="number"
              value={params.to ?? 10}
              onChange={(e) => update('to', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'op_add':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
            <span>+</span>
            <input
              type="text"
              value={params.b ?? ''}
              onChange={(e) => update('b', e.target.value)}
              className={emptyWhiteOvalClass}
            />
          </div>
        );

      case 'op_subtract':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
            <span>-</span>
            <input
              type="text"
              value={params.b ?? ''}
              onChange={(e) => update('b', e.target.value)}
              className={emptyWhiteOvalClass}
            />
          </div>
        );

      case 'op_multiply':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
            <span>*</span>
            <input
              type="text"
              value={params.b ?? ''}
              onChange={(e) => update('b', e.target.value)}
              className={emptyWhiteOvalClass}
            />
          </div>
        );

      case 'op_divide':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
            <span>/</span>
            <input
              type="text"
              value={params.b ?? ''}
              onChange={(e) => update('b', e.target.value)}
              className={emptyWhiteOvalClass}
            />
          </div>
        );

      case 'op_lt':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
            <span>&lt;</span>
            <input
              type="number"
              value={params.b ?? 100}
              onChange={(e) => update('b', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'op_eq':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
            <span>=</span>
            <input
              type="number"
              value={params.b ?? 100}
              onChange={(e) => update('b', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'op_gt':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
            <span>&gt;</span>
            <input
              type="number"
              value={params.b ?? 100}
              onChange={(e) => update('b', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'op_and':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <span className="spike-boolean-slot bg-[#146c27] w-[38px] h-[24px] inline-block" />
            <span>and</span>
            <span className="spike-boolean-slot bg-[#146c27] w-[38px] h-[24px] inline-block" />
          </div>
        );

      case 'op_or':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <span className="spike-boolean-slot bg-[#146c27] w-[38px] h-[24px] inline-block" />
            <span>or</span>
            <span className="spike-boolean-slot bg-[#146c27] w-[38px] h-[24px] inline-block" />
          </div>
        );

      case 'op_not':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>not</span>
            <span className="spike-boolean-slot bg-[#146c27] w-[38px] h-[24px] inline-block" />
          </div>
        );

      case 'op_between':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>is</span>
            <input
              type="number"
              value={params.val ?? 0}
              onChange={(e) => update('val', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>in between</span>
            <input
              type="number"
              value={params.low ?? -10}
              onChange={(e) => update('low', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>and</span>
            <input
              type="number"
              value={params.high ?? 10}
              onChange={(e) => update('high', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>?</span>
          </div>
        );

      case 'op_join':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>join</span>
            <input
              type="text"
              value={params.s1 ?? 'apple'}
              onChange={(e) => update('s1', e.target.value)}
              className={textWhiteOvalClass}
            />
            <input
              type="text"
              value={params.s2 ?? 'banana'}
              onChange={(e) => update('s2', e.target.value)}
              className={textWhiteOvalClass}
            />
          </div>
        );

      case 'op_letter_of':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>letter</span>
            <input
              type="number"
              value={params.index ?? 1}
              onChange={(e) => update('index', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>of</span>
            <input
              type="text"
              value={params.text ?? 'apple'}
              onChange={(e) => update('text', e.target.value)}
              className={textWhiteOvalClass}
            />
          </div>
        );

      case 'op_length_of':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>length of</span>
            <input
              type="text"
              value={params.text ?? 'apple'}
              onChange={(e) => update('text', e.target.value)}
              className={textWhiteOvalClass}
            />
          </div>
        );

      case 'op_contains':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.text ?? 'apple'}
              onChange={(e) => update('text', e.target.value)}
              className={textWhiteOvalClass}
            />
            <span>contains</span>
            <input
              type="text"
              value={params.sub ?? 'a'}
              onChange={(e) => update('sub', e.target.value)}
              className={whiteOvalInputClass}
            />
            <span>?</span>
          </div>
        );

      case 'op_mod':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
            <span>mod</span>
            <input
              type="text"
              value={params.b ?? ''}
              onChange={(e) => update('b', e.target.value)}
              className={emptyWhiteOvalClass}
            />
          </div>
        );

      case 'op_round':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>round</span>
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
          </div>
        );

      case 'op_math_func':
        return (
          <div className="flex items-center gap-2 font-semibold text-white text-[12px] whitespace-nowrap">
            <select
              value={params.func || 'abs'}
              onChange={(e) => update('func', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="abs" className="text-slate-900">abs</option>
              <option value="floor" className="text-slate-900">floor</option>
              <option value="ceiling" className="text-slate-900">ceiling</option>
              <option value="sqrt" className="text-slate-900">sqrt</option>
              <option value="sin" className="text-slate-900">sin</option>
              <option value="cos" className="text-slate-900">cos</option>
              <option value="tan" className="text-slate-900">tan</option>
              <option value="asin" className="text-slate-900">asin</option>
              <option value="acos" className="text-slate-900">acos</option>
              <option value="atan" className="text-slate-900">atan</option>
              <option value="ln" className="text-slate-900">ln</option>
              <option value="log" className="text-slate-900">log</option>
              <option value="e ^" className="text-slate-900">e ^</option>
              <option value="10 ^" className="text-slate-900">10 ^</option>
            </select>
            <span>of</span>
            <input
              type="text"
              value={params.a ?? ''}
              onChange={(e) => update('a', e.target.value)}
              className={emptyWhiteOvalClass}
            />
          </div>
        );

      // =====================================================================
      // 9. VARIABLES & LISTS (9.1 -> 9.13)
      // =====================================================================
      case 'var_reporter':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap px-1">
            <span>{params.varName || 'V'}</span>
          </div>
        );

      case 'set_variable_to':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>set</span>
            <span className={rectDropdownClass}>{params.varName || 'V'} ▾</span>
            <span>to</span>
            <input
              type="number"
              value={params.value ?? 0}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'change_variable_by':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>change</span>
            <span className={rectDropdownClass}>{params.varName || 'V'} ▾</span>
            <span>by</span>
            <input
              type="number"
              value={params.delta ?? 1}
              onChange={(e) => update('delta', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'list_reporter':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap px-1">
            <span>{params.listName || 'L'}</span>
          </div>
        );

      case 'add_item_to_list':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>add</span>
            <input
              type="text"
              value={params.item || 'thing'}
              onChange={(e) => update('item', e.target.value)}
              className={textWhiteOvalClass}
            />
            <span>to</span>
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
          </div>
        );

      case 'delete_of_list':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>delete</span>
            <input
              type="number"
              value={params.index ?? 1}
              onChange={(e) => update('index', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>of</span>
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
          </div>
        );

      case 'delete_all_of_list':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>delete all of</span>
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
          </div>
        );

      case 'insert_at_list':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>insert</span>
            <input
              type="text"
              value={params.item || 'thing'}
              onChange={(e) => update('item', e.target.value)}
              className={textWhiteOvalClass}
            />
            <span>at</span>
            <input
              type="number"
              value={params.index ?? 1}
              onChange={(e) => update('index', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>of</span>
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
          </div>
        );

      case 'replace_item_list':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>replace item</span>
            <input
              type="number"
              value={params.index ?? 1}
              onChange={(e) => update('index', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>of</span>
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
            <span>with</span>
            <input
              type="text"
              value={params.item || 'thing'}
              onChange={(e) => update('item', e.target.value)}
              className={textWhiteOvalClass}
            />
          </div>
        );

      case 'item_of_list':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>item</span>
            <input
              type="number"
              value={params.index ?? 1}
              onChange={(e) => update('index', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>of</span>
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
          </div>
        );

      case 'item_num_of_list':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>item # of</span>
            <input
              type="text"
              value={params.item || 'thing'}
              onChange={(e) => update('item', e.target.value)}
              className={textWhiteOvalClass}
            />
            <span>in</span>
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
          </div>
        );

      case 'length_of_list':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>length of</span>
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
          </div>
        );

      case 'list_contains':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span className={rectDropdownClass}>{params.listName || 'L'} ▾</span>
            <span>contains</span>
            <input
              type="text"
              value={params.item || 'thing'}
              onChange={(e) => update('item', e.target.value)}
              className={textWhiteOvalClass}
            />
            <span>?</span>
          </div>
        );

      // =====================================================================
      // 10. MY BLOCKS & 11-17 EXTENSIONS
      // =====================================================================
      case 'define_my_block':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>define</span>
            <span className="bg-black/20 px-2.5 py-0.5 rounded-md border border-white/30">
              {params.blockName || 'GrabCargo'}
            </span>
          </div>
        );

      case 'call_my_block':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>{params.blockName || 'GrabCargo'}</span>
          </div>
        );

      case 'more_motor_go_relative':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'C')}
            <span>go to relative position</span>
            <input
              type="number"
              value={params.position ?? 90}
              onChange={(e) => update('position', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>at</span>
            <input
              type="number"
              value={params.speed ?? 80}
              onChange={(e) => update('speed', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>% speed</span>
          </div>
        );

      case 'more_motor_reset_relative':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'C')}
            <span>set relative position to</span>
            <input
              type="number"
              value={params.value ?? 0}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'more_motor_relative_pos':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>relative position</span>
          </div>
        );

      case 'more_motor_start_power':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'C')}
            <span>start motor at</span>
            <input
              type="number"
              value={params.power ?? 100}
              onChange={(e) => update('power', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>% power</span>
          </div>
        );

      case 'more_motor_power':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'A')}
            <span>power</span>
          </div>
        );

      case 'motor_set_stop_mode':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'C')}
            <span>set motors to</span>
            <select
              value={params.mode || 'hold position'}
              onChange={(e) => update('mode', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="brake" className="text-slate-900">brake</option>
              <option value="hold position" className="text-slate-900">hold position</option>
              <option value="coast" className="text-slate-900">coast</option>
            </select>
            <span>at stop</span>
          </div>
        );

      case 'motor_set_acceleration':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'C')}
            <span>set acceleration to</span>
            <span className={portPillClass}>{params.accel || 'medium'} ▾</span>
          </div>
        );

      case 'more_movement_tank':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>start moving at</span>
            <input
              type="number"
              value={params.leftSpeed ?? 50}
              onChange={(e) => update('leftSpeed', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <input
              type="number"
              value={params.rightSpeed ?? 50}
              onChange={(e) => update('rightSpeed', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>% speed</span>
          </div>
        );

      case 'more_movement_stop_mode':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set movement motors to</span>
            <span className={rectDropdownClass}>{params.mode || 'brake'} ▾</span>
            <span>at stop</span>
          </div>
        );

      case 'more_movement_accel':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <SpikeWheelBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set movement acceleration to</span>
            <span className={portPillClass}>{params.accel || 'medium'} ▾</span>
          </div>
        );

      case 'more_sensor_raw_color':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <ColorSensorBadge />
            <span className="h-4 border-r border-black/15" />
            {renderPortSelect('port', 'D')}
            <span>raw</span>
            <select
              value={params.channel || 'red'}
              onChange={(e) => update('channel', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="red" className="text-slate-900">red</option>
              <option value="green" className="text-slate-900">green</option>
              <option value="blue" className="text-slate-900">blue</option>
            </select>
          </div>
        );

      case 'more_sensor_accel':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>acceleration</span>
            <select
              value={params.axis || 'x'}
              onChange={(e) => update('axis', e.target.value)}
              className={rectDropdownClass}
            >
              <option value="x" className="text-slate-900">x</option>
              <option value="y" className="text-slate-900">y</option>
              <option value="z" className="text-slate-900">z</option>
            </select>
          </div>
        );

      case 'more_sensor_set_orientation':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <HubDeviceBadge />
            <span className="h-4 border-r border-black/15" />
            <span>set sensor orientation to</span>
            <span className={rectDropdownClass}>{params.side || 'front'} ▾</span>
          </div>
        );

      case 'music_play_drum':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>play drum</span>
            <span className={portPillClass}>{params.drum || '(1) Snare Drum'} ▾</span>
            <span>for</span>
            <input
              type="number"
              step="0.25"
              value={params.beats ?? 0.25}
              onChange={(e) => update('beats', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>beats</span>
          </div>
        );

      case 'music_play_note':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>play note</span>
            <input
              type="number"
              value={params.note ?? 60}
              onChange={(e) => update('note', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>for</span>
            <input
              type="number"
              step="0.25"
              value={params.beats ?? 0.25}
              onChange={(e) => update('beats', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>beats</span>
          </div>
        );

      case 'line_graph_plot':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>plot</span>
            <input
              type="number"
              value={params.value ?? 50}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>to</span>
            <span className="bg-blue-600 px-2 py-0.5 rounded-full border border-white text-[11px]">
              {params.color || 'blue'} ▾
            </span>
            <span>line</span>
          </div>
        );

      case 'bar_graph_set':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>set</span>
            <span className="bg-blue-600 px-2 py-0.5 rounded-full border border-white text-[11px]">
              {params.color || 'blue'} ▾
            </span>
            <span>bar value to</span>
            <input
              type="number"
              value={params.value ?? 10}
              onChange={(e) => update('value', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
          </div>
        );

      case 'display_write':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>write</span>
            <input
              type="text"
              value={params.text ?? 'Hello'}
              onChange={(e) => update('text', e.target.value)}
              className={textWhiteOvalClass}
            />
            <span>for</span>
            <input
              type="number"
              value={params.seconds ?? 2}
              onChange={(e) => update('seconds', Number(e.target.value))}
              className={whiteOvalInputClass}
            />
            <span>seconds</span>
          </div>
        );

      case 'weather_set_location':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>set location to</span>
            <input
              type="text"
              value={params.city || 'Billund'}
              onChange={(e) => update('city', e.target.value)}
              className={textWhiteOvalClass}
            />
          </div>
        );

      case 'weather_temperature':
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white text-[12px] whitespace-nowrap">
            <span>temperature in</span>
            <span className={rectDropdownClass}>{params.unit || '°C'} ▾</span>
          </div>
        );

      default:
        return <span>{def.nameEn}</span>;
    }
  };

  return (
    <div
      data-block-id={!isPalette && !isEmbeddedBoolean ? id : undefined}
      data-parent-id={!isPalette && !isEmbeddedBoolean ? parentId : undefined}
      data-parent-branch={!isPalette && !isEmbeddedBoolean ? parentBranch : undefined}
      data-canvas-block-index={!isPalette && !isEmbeddedBoolean ? index : undefined}
      onMouseEnter={() => onHover && onHover(def)}
      onPointerDown={handlePointerDown}
      className={`${shapeClass} ${
        isEmbeddedBoolean ? 'px-2.5 py-0.5' : 'px-3.5 py-1.5'
      } text-white select-none transition-transform border border-black/20 w-fit max-w-full group ${
        isPalette
          ? 'cursor-grab active:cursor-grabbing hover:brightness-105'
          : isEmbeddedBoolean
          ? 'cursor-default shadow-sm'
          : 'cursor-grab active:cursor-grabbing shadow-md'
      } ${isCurrent ? 'ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.9)] z-20 brightness-110 scale-[1.01]' : ''} ${
        isDragging ? 'opacity-35 scale-95 ring-2 ring-dashed ring-white' : ''
      }`}
      style={{ backgroundColor: def.color, touchAction: 'none' }}
    >
      <div className="flex items-start justify-between gap-2">
        {renderContent()}

        {/* Nút Nhân bản (Duplicate) & Xóa nhanh khi di chuột lên khối trong Canvas */}
        {!isPalette && !isEmbeddedBoolean && (
          <div className="flex items-center gap-0.5 ml-1.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate && onDuplicate(id);
              }}
              title="Nhân bản khối lệnh (Duplicate)"
              className="p-1 rounded hover:bg-black/25"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove && onRemove(id);
              }}
              title="Xóa khối lệnh (Hoặc kéo thả về cột bên trái để xóa)"
              className="p-1 rounded hover:bg-rose-600"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
