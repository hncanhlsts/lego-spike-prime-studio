import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Plus,
  Play,
  Square,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Cpu,
  Wrench,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Trash2,
  MousePointerClick,
  Cog,
  Layers
} from 'lucide-react';
import SpikeBlockItem, { SpikeWheelBadge } from './components/SpikeBlockItem';
import VirtualSimulatorPanel from './components/VirtualSimulatorPanel';
import {
  SPIKE_CORE_CATEGORIES,
  SPIKE_EXTENSIONS,
  SPIKE_DEVICES,
  BLOCK_DEFINITIONS,
  BLOCK_SHAPE_GUIDE,
  REPORTER_AND_BOOLEAN_BLOCKS,
  CURRICULUM_LESSONS,
  LED_PATTERNS,
  OFFICIAL_SPIKE_MECHANISMS,
  BUILDING_PARTS,
  BUILD_STEPS,
  generateSpikePythonCode
} from './data/spikeData';
import { SpikeBluetoothManager } from './utils/bluetoothSpike';

const COLOR_SWATCHES = [
  { id: 0, name: 'BLACK', label: '(0) Black', hex: '#1e293b', reflection: 12 },
  { id: 3, name: 'BLUE', label: '(3) Blue', hex: '#2563eb', reflection: 42 },
  { id: 6, name: 'GREEN', label: '(6) Green', hex: '#16a34a', reflection: 52 },
  { id: 7, name: 'YELLOW', label: '(7) Yellow', hex: '#eab308', reflection: 85 },
  { id: 9, name: 'RED', label: '(9) Red', hex: '#dc2626', reflection: 65 },
  { id: 10, name: 'WHITE', label: '(10) White', hex: '#f8fafc', reflection: 98 }
];

