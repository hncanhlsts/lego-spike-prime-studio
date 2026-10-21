import React, { useState } from 'react';
import {
  Cpu,
  Wrench,
  Volume2,
  Compass,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Eye,
  Gauge,
  Radar,
  Hand
} from 'lucide-react';
import { SPIKE_DEVICES, BUILDING_PARTS, BUILD_STEPS } from '../data/spikeData';

const COLOR_SWATCHES = [
  { id: 0, name: 'BLACK', label: '(0) Đen - Black', hex: '#1e293b', reflection: 12 },
  { id: 1, name: 'VIOLET', label: '(1) Tím - Violet', hex: '#7c3aed', reflection: 35 },
  { id: 3, name: 'BLUE', label: '(3) Xanh dương - Blue', hex: '#2563eb', reflection: 42 },
  { id: 6, name: 'GREEN', label: '(6) Xanh lá - Green', hex: '#16a34a', reflection: 52 },
  { id: 7, name: 'YELLOW', label: '(7) Vàng - Yellow', hex: '#eab308', reflection: 85 },
  { id: 9, name: 'RED', label: '(9) Đỏ - Red', hex: '#dc2626', reflection: 65 },
  { id: 10, name: 'WHITE', label: '(10) Trắng - White', hex: '#f8fafc', reflection: 98 }
];

export default function RobotInterfacePanel({
  ports,
  onChangePortDevice,
  ledMatrix,
  onTogglePixel,
  telemetry,
  onUpdateManualSensor,
  activeSubTab,
  setActiveSubTab,
  buildStepIndex,
  setBuildStepIndex,
  onTriggerHubEvent
}) {
  const [selectedPort, setSelectedPort] = useState('A');
  const [showAnatomyLabels, setShowAnatomyLabels] = useState(true);

  const renderPortCard = (portKey, side) => {
    const deviceId = ports[portKey];
    const deviceKey =
      Object.keys(SPIKE_DEVICES).find((k) => SPIKE_DEVICES[k].id === deviceId) || 'NONE';
    const device = SPIKE_DEVICES[deviceKey];
    const isSelected = selectedPort === portKey;

    const motorDeg = Math.round(((telemetry.motors[portKey]?.angle || 0) % 360 + 360) % 360);
    const motorSpd = Math.round(telemetry.motors[portKey]?.speed || 0);

    return (
      <div
        key={portKey}
        onClick={() => setSelectedPort(portKey)}
        className={`cursor-pointer rounded-xl p-2 border transition-all relative ${
          isSelected
            ? 'bg-slate-800/95 border-yellow-400 shadow-[0_0_12px_rgba(255,213,0,0.25)]'
            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Hàng trên: Ký hiệu Cổng A-F + Đồng hồ đo trực quan */}
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black text-white shadow-sm shrink-0"
              style={{ backgroundColor: device.id === 'none' ? '#475569' : device.color }}
            >
              {portKey}
            </span>
            <span className="text-[11px] font-bold text-slate-200 truncate">
              {device.shortName}
            </span>
          </div>

          {/* Đồ họa linh kiện thu nhỏ & Giá trị Realtime */}
          {(device.id === 'medium_motor' || device.id === 'large_motor') && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-blue-500/30">
              {/* Vòng tròn hiển thị kim chỉ góc động cơ 0-359° */}
              <div className="relative w-4 h-4 rounded-full border border-blue-400 flex items-center justify-center">
                <div
                  className="w-0.5 h-2 bg-yellow-400 origin-bottom"
                  style={{ transform: `rotate(${motorDeg}deg) translateY(-2px)` }}
                />
              </div>
              <span className="text-[11px] font-mono font-extrabold text-blue-300">
                {motorDeg}° | {motorSpd}%
              </span>
            </div>
          )}

          {device.id === 'color_sensor' && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-cyan-500/30">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white"
                style={{
                  backgroundColor:
                    COLOR_SWATCHES.find((s) => s.name === telemetry.colorSensor.color)?.hex ||
                    '#1e293b'
                }}
              />
              <span className="text-[11px] font-mono font-extrabold text-cyan-300">
                {telemetry.colorSensor.color} ({telemetry.colorSensor.reflection}%)
              </span>
            </div>
          )}

          {device.id === 'distance_sensor' && (
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-cyan-500/30">
              <span className="text-[10px] text-yellow-300 font-bold">◉◉</span>
              <span className="text-[11px] font-mono font-extrabold text-cyan-300">
                {Math.round(telemetry.distanceSensor.cm)} cm
              </span>
            </div>
          )}

          {device.id === 'force_sensor' && (
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-cyan-500/30">
              <span className="text-[11px] font-mono font-extrabold text-pink-400">
                {telemetry.forceSensor.pressed
                  ? `PRESSED (${telemetry.forceSensor.newton}N)`
                  : '0 N'}
              </span>
            </div>
          )}
        </div>

        {/* Hàng dưới: Chọn loại thiết bị gắn vào cổng */}
        <select
          value={device.id}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChangePortDevice(portKey, e.target.value)}
          className="w-full bg-slate-950 text-slate-300 text-[11px] rounded-md px-2 py-0.5 border border-slate-800 focus:outline-none focus:border-yellow-400"
        >
          {Object.values(SPIKE_DEVICES).map((d) => (
            <option key={d.id} value={d.id}>
              Port {portKey}: {d.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const currentStep = BUILD_STEPS[buildStepIndex] || BUILD_STEPS[0];

  const centerLightColorHex =
    telemetry.centerButtonColor === 'RED'
      ? '#ef4444'
      : telemetry.centerButtonColor === 'BLUE'
      ? '#3b82f6'
      : telemetry.centerButtonColor === 'YELLOW'
      ? '#eab308'
      : telemetry.centerButtonColor === 'MAGENTA'
      ? '#e879f9'
      : '#22c55e';

  return (
    <div className="flex flex-col h-full bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden">
      {/* HEADER KHU VỰC 1: GIAO DIỆN ROBOT & PHẦN CỨNG */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-yellow-400 text-slate-950 font-black text-[11px]">
            KHU VỰC 1
          </span>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">
            Giao Diện Robot & Cấu Tạo Phần Cứng (SPIKE™ Hub Dashboard)
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAnatomyLabels((v) => !v)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition ${
              showAnatomyLabels
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Eye className="w-3 h-3 inline mr-1" />
            Nhãn chú thích cho HS
          </button>

          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveSubTab('hub')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
                activeSubTab === 'hub'
                  ? 'bg-yellow-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Hub & Ports A-F
            </button>
            <button
              onClick={() => setActiveSubTab('builder')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition ${
                activeSubTab === 'builder'
                  ? 'bg-pink-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Lắp Ráp Robot
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'hub' ? (
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
          {/* SƠ ĐỒ BỘ NÃO LEGO SPIKE PRIME HUB + 6 CỔNG KẾT NỐI A-F TRỰC QUAN */}
          <div className="grid grid-cols-12 gap-2.5 items-center">
            {/* Cột Trái: Cổng A, C, E */}
            <div className="col-span-4 space-y-1.5">
              {showAnatomyLabels && (
                <div className="text-[10px] font-extrabold text-cyan-400 uppercase px-1">
                  ◀ Cổng Trái (Left Ports A, C, E)
                </div>
              )}
              {['A', 'C', 'E'].map((p) => renderPortCard(p, 'left'))}
            </div>

            {/* Chính giữa: Bộ não SPIKE Prime Hub với chú thích các bộ phận rõ ràng cho Học sinh */}
            <div className="col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[215px] bg-gradient-to-b from-yellow-400 via-yellow-400 to-amber-500 p-2 rounded-2xl shadow-xl border-2 border-yellow-200 relative">
                <div className="bg-slate-100 rounded-xl p-2 shadow-inner flex flex-col items-center">
                  {/* Dòng trạng thái Bluetooth + Orientation trên mặt Hub */}
                  <div className="flex items-center justify-between w-full text-[9px] font-extrabold text-slate-600 mb-1 px-1">
                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                      Hub: {telemetry.hubOrientation || 'top'}
                    </span>
                    <span className="text-blue-600 font-black">ᛒ BLE</span>
                  </div>

                  {/* Chú thích Ma trận đèn 5x5 */}
                  {showAnatomyLabels && (
                    <div className="text-[9px] font-extrabold text-purple-700 mb-0.5">
                      5x5 Light Matrix (Nhấn để bật/tắt pixel)
                    </div>
                  )}

                  {/* Màn hình Ma trận đèn 5x5 (25 bóng LED) */}
                  <div className="grid grid-cols-5 gap-1 bg-slate-900 p-2 rounded-xl border-2 border-slate-700 shadow-inner">
                    {ledMatrix.map((row, rIdx) =>
                      row.map((val, cIdx) => (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          onClick={() => onTogglePixel(rIdx, cIdx)}
                          title={`Pixel (${cIdx + 1}, ${rIdx + 1}) = ${val > 0 ? '100%' : '0%'}`}
                          className={`w-4 h-4 rounded-[2px] transition-all ${
                            val > 0
                              ? 'bg-amber-300 shadow-[0_0_8px_#fde047] scale-105'
                              : 'bg-slate-800 hover:bg-slate-700'
                          }`}
                        />
                      ))
                    )}
                  </div>

                  {/* Hàng nút vật lý trên mặt Hub: Left Button - Center Power Button RGB - Right Button */}
                  <div className="flex items-center justify-center gap-2.5 mt-2 w-full">
                    <button
                      onClick={() => onTriggerHubEvent && onTriggerHubEvent('left_button')}
                      title="Left Button (Mục 5.8 / 7.14: when left button pressed)"
                      className="px-2 py-1 rounded-md bg-slate-300 hover:bg-slate-400 border border-slate-400 text-[9px] font-extrabold text-slate-800 active:scale-95"
                    >
                      ◀ Left
                    </button>

                    <button
                      onClick={() => onTriggerHubEvent && onTriggerHubEvent('center_button')}
                      title="Center Power Button Light (Mục 3.16: set Power Button light)"
                      className="w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all shadow-md"
                      style={{
                        borderColor: centerLightColorHex,
                        boxShadow: `0 0 10px ${centerLightColorHex}`
                      }}
                    >
                      <Volume2
                        className={`w-3.5 h-3.5 ${
                          telemetry.hubSoundPlaying ? 'text-pink-600 animate-bounce' : 'text-slate-700'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => onTriggerHubEvent && onTriggerHubEvent('right_button')}
                      title="Right Button (Mục 5.8 / 7.14: when right button pressed)"
                      className="px-2 py-1 rounded-md bg-slate-300 hover:bg-slate-400 border border-slate-400 text-[9px] font-extrabold text-slate-800 active:scale-95"
                    >
                      Right ▶
                    </button>
                  </div>

                  {showAnatomyLabels && (
                    <div className="text-[9px] text-slate-600 font-semibold mt-1 text-center">
                      Left / Center (Power RGB) / Right Buttons
                    </div>
                  )}
                </div>
              </div>

              {/* Cụm thông số Cảm biến Con quay 6 trục (Pitch / Roll / Yaw) & Timer */}
              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
                <span className="bg-slate-950 px-2 py-0.5 rounded-full border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                  Yaw: {Math.round(telemetry.gyroYaw)}°
                </span>
                <span className="bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-300 font-mono">
                  Pitch: {Math.round(telemetry.gyroPitch || 0)}°
                </span>
                <span className="bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-300 font-mono">
                  Roll: {Math.round(telemetry.gyroRoll || 0)}°
                </span>
              </div>
            </div>

            {/* Cột Phải: Cổng B, D, F */}
            <div className="col-span-4 space-y-1.5">
              {showAnatomyLabels && (
                <div className="text-[10px] font-extrabold text-cyan-400 uppercase px-1 text-right">
                  Cổng Phải (Right Ports B, D, F) ▶
                </div>
              )}
              {['B', 'D', 'F'].map((p) => renderPortCard(p, 'right'))}
            </div>
          </div>

          {/* BẢNG ĐIỀU KHIỂN THỬ NGHIỆM CẢM BIẾN TRỰC QUAN CHO HỌC SINH */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-extrabold text-cyan-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                BẢNG TƯƠNG TÁC CẢM BIẾN (Học sinh tự chỉnh để kiểm tra các khối Sensor Blocks Mục 7):
              </span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <button
                  onClick={() => onUpdateManualSensor('gesture', 'shaken')}
                  className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold"
                >
                  👋 Lắc Hub (shaken)
                </button>
                <button
                  onClick={() => onUpdateManualSensor('gesture', 'tapped')}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold"
                >
                  👆 Gõ nhẹ (tapped)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* 1. Cảm biến Màu sắc (Port D) */}
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
                  <span>Color Sensor (D):</span>
                  <span className="font-mono text-cyan-300">
                    reflection = {telemetry.colorSensor.reflection}%
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {COLOR_SWATCHES.map((sw) => (
                    <button
                      key={sw.name}
                      onClick={() =>
                        onUpdateManualSensor('color', {
                          color: sw.name,
                          reflection: sw.reflection
                        })
                      }
                      title={sw.label}
                      className={`w-5 h-5 rounded-full border transition ${
                        telemetry.colorSensor.color === sw.name
                          ? 'ring-2 ring-yellow-400 scale-110'
                          : 'border-slate-600'
                      }`}
                      style={{ backgroundColor: sw.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Cảm biến Khoảng cách (Port E) */}
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
                  <span>Distance Sensor (E):</span>
                  <span className="font-mono text-cyan-300">
                    {Math.round(telemetry.distanceSensor.cm)} cm (
                    {Math.round(telemetry.distanceSensor.cm / 2)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="200"
                  value={Math.round(telemetry.distanceSensor.cm)}
                  onChange={(e) =>
                    onUpdateManualSensor('distance', { cm: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-1"
                />
              </div>

              {/* 3. Cảm biến Lực (Port F) */}
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex flex-col justify-between">
                <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                  <span>Force Sensor (F):</span>
                  <span className="font-mono text-pink-400">
                    {telemetry.forceSensor.newton} N ({telemetry.forceSensor.newton * 10}%)
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <button
                    onClick={() =>
                      onUpdateManualSensor('force', {
                        pressed: true,
                        newton: 4
                      })
                    }
                    className={`flex-1 py-0.5 rounded text-[10px] font-bold ${
                      telemetry.forceSensor.pressed && telemetry.forceSensor.newton <= 5
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    pressed (4N)
                  </button>
                  <button
                    onClick={() =>
                      onUpdateManualSensor('force', {
                        pressed: true,
                        newton: 9
                      })
                    }
                    className={`flex-1 py-0.5 rounded text-[10px] font-bold ${
                      telemetry.forceSensor.newton > 5
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    hard (9N)
                  </button>
                  <button
                    onClick={() =>
                      onUpdateManualSensor('force', {
                        pressed: false,
                        newton: 0
                      })
                    }
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 hover:text-white"
                  >
                    0N
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB LẮP RÁP ROBOT SÁNG TẠO (BỘ CHUẨN 45678 + BỘ MỞ RỘNG 45681) */
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div className="bg-slate-950 border border-pink-500/40 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold text-pink-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                HƯỚNG DẪN LẮP RÁP ROBOT TỪNG BƯỚC ({buildStepIndex + 1}/{BUILD_STEPS.length})
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBuildStepIndex((i) => Math.max(0, i - 1))}
                  disabled={buildStepIndex === 0}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setBuildStepIndex((i) => Math.min(BUILD_STEPS.length - 1, i + 1))
                  }
                  disabled={buildStepIndex === BUILD_STEPS.length - 1}
                  className="p-1 rounded bg-pink-600 hover:bg-pink-500 text-white disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-xs font-extrabold text-white mb-1">{currentStep.title}</h3>
            <p className="text-[11px] text-slate-300 mb-2">{currentStep.instruction}</p>
            <div className="flex flex-wrap gap-1.5">
              {currentStep.parts.map((pt, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] bg-slate-900 text-yellow-300 px-2 py-0.5 rounded-full border border-slate-700"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {pt}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {BUILDING_PARTS.map((part) => (
              <div
                key={part.id}
                className="bg-slate-950/90 border border-slate-800 rounded-xl p-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-extrabold text-white">{part.name}</span>
                  <span
                    className="text-[9px] font-black px-1.5 py-0.5 rounded text-slate-950"
                    style={{ backgroundColor: part.color }}
                  >
                    {part.set}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mb-1">{part.role}</p>
                <p className="text-[10px] text-emerald-400">💡 {part.tips}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