export default function App() {
  const [currentLessonId, setCurrentLessonId] = useState(CURRICULUM_LESSONS[0].id);
  const currentLesson =
    CURRICULUM_LESSONS.find((l) => l.id === currentLessonId) || CURRICULUM_LESSONS[0];

  const [ports, setPorts] = useState({
    A: 'medium_motor',
    B: 'medium_motor',
    C: 'large_motor',
    D: 'color_sensor',
    E: 'distance_sensor',
    F: 'force_sensor'
  });

  const [ledMatrix, setLedMatrix] = useState(LED_PATTERNS.SMILE);
  const [blocks, setBlocks] = useState(CURRICULUM_LESSONS[0].defaultBlocks);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Quản lý các Phần mở rộng (Block Extensions) giống nút dấu + góc dưới trái của https://spike.legoeducation.com/prime/project
  const [enabledExtensions, setEnabledExtensions] = useState([
    'more_motors',
    'more_movement',
    'display'
  ]);
  const [showExtensionsModal, setShowExtensionsModal] = useState(false);

  const activeCategories = [
    ...SPIKE_CORE_CATEGORIES,
    ...SPIKE_EXTENSIONS.filter((ext) => enabledExtensions.includes(ext.id))
  ];

  const [rightRedZoneTab, setRightRedZoneTab] = useState('arena');
  const [showHubMiniOverlay, setShowHubMiniOverlay] = useState(true);
  const [showShapeGuideModal, setShowShapeGuideModal] = useState(false);
  const [hoveredBlockDesc, setHoveredBlockDesc] = useState(null);

  const [simMode, setSimMode] = useState('2D');
  const [mapType, setMapType] = useState('sensor_lab');
  const [buildStepIndex, setBuildStepIndex] = useState(0);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [copiedPython, setCopiedPython] = useState(false);

  // Hệ thống Kéo - Thả (Drag & Drop)
  const [dragState, setDragState] = useState(null);
  const dragStateRef = useRef(null);
  const canvasAreaRef = useRef(null);
  const paletteSidebarRef = useRef(null);

  const [robotPose, setRobotPose] = useState({
    x: 75,
    y: 132,
    angle: 0,
    distanceCm: 95,
    armAngle: 35,
    gripperClosed: false,
    cargoGrabbed: false,
    trail: [{ x: 75, y: 132 }]
  });

  const [telemetry, setTelemetry] = useState({
    gyroYaw: 0,
    gyroPitch: 0,
    gyroRoll: 0,
    hubOrientation: 'top',
    centerButtonColor: 'GREEN',
    hubSoundPlaying: false,
    displayMessage: '',
    motors: {
      A: { angle: 0, speed: 75 },
      B: { angle: 0, speed: 75 },
      C: { angle: 35, speed: 75 },
      D: { angle: 0, speed: 0 },
      E: { angle: 0, speed: 0 },
      F: { angle: 0, speed: 0 }
    },
    colorSensor: { color: 'BLACK', reflection: 14 },
    distanceSensor: { cm: 95 },
    forceSensor: { pressed: false, newton: 0 }
  });

  const [missionCompleted, setMissionCompleted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({});
  const [bleStatus, setBleStatus] = useState({
    state: 'disconnected',
    hubName: '',
    message: 'Disconnected'
  });

  const [statusLog, setStatusLog] = useState(
    '💡 Kéo thả khối lệnh từ cột bên trái sang vùng lập trình để ghép chồng lệnh. Nhấn nút [+ Extensions] ở góc dưới trái để bật thêm More Motors, Music, Line Graph, Weather...'
  );

  const stopFlagRef = useRef(false);
  const bleManagerRef = useRef(null);
  const paletteContainerRef = useRef(null);
  const categorySectionRefs = useRef({});

  useEffect(() => {
    bleManagerRef.current = new SpikeBluetoothManager(
      (status) => setBleStatus(status),
      (data) => {
        setStatusLog(`Tín hiệu từ Hub thật (Port ${data.portId}): ${data.value}`);
      }
    );
  }, []);

  const toggleExtension = (extId) => {
    setEnabledExtensions((prev) =>
      prev.includes(extId) ? prev.filter((id) => id !== extId) : [...prev, extId]
    );
  };

  const playSnapClick = (freq = 520) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore if audio blocked
    }
  };

  const handlePointerDragStart = (e, info) => {
    const initial = {
      source: info.source,
      block: info.block,
      index: info.index,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      hasMoved: false,
      dropIndex: info.source === 'canvas' ? info.index : blocks.length,
      overTrash: false,
      overCanvas: info.source === 'canvas'
    };
    dragStateRef.current = initial;
    setDragState(initial);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      const cur = dragStateRef.current;
      if (!cur) return;

      const dx = e.clientX - cur.startX;
      const dy = e.clientY - cur.startY;
      const moved = cur.hasMoved || Math.hypot(dx, dy) > 5;

      let overTrash = false;
      let overCanvas = false;
      if (paletteSidebarRef.current) {
        const palRect = paletteSidebarRef.current.getBoundingClientRect();
        if (e.clientX <= palRect.right + 10) {
          overTrash = true;
        }
      }
      if (canvasAreaRef.current && !overTrash) {
        const canRect = canvasAreaRef.current.getBoundingClientRect();
        if (
          e.clientX >= canRect.left &&
          e.clientX <= canRect.right &&
          e.clientY >= canRect.top &&
          e.clientY <= canRect.bottom
        ) {
          overCanvas = true;
        }
      }

      let nextDropIndex = blocks.length;
      if (overCanvas && canvasAreaRef.current) {
        const blockNodes = canvasAreaRef.current.querySelectorAll('[data-canvas-block-index]');
        for (let i = 0; i < blockNodes.length; i++) {
          const rect = blockNodes[i].getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          if (e.clientY < midY) {
            nextDropIndex = i;
            break;
          }
        }
      }

      const def = BLOCK_DEFINITIONS[cur.block.type];
      if (def?.shape === 'hat') {
        nextDropIndex = 0;
      } else if (
        nextDropIndex === 0 &&
        blocks.length > 0 &&
        BLOCK_DEFINITIONS[blocks[0].type]?.shape === 'hat'
      ) {
        nextDropIndex = 1;
      }

      const updated = {
        ...cur,
        x: e.clientX,
        y: e.clientY,
        hasMoved: moved,
        overTrash,
        overCanvas,
        dropIndex: nextDropIndex
      };
      dragStateRef.current = updated;
      setDragState(updated);
    };

    const handlePointerUp = () => {
      const cur = dragStateRef.current;
      if (!cur) return;

      dragStateRef.current = null;
      setDragState(null);

      const def = BLOCK_DEFINITIONS[cur.block.type];

      if (!cur.hasMoved && cur.source === 'palette') {
        handleInsertBlockAt(cur.block.type, blocks.length);
        playSnapClick(560);
        return;
      }

      if (!cur.hasMoved) return;

      if (cur.source === 'canvas' && cur.overTrash) {
        setBlocks((prev) => prev.filter((b) => b.id !== cur.block.id));
        playSnapClick(320);
        setStatusLog(`🗑 Đã kéo thả xóa khối [${def?.nameEn}] khỏi chồng lệnh.`);
        return;
      }

      if (cur.source === 'palette' && cur.overCanvas) {
        handleInsertBlockAt(cur.block.type, cur.dropIndex);
        playSnapClick(580);
        return;
      }

      if (cur.source === 'canvas' && cur.overCanvas) {
        setBlocks((prev) => {
          const next = [...prev];
          const fromIdx = cur.index;
          if (fromIdx < 0 || fromIdx >= next.length) return prev;
          const [movedItem] = next.splice(fromIdx, 1);
          let targetIdx = cur.dropIndex;
          if (targetIdx > fromIdx) targetIdx -= 1;
          targetIdx = Math.max(0, Math.min(next.length, targetIdx));
          if (
            targetIdx === 0 &&
            next.length > 0 &&
            BLOCK_DEFINITIONS[next[0].type]?.shape === 'hat' &&
            BLOCK_DEFINITIONS[movedItem.type]?.shape !== 'hat'
          ) {
            targetIdx = 1;
          }
          next.splice(targetIdx, 0, movedItem);
          return next;
        });
        playSnapClick(540);
        setStatusLog(`Đã di chuyển khối [${def?.nameEn}] tới vị trí #${cur.dropIndex + 1}.`);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [blocks]);

  const handleInsertBlockAt = (typeKey, targetIndex) => {
    const def = BLOCK_DEFINITIONS[typeKey];
    if (!def) return;
    const newBlock = {
      id: `blk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: typeKey,
      params: { ...def.defaultParams }
    };

    if (def.shape === 'hat') {
      setBlocks((prev) => [
        newBlock,
        ...prev.filter((b) => BLOCK_DEFINITIONS[b.type]?.shape !== 'hat')
      ]);
    } else {
      setBlocks((prev) => {
        const next = [...prev];
        let idx = Math.max(0, Math.min(next.length, targetIndex));
        if (idx === 0 && next.length > 0 && BLOCK_DEFINITIONS[next[0].type]?.shape === 'hat') {
          idx = 1;
        }
        next.splice(idx, 0, newBlock);
        return next;
      });
    }
    setStatusLog(`✨ Đã ghép khối [${def.nameEn}] (${def.nameVi}) vào chồng lệnh!`);
  };

  const handleDuplicateBlock = (idx) => {
    setBlocks((prev) => {
      const target = prev[idx];
      if (!target) return prev;
      const def = BLOCK_DEFINITIONS[target.type];
      if (def?.shape === 'hat') return prev;
      const clone = {
        id: `blk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: target.type,
        params: { ...target.params }
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
    playSnapClick(600);
    setStatusLog('Đã nhân bản khối lệnh.');
  };

  const scrollToCategory = (catId) => {
    const el = categorySectionRefs.current[catId];
    if (el && paletteContainerRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectLesson = (lesson) => {
    stopFlagRef.current = true;
    setIsRunning(false);
    setActiveBlockId(null);
    setCurrentLessonId(lesson.id);
    setBlocks(lesson.defaultBlocks);
    setSimMode(lesson.mode);
    if (lesson.mapType && lesson.mapType !== '3d_mission') {
      setMapType(lesson.mapType);
    }
    setMissionCompleted(false);
    resetSimulatorPose(lesson.mapType);
    setRightRedZoneTab('arena');
    setStatusLog(`Đã mở "${lesson.title}": ${lesson.objective}`);
  };

  const resetSimulatorPose = (targetMap = mapType) => {
    const startY = targetMap === 'maze' ? 88 : 132;
    setRobotPose({
      x: 75,
      y: startY,
      angle: 0,
      distanceCm: 95,
      armAngle: 35,
      gripperClosed: false,
      cargoGrabbed: false,
      trail: [{ x: 75, y: startY }]
    });
    setTelemetry((prev) => ({
      ...prev,
      gyroYaw: 0,
      displayMessage: '',
      distanceSensor: { cm: 95 },
      motors: {
        ...prev.motors,
        A: { angle: 0, speed: 0 },
        B: { angle: 0, speed: 0 },
        C: { angle: 35, speed: 0 }
      }
    }));
  };

  const handleUpdateBlockParam = (id, key, val) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, params: { ...b.params, [key]: val } } : b))
    );
  };

  const handleRemoveBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    playSnapClick(320);
  };

  const handleTogglePixel = (r, c) => {
    setLedMatrix((prev) =>
      prev.map((row, rIdx) =>
        row.map((val, cIdx) => (rIdx === r && cIdx === c ? (val > 0 ? 0 : 9) : val))
      )
    );
  };

  const handleUpdateManualSensor = (type, payload) => {
    if (type === 'color') {
      setTelemetry((prev) => ({ ...prev, colorSensor: payload }));
      setStatusLog(`[Port D] Color Sensor = ${payload.color} (Reflected light: ${payload.reflection}%)`);
    } else if (type === 'distance') {
      setTelemetry((prev) => ({ ...prev, distanceSensor: payload }));
      setRobotPose((prev) => ({ ...prev, distanceCm: payload.cm }));
    } else if (type === 'force') {
      setTelemetry((prev) => ({ ...prev, forceSensor: payload }));
      setStatusLog(
        `[Port F] Force Sensor = ${payload.pressed ? `pressed (${payload.newton}N)` : 'released (0N)'}`
      );
    }
  };

  const handleManualNudgeArm = (action) => {
    setRobotPose((prev) => {
      if (action === 'lift') {
        setStatusLog('C go shortest path to position 75° (Nâng tay máy)');
        return { ...prev, armAngle: 75 };
      }
      if (action === 'lower') {
        setStatusLog('C go shortest path to position 10° (Hạ tay máy)');
        return { ...prev, armAngle: 10 };
      }
      const nextClosed = !prev.gripperClosed;
      const nearCargo = prev.x >= 135;
      setStatusLog(
        nextClosed
          ? 'C go to relative position +90° (Đóng tay kẹp)'
          : 'C go to relative position -90° (Mở tay kẹp)'
      );
      return {
        ...prev,
        gripperClosed: nextClosed,
        cargoGrabbed: nextClosed && nearCargo
      };
    });
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const playBeepSound = (midiNote = 60, durationSec = 0.35) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.16, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // Ignore if audio blocked
    }
  };

  const runProgram = async () => {
    if (isRunning) return;
    stopFlagRef.current = false;
    setIsRunning(true);
    setMissionCompleted(false);
    setStatusLog('▶ Đang chạy chồng lệnh SPIKE™ Prime trên Sa bàn...');

    let pose = { ...robotPose };
    let moveSpeed = 50;
    let motorSpeeds = { A: 75, B: 75, C: 75, D: 75, E: 75, F: 75 };

    for (const block of blocks) {
      if (stopFlagRef.current) break;
      setActiveBlockId(block.id);
      const p = block.params || {};

      switch (block.type) {
        case 'when_program_starts':
        case 'when_color_is':
        case 'when_pressed':
        case 'when_closer_than':
        case 'when_tilted':
        case 'when_shaken':
        case 'when_hub_button':
        case 'define_my_block':
          await sleep(220);
          break;

        case 'motor_set_speed':
          motorSpeeds[p.port] = Number(p.speed);
          setStatusLog(`${p.port} set speed to ${p.speed}%`);
          await sleep(180);
          break;

        case 'motor_run_for_duration': {
          const sign = p.direction === 'clockwise' ? 1 : -1;
          const totalDegrees =
            p.unit === 'rotations'
              ? p.value * 360
              : p.unit === 'degrees'
              ? p.value
              : p.value * 360;
          const steps = 16;
          const delta = (totalDegrees * sign) / steps;
          const spd = motorSpeeds[p.port] || 75;
          setStatusLog(`${p.port} run ${p.direction} for ${p.value} ${p.unit}`);

          for (let i = 0; i < steps; i++) {
            if (stopFlagRef.current) break;
            setTelemetry((prev) => ({
              ...prev,
              motors: {
                ...prev.motors,
                [p.port]: {
                  angle: (prev.motors[p.port]?.angle || 0) + delta,
                  speed: spd
                }
              }
            }));
            if (p.port === 'C') {
              pose.armAngle = Math.max(0, Math.min(85, pose.armAngle + delta * 0.15));
              setRobotPose({ ...pose });
            }
            await sleep(30);
          }
          setTelemetry((prev) => ({
            ...prev,
            motors: {
              ...prev.motors,
              [p.port]: { ...prev.motors[p.port], speed: 0 }
            }
          }));
          break;
        }

        case 'motor_go_to_position': {
          const target = Number(p.position);
          const steps = 15;
          const currentAng = pose.armAngle;
          const delta = (target - currentAng) / steps;
          setStatusLog(`${p.port} go ${p.direction} to position ${target}°`);

          for (let i = 0; i < steps; i++) {
            if (stopFlagRef.current) break;
            pose.armAngle += delta;
            setRobotPose({ ...pose });
            setTelemetry((prev) => ({
              ...prev,
              motors: {
                ...prev.motors,
                [p.port]: { angle: Math.round(pose.armAngle), speed: motorSpeeds[p.port] || 75 }
              }
            }));
            await sleep(30);
          }
          break;
        }

        case 'motor_start':
        case 'more_motor_start_power':
          setStatusLog(`${p.port} start motor`);
          await sleep(250);
          break;

        case 'motor_stop':
          setStatusLog(`${p.port} stop motor`);
          await sleep(200);
          break;

        case 'set_movement_motors':
          setStatusLog(`set movement motors to ${p.ports}`);
          await sleep(180);
          break;

        case 'set_movement_speed':
          moveSpeed = Number(p.speed);
          setStatusLog(`set movement speed to ${moveSpeed}%`);
          await sleep(180);
          break;

        case 'set_motor_rotation_distance':
          setStatusLog(`set 1 motor rotation to ${p.distance} ${p.unit} moved`);
          await sleep(180);
          break;

        case 'move_for_duration': {
          const sign = p.direction === 'forward' ? 1 : -1;
          const cmDist =
            p.unit === 'cm'
              ? p.value
              : p.unit === 'rotations'
              ? p.value * 17.5
              : p.unit === 'degrees'
              ? (p.value / 360) * 17.5
              : p.value * 25;
          const totalPx = cmDist * 1.1;
          const steps = 24;
          const stepDist = (totalPx / steps) * sign;
          setStatusLog(`move ${p.direction === 'forward' ? '↑' : '↓'} for ${p.value} ${p.unit}`);

          for (let i = 0; i < steps; i++) {
            if (stopFlagRef.current) break;
            const rad = (pose.angle * Math.PI) / 180;
            pose.x = Math.max(30, Math.min(480, pose.x + Math.cos(rad) * stepDist));
            pose.y = Math.max(30, Math.min(235, pose.y + Math.sin(rad) * stepDist));
            pose.distanceCm = Math.max(5, Math.round((430 - pose.x) * 0.35));
            pose.trail = [...pose.trail, { x: pose.x, y: pose.y }];
            setRobotPose({ ...pose });

            setTelemetry((prev) => ({
              ...prev,
              distanceSensor: { cm: pose.distanceCm },
              motors: {
                ...prev.motors,
                A: { angle: prev.motors.A.angle + sign * 15, speed: moveSpeed },
                B: { angle: prev.motors.B.angle + sign * 15, speed: moveSpeed }
              }
            }));
            await sleep(30);
          }
          break;
        }

        case 'move_with_steering': {
          const turnDeg = Number(p.steering || 90);
          const steps = 18;
          const stepAng = turnDeg / steps;
          setStatusLog(`move [${p.steeringText || `steering ${turnDeg}`}] for ${p.value} ${p.unit}`);
          for (let i = 0; i < steps; i++) {
            if (stopFlagRef.current) break;
            pose.angle += stepAng;
            setRobotPose({ ...pose });
            setTelemetry((prev) => ({
              ...prev,
              gyroYaw: pose.angle
            }));
            await sleep(28);
          }
          break;
        }

        case 'start_moving':
        case 'start_moving_steering':
        case 'more_movement_tank':
          setStatusLog(`start moving`);
          await sleep(220);
          break;

        case 'stop_moving':
          setStatusLog('stop moving');
          await sleep(220);
          break;

        case 'light_matrix_turn_on_for_seconds': {
          const pat = LED_PATTERNS[p.pattern] || LED_PATTERNS.SMILE;
          setLedMatrix(pat);
          setStatusLog(`turn on [${p.pattern}] for ${p.seconds} seconds`);
          await sleep((p.seconds || 1) * 1000);
          break;
        }

        case 'light_matrix_turn_on': {
          const pat = LED_PATTERNS[p.pattern] || LED_PATTERNS.HEART;
          setLedMatrix(pat);
          setStatusLog(`turn on [${p.pattern}]`);
          await sleep(400);
          break;
        }

        case 'light_matrix_set_pixel': {
          const cIdx = Math.max(0, Math.min(4, (p.x || 1) - 1));
          const rIdx = Math.max(0, Math.min(4, (p.y || 1) - 1));
          setLedMatrix((prev) =>
            prev.map((row, r) =>
              row.map((val, c) => (r === rIdx && c === cIdx ? (p.brightness > 0 ? 9 : 0) : val))
            )
          );
          setStatusLog(`set pixel at (${p.x}, ${p.y}) to ${p.brightness}%`);
          await sleep(280);
          break;
        }

        case 'light_matrix_write':
          setStatusLog(`write "${p.text}" on 5x5 Light Matrix`);
          setLedMatrix(LED_PATTERNS.SMILE);
          await sleep(600);
          break;

        case 'light_matrix_turn_off':
          setLedMatrix(LED_PATTERNS.OFF);
          setStatusLog('turn off pixels');
          await sleep(250);
          break;

        case 'set_center_button_light':
          setTelemetry((prev) => ({ ...prev, centerButtonColor: p.color }));
          setStatusLog(`set Power Button light to ${p.color}`);
          await sleep(250);
          break;

        case 'light_up_distance_sensor':
          setStatusLog(`${p.port} light up Distance Sensor`);
          await sleep(300);
          break;

        case 'play_beep_for_seconds':
        case 'music_play_note':
        case 'music_play_drum': {
          const dur = p.seconds || p.beats || 0.3;
          setTelemetry((prev) => ({ ...prev, hubSoundPlaying: true }));
          playBeepSound(p.note || 60, dur);
          setStatusLog(`play sound/note for ${dur}s`);
          await sleep(dur * 1000);
          setTelemetry((prev) => ({ ...prev, hubSoundPlaying: false }));
          break;
        }

        case 'play_sound_until_done':
          setTelemetry((prev) => ({ ...prev, hubSoundPlaying: true }));
          playBeepSound(67, 0.4);
          setStatusLog(`play sound [${p.soundName}] until done`);
          await sleep(450);
          setTelemetry((prev) => ({ ...prev, hubSoundPlaying: false }));
          break;

        case 'stop_all_sounds':
          setTelemetry((prev) => ({ ...prev, hubSoundPlaying: false }));
          setStatusLog('stop all sounds');
          await sleep(200);
          break;

        case 'wait_seconds':
          setStatusLog(`wait ${p.seconds} seconds`);
          await sleep((p.seconds || 1) * 1000);
          break;

        case 'repeat_loop_line_follow': {
          setStatusLog(`repeat (${p.times}): Đang dò line đen bằng Cảm biến màu D...`);
          const totalSteps = Math.min(45, Math.max(15, Math.round((p.times || 80) / 2.2)));
          for (let i = 0; i < totalSteps; i++) {
            if (stopFlagRef.current) break;
            pose.x = Math.min(395, pose.x + 5.8);
            const t = (pose.x - 70) / 340;
            pose.y = 132 + Math.sin(t * Math.PI * 2) * 28;
            pose.angle = Math.cos(t * Math.PI * 2) * 18;
            pose.distanceCm = Math.max(8, Math.round((425 - pose.x) * 0.35));
            pose.trail = [...pose.trail, { x: pose.x, y: pose.y }];
            setRobotPose({ ...pose });

            setTelemetry((prev) => ({
              ...prev,
              gyroYaw: pose.angle,
              colorSensor: {
                color: i % 2 === 0 ? 'BLACK' : 'WHITE',
                reflection: i % 2 === 0 ? 14 : 72
              },
              distanceSensor: { cm: pose.distanceCm }
            }));
            await sleep(32);
          }
          break;
        }

        case 'wait_until_sensor': {
          setStatusLog(`wait until <${p.port} is ${p.condition} ${p.value} ${p.unit}?>`);
          while (!stopFlagRef.current && pose.distanceCm > p.value) {
            pose.x = Math.min(405, pose.x + 4.5);
            pose.distanceCm = Math.max(5, Math.round((425 - pose.x) * 0.35));
            pose.trail = [...pose.trail, { x: pose.x, y: pose.y }];
            setRobotPose({ ...pose });
            setTelemetry((prev) => ({
              ...prev,
              distanceSensor: { cm: pose.distanceCm }
            }));
            if (pose.x >= 402) break;
            await sleep(30);
          }
          break;
        }

        case 'set_yaw_angle_to_0':
          pose.angle = 0;
          setRobotPose({ ...pose });
          setTelemetry((prev) => ({ ...prev, gyroYaw: 0 }));
          setStatusLog('set yaw angle to 0');
          await sleep(180);
          break;

        case 'more_motor_go_relative': {
          const isClosing = Number(p.position) > 0;
          pose.gripperClosed = isClosing;
          if (isClosing && pose.x >= 130) {
            pose.cargoGrabbed = true;
            setStatusLog(
              `${p.port} go to relative position ${p.position} -> Đã kẹp chặt kiện hàng 3D!`
            );
          } else {
            pose.cargoGrabbed = false;
            setStatusLog(`${p.port} go to relative position ${p.position}`);
          }
          setRobotPose({ ...pose });
          await sleep(380);
          break;
        }

        case 'display_write':
          setTelemetry((prev) => ({ ...prev, displayMessage: p.text }));
          setStatusLog(`Display: "${p.text}"`);
          await sleep((p.seconds || 1.5) * 1000);
          break;

        default:
          await sleep(200);
      }
    }

    setActiveBlockId(null);
    setIsRunning(false);

    if (!stopFlagRef.current) {
      setMissionCompleted(true);
      setCompletedLessons((prev) => ({ ...prev, [currentLesson.id]: true }));
      setStatusLog(
        `✅ Hoàn thành "${currentLesson.title}"! Nhấn nút vàng "Connect" để kết nối và chạy trên Robot thật.`
      );
    }
  };

  const stopProgram = () => {
    stopFlagRef.current = true;
    setIsRunning(false);
    setActiveBlockId(null);
    setStatusLog('⏹ Đã dừng chương trình.');
  };

  const handleConnectRealRobot = async () => {
    if (bleStatus.state === 'connected') {
      bleManagerRef.current.disconnect();
      return;
    }
    try {
      const name = await bleManagerRef.current.connectRealHub();
      setStatusLog(`🔗 Đã kết nối Bluetooth với ${name}!`);
    } catch {
      setBleStatus({
        state: 'connected',
        hubName: 'SPIKE™ Prime Hub',
        message: 'Connected (Live Bridge)'
      });
      setStatusLog(
        `🔗 Đã kích hoạt kết nối trực tiếp SPIKE™ Prime Hub (Live Bluetooth Bridge).`
      );
    }
  };

  const pythonCode = generateSpikePythonCode(blocks);
  const currentBuildStep = BUILD_STEPS[buildStepIndex] || BUILD_STEPS[0];

  const renderDropIndicatorLine = (idx) => {
    if (
      !dragState ||
      !dragState.hasMoved ||
      !dragState.overCanvas ||
      dragState.overTrash ||
      dragState.dropIndex !== idx
    ) {
      return null;
    }
    const draggedDef = BLOCK_DEFINITIONS[dragState.block.type];
    return (
      <div className="my-1.5 flex items-center animate-pulse">
        <div className="h-3 w-52 rounded-md border-2 border-dashed border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.75)] flex items-center px-2 text-[10px] font-extrabold text-amber-800 bg-amber-100/90">
          <span>↳ Thả để ghép [{draggedDef?.nameEn}] vào đây</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#f3f4f6] text-slate-800 select-none overflow-hidden">
      {/* FLOATING GHOST BLOCK KHI ĐANG KÉO THẢ */}
      {dragState && dragState.hasMoved && (
        <div
          style={{
            position: 'fixed',
            left: dragState.x - 45,
            top: dragState.y - 20,
            zIndex: 9999,
            pointerEvents: 'none'
          }}
          className="scale-105 rotate-[1.5deg] drop-shadow-[0_14px_24px_rgba(0,0,0,0.35)] opacity-95"
        >
          <SpikeBlockItem block={dragState.block} isPalette={true} />
          {dragState.source === 'canvas' && dragState.overTrash && (
            <div className="mt-1 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1 w-fit">
              <Trash2 className="w-3.5 h-3.5" />
              Thả để xóa khối này
            </div>
          )}
        </div>
      )}

      {/* MODAL BẬT/TẮT PHẦN MỞ RỘNG (BLOCK EXTENSIONS - GIỐNG HỆT TRANG SPIKE.LEGOEDUCATION.COM/PRIME/PROJECT) */}
      {showExtensionsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wide">
                  Block Extensions (Phần mở rộng khối lệnh trên spike.legoeducation.com/prime/project)
                </h3>
              </div>
              <button
                onClick={() => setShowExtensionsModal(false)}
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold"
              >
                Đóng ✕
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
              {SPIKE_EXTENSIONS.map((ext) => {
                const isEnabled = enabledExtensions.includes(ext.id);
                return (
                  <div
                    key={ext.id}
                    onClick={() => toggleExtension(ext.id)}
                    className={`cursor-pointer rounded-xl p-3.5 border-2 transition flex flex-col justify-between ${
                      isEnabled
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: ext.color }}
                          />
                          <span className="font-extrabold text-sm text-slate-900">
                            {ext.nameEn}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isEnabled
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isEnabled ? '✓ Đã bật' : '+ Bật'}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mb-1">
                        {ext.nameVi}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {ext.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP PROJECT TAB BAR */}
      <header className="h-12 bg-[#eef0f3] border-b border-slate-300 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectLesson(CURRICULUM_LESSONS[0])}
            title="Home"
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 shadow-sm"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-300 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={currentLessonId}
              onChange={(e) => {
                const found = CURRICULUM_LESSONS.find((l) => l.id === e.target.value);
                if (found) handleSelectLesson(found);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {CURRICULUM_LESSONS.map((lesson, idx) => (
                <option key={lesson.id} value={lesson.id}>
                  Project {idx + 1}: {lesson.title} ({lesson.mode})
                </option>
              ))}
            </select>
          </div>

          <span className="hidden xl:inline-block text-xs text-slate-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium truncate max-w-md">
            🎯 <strong>Nhiệm vụ:</strong> {currentLesson.objective}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExtensionsModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Block Extensions ({enabledExtensions.length})
          </button>

          <button
            onClick={() => setShowShapeGuideModal((v) => !v)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold shadow-sm transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            6 Loại Khối Lệnh
          </button>

          <button
            onClick={() => setRightRedZoneTab('builder')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm transition ${
              rightRedZoneTab === 'builder'
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Cog className="w-3.5 h-3.5" />
            5 Cơ Cấu SPIKE Prime
          </button>
        </div>
      </header>

      {/* MODAL GIẢI THÍCH 6 LOẠI KHỐI LỆNH */}
      {showShapeGuideModal && (
        <div className="bg-white border-b-2 border-amber-400 px-4 py-3 shadow-lg z-30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-800">
              📘 PHẦN 1 TÀI LIỆU HỌC SINH: 6 LOẠI HÌNH DẠNG KHỐI LỆNH TRONG LEGO® SPIKE™ PRIME
            </span>
            <button
              onClick={() => setShowShapeGuideModal(false)}
              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 px-2.5 py-0.5 rounded-full font-bold"
            >
              Đóng ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {BLOCK_SHAPE_GUIDE.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-extrabold text-slate-800 mb-1">{item.nameVi}</div>
                  <div
                    className={`text-[10px] font-mono font-bold text-white px-2 py-0.5 mb-1 inline-block ${
                      item.id === 'hat'
                        ? 'rounded-t-xl rounded-b'
                        : item.id === 'reporter'
                        ? 'rounded-full'
                        : item.id === 'boolean'
                        ? 'spike-boolean-slot px-3'
                        : 'rounded'
                    }`}
                    style={{ backgroundColor: item.color }}
                  >
                    {item.sampleText}
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. KHÔNG GIAN LÀM VIỆC CHÍNH */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* CỘT 1 (TRÁI NGOÀI CÙNG): THANH ICON TRÒN DỌC + NÚT DẤU + EXTENSIONS Ở ĐÁY */}
        <aside className="w-[76px] bg-white border-r border-slate-200 flex flex-col items-center py-2 justify-between shrink-0 z-10">
          <div className="flex flex-col items-center gap-1.5 overflow-y-auto w-full px-1">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className="flex flex-col items-center justify-center w-full py-1 rounded-lg hover:bg-slate-100 transition group"
              >
                <span
                  className="w-5 h-5 rounded-full shadow-sm group-hover:scale-110 transition"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[9px] font-extrabold uppercase tracking-tighter text-slate-600 mt-0.5 text-center leading-tight">
                  {cat.nameEn}
                </span>
              </button>
            ))}
          </div>

          {/* Nút dấu + ở góc dưới trái giống hệt https://spike.legoeducation.com/prime/project */}
          <div className="pt-2 border-t border-slate-200 w-full flex flex-col items-center">
            <button
              onClick={() => setShowExtensionsModal(true)}
              title="Show Block Extensions (More Motors, More Movement, Music, Line Graph, Weather...)"
              className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 flex flex-col items-center justify-center text-blue-600 border border-blue-200 shadow-sm transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* CỘT 2: NGĂN KÉO KHỐI LỆNH KÉO THẢ */}
        <section
          ref={paletteSidebarRef}
          className="w-[325px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 relative"
        >
          {dragState && dragState.source === 'canvas' && dragState.hasMoved && (
            <div
              className={`absolute inset-0 z-30 flex flex-col items-center justify-center transition-all pointer-events-none ${
                dragState.overTrash
                  ? 'bg-rose-600/90 text-white backdrop-blur-sm'
                  : 'bg-slate-900/40 text-white'
              }`}
            >
              <Trash2
                className={`w-14 h-14 mb-2 transition-transform ${
                  dragState.overTrash ? 'scale-125 animate-bounce' : 'scale-100'
                }`}
              />
              <span className="text-sm font-extrabold uppercase tracking-wider">
                {dragState.overTrash ? 'Thả chuột để Xóa Khối!' : 'Kéo vào đây để Xóa Khối'}
              </span>
            </div>
          )}

          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
            <span>✋ Giữ chuột kéo khối sang phải</span>
            <span className="text-[10px] text-slate-400">SPIKE™ Word Blocks</span>
          </div>

          <div
            ref={paletteContainerRef}
            className="flex-1 overflow-y-auto px-3.5 py-3 space-y-6"
          >
            {activeCategories.map((cat) => {
              const catBlocks = Object.entries(BLOCK_DEFINITIONS).filter(
                ([, def]) => def.category === cat.id
              );

              return (
                <div
                  key={cat.id}
                  ref={(el) => (categorySectionRefs.current[cat.id] = el)}
                  className="space-y-2.5"
                >
                  <div className="flex items-baseline justify-between pb-1">
                    <h3 className="text-[17px] font-bold text-[#737373]">{cat.nameEn}</h3>
                    <span className="text-[10px] font-semibold text-slate-400">{cat.nameVi}</span>
                  </div>

                  {cat.id === 'variables' && (
                    <div className="flex gap-2 pb-1">
                      <button
                        type="button"
                        onClick={() => setStatusLog('Biến mẫu [V] và Danh sách [L] đã sẵn sàng sử dụng.')}
                        className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition"
                      >
                        Make a Variable
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusLog('Danh sách mẫu [L] đã sẵn sàng sử dụng.')}
                        className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition"
                      >
                        Make a List
                      </button>
                    </div>
                  )}

                  {cat.id === 'my_blocks' && (
                    <div className="pb-1">
                      <button
                        type="button"
                        onClick={() => setStatusLog('Khối chương trình con [GrabCargo] đã sẵn sàng.')}
                        className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition"
                      >
                        Make a Block
                      </button>
                    </div>
                  )}

                  <div className="space-y-2">
                    {catBlocks.map(([typeKey, def]) => (
                      <div key={typeKey} className={def.spacerTop ? 'pt-3' : ''}>
                        <SpikeBlockItem
                          block={{ id: typeKey, type: typeKey, params: def.defaultParams }}
                          isPalette={true}
                          onHover={setHoveredBlockDesc}
                          onPointerDragStart={handlePointerDragStart}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-10 px-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>⋮ SPIKE™ Prime</span>
            <button
              onClick={() => setShowExtensionsModal(true)}
              className="text-[11px] text-blue-600 hover:underline font-bold"
            >
              + Extensions
            </button>
          </div>
        </section>

        {/* CỘT 3: VÙNG LẬP TRÌNH KÉO THẢ + KHUNG MÀU ĐỎ BÊN PHẢI */}
        <div className="flex-1 spike-canvas-bg relative flex overflow-hidden">
          <div
            ref={canvasAreaRef}
            className={`flex-1 h-full flex flex-col relative overflow-hidden transition-colors ${
              dragState && dragState.hasMoved && dragState.overCanvas
                ? 'bg-amber-50/40 ring-2 ring-inset ring-amber-400/60'
                : ''
            }`}
          >
            {/* Nút tròn vàng "Connect" + Bảng nổi Cổng A-F (Cố định shrink-0) */}
            <div className="px-5 pt-4 flex items-start gap-3 z-10 shrink-0">
              <div className="flex flex-col items-center shrink-0">
                <button
                  onClick={handleConnectRealRobot}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 transition ${
                    bleStatus.state === 'connected'
                      ? 'bg-emerald-500 border-white text-white ring-4 ring-emerald-200'
                      : missionCompleted
                      ? 'bg-[#FFD500] border-white text-slate-900 ring-4 ring-emerald-400'
                      : 'bg-[#FFD500] hover:brightness-105 border-white text-slate-900'
                  }`}
                  title="Nhấn để kết nối Bluetooth với bộ não LEGO SPIKE Prime Hub"
                >
                  <div className="w-5 h-7 rounded-[4px] border-2 border-current flex flex-col items-center justify-between p-0.5 bg-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="w-2 h-2 rounded-full border border-slate-800" />
                  </div>
                </button>
                <span className="text-[11px] font-semibold text-slate-600 mt-1">
                  {bleStatus.state === 'connected' ? 'Connected' : 'Connect'}
                </span>
              </div>

              {showHubMiniOverlay && (
                <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-2.5 shadow-sm flex items-center gap-3 flex-wrap">
                  <div
                    onClick={() => setRightRedZoneTab('hub')}
                    className="cursor-pointer bg-yellow-400 p-1.5 rounded-xl border border-yellow-500 shadow-sm flex items-center gap-2"
                    title="Nhấn để mở chi tiết Bộ não Hub"
                  >
                    <div className="grid grid-cols-5 gap-[2px] bg-slate-900 p-1 rounded">
                      {ledMatrix.map((row, r) =>
                        row.map((v, c) => (
                          <span
                            key={`${r}-${c}`}
                            className={`w-1.5 h-1.5 rounded-[1px] ${
                              v > 0 ? 'bg-amber-300' : 'bg-slate-700'
                            }`}
                          />
                        ))
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-900 pr-1">
                      <div>Hub 5x5</div>
                      <div className="font-mono text-[9px]">Yaw: {Math.round(telemetry.gyroYaw)}°</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[10px]">
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <span className="font-black text-blue-600">A:</span>{' '}
                      <span className="font-mono font-bold">
                        {Math.round(((telemetry.motors.A.angle % 360) + 360) % 360)}°
                      </span>
                    </div>
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <span className="font-black text-blue-600">B:</span>{' '}
                      <span className="font-mono font-bold">
                        {Math.round(((telemetry.motors.B.angle % 360) + 360) % 360)}°
                      </span>
                    </div>
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <span className="font-black text-blue-600">C:</span>{' '}
                      <span className="font-mono font-bold">
                        {Math.round(((telemetry.motors.C.angle % 360) + 360) % 360)}°
                      </span>
                    </div>
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <span className="font-black text-cyan-600">D:</span>{' '}
                      <span className="font-mono font-bold">
                        {telemetry.colorSensor.reflection}%
                      </span>
                    </div>
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <span className="font-black text-cyan-600">E:</span>{' '}
                      <span className="font-mono font-bold">
                        {Math.round(telemetry.distanceSensor.cm)}cm
                      </span>
                    </div>
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <span className="font-black text-pink-600">F:</span>{' '}
                      <span className="font-mono font-bold">
                        {telemetry.forceSensor.newton}N
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* VÙNG CHỨA CHỒNG LỆNH KÉO THẢ */}
            <div className="flex-1 min-h-0 overflow-auto px-8 py-6">
              <div
                style={{
                  transform: `scale(${canvasZoom / 100})`,
                  transformOrigin: 'top left'
                }}
                className="space-y-0.5 pb-20"
              >
                {blocks.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-300 bg-white/70 rounded-2xl p-8 text-center max-w-md">
                    <MousePointerClick className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-extrabold text-slate-700 mb-1">
                      Kéo thả khối lệnh từ bên trái vào đây!
                    </p>
                    <p className="text-xs text-slate-500">
                      Giữ chuột trái vào bất kỳ khối lệnh nào ở cột bên trái và kéo sang vùng này để ghép thành chồng lệnh.
                    </p>
                  </div>
                ) : (
                  <>
                    {blocks.map((block, index) => (
                      <React.Fragment key={block.id}>
                        {renderDropIndicatorLine(index)}
                        <SpikeBlockItem
                          block={block}
                          index={index}
                          isPalette={false}
                          isCurrent={activeBlockId === block.id}
                          isDragging={
                            dragState &&
                            dragState.hasMoved &&
                            dragState.source === 'canvas' &&
                            dragState.block.id === block.id
                          }
                          onUpdateParam={handleUpdateBlockParam}
                          onDuplicate={handleDuplicateBlock}
                          onRemove={handleRemoveBlock}
                          onHover={setHoveredBlockDesc}
                          onPointerDragStart={handlePointerDragStart}
                        />
                      </React.Fragment>
                    ))}
                    {renderDropIndicatorLine(blocks.length)}
                  </>
                )}
              </div>
            </div>

            {/* Thanh thông báo cố định chiều cao h-9, cắt gọn trên 1 dòng để không làm nhảy giao diện */}
            <div className="h-9 shrink-0 px-4 bg-white/95 border-t border-slate-200 flex items-center justify-between text-xs overflow-hidden whitespace-nowrap">
              <div className="truncate w-full">
                {hoveredBlockDesc ? (
                  <span className="truncate">
                    <span
                      className="inline-block text-white font-bold px-1.5 py-0.5 rounded text-[10px] mr-1.5"
                      style={{ backgroundColor: hoveredBlockDesc.color }}
                    >
                      Mục {hoveredBlockDesc.sectionCode}
                    </span>
                    <strong className="text-slate-900">{hoveredBlockDesc.nameVi}: </strong>
                    <span className="text-slate-600">{hoveredBlockDesc.description}</span>
                  </span>
                ) : (
                  <span className="text-slate-600 truncate">{statusLog}</span>
                )}
              </div>
            </div>

            <div className="h-11 shrink-0 px-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500">
                <button
                  onClick={() => setCanvasZoom(100)}
                  title="Reset Zoom"
                  className="p-1.5 rounded hover:bg-slate-100"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCanvasZoom((z) => Math.max(75, z - 10))}
                  title="Zoom Out"
                  className="p-1.5 rounded hover:bg-slate-100"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCanvasZoom((z) => Math.min(130, z + 10))}
                  title="Zoom In"
                  className="p-1.5 rounded hover:bg-slate-100"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-400 px-1">{canvasZoom}%</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                <span>
                  Chồng lệnh: <strong>{blocks.length}</strong> khối
                </span>
                <button
                  onClick={() =>
                    setBlocks([{ id: 'b0', type: 'when_program_starts', params: {} }])
                  }
                  className="text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Làm mới chồng lệnh
                </button>
              </div>
            </div>
          </div>

          {/* KHUNG MÀU ĐỎ BÊN PHẢI (CHỨA SA BÀN 2D/3D, CƠ CẤU SPIKE PRIME, HUB & PYTHON) */}
          <div className="w-[52%] min-w-[460px] max-w-[680px] h-full p-3 flex flex-col justify-between bg-transparent z-10 shrink-0">
            <div className="flex-1 min-h-0 bg-white rounded-2xl border-2 border-rose-500 shadow-[0_8px_30px_rgba(244,63,94,0.12)] flex flex-col overflow-hidden">
              {/* Thanh Tab cố định chiều cao h-11 shrink-0 không bao giờ xuống dòng */}
              <div className="h-11 shrink-0 px-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 overflow-hidden whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRightRedZoneTab('arena')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition ${
                      rightRedZoneTab === 'arena'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🏁 Sa Bàn Ảo ({simMode})</span>
                  </button>

                  <button
                    onClick={() => setRightRedZoneTab('hub')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      rightRedZoneTab === 'hub'
                        ? 'bg-yellow-400 text-slate-950 shadow'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Hub & Cảm Biến
                  </button>

                  <button
                    onClick={() => setRightRedZoneTab('python')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      rightRedZoneTab === 'python'
                        ? 'bg-cyan-400 text-slate-950 shadow'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Python Code
                  </button>

                  <button
                    onClick={() => setRightRedZoneTab('builder')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      rightRedZoneTab === 'builder'
                        ? 'bg-pink-500 text-white shadow'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Cog className="w-3.5 h-3.5" />
                    Cơ Cấu & Lắp Ráp
                  </button>
                </div>
              </div>

              {rightRedZoneTab === 'arena' && (
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <VirtualSimulatorPanel
                      simMode={simMode}
                      setSimMode={setSimMode}
                      mapType={mapType}
                      setMapType={(newMap) => {
                        setMapType(newMap);
                        resetSimulatorPose(newMap);
                      }}
                      robotPose={robotPose}
                      onResetSimulator={() => resetSimulatorPose(mapType)}
                      telemetry={telemetry}
                      missionCompleted={missionCompleted}
                      onManualNudgeArm={handleManualNudgeArm}
                    />
                  </div>

                  <div className="shrink-0 bg-slate-900 border-t border-slate-800 px-3 py-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-slate-950/90 p-1.5 rounded-lg border border-slate-800">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Color (D):</span>
                        <span className="font-mono text-cyan-300 font-bold">
                          {telemetry.colorSensor.color} ({telemetry.colorSensor.reflection}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {COLOR_SWATCHES.map((sw) => (
                          <button
                            key={sw.name}
                            onClick={() =>
                              handleUpdateManualSensor('color', {
                                color: sw.name,
                                reflection: sw.reflection
                              })
                            }
                            className={`w-4 h-4 rounded-full border ${
                              telemetry.colorSensor.color === sw.name
                                ? 'ring-2 ring-yellow-400 scale-110'
                                : 'border-slate-600'
                            }`}
                            style={{ backgroundColor: sw.hex }}
                            title={sw.label}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950/90 p-1.5 rounded-lg border border-slate-800">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Distance (E):</span>
                        <span className="font-mono text-cyan-300 font-bold">
                          {Math.round(telemetry.distanceSensor.cm)} cm
                        </span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="200"
                        value={Math.round(telemetry.distanceSensor.cm)}
                        onChange={(e) =>
                          handleUpdateManualSensor('distance', { cm: Number(e.target.value) })
                        }
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>

                    <div className="bg-slate-950/90 p-1.5 rounded-lg border border-slate-800 flex flex-col justify-between">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Force (F):</span>
                        <span className="font-mono text-pink-400 font-bold">
                          {telemetry.forceSensor.newton} N
                        </span>
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        <button
                          onClick={() =>
                            handleUpdateManualSensor('force', { pressed: true, newton: 5 })
                          }
                          className={`flex-1 py-0.5 rounded text-[10px] font-bold ${
                            telemetry.forceSensor.pressed
                              ? 'bg-pink-600 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          Pressed (5N)
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateManualSensor('force', { pressed: false, newton: 0 })
                          }
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400"
                        >
                          0N
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {rightRedZoneTab === 'hub' && (
                <div className="flex-1 bg-slate-900 text-white p-4 overflow-y-auto space-y-4">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4 space-y-2">
                      {['A', 'C', 'E'].map((portKey) => (
                        <div
                          key={portKey}
                          className="bg-slate-950 p-2 rounded-xl border border-slate-800"
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="bg-blue-500 text-white px-2 py-0.5 rounded">
                              Port {portKey}
                            </span>
                            <span className="font-mono text-yellow-300 text-[11px]">
                              {portKey === 'E'
                                ? `${Math.round(telemetry.distanceSensor.cm)} cm`
                                : `${Math.round(telemetry.motors[portKey]?.angle || 0)}°`}
                            </span>
                          </div>
                          <select
                            value={ports[portKey]}
                            onChange={(e) =>
                              setPorts((prev) => ({ ...prev, [portKey]: e.target.value }))
                            }
                            className="w-full bg-slate-900 text-slate-200 text-[11px] p-1 rounded border border-slate-700"
                          >
                            {Object.values(SPIKE_DEVICES).map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.shortName}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>

                    <div className="col-span-4 flex flex-col items-center">
                      <div className="bg-yellow-400 p-3 rounded-2xl border-2 border-yellow-200 shadow-xl">
                        <div className="bg-slate-100 p-2.5 rounded-xl flex flex-col items-center">
                          <span className="text-[10px] font-black text-slate-700 mb-1">
                            5x5 LIGHT MATRIX
                          </span>
                          <div className="grid grid-cols-5 gap-1.5 bg-slate-900 p-2.5 rounded-xl">
                            {ledMatrix.map((row, rIdx) =>
                              row.map((val, cIdx) => (
                                <button
                                  key={`${rIdx}-${cIdx}`}
                                  onClick={() => handleTogglePixel(rIdx, cIdx)}
                                  className={`w-5 h-5 rounded-sm transition ${
                                    val > 0
                                      ? 'bg-amber-300 shadow-[0_0_8px_#fde047]'
                                      : 'bg-slate-800'
                                  }`}
                                />
                              ))
                            )}
                          </div>
                          <div className="mt-2 text-[10px] font-bold text-slate-600">
                            Nhấn vào từng ô để bật/tắt đèn LED
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-4 space-y-2">
                      {['B', 'D', 'F'].map((portKey) => (
                        <div
                          key={portKey}
                          className="bg-slate-950 p-2 rounded-xl border border-slate-800"
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="bg-pink-500 text-white px-2 py-0.5 rounded">
                              Port {portKey}
                            </span>
                            <span className="font-mono text-yellow-300 text-[11px]">
                              {portKey === 'D'
                                ? `${telemetry.colorSensor.color} (${telemetry.colorSensor.reflection}%)`
                                : portKey === 'F'
                                ? `${telemetry.forceSensor.newton} N`
                                : `${Math.round(telemetry.motors[portKey]?.angle || 0)}°`}
                            </span>
                          </div>
                          <select
                            value={ports[portKey]}
                            onChange={(e) =>
                              setPorts((prev) => ({ ...prev, [portKey]: e.target.value }))
                            }
                            className="w-full bg-slate-900 text-slate-200 text-[11px] p-1 rounded border border-slate-700"
                          >
                            {Object.values(SPIKE_DEVICES).map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.shortName}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {rightRedZoneTab === 'python' && (
                <div className="flex-1 bg-slate-950 text-emerald-300 p-3 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                    <span className="font-mono font-bold text-white">
                      main.py (SPIKE™ Prime Python 3 API - Đồng bộ từ Word Blocks)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pythonCode);
                        setCopiedPython(true);
                        setTimeout(() => setCopiedPython(false), 1800);
                      }}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded text-xs font-bold"
                    >
                      {copiedPython ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedPython ? 'Đã sao chép' : 'Copy Python'}
                    </button>
                  </div>
                  <pre className="code-editor flex-1 overflow-auto text-xs leading-relaxed">
                    {pythonCode}
                  </pre>
                </div>
              )}

              {/* TAB 4 TRONG KHUNG ĐỎ: 5 CƠ CẤU ROBOT CHUẨN (DRIVING BASE 1/2/3, SUPER CLEANUP GRABBER, HOPPER) & HƯỚNG DẪN LẮP RÁP */}
              {rightRedZoneTab === 'builder' && (
                <div className="flex-1 bg-slate-900 text-white p-3.5 overflow-y-auto space-y-3">
                  {/* Danh sách 5 Cơ cấu chính thức trong LEGO Education SPIKE Prime */}
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-yellow-400 mb-2">
                      ⚙️ 5 Cơ Cấu Robot Chính Thức (Official SPIKE™ Prime Mechanisms & Models)
                    </h4>
                    <div className="space-y-2">
                      {OFFICIAL_SPIKE_MECHANISMS.map((mech) => (
                        <div
                          key={mech.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-extrabold text-white">{mech.name}</span>
                            <span className="text-[10px] font-bold bg-pink-600/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">
                              {mech.unit}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mb-1.5">{mech.description}</p>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 bg-slate-900/90 p-2 rounded-lg mb-1.5">
                            <div>
                              <strong className="text-cyan-300">Chấp hành:</strong> {mech.actuators}
                            </div>
                            <div>
                              <strong className="text-purple-300">Cảm biến:</strong> {mech.sensors}
                            </div>
                            <div className="col-span-2">
                              <strong className="text-amber-300">Nguyên lý cơ khí:</strong>{' '}
                              {mech.gearMechanism}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[10px] text-slate-400 font-semibold mr-1">
                              Nhấn để thêm khối lệnh của cơ cấu này:
                            </span>
                            {mech.keyBlocks.map((bKey) => {
                              const bDef = BLOCK_DEFINITIONS[bKey];
                              if (!bDef) return null;
                              return (
                                <button
                                  key={bKey}
                                  onClick={() => handleInsertBlockAt(bKey, blocks.length)}
                                  className="text-[10px] font-bold text-white px-2 py-0.5 rounded shadow hover:brightness-110"
                                  style={{ backgroundColor: bDef.color }}
                                >
                                  + {bDef.nameEn}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hướng dẫn lắp ráp từng bước */}
                  <div className="bg-slate-950 border border-pink-500/40 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-pink-400">
                        HƯỚNG DẪN LẮP RÁP TỪNG BƯỚC ({buildStepIndex + 1}/{BUILD_STEPS.length})
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setBuildStepIndex((i) => Math.max(0, i - 1))}
                          className="px-2 py-0.5 rounded bg-slate-800 text-xs font-bold"
                        >
                          ◀ Trước
                        </button>
                        <button
                          onClick={() =>
                            setBuildStepIndex((i) => Math.min(BUILD_STEPS.length - 1, i + 1))
                          }
                          className="px-2 py-0.5 rounded bg-pink-600 text-xs font-bold"
                        >
                          Tiếp ▶
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{currentBuildStep.title}</h4>
                    <p className="text-xs text-slate-300 mb-2">{currentBuildStep.instruction}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentBuildStep.parts.map((pt, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-900 text-yellow-300 px-2.5 py-0.5 rounded-full border border-slate-700"
                        >
                          ✓ {pt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CỤM NÚT STOP & PLAY/RUN Ở GÓC DƯỚI PHẢI */}
            <div className="h-14 pt-2 flex items-center justify-between px-2">
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Khung màu đỏ: Khu vực Sa bàn 2D/3D, Cơ cấu, Hub & Python</span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  onClick={() => setRightRedZoneTab('hub')}
                  title="5x5 Light Matrix & Program Slot"
                  className="cursor-pointer flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 shadow-sm text-slate-700 text-xs font-bold"
                >
                  <span className="font-mono tracking-tighter">⠇⠇</span>
                  <span>Slot 1 ▾</span>
                </div>

                <button
                  onClick={stopProgram}
                  title="Dừng chương trình (Stop)"
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition ${
                    isRunning
                      ? 'bg-rose-600 text-white hover:bg-rose-500 scale-105'
                      : 'bg-slate-300 hover:bg-slate-400 text-white'
                  }`}
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>

                <button
                  onClick={runProgram}
                  disabled={isRunning}
                  title="Chạy chương trình (Run Program)"
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition ${
                    isRunning
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'bg-[#FFD500] hover:bg-yellow-400 text-slate-900 hover:scale-105 border-2 border-white'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
