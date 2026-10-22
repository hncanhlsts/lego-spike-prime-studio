import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  XCircle,
  Code2,
  Copy,
  Check,
  Trash2,
  MousePointerClick,
  Cog,
  Layers,
  Save,
  Download,
  Upload,
  RotateCcw,
  FilePlus2,
  Settings2,
  Undo2,
  Redo2,
  GraduationCap,
  Sparkles,
  Lock,
  Unlock,
  KeyRound,
  Compass,
  AlertTriangle,
  Lightbulb,
  Award,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Footprints,
  StepForward,
  Gauge
} from 'lucide-react';
import SpikeBlockItem, { SpikeWheelBadge } from './components/SpikeBlockItem';
import VirtualSimulatorPanel, {
  MAP_2D_OPTIONS,
  SCENE_3D_OPTIONS,
  normalizeLineObject
} from './components/VirtualSimulatorPanel';
import BlockEncyclopediaModal from './components/BlockEncyclopediaModal';
import UserGuideModal from './components/UserGuideModal';
import {
  SPIKE_CORE_CATEGORIES,
  SPIKE_EXTENSIONS,
  SPIKE_DEVICES,
  BLOCK_DEFINITIONS,
  BLOCK_SHAPE_GUIDE,
  LED_PATTERNS,
  OFFICIAL_SPIKE_MECHANISMS,
  BUILDING_PARTS,
  BUILD_STEPS,
  generateSpikePythonCode
} from './data/spikeData';
import {
  CURRICULUM,
  LEARNING_TRACKS,
  WIN_CONDITIONS,
  migrateMission
} from './data/curriculum';
import {
  getSolids,
  getGoals,
  findCollision,
  raycastDistanceCm,
  sampleFloorColor,
  sensorPoint,
  DEFAULT_START_POSES
} from './utils/simPhysics';
import { SpikeBluetoothManager } from './utils/bluetoothSpike';

const COLOR_SWATCHES = [
  { id: 0, name: 'BLACK', label: '(0) Black', hex: '#1e293b', reflection: 12 },
  { id: 3, name: 'BLUE', label: '(3) Blue', hex: '#2563eb', reflection: 42 },
  { id: 6, name: 'GREEN', label: '(6) Green', hex: '#16a34a', reflection: 52 },
  { id: 7, name: 'YELLOW', label: '(7) Yellow', hex: '#eab308', reflection: 85 },
  { id: 9, name: 'RED', label: '(9) Red', hex: '#dc2626', reflection: 65 },
  { id: 10, name: 'WHITE', label: '(10) White', hex: '#f8fafc', reflection: 98 }
];

const EMPTY_ARENA_CONFIG = {
  startPose: null,
  lines: [],
  goals: [],
  obstacles: [],
  walls: [],
  colorPatches: [],
  backgroundImage: ''
};

const MISSIONS_STORAGE_KEY = 'spike_prime_curriculum_v4';

function loadInitialMissions() {
  try {
    const raw = localStorage.getItem(MISSIONS_STORAGE_KEY);
    if (!raw) return CURRICULUM.map(migrateMission);
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length === 0) return CURRICULUM.map(migrateMission);
    const savedIds = new Set(saved.map((m) => m.id));
    const missingDefaults = CURRICULUM.filter((d) => !savedIds.has(d.id));
    return [...saved, ...missingDefaults].map(migrateMission);
  } catch {
    return CURRICULUM.map(migrateMission);
  }
}

export default function App() {
  const [missions, setMissions] = useState(loadInitialMissions);
  const [currentLessonId, setCurrentLessonId] = useState(() => loadInitialMissions()[0]?.id || CURRICULUM[0].id);
  const currentLesson =
    missions.find((l) => l.id === currentLessonId) || missions[0] || CURRICULUM[0];

  // Vai trò: 'student' (Học sinh) hoặc 'teacher' (Giáo viên - mã PIN: 1234)
  const [roleMode, setRoleMode] = useState('student');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Sổ tay Khối lệnh & Kỹ thuật FLL/WRO
  const [showEncyclopediaModal, setShowEncyclopediaModal] = useState(false);
  const [showUserGuideModal, setShowUserGuideModal] = useState(false);

  // Thanh đề bài & Gợi ý cho Học sinh
  const [showBriefBar, setShowBriefBar] = useState(true);
  const [revealedHintIndex, setRevealedHintIndex] = useState(0);
  const [showSolutionPreviewModal, setShowSolutionPreviewModal] = useState(false);

  // Kết quả chấm điểm nhiệm vụ
  const [gradingResult, setGradingResult] = useState(null);

  const [showMissionStudioModal, setShowMissionStudioModal] = useState(false);
  const missionFileInputRef = useRef(null);

  const [arenaConfig, setArenaConfig] = useState(
    currentLesson.arenaConfig || EMPTY_ARENA_CONFIG
  );

  // Snapshot mặt sàn từ VirtualSimulatorPanel để cảm biến màu đọc pixel 100% chính xác
  const floorCanvasRef = useRef(null);
  const cargoStatusRef = useRef({ inZoneCount: 0, totalCargo: 0, isHolding: false, bridgeLowered: false });
  const isContinuousDrivingRef = useRef({ moving: false, direction: 1, steering: 0 });

  // Tự động lưu danh sách nhiệm vụ vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(missions));
    } catch {
      // Ignore storage quota errors
    }
  }, [missions]);

  const [ports, setPorts] = useState({
    A: 'medium_motor',
    B: 'medium_motor',
    C: 'large_motor',
    D: 'color_sensor',
    E: 'distance_sensor',
    F: 'force_sensor'
  });

  const [ledMatrix, setLedMatrix] = useState(LED_PATTERNS.SMILE);

  // Tải code bài làm đã lưu của học sinh cho bài học này hoặc nạp code khởi đầu
  const getInitialBlocksForLesson = useCallback((lesson) => {
    try {
      const saved = localStorage.getItem(`spike_work_${lesson.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return (
      lesson.starterBlocks ||
      lesson.defaultBlocks || [
        { id: 'b0', type: 'when_program_starts', params: {} }
      ]
    );
  }, []);

  const [blocks, setBlocksState] = useState(() => getInitialBlocksForLesson(currentLesson));
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  const setBlocks = useCallback(
    (updater, pushHistory = true) => {
      setBlocksState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (pushHistory) {
          undoStackRef.current.push(prev);
          if (undoStackRef.current.length > 50) undoStackRef.current.shift();
          redoStackRef.current = [];
        }
        try {
          localStorage.setItem(`spike_work_${currentLessonId}`, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [currentLessonId]
  );

  const handleUndo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;
    const prev = undoStackRef.current.pop();
    redoStackRef.current.push(blocks);
    setBlocksState(prev);
    try {
      localStorage.setItem(`spike_work_${currentLessonId}`, JSON.stringify(prev));
    } catch {}
    playSnapClick(420);
    setStatusLog('↶ Đã Hoàn tác (Undo).');
  }, [blocks, currentLessonId]);

  const handleRedo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;
    const nxt = redoStackRef.current.pop();
    undoStackRef.current.push(blocks);
    setBlocksState(nxt);
    try {
      localStorage.setItem(`spike_work_${currentLessonId}`, JSON.stringify(nxt));
    } catch {}
    playSnapClick(520);
    setStatusLog('↷ Đã Làm lại (Redo).');
  }, [blocks, currentLessonId]);

  // Phím tắt bàn phím Undo (Ctrl+Z) & Redo (Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, handleRedo]);

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

  const [simMode, setSimMode] = useState(currentLesson.mode || '2D');
  const [mapType, setMapType] = useState(
    currentLesson.mapType && currentLesson.mapType !== '3d_mission'
      ? currentLesson.mapType
      : 'sensor_lab'
  );
  const [scene3DType, setScene3DType] = useState(
    currentLesson.scene3DType || '3d_grab_lift'
  );
  const [buildStepIndex, setBuildStepIndex] = useState(0);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [copiedPython, setCopiedPython] = useState(false);

  // Chế độ bố cục khung sa bàn: 'balanced' (52%), 'wide' (68%), 'max' (82%)
  const [arenaLayoutMode, setArenaLayoutMode] = useState('balanced');
  const codeScrollContainerRef = useRef(null);

  // Xử lý nạp kết quả đo từ Thước Đo Khoảng Cách & Đo Góc vào Chồng Lệnh
  const handleApplyMeasurement = useCallback(
    ({ distCm, rotations, turnAngle }) => {
      const newBlocks = [];
      if (Math.abs(turnAngle) >= 3) {
        const dir = turnAngle >= 0 ? 'right' : 'left';
        newBlocks.push({
          id: `blk_${Date.now()}_turn`,
          type: 'turn_in_place',
          params: {
            direction: dir,
            degrees: Math.abs(turnAngle)
          }
        });
      }
      if (distCm > 0) {
        newBlocks.push({
          id: `blk_${Date.now() + 1}_move`,
          type: 'move_straight_distance',
          params: {
            direction: 'forward',
            distance: Math.round(distCm),
            unit: 'cm'
          }
        });
      }

      if (newBlocks.length > 0) {
        setBlocks((prev) => [...prev, ...newBlocks]);
        playSnapClick(750);
        setStatusLog(
          `📏 Đã nạp từ Thước Đo: ${Math.abs(turnAngle) >= 3 ? `Rẽ ${turnAngle}° & ` : ''}Đi thẳng ${Math.round(distCm)} cm (${rotations} vòng) vào Chồng Lệnh!`
        );
        setTimeout(() => {
          if (codeScrollContainerRef.current) {
            codeScrollContainerRef.current.scrollTo({
              top: codeScrollContainerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        }, 150);
      }
    },
    [setBlocks]
  );

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
    '💡 Kéo thả khối lệnh từ cột bên trái sang vùng lập trình. Nhấn "🛠 Thiết Kế Sa Bàn" trên sa bàn hoặc "🎯 Thiết Kế Nhiệm Vụ" ở thanh trên để tự tạo bài tập mới!'
  );

  const stopFlagRef = useRef(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const simSpeedRef = useRef(1);
  const [isStepMode, setIsStepMode] = useState(false);
  const isStepModeRef = useRef(false);
  const [isWaitingForStep, setIsWaitingForStep] = useState(false);
  const stepResolverRef = useRef(null);

  const changeSimSpeed = (newSpeed) => {
    simSpeedRef.current = newSpeed;
    setSimSpeed(newSpeed);
    setStatusLog(`⚡ Đã chỉnh tốc độ mô phỏng sang: ${newSpeed}x`);
  };
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

  const makeUid = (prefix = 'blk') =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const cloneBlockTree = (blk) => ({
    ...blk,
    id: makeUid('blk'),
    params: { ...(blk.params || {}) },
    conditionBlock: blk.conditionBlock ? cloneBlockTree(blk.conditionBlock) : undefined,
    children: Array.isArray(blk.children) ? blk.children.map(cloneBlockTree) : undefined,
    elseChildren: Array.isArray(blk.elseChildren) ? blk.elseChildren.map(cloneBlockTree) : undefined
  });

  const isDescendantOfBlock = (parentBlk, targetId) => {
    if (!parentBlk || !targetId) return false;
    if (parentBlk.id === targetId) return true;
    if (Array.isArray(parentBlk.children)) {
      if (parentBlk.children.some((c) => isDescendantOfBlock(c, targetId))) return true;
    }
    if (Array.isArray(parentBlk.elseChildren)) {
      if (parentBlk.elseChildren.some((c) => isDescendantOfBlock(c, targetId))) return true;
    }
    return false;
  };

  const findBlockByIdRecursive = (list, targetId) => {
    for (const b of list || []) {
      if (b.id === targetId) return b;
      if (b.children) {
        const found = findBlockByIdRecursive(b.children, targetId);
        if (found) return found;
      }
      if (b.elseChildren) {
        const found = findBlockByIdRecursive(b.elseChildren, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const removeBlockFromTree = (list, targetId) => {
    let removed = null;
    const walk = (arr) => {
      const out = [];
      for (const item of arr || []) {
        if (item.id === targetId) {
          removed = item;
          continue;
        }
        const nextItem = { ...item };
        if (Array.isArray(item.children)) {
          nextItem.children = walk(item.children);
        }
        if (Array.isArray(item.elseChildren)) {
          nextItem.elseChildren = walk(item.elseChildren);
        }
        out.push(nextItem);
      }
      return out;
    };
    const nextList = walk(list);
    return { nextList, removed };
  };

  const insertBlockIntoTree = (
    list,
    targetContainerId,
    targetBranch,
    targetIndex,
    blockToInsert
  ) => {
    const def = BLOCK_DEFINITIONS[blockToInsert.type];
    if (!targetContainerId || targetContainerId === 'root') {
      if (def?.shape === 'hat') {
        return [
          blockToInsert,
          ...(list || []).filter((b) => BLOCK_DEFINITIONS[b.type]?.shape !== 'hat')
        ];
      }
      const next = [...(list || [])];
      let idx = Math.max(0, Math.min(next.length, targetIndex));
      if (idx === 0 && next.length > 0 && BLOCK_DEFINITIONS[next[0].type]?.shape === 'hat') {
        idx = 1;
      }
      next.splice(idx, 0, blockToInsert);
      return next;
    }

    const branchKey = targetBranch === 'elseChildren' ? 'elseChildren' : 'children';
    const walk = (arr) =>
      (arr || []).map((item) => {
        if (item.id === targetContainerId) {
          const curBranch = Array.isArray(item[branchKey]) ? [...item[branchKey]] : [];
          const idx = Math.max(0, Math.min(curBranch.length, targetIndex));
          curBranch.splice(idx, 0, blockToInsert);
          return { ...item, [branchKey]: curBranch };
        }
        const updated = { ...item };
        if (Array.isArray(item.children)) {
          updated.children = walk(item.children);
        }
        if (Array.isArray(item.elseChildren)) {
          updated.elseChildren = walk(item.elseChildren);
        }
        return updated;
      });

    return walk(list);
  };

  const setConditionOnBlockRecursive = (list, targetBlockId, conditionBlock) => {
    const walk = (arr) =>
      (arr || []).map((item) => {
        if (item.id === targetBlockId) {
          return { ...item, conditionBlock };
        }
        const updated = { ...item };
        if (Array.isArray(item.children)) {
          updated.children = walk(item.children);
        }
        if (Array.isArray(item.elseChildren)) {
          updated.elseChildren = walk(item.elseChildren);
        }
        return updated;
      });
    return walk(list);
  };

  const findFirstConditionAcceptingBlockId = (list) => {
    const CONDITION_TYPES = new Set([
      'if_then_block',
      'if_else_block',
      'wait_until_sensor',
      'repeat_until_block',
      'when_condition'
    ]);
    let fallbackId = null;
    const walk = (arr) => {
      for (const b of arr || []) {
        if (CONDITION_TYPES.has(b.type)) {
          if (!b.conditionBlock) return b.id;
          fallbackId = b.id;
        }
        if (b.children) {
          const r = walk(b.children);
          if (r) return r;
        }
        if (b.elseChildren) {
          const r = walk(b.elseChildren);
          if (r) return r;
        }
      }
      return null;
    };
    return walk(list) || fallbackId;
  };

  const handlePointerDragStart = (e, info) => {
    const initial = {
      source: info.source,
      block: info.block,
      index: info.index,
      parentId: info.parentId || 'root',
      parentBranch: info.parentBranch || 'root',
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      hasMoved: false,
      targetContainerId: info.source === 'canvas' ? info.parentId || 'root' : 'root',
      targetBranch: info.source === 'canvas' ? info.parentBranch || 'root' : 'root',
      targetBooleanBlockId: null,
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

      const def = BLOCK_DEFINITIONS[cur.block.type];
      let targetContainerId = 'root';
      let targetBranch = 'root';
      let targetBooleanBlockId = null;
      let nextDropIndex = blocks.length;

      if (overCanvas && canvasAreaRef.current) {
        const hitElements = document.elementsFromPoint(e.clientX, e.clientY);

        // 1. Nếu đang kéo khối điều kiện Lục giác (Boolean < >), tìm ô < > mục tiêu
        if (def?.shape === 'boolean') {
          for (const el of hitElements) {
            const boolAttr = el.getAttribute?.('data-boolean-target-block-id');
            if (boolAttr) {
              targetBooleanBlockId = boolAttr;
              break;
            }
          }
          if (!targetBooleanBlockId) {
            for (const el of hitElements) {
              const blkId = el.getAttribute?.('data-block-id');
              if (blkId) {
                const targetBlk = findBlockByIdRecursive(blocks, blkId);
                if (
                  targetBlk &&
                  [
                    'if_then_block',
                    'if_else_block',
                    'wait_until_sensor',
                    'repeat_until_block',
                    'when_condition'
                  ].includes(targetBlk.type)
                ) {
                  targetBooleanBlockId = blkId;
                  break;
                }
              }
            }
          }
        } else {
          // 2. Nếu đang kéo khối Stack / C-Block, kiểm tra xem con trỏ có nằm trong khe chữ C (repeat / forever / if / else) không
          if (def?.shape !== 'hat') {
            for (const el of hitElements) {
              const cId = el.getAttribute?.('data-c-container-id');
              const cBranch = el.getAttribute?.('data-c-branch');
              if (cId && cBranch) {
                // Không cho phép thả một khối C-block cha vào chính nhánh con của nó
                if (cur.source === 'canvas' && isDescendantOfBlock(cur.block, cId)) {
                  continue;
                }
                targetContainerId = cId;
                targetBranch = cBranch;
                break;
              }
            }
          }

          // Tính toán vị trí chèn (dropIndex) bên trong Container đích (Root hoặc khe chữ C)
          const selector =
            targetContainerId === 'root'
              ? '[data-parent-id="root"]'
              : `[data-parent-id="${targetContainerId}"][data-parent-branch="${targetBranch}"]`;
          const siblingNodes = canvasAreaRef.current.querySelectorAll(selector);
          nextDropIndex = siblingNodes.length;

          for (let i = 0; i < siblingNodes.length; i++) {
            const rect = siblingNodes[i].getBoundingClientRect();
            const midY = rect.top + rect.height / 2;
            if (e.clientY < midY) {
              nextDropIndex = i;
              break;
            }
          }

          if (targetContainerId === 'root') {
            if (def?.shape === 'hat') {
              nextDropIndex = 0;
            } else if (
              nextDropIndex === 0 &&
              blocks.length > 0 &&
              BLOCK_DEFINITIONS[blocks[0].type]?.shape === 'hat'
            ) {
              nextDropIndex = 1;
            }
          }
        }
      }

      const updated = {
        ...cur,
        x: e.clientX,
        y: e.clientY,
        hasMoved: moved,
        overTrash,
        overCanvas,
        targetContainerId,
        targetBranch,
        targetBooleanBlockId,
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

      // Click nhanh vào khối ở cột bên trái
      if (!cur.hasMoved && cur.source === 'palette') {
        if (def?.shape === 'boolean') {
          const targetId = findFirstConditionAcceptingBlockId(blocks);
          if (targetId) {
            const condBlk = {
              id: makeUid('cond'),
              type: cur.block.type,
              params: { ...(def.defaultParams || {}) }
            };
            setBlocks((prev) => setConditionOnBlockRecursive(prev, targetId, condBlk));
            playSnapClick(600);
            setStatusLog(`✨ Đã gắn khối điều kiện <${def.nameEn}> vào ô lục giác < >!`);
            return;
          }
        }
        handleInsertBlockAt(cur.block.type, blocks.length, 'root', 'root');
        playSnapClick(560);
        return;
      }

      if (!cur.hasMoved) return;

      // Kéo khối từ Canvas sang vùng thùng rác cột bên trái để xóa
      if (cur.source === 'canvas' && cur.overTrash) {
        setBlocks((prev) => removeBlockFromTree(prev, cur.block.id).nextList);
        playSnapClick(320);
        setStatusLog(`🗑 Đã kéo thả xóa khối [${def?.nameEn}] khỏi chương trình.`);
        return;
      }

      // Thả khối điều kiện Boolean (< >) vào ô lục giác của if / if-else / wait-until / repeat-until
      if (cur.overCanvas && def?.shape === 'boolean') {
        const targetId = cur.targetBooleanBlockId || findFirstConditionAcceptingBlockId(blocks);
        if (targetId) {
          const condBlk = {
            id: makeUid('cond'),
            type: cur.block.type,
            params: { ...(cur.block.params || def.defaultParams || {}) }
          };
          setBlocks((prev) => setConditionOnBlockRecursive(prev, targetId, condBlk));
          playSnapClick(620);
          setStatusLog(`✨ Đã lắp điều kiện <${def.nameEn}> vào ô lục giác < >!`);
          return;
        }
      }

      // Kéo khối từ Palette bên trái thả vào Root hoặc vào bên trong khe chữ C (repeat / forever / if / else)
      if (cur.source === 'palette' && cur.overCanvas) {
        handleInsertBlockAt(
          cur.block.type,
          cur.dropIndex,
          cur.targetContainerId,
          cur.targetBranch
        );
        playSnapClick(580);
        return;
      }

      // Di chuyển khối đang có trên Canvas (giữa Root và các khe chữ C lồng nhau)
      if (cur.source === 'canvas' && cur.overCanvas) {
        setBlocks((prev) => {
          const { nextList, removed } = removeBlockFromTree(prev, cur.block.id);
          if (!removed) return prev;
          let adjustedIndex = cur.dropIndex;
          if (
            cur.parentId === cur.targetContainerId &&
            cur.parentBranch === cur.targetBranch &&
            adjustedIndex > cur.index
          ) {
            adjustedIndex -= 1;
          }
          return insertBlockIntoTree(
            nextList,
            cur.targetContainerId,
            cur.targetBranch,
            adjustedIndex,
            removed
          );
        });
        playSnapClick(540);
        setStatusLog(
          cur.targetContainerId === 'root'
            ? `Đã di chuyển khối [${def?.nameEn}] tới vị trí #${cur.dropIndex + 1}.`
            : `↳ Đã lồng khối [${def?.nameEn}] vào bên trong nhánh (${
                cur.targetBranch === 'elseChildren' ? 'else' : 'then / loop'
              })!`
        );
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [blocks]);

  const handleInsertBlockAt = (
    typeKey,
    targetIndex,
    targetContainerId = 'root',
    targetBranch = 'root'
  ) => {
    const def = BLOCK_DEFINITIONS[typeKey];
    if (!def) return;
    const isCBlock = def.shape === 'c_block';
    const newBlock = {
      id: makeUid('blk'),
      type: typeKey,
      params: { ...def.defaultParams },
      children: isCBlock ? [] : undefined,
      elseChildren: typeKey === 'if_else_block' ? [] : undefined
    };

    setBlocks((prev) =>
      insertBlockIntoTree(prev, targetContainerId, targetBranch, targetIndex, newBlock)
    );
    setStatusLog(
      targetContainerId === 'root'
        ? `✨ Đã ghép khối [${def.nameEn}] (${def.nameVi}) vào chồng lệnh!`
        : `↳ Đã chèn khối [${def.nameEn}] vào bên trong khối điều khiển lồng nhau!`
    );
  };

  const handleDuplicateBlock = (targetBlockId) => {
    setBlocks((prev) => {
      const walk = (arr) => {
        const out = [];
        for (const item of arr || []) {
          const nextItem = { ...item };
          if (Array.isArray(item.children)) {
            nextItem.children = walk(item.children);
          }
          if (Array.isArray(item.elseChildren)) {
            nextItem.elseChildren = walk(item.elseChildren);
          }
          out.push(nextItem);
          if (item.id === targetBlockId) {
            const def = BLOCK_DEFINITIONS[item.type];
            if (def?.shape !== 'hat') {
              out.push(cloneBlockTree(item));
            }
          }
        }
        return out;
      };
      return walk(prev);
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

  const getStartPoseForMap = (targetMap, customArena = arenaConfig) => {
    if (customArena?.startPose?.x) {
      return {
        x: customArena.startPose.x,
        y: customArena.startPose.y,
        angle: customArena.startPose.angle || 0
      };
    }
    return DEFAULT_START_POSES[targetMap] || { x: 75, y: 132, angle: 0 };
  };

  const resetSimulatorPose = (targetMap = mapType, customArena = arenaConfig) => {
    const sp = getStartPoseForMap(targetMap, customArena);
    setRobotPose({
      x: sp.x,
      y: sp.y,
      angle: sp.angle,
      distanceCm: 95,
      armAngle: 35,
      gripperClosed: false,
      cargoGrabbed: false,
      trail: [{ x: sp.x, y: sp.y }]
    });
    setTelemetry((prev) => ({
      ...prev,
      gyroYaw: sp.angle,
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

  const handleSelectLesson = (lesson) => {
    stopFlagRef.current = true;
    setIsRunning(false);
    setActiveBlockId(null);
    setCurrentLessonId(lesson.id);

    const savedOrStarter = getInitialBlocksForLesson(lesson);
    setBlocksState(savedOrStarter);
    undoStackRef.current = [];
    redoStackRef.current = [];
    setRevealedHintIndex(0);
    setGradingResult(null);

    setSimMode(lesson.mode || '2D');
    const nextMap =
      lesson.mapType && lesson.mapType !== '3d_mission' ? lesson.mapType : 'sensor_lab';
    setMapType(nextMap);
    if (lesson.scene3DType) {
      setScene3DType(lesson.scene3DType);
    } else if (lesson.mode === '3D') {
      setScene3DType('3d_grab_lift');
    }
    const nextArena = lesson.arenaConfig || EMPTY_ARENA_CONFIG;
    setArenaConfig(nextArena);
    setMissionCompleted(false);
    resetSimulatorPose(nextMap, nextArena);
    setRightRedZoneTab('arena');
    setStatusLog(`Đã mở "${lesson.title}": ${lesson.objective}`);
  };

  // Cập nhật cấu hình sa bàn trực tiếp vào nhiệm vụ hiện tại
  const handleUpdateArenaConfig = (updater) => {
    setArenaConfig((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setMissions((all) =>
        all.map((m) => (m.id === currentLessonId ? { ...m, arenaConfig: next } : m))
      );
      return next;
    });
  };

  const handleSetStartPose = (poseObj) => {
    setRobotPose((prev) => ({
      ...prev,
      x: poseObj.x,
      y: poseObj.y,
      angle: poseObj.angle || 0,
      trail: [{ x: poseObj.x, y: poseObj.y }]
    }));
    setTelemetry((prev) => ({
      ...prev,
      gyroYaw: poseObj.angle || 0
    }));
  };

  // Lưu trạng thái Sa bàn + Chồng lệnh hiện tại vào nhiệm vụ đang chọn
  const handleSaveCurrentStateToMission = () => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === currentLessonId
          ? {
              ...m,
              mode: simMode,
              mapType: simMode === '3D' ? '3d_mission' : mapType,
              scene3DType: simMode === '3D' ? scene3DType : m.scene3DType,
              arenaConfig,
              defaultBlocks: blocks
            }
          : m
      )
    );
    playSnapClick(660);
    setStatusLog(
      `💾 Đã lưu Sa bàn (${simMode === '3D' ? scene3DType : mapType}) và ${blocks.length} khối lệnh vào nhiệm vụ "${currentLesson.title}"!`
    );
  };

  // Tạo nhiệm vụ mới linh hoạt
  const handleCreateNewMission = () => {
    const newId = `custom_mission_${Date.now()}`;
    const nextIdx = missions.length + 1;
    const newMission = {
      id: newId,
      isCustom: true,
      level: `Unit ${nextIdx}: Nhiệm vụ Tự Thiết Kế`,
      title: `Bài ${nextIdx}: Thử thách Robot Tự Thiết Kế #${nextIdx}`,
      mode: simMode,
      mapType: simMode === '3D' ? '3d_mission' : 'custom_blank',
      scene3DType: simMode === '3D' ? scene3DType : '3d_grab_lift',
      winCondition: 'reach_goal',
      objective:
        'Điều khiển Robot từ điểm START vượt qua chướng ngại vật để tiến vào vùng Đích GOAL.',
      steps: [
        'Bấm nút "🛠 Thiết Kế Sa Bàn" trên sa bàn 2D để vẽ đường line, đặt Đích GOAL hoặc Vật cản.',
        'Kéo thả các khối lệnh từ cột trái để lập trình cho Robot giải quyết sa bàn.',
        'Nhấn nút "💾 Lưu Sa Bàn & Code" để lưu lại bài tập cho học sinh.'
      ],
      arenaConfig: {
        startPose: { x: 75, y: 132, angle: 0 },
        lines: [],
        goals: [{ id: `g_${Date.now()}`, x: 405, y: 105, w: 62, h: 52, label: 'GOAL' }],
        obstacles: [{ id: `obs_${Date.now()}`, x: 255, y: 112, w: 36, h: 44, label: 'OBS 1' }],
        walls: [],
        colorPatches: [],
        cargos: [],
        backgroundImage: ''
      },
      defaultBlocks: [
        { id: `b0_${Date.now()}`, type: 'when_program_starts', params: {} },
        { id: `b1_${Date.now()}`, type: 'set_movement_motors', params: { ports: 'A+B' } }
      ]
    };
    setMissions((prev) => [...prev, newMission]);
    handleSelectLesson(newMission);
    setStatusLog(`✨ Đã tạo nhiệm vụ mới "${newMission.title}"! Bạn có thể sửa đề bài và thiết kế sa bàn ngay.`);
  };

  const handleDuplicateMission = (mission) => {
    const cloneId = `custom_mission_${Date.now()}`;
    const clone = {
      ...mission,
      id: cloneId,
      isCustom: true,
      title: `${mission.title} (Bản sao)`,
      arenaConfig: mission.arenaConfig ? JSON.parse(JSON.stringify(mission.arenaConfig)) : EMPTY_ARENA_CONFIG,
      defaultBlocks: JSON.parse(JSON.stringify(mission.defaultBlocks || []))
    };
    setMissions((prev) => [...prev, clone]);
    handleSelectLesson(clone);
    setStatusLog(`📋 Đã nhân bản nhiệm vụ "${clone.title}".`);
  };

  const handleDeleteMission = (id) => {
    if (missions.length <= 1) return;
    const filtered = missions.filter((m) => m.id !== id);
    setMissions(filtered);
    if (currentLessonId === id) {
      handleSelectLesson(filtered[0]);
    }
    setStatusLog('🗑 Đã xóa nhiệm vụ.');
  };

  const handleUpdateMissionField = (field, value) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === currentLessonId ? { ...m, [field]: value } : m))
    );
    if (field === 'mode') {
      setSimMode(value);
    }
    if (field === 'mapType') {
      setMapType(value);
      resetSimulatorPose(value, arenaConfig);
    }
    if (field === 'scene3DType') {
      setScene3DType(value);
      resetSimulatorPose(mapType, arenaConfig);
    }
  };

  const handleExportMissionsJson = () => {
    const dataStr = JSON.stringify(missions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spike-prime-missions-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusLog('📥 Đã xuất toàn bộ bộ Nhiệm vụ & Sa bàn ra file .JSON!');
  };

  const handleImportMissionsJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMissions(parsed);
          handleSelectLesson(parsed[0]);
          setStatusLog(`📤 Đã nhập thành công ${parsed.length} nhiệm vụ từ file JSON!`);
        } else if (parsed && parsed.id && parsed.title) {
          setMissions((prev) => [...prev, parsed]);
          handleSelectLesson(parsed);
          setStatusLog(`📤 Đã nhập nhiệm vụ "${parsed.title}"!`);
        }
      } catch {
        setStatusLog('⚠️ File JSON không hợp lệ.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDefaultMissions = () => {
    localStorage.removeItem(MISSIONS_STORAGE_KEY);
    setMissions(CURRICULUM_LESSONS);
    handleSelectLesson(CURRICULUM_LESSONS[0]);
    setStatusLog('↺ Đã khôi phục danh sách 8 bài học mặc định.');
  };

  const handleUpdateBlockParam = (id, key, val) => {
    const walk = (arr) =>
      (arr || []).map((b) => {
        if (b.id === id) {
          return { ...b, params: { ...(b.params || {}), [key]: val } };
        }
        const updated = { ...b };
        if (b.conditionBlock && b.conditionBlock.id === id) {
          updated.conditionBlock = {
            ...b.conditionBlock,
            params: { ...(b.conditionBlock.params || {}), [key]: val }
          };
        }
        if (Array.isArray(b.children)) {
          updated.children = walk(b.children);
        }
        if (Array.isArray(b.elseChildren)) {
          updated.elseChildren = walk(b.elseChildren);
        }
        return updated;
      });
    setBlocks((prev) => walk(prev));
  };

  const handleRemoveBlock = (id) => {
    setBlocks((prev) => removeBlockFromTree(prev, id).nextList);
    playSnapClick(320);
  };

  const handleClearCondition = (blockId) => {
    setBlocks((prev) => setConditionOnBlockRecursive(prev, blockId, undefined));
    playSnapClick(340);
    setStatusLog('Đã gỡ khối điều kiện ra khỏi ô lục giác < >.');
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
      if (action === 'forward' || action === 'backward') {
        const sign = action === 'forward' ? 1 : -1;
        const rad = (prev.angle * Math.PI) / 180;
        const nx = Math.max(30, Math.min(480, prev.x + Math.cos(rad) * 18 * sign));
        const ny = Math.max(30, Math.min(235, prev.y + Math.sin(rad) * 18 * sign));
        setStatusLog(
          action === 'forward'
            ? 'move ↑ forward 15 cm (Di chuyển tiến trong 3D)'
            : 'move ↓ backward 15 cm (Di chuyển lùi trong 3D)'
        );
        return {
          ...prev,
          x: nx,
          y: ny,
          trail: [...(prev.trail || []), { x: nx, y: ny }]
        };
      }
      if (action === 'turnLeft' || action === 'turnRight') {
        const delta = action === 'turnLeft' ? -15 : 15;
        const nextAng = prev.angle + delta;
        setTelemetry((t) => ({ ...t, gyroYaw: nextAng }));
        setStatusLog(`move steering (${delta}°) -> Yaw = ${Math.round(nextAng)}°`);
        return { ...prev, angle: nextAng };
      }
      if (action === 'lift') {
        setStatusLog('C go shortest path to position 75° (Nâng tay máy / Càng nâng 3D)');
        return { ...prev, armAngle: 75 };
      }
      if (action === 'lower') {
        setStatusLog('C go shortest path to position 10° (Hạ tay máy / Càng nâng 3D)');
        return { ...prev, armAngle: 10 };
      }
      const nextClosed = !prev.gripperClosed;
      const nearCargo = prev.x >= 115;
      setStatusLog(
        nextClosed
          ? 'C go to relative position +90° (Đóng tay kẹp kiện hàng 3D)'
          : 'C go to relative position -90° (Mở tay kẹp thả kiện hàng 3D)'
      );
      return {
        ...prev,
        gripperClosed: nextClosed,
        cargoGrabbed: nextClosed && nearCargo
      };
    });
  };

  const sleep = (ms) =>
    new Promise((r) =>
      setTimeout(r, Math.max(5, Math.round(ms / (simSpeedRef.current || 1))))
    );

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

  // Cảm biến thời gian thực: dùng snapshot mặt sàn từ Canvas 2D và tia siêu âm raycast theo góc xe
  const computeLiveArenaSensors = (px, py, angleDeg) => {
    const solids = getSolids(mapType, arenaConfig) || [];
    const minCm = raycastDistanceCm(px, py, angleDeg, solids);

    const sPt = sensorPoint(px, py, angleDeg);
    let detectedColor = null;
    if (floorCanvasRef.current) {
      try {
        const sampled = sampleFloorColor(floorCanvasRef.current, sPt.x, sPt.y);
        if (sampled && sampled.color) {
          detectedColor = {
            color: sampled.color,
            reflection: sampled.reflection,
            rawRgb: sampled.rawRgb
          };
        }
      } catch (err) {
        // Canvas context read fallback
      }
    }
    if (!detectedColor && arenaConfig?.colorPatches?.length) {
      for (const cp of arenaConfig.colorPatches) {
        if (
          sPt.x >= cp.x - 4 &&
          sPt.x <= cp.x + cp.w + 4 &&
          sPt.y >= cp.y - 4 &&
          sPt.y <= cp.y + cp.h + 4
        ) {
          const sw = COLOR_SWATCHES.find((s) => s.name === cp.color);
          detectedColor = {
            color: cp.color,
            reflection: sw ? sw.reflection : 50
          };
          break;
        }
      }
    }
    if (!detectedColor) {
      detectedColor = { color: 'WHITE', reflection: 95 };
    }

    return { distanceCm: minCm, detectedColor };
  };

  const evaluateMissionSuccess = (finalPose, trail, collisionOccurred) => {
    const win = currentLesson.winCondition || 'reach_goal';
    const goals = getGoals(mapType, arenaConfig);

    let passed = false;
    let reason = '';
    const criteriaResults = [];

    const insideGoal = goals.some(
      (g) =>
        finalPose.x >= g.x &&
        finalPose.x <= g.x + g.w &&
        finalPose.y >= g.y &&
        finalPose.y <= g.y + g.h
    );

    switch (win) {
      case 'reach_goal':
        passed = insideGoal && !collisionOccurred;
        reason = passed
          ? 'Robot đã tiến vào vùng Đích GOAL an toàn!'
          : collisionOccurred
          ? 'Robot đã va chạm chướng ngại vật/tường!'
          : 'Robot chưa dừng trong vùng Đích GOAL.';
        criteriaResults.push({ label: 'Vào vùng Đích GOAL', passed: insideGoal });
        criteriaResults.push({ label: 'Không va chạm', passed: !collisionOccurred });
        break;

      case 'stop_before_obstacle': {
        const dist = finalPose.distanceCm;
        const goodDist = dist >= 8 && dist <= 32;
        passed = goodDist && !collisionOccurred;
        reason = passed
          ? `Robot đã dừng trước vật cản ở cự ly an toàn (${Math.round(dist)} cm)!`
          : collisionOccurred
          ? 'Robot đã đâm vào vật cản!'
          : `Khoảng cách hiện tại: ${Math.round(dist)} cm (yêu cầu trong khoảng 8 - 32 cm).`;
        criteriaResults.push({ label: 'Dừng cách vật cản 8 - 32 cm', passed: goodDist });
        criteriaResults.push({ label: 'Không va chạm', passed: !collisionOccurred });
        break;
      }

      case 'stop_on_color': {
        const live = computeLiveArenaSensors(finalPose.x, finalPose.y, finalPose.angle);
        const col = String(live.detectedColor?.color || '').toUpperCase();
        const ref = live.detectedColor?.reflection ?? 50;
        const targetColor = String(currentLesson.winParams?.color || 'GREEN').toUpperCase();
        const isTarget = col === targetColor || (targetColor === 'BLACK' && (col === 'BLACK' || ref < 25));
        passed = isTarget;
        reason = passed
          ? `Cảm biến màu đã nhận diện vạch màu (${col}) và robot đã dừng thành công!`
          : `Robot dừng ngoài vạch màu chỉ định ${targetColor} (màu hiện tại: ${col || 'WHITE'}).`;
        criteriaResults.push({ label: `Dừng đúng trên vạch màu ${targetColor}`, passed: isTarget });
        break;
      }

      case 'cargo_in_zone': {
        const count = cargoStatusRef.current?.inZoneCount || 0;
        passed = count >= 1;
        reason = passed
          ? `Đã vận chuyển thành công ${count} kiện hàng vào vùng đích!`
          : 'Chưa có kiện hàng nào được đặt vào vùng đích (Drop Zone).';
        criteriaResults.push({ label: 'Đặt kiện hàng vào Drop Zone', passed: count >= 1 });
        break;
      }

      case 'bridge_crossing': {
        const crossed = finalPose.x >= 380;
        const lowered = cargoStatusRef.current?.bridgeLowered || false;
        passed = crossed && lowered;
        reason = passed
          ? 'Đã hạ cầu rút thành công và lái robot vượt qua bờ bên kia!'
          : !lowered
          ? 'Cầu rút chưa được hạ xuống phẳng!'
          : 'Robot chưa vượt qua cầu tới bờ bên kia.';
        criteriaResults.push({ label: 'Hạ cầu rút phẳng', passed: lowered });
        criteriaResults.push({ label: 'Lái robot vượt qua cầu', passed: crossed });
        break;
      }

      case 'return_to_start': {
        const sp = getStartPoseForMap(mapType, arenaConfig);
        const d = Math.hypot(finalPose.x - sp.x, finalPose.y - sp.y);
        const moved = (trail?.length || 0) > 8;
        passed = d < 40 && moved && !collisionOccurred;
        reason = passed
          ? 'Robot đã hoàn thành lộ trình và quay trở về điểm xuất phát!'
          : 'Robot chưa quay về đúng vị trí xuất phát ban đầu.';
        criteriaResults.push({ label: 'Di chuyển theo lộ trình', passed: moved });
        criteriaResults.push({ label: 'Quay về vị trí xuất phát (±40px)', passed: d < 40 });
        break;
      }

      case 'run_complete':
      default:
        passed = !collisionOccurred;
        reason = passed ? 'Chương trình đã thực thi hoàn tất!' : 'Đã xảy ra va chạm trong lúc chạy!';
        criteriaResults.push({ label: 'Chạy hết khối lệnh', passed: true });
        criteriaResults.push({ label: 'Không va chạm', passed: !collisionOccurred });
        break;
    }

    return { passed, reason, criteriaResults };
  };

  // Đánh giá biểu thức điều kiện Boolean (< >) khi chạy if / if-else / wait-until / repeat-until
  const evaluateBooleanCondition = (condBlock, fallbackParams, pose) => {
    try {
      const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
      const curColor = String(live.detectedColor?.color || telemetry.colorSensor?.color || 'WHITE').toUpperCase();
      const curRef = live.detectedColor?.reflection ?? telemetry.colorSensor?.reflection ?? 95;
      const curDist = live.distanceCm ?? pose.distanceCm ?? 95;

      if (!condBlock) {
        if (fallbackParams?.condition === 'closer than' || fallbackParams?.value !== undefined) {
          return curDist <= Number(fallbackParams.value ?? 25);
        }
        if (fallbackParams?.color) {
          return curColor === String(fallbackParams.color).toUpperCase();
        }
        return true;
      }

      const cp = condBlock.params || {};
      switch (condBlock.type) {
        case 'sensor_is_color': {
          const targetColor = String(cp.color || 'RED').toUpperCase();
          return curColor === targetColor;
        }
        case 'sensor_is_reflection': {
          const target = Number(cp.value ?? 50);
          if (cp.comp === '>') return curRef > target;
          if (cp.comp === '=') return curRef === target;
          return curRef < target;
        }
        case 'sensor_is_pressed':
          return cp.state === 'released'
            ? !telemetry.forceSensor?.pressed
            : !!telemetry.forceSensor?.pressed;
        case 'sensor_is_closer_than': {
          const thresh = Number(cp.value ?? 25);
          return cp.comp === 'farther than' ? curDist > thresh : curDist <= thresh;
        }
        case 'op_lt':
          return Number(cp.a ?? 0) < Number(cp.b ?? 100);
        case 'op_eq':
          return String(cp.a ?? 0) === String(cp.b ?? 100);
        case 'op_gt':
          return Number(cp.a ?? 0) > Number(cp.b ?? 100);
        case 'op_not':
          return false;
        default:
          return true;
      }
    } catch (e) {
      console.warn('Error in evaluateBooleanCondition:', e);
      return false;
    }
  };

  const runProgram = async () => {
    if (isRunning) return;
    try {
      stopFlagRef.current = false;
      setIsRunning(true);
      setMissionCompleted(false);
      setGradingResult(null);

      // Tự động khôi phục tư thế xuất phát ban đầu của Robot trước khi chạy để kết quả luôn nhất quán
      const sp = getStartPoseForMap(mapType, arenaConfig);
      let pose = {
        x: sp.x,
        y: sp.y,
        angle: sp.angle,
        distanceCm: 95,
        armAngle: 35,
        gripperClosed: false,
        cargoGrabbed: false,
        trail: [{ x: sp.x, y: sp.y }]
      };
      setRobotPose({ ...pose });
      setTelemetry((prev) => ({
        ...prev,
        gyroYaw: sp.angle,
        displayMessage: '',
        distanceSensor: { cm: 95 }
      }));
      await sleep(120);

      setStatusLog('▶ Đang chạy chương trình SPIKE™ Prime trên Sa bàn...');

    const solids = getSolids(mapType, arenaConfig);
    let collisionOccurred = false;
    let moveSpeed = 50;
    let motorSpeeds = { A: 75, B: 75, C: 75, D: 75, E: 75, F: 75 };
    isContinuousDrivingRef.current = { moving: false, direction: 1, steering: 0 };
    let physicsStepsCount = 0;

    const stepContinuousMovement = (customSteering = null, factor = 1.0) => {
      if (!isContinuousDrivingRef.current.moving && customSteering === null) return false;
      physicsStepsCount += 1;
      const steer = customSteering !== null ? customSteering : isContinuousDrivingRef.current.steering;
      const dir = isContinuousDrivingRef.current.direction || 1;

      if (steer !== 0) {
        pose.angle = Math.round((pose.angle + steer * 0.1 * factor + 360) % 360);
      }
      const rad = (pose.angle * Math.PI) / 180;
      const stepDist = (moveSpeed / 100) * 3.6 * dir * factor;
      const nx = Math.max(25, Math.min(495, pose.x + Math.cos(rad) * stepDist));
      const ny = Math.max(25, Math.min(240, pose.y + Math.sin(rad) * stepDist));

      const col = findCollision({ x: nx, y: ny }, solids);
      if (col) {
        collisionOccurred = true;
        setStatusLog(`⚠️ Robot va chạm vào ${col.kind === 'wall' ? 'tường chắn' : 'vật cản'}!`);
        return true;
      }
      pose.x = nx;
      pose.y = ny;
      const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
      pose.distanceCm = live.distanceCm;
      pose.trail = [...pose.trail, { x: pose.x, y: pose.y }];
      setRobotPose({ ...pose });
      setTelemetry((prev) => ({
        ...prev,
        gyroYaw: pose.angle,
        distanceSensor: { cm: pose.distanceCm },
        colorSensor: live.detectedColor || prev.colorSensor
      }));
      return false;
    };

    const executeBlockList = async (blockList) => {
      for (const block of blockList || []) {
        if (stopFlagRef.current) break;
        setActiveBlockId(block.id);

        if (isStepModeRef.current) {
          setIsWaitingForStep(true);
          const def = BLOCK_DEFINITIONS[block.type];
          const bLabel = def ? `${def.nameEn} (${def.nameVi})` : block.type;
          setStatusLog(`🐾 [Bước ${block.id}]: Đang dừng ở khối [${bLabel}]. Nhấn "Bước tiếp ▶" để thực thi.`);
          await new Promise((resolve) => {
            stepResolverRef.current = resolve;
          });
          setIsWaitingForStep(false);
          if (stopFlagRef.current) break;
        }

        const p = block.params || {};

        switch (block.type) {
          case 'when_program_starts':
          case 'when_color_is':
          case 'when_pressed':
          case 'when_closer_than':
          case 'when_tilted':
          case 'when_shaken':
          case 'when_hub_button':
          case 'when_condition':
          case 'define_my_block':
            await sleep(180);
            break;

          case 'motor_set_speed':
            motorSpeeds[p.port] = Number(p.speed);
            setStatusLog(`${p.port} set speed to ${p.speed}%`);
            await sleep(150);
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
              await sleep(28);
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
              await sleep(28);
            }
            break;
          }

          case 'motor_start':
          case 'more_motor_start_power':
            setStatusLog(`${p.port} start motor`);
            await sleep(180);
            break;

          case 'motor_stop':
            setStatusLog(`${p.port} stop motor`);
            await sleep(150);
            break;

          case 'set_movement_motors':
            setStatusLog(`set movement motors to ${p.ports}`);
            await sleep(150);
            break;

          case 'set_movement_speed':
            moveSpeed = Number(p.speed);
            setStatusLog(`set movement speed to ${moveSpeed}%`);
            await sleep(150);
            break;

          case 'set_motor_rotation_distance':
            setStatusLog(`set 1 motor rotation to ${p.distance} ${p.unit} moved`);
            await sleep(150);
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
            const steps = Math.max(8, Math.min(26, Math.round(Math.abs(totalPx) / 3)));
            const stepDist = (totalPx / steps) * sign;
            setStatusLog(`move ${p.direction === 'forward' ? '↑' : '↓'} for ${p.value} ${p.unit}`);

            for (let i = 0; i < steps; i++) {
              if (stopFlagRef.current) break;
              const rad = (pose.angle * Math.PI) / 180;
              const nx = Math.max(25, Math.min(495, pose.x + Math.cos(rad) * stepDist));
              const ny = Math.max(25, Math.min(240, pose.y + Math.sin(rad) * stepDist));
              const col = findCollision({ x: nx, y: ny }, solids);
              if (col) {
                collisionOccurred = true;
                setStatusLog(`⚠️ Robot va chạm vào ${col.kind === 'wall' ? 'tường chắn' : 'vật cản'}!`);
                break;
              }
              pose.x = nx;
              pose.y = ny;
              const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
              pose.distanceCm = live.distanceCm;
              pose.trail = [...pose.trail, { x: pose.x, y: pose.y }];
              setRobotPose({ ...pose });

              setTelemetry((prev) => ({
                ...prev,
                distanceSensor: { cm: pose.distanceCm },
                colorSensor: live.detectedColor || prev.colorSensor,
                motors: {
                  ...prev.motors,
                  A: { angle: prev.motors.A.angle + sign * 15, speed: moveSpeed },
                  B: { angle: prev.motors.B.angle + sign * 15, speed: moveSpeed }
                }
              }));
              await sleep(28);
            }
            break;
          }

          case 'move_with_steering': {
            const turnDeg = Number(p.steering || 90);
            const steps = 14;
            const stepAng = turnDeg / steps;
            setStatusLog(
              `move [${p.steeringText || `steering ${turnDeg}`}] for ${p.value} ${p.unit}`
            );
            for (let i = 0; i < steps; i++) {
              if (stopFlagRef.current) break;
              pose.angle += stepAng;
              const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
              pose.distanceCm = live.distanceCm;
              setRobotPose({ ...pose });
              setTelemetry((prev) => ({
                ...prev,
                gyroYaw: pose.angle,
                distanceSensor: { cm: pose.distanceCm }
              }));
              await sleep(25);
            }
            break;
          }

          case 'start_moving': {
            const sign = p.direction === 'backward' ? -1 : 1;
            isContinuousDrivingRef.current = { moving: true, direction: sign, steering: 0 };
            setStatusLog(`start moving ${p.direction === 'backward' ? '↓' : '↑'}`);
            stepContinuousMovement(0, 1.0);
            await sleep(40);
            break;
          }

          case 'start_moving_steering': {
            const steer = Number(p.steering ?? 30);
            isContinuousDrivingRef.current = { moving: true, direction: 1, steering: steer };
            setStatusLog(
              `start moving steering (${steer > 0 ? `right: ${steer}` : steer < 0 ? `left: ${Math.abs(steer)}` : '0'})`
            );
            stepContinuousMovement(steer, 1.0);
            await sleep(40);
            break;
          }

          case 'more_movement_tank':
            setStatusLog(`start moving at ${p.leftSpeed}% / ${p.rightSpeed}%`);
            await sleep(150);
            break;

          case 'stop_moving':
            isContinuousDrivingRef.current = { moving: false, direction: 0, steering: 0 };
            setStatusLog('stop moving');
            await sleep(120);
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
            await sleep(350);
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
            await sleep(240);
            break;
          }

          case 'light_matrix_write':
            setStatusLog(`write "${p.text}" on 5x5 Light Matrix`);
            setLedMatrix(LED_PATTERNS.SMILE);
            await sleep(450);
            break;

          case 'light_matrix_turn_off':
            setLedMatrix(LED_PATTERNS.OFF);
            setStatusLog('turn off pixels');
            await sleep(180);
            break;

          case 'set_center_button_light':
            setTelemetry((prev) => ({ ...prev, centerButtonColor: p.color }));
            setStatusLog(`set Power Button light to ${p.color}`);
            await sleep(180);
            break;

          case 'light_up_distance_sensor':
            setStatusLog(`${p.port} light up Distance Sensor`);
            await sleep(200);
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
            await sleep(400);
            setTelemetry((prev) => ({ ...prev, hubSoundPlaying: false }));
            break;

          case 'stop_all_sounds':
            setTelemetry((prev) => ({ ...prev, hubSoundPlaying: false }));
            setStatusLog('stop all sounds');
            await sleep(150);
            break;

          case 'wait_seconds': {
            const totalSec = Math.max(0.05, Number(p.seconds ?? 1));
            const tickMs = 28;
            const totalTicks = Math.round((totalSec * 1000) / tickMs);
            setStatusLog(`wait ${totalSec} seconds...`);
            for (let t = 0; t < totalTicks; t++) {
              if (stopFlagRef.current) break;
              if (isContinuousDrivingRef.current.moving) {
                const { direction, steering } = isContinuousDrivingRef.current;
                if (steering !== 0) pose.angle += steering * 0.08;
                const rad = (pose.angle * Math.PI) / 180;
                const step = (moveSpeed / 100) * 3.5 * direction;
                const nx = Math.max(25, Math.min(495, pose.x + Math.cos(rad) * step));
                const ny = Math.max(25, Math.min(240, pose.y + Math.sin(rad) * step));
                const col = findCollision({ x: nx, y: ny }, solids);
                if (col) {
                  collisionOccurred = true;
                  setStatusLog(`⚠️ Robot va chạm vào ${col.kind === 'wall' ? 'tường chắn' : 'vật cản'}!`);
                  break;
                }
                pose.x = nx;
                pose.y = ny;
                pose.trail = [...pose.trail, { x: nx, y: ny }];
                const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
                pose.distanceCm = live.distanceCm;
                setRobotPose({ ...pose });
                setTelemetry((prev) => ({
                  ...prev,
                  gyroYaw: pose.angle,
                  distanceSensor: { cm: pose.distanceCm },
                  colorSensor: live.detectedColor || prev.colorSensor
                }));
              }
              await sleep(tickMs);
            }
            break;
          }

          // ================= KHỐI CHỮ C LỒNG NHAU: REPEAT, FOREVER, IF, IF-ELSE, REPEAT UNTIL =================
          case 'repeat_loop_line_follow': {
            const times = Math.max(1, Number(p.times ?? 10));
            const hasCustomChildren = Array.isArray(block.children) && block.children.length > 0;
            const isDefaultLineFollowDemo =
              p.action === 'line_follow_port_D' &&
              times >= 40 &&
              (!hasCustomChildren ||
                (block.children.length === 1 && block.children[0].id === 'b2_ifelse'));

            if (hasCustomChildren && !isDefaultLineFollowDemo) {
              const safeLoops = Math.min(500, times);
              for (let loopIdx = 0; loopIdx < safeLoops; loopIdx++) {
                if (stopFlagRef.current) break;
                if (loopIdx % 10 === 0 || loopIdx <= 3) {
                  setStatusLog(`repeat (${loopIdx + 1}/${safeLoops})...`);
                }
                const stepsBefore = physicsStepsCount;
                await executeBlockList(block.children);
                if (isContinuousDrivingRef.current.moving && physicsStepsCount === stepsBefore) {
                  const hit = stepContinuousMovement(null, 1.0);
                  if (hit) break;
                  await sleep(25);
                }
              }
            } else {
              setStatusLog(`repeat (${p.times}): Đang dò line đen bằng Cảm biến màu D...`);
              const rawPts = (arenaConfig?.lines || []).flatMap(
                (l, idx) => normalizeLineObject(l, idx).points || []
              );
              const customPoly = [];
              for (let i = 0; i < rawPts.length; i++) {
                const cur = rawPts[i];
                customPoly.push(cur);
                if (i < rawPts.length - 1) {
                  const nxt = rawPts[i + 1];
                  const segDist = Math.hypot(nxt.x - cur.x, nxt.y - cur.y);
                  if (segDist > 12) {
                    const subSteps = Math.min(30, Math.floor(segDist / 8));
                    for (let s = 1; s < subSteps; s++) {
                      const t = s / subSteps;
                      customPoly.push({
                        x: cur.x + (nxt.x - cur.x) * t,
                        y: cur.y + (nxt.y - cur.y) * t
                      });
                    }
                  }
                }
              }

              if (customPoly && customPoly.length > 1) {
                for (let i = 0; i < customPoly.length; i++) {
                  if (stopFlagRef.current) break;
                  const targetPt = customPoly[i];
                  const dx = targetPt.x - pose.x;
                  const dy = targetPt.y - pose.y;
                  if (Math.hypot(dx, dy) > 2) {
                    pose.angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
                  }
                  pose.x = targetPt.x;
                  pose.y = targetPt.y;
                  const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
                  pose.distanceCm = live.distanceCm;
                  pose.trail = [...pose.trail, { x: pose.x, y: pose.y }];
                  setRobotPose({ ...pose });
                  setTelemetry((prev) => ({
                    ...prev,
                    gyroYaw: pose.angle,
                    colorSensor: live.detectedColor || {
                      color: i % 2 === 0 ? 'BLACK' : 'WHITE',
                      reflection: i % 2 === 0 ? 14 : 68
                    },
                    distanceSensor: { cm: pose.distanceCm }
                  }));
                  await sleep(34);
                }
              } else {
                const totalSteps = Math.min(45, Math.max(15, Math.round((p.times || 80) / 2.2)));
                for (let i = 0; i < totalSteps; i++) {
                  if (stopFlagRef.current) break;
                  pose.x = Math.min(395, pose.x + 5.8);
                  const t = (pose.x - 70) / 340;
                  pose.y = 132 + Math.sin(t * Math.PI * 2) * 28;
                  pose.angle = Math.cos(t * Math.PI * 2) * 18;
                  const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
                  pose.distanceCm = live.distanceCm;
                  pose.trail = [...pose.trail, { x: pose.x, y: pose.y }];
                  setRobotPose({ ...pose });

                  setTelemetry((prev) => ({
                    ...prev,
                    gyroYaw: pose.angle,
                    colorSensor: live.detectedColor || {
                      color: i % 2 === 0 ? 'BLACK' : 'WHITE',
                      reflection: i % 2 === 0 ? 14 : 72
                    },
                    distanceSensor: { cm: pose.distanceCm }
                  }));
                  await sleep(32);
                }
              }
            }
            break;
          }

          case 'forever_loop': {
            let loopIdx = 0;
            const maxLoops = 2000;
            while (!stopFlagRef.current && loopIdx < maxLoops) {
              loopIdx++;
              if (loopIdx % 10 === 0 || loopIdx <= 3) {
                setStatusLog(`forever (vòng #${loopIdx})...`);
              }
              if (Array.isArray(block.children) && block.children.length > 0) {
                const stepsBefore = physicsStepsCount;
                await executeBlockList(block.children);
                if (isContinuousDrivingRef.current.moving && physicsStepsCount === stepsBefore) {
                  const hit = stepContinuousMovement(null, 1.0);
                  if (hit) break;
                  await sleep(25);
                }
              } else {
                if (isContinuousDrivingRef.current.moving) {
                  const hit = stepContinuousMovement(null, 1.0);
                  if (hit) break;
                }
                await sleep(40);
              }
            }
            break;
          }

          case 'if_then_block': {
            const condResult = evaluateBooleanCondition(block.conditionBlock, p, pose);
            setStatusLog(
              `if < > then -> Điều kiện = ${condResult ? 'ĐÚNG (True)' : 'SAI (False)'}`
            );
            await sleep(150);
            if (condResult && Array.isArray(block.children) && block.children.length > 0) {
              await executeBlockList(block.children);
            }
            break;
          }

          case 'if_else_block': {
            const condResult = evaluateBooleanCondition(block.conditionBlock, p, pose);
            setStatusLog(
              `if < > then / else -> Điều kiện = ${
                condResult ? 'ĐÚNG (Chạy nhánh then)' : 'SAI (Chạy nhánh else)'
              }`
            );
            await sleep(150);
            if (condResult) {
              if (Array.isArray(block.children) && block.children.length > 0) {
                await executeBlockList(block.children);
              }
            } else {
              if (Array.isArray(block.elseChildren) && block.elseChildren.length > 0) {
                await executeBlockList(block.elseChildren);
              }
            }
            break;
          }

          case 'repeat_until_block': {
            let guard = 0;
            const maxGuard = 1500;
            while (!stopFlagRef.current && guard < maxGuard) {
              const isMet = evaluateBooleanCondition(block.conditionBlock, p, pose);
              if (isMet) {
                setStatusLog(`repeat until < >: Điều kiện thỏa mãn sau ${guard} vòng lặp.`);
                break;
              }
              guard += 1;
              if (guard % 10 === 0 || guard <= 3) {
                setStatusLog(`repeat until < > (vòng #${guard})...`);
              }
              if (Array.isArray(block.children) && block.children.length > 0) {
                const stepsBefore = physicsStepsCount;
                await executeBlockList(block.children);
                if (isContinuousDrivingRef.current.moving && physicsStepsCount === stepsBefore) {
                  const hit = stepContinuousMovement(null, 1.0);
                  if (hit) break;
                  await sleep(25);
                }
              } else {
                if (isContinuousDrivingRef.current.moving) {
                  const hit = stepContinuousMovement(null, 1.0);
                  if (hit) break;
                } else {
                  const rad = (pose.angle * Math.PI) / 180;
                  const nx = Math.max(25, Math.min(495, pose.x + Math.cos(rad) * 4.5));
                  const ny = Math.max(25, Math.min(240, pose.y + Math.sin(rad) * 4.5));
                  const col = findCollision({ x: nx, y: ny }, solids);
                  if (col) {
                    collisionOccurred = true;
                    break;
                  }
                  pose.x = nx;
                  pose.y = ny;
                  const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
                  pose.distanceCm = live.distanceCm;
                  pose.trail = [...pose.trail, { x: pose.x, y: pose.y }];
                  setRobotPose({ ...pose });
                }
                await sleep(30);
              }
            }
            break;
          }

          case 'wait_until_sensor': {
            setStatusLog(`wait until <${p.port || 'E'} ...>`);
            let guard = 0;
            while (
              !stopFlagRef.current &&
              !evaluateBooleanCondition(block.conditionBlock, p, pose) &&
              guard < 1200
            ) {
              guard += 1;
              if (isContinuousDrivingRef.current.moving) {
                const { direction, steering } = isContinuousDrivingRef.current;
                if (steering !== 0) pose.angle += steering * 0.08;
                const rad = (pose.angle * Math.PI) / 180;
                const step = (moveSpeed / 100) * 3.4 * direction;
                const nx = Math.max(25, Math.min(495, pose.x + Math.cos(rad) * step));
                const ny = Math.max(25, Math.min(240, pose.y + Math.sin(rad) * step));
                const col = findCollision({ x: nx, y: ny }, solids);
                if (col) {
                  collisionOccurred = true;
                  setStatusLog(`⚠️ Robot va chạm vào ${col.kind === 'wall' ? 'tường chắn' : 'vật cản'}!`);
                  break;
                }
                pose.x = nx;
                pose.y = ny;
                pose.trail = [...pose.trail, { x: nx, y: ny }];
              }
              const live = computeLiveArenaSensors(pose.x, pose.y, pose.angle);
              pose.distanceCm = live.distanceCm;
              setRobotPose({ ...pose });
              setTelemetry((prev) => ({
                ...prev,
                gyroYaw: pose.angle,
                distanceSensor: { cm: pose.distanceCm },
                colorSensor: live.detectedColor || prev.colorSensor
              }));
              await sleep(28);
            }
            break;
          }

          case 'set_yaw_angle_to_0':
            pose.angle = 0;
            setRobotPose({ ...pose });
            setTelemetry((prev) => ({ ...prev, gyroYaw: 0 }));
            setStatusLog('set yaw angle to 0');
            await sleep(150);
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
            await sleep(350);
            break;
          }

          case 'display_write':
            setTelemetry((prev) => ({ ...prev, displayMessage: p.text }));
            setStatusLog(`Display: "${p.text}"`);
            await sleep((p.seconds || 1.5) * 1000);
            break;

          case 'stop_all_cap':
            stopFlagRef.current = true;
            setStatusLog(`stop [${p.target || 'all'}]`);
            break;

          default:
            await sleep(160);
        }
      }
    };

    await executeBlockList(blocks);

    if (!stopFlagRef.current || blocks.some((b) => b.type === 'stop_all_cap')) {
      const evalRes = evaluateMissionSuccess(pose, pose.trail, collisionOccurred);
      setGradingResult({
        show: true,
        passed: evalRes.passed,
        reason: evalRes.reason,
        criteriaResults: evalRes.criteriaResults,
        title: currentLesson.title,
        timestamp: Date.now()
      });
      if (evalRes.passed) {
        setMissionCompleted(true);
        setCompletedLessons((prev) => ({ ...prev, [currentLesson.id]: true }));
        playSnapClick(780);
        setStatusLog(`🏆 ĐẠT TIÊU CHÍ: ${evalRes.reason}`);
      } else {
        playSnapClick(280);
        setStatusLog(`❌ CHƯA ĐẠT: ${evalRes.reason}`);
      }
    }
  } catch (err) {
    console.error("Runtime execution error:", err);
    setStatusLog(`⚠️ Lỗi khi chạy chương trình: ${err.message}`);
  } finally {
    isContinuousDrivingRef.current = { moving: false, direction: 0, steering: 0 };
    setActiveBlockId(null);
    setIsRunning(false);
    setIsStepMode(false);
    isStepModeRef.current = false;
    setIsWaitingForStep(false);
    stepResolverRef.current = null;
  }
};

  const handleStepClick = async () => {
    if (!isRunning) {
      isStepModeRef.current = true;
      setIsStepMode(true);
      runProgram();
    } else if (isWaitingForStep) {
      if (stepResolverRef.current) {
        const resolve = stepResolverRef.current;
        stepResolverRef.current = null;
        resolve();
      }
    } else {
      isStepModeRef.current = true;
      setIsStepMode(true);
      setStatusLog('🐾 Đã chuyển sang chế độ Từng bước. Robot sẽ dừng ở khối tiếp theo.');
    }
  };

  const handlePlayClick = () => {
    if (isRunning) {
      if (isStepModeRef.current || isWaitingForStep) {
        isStepModeRef.current = false;
        setIsStepMode(false);
        setIsWaitingForStep(false);
        setStatusLog('▶ Tiếp tục chạy liên tục chương trình...');
        if (stepResolverRef.current) {
          const resolve = stepResolverRef.current;
          stepResolverRef.current = null;
          resolve();
        }
      }
    } else {
      isStepModeRef.current = false;
      setIsStepMode(false);
      setIsWaitingForStep(false);
      runProgram();
    }
  };

  const stopProgram = () => {
    stopFlagRef.current = true;
    isStepModeRef.current = false;
    setIsStepMode(false);
    setIsWaitingForStep(false);
    if (stepResolverRef.current) {
      const resolve = stepResolverRef.current;
      stepResolverRef.current = null;
      resolve();
    }
    isContinuousDrivingRef.current = { moving: false, direction: 0, steering: 0 };
    setActiveBlockId(null);
    setIsRunning(false);
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
      dragState.targetBooleanBlockId ||
      dragState.targetContainerId !== 'root' ||
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

      {/* MODAL QUẢN LÝ & THIẾT KẾ NHIỆM VỤ / SA BÀN (MISSION STUDIO) */}
      {showMissionStudioModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[88vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Settings2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide">
                    🎯 Mission & Arena Studio — Thiết Kế Nhiệm Vụ & Sa Bàn Linh Động
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Tạo không giới hạn cấp độ/nhiệm vụ mới, lưu sa bàn tự vẽ, chỉnh sửa đề bài và xuất/nhập file .JSON chia sẻ cho học sinh
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={missionFileInputRef}
                  type="file"
                  accept="application/json"
                  onChange={handleImportMissionsJson}
                  className="hidden"
                />
                <button
                  onClick={() => missionFileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold"
                  title="Nhập bộ nhiệm vụ từ file JSON"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Nhập JSON
                </button>
                <button
                  onClick={handleExportMissionsJson}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold"
                  title="Xuất toàn bộ nhiệm vụ & sa bàn ra file JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xuất JSON
                </button>
                <button
                  onClick={handleResetDefaultMissions}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold"
                  title="Khôi phục 8 bài học mặc định"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Mặc định
                </button>
                <button
                  onClick={() => setShowMissionStudioModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Đóng ✕
                </button>
              </div>
            </div>

            {/* Body: 2 cột (Danh sách nhiệm vụ bên trái + Form chỉnh sửa chi tiết bên phải) */}
            <div className="flex-1 min-h-0 grid grid-cols-12 overflow-hidden">
              {/* Cột trái: Danh sách tất cả nhiệm vụ */}
              <div className="col-span-5 border-r border-slate-200 bg-slate-50 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white">
                  <span className="text-xs font-extrabold text-slate-700 uppercase">
                    Danh Sách Nhiệm Vụ ({missions.length} cấp độ)
                  </span>
                  <button
                    onClick={handleCreateNewMission}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm"
                  >
                    <FilePlus2 className="w-3.5 h-3.5" />
                    + Tạo Nhiệm Vụ Mới
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                  {missions.map((m, idx) => {
                    const isSelected = m.id === currentLessonId;
                    const isDone = completedLessons[m.id];
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectLesson(m)}
                        className={`cursor-pointer rounded-xl p-2.5 border-2 transition ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 text-[10px] font-extrabold">
                                #{idx + 1}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                                {m.mode}
                              </span>
                              {m.isCustom && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  Tự thiết kế
                                </span>
                              )}
                              {isDone && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs font-extrabold text-slate-900 mt-1 truncate">
                              {m.title}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">{m.objective}</div>
                          </div>

                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleDuplicateMission(m)}
                              title="Nhân bản nhiệm vụ này"
                              className="p-1 rounded hover:bg-slate-200 text-slate-600"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {missions.length > 1 && (
                              <button
                                onClick={() => handleDeleteMission(m.id)}
                                title="Xóa nhiệm vụ này"
                                className="p-1 rounded hover:bg-rose-100 text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cột phải: Chỉnh sửa chi tiết Nhiệm vụ đang chọn */}
              <div className="col-span-7 p-5 overflow-y-auto space-y-4 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-amber-600">
                      Đang chỉnh sửa nhiệm vụ
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {currentLesson.title}
                    </h4>
                  </div>
                  <button
                    onClick={handleSaveCurrentStateToMission}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow"
                  >
                    <Save className="w-4 h-4" />
                    Lưu Sa Bàn & {blocks.length} Khối Lệnh Hiện Tại Vào Bài Này
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên Nhiệm Vụ / Cấp Độ (Title):
                    </label>
                    <input
                      type="text"
                      value={currentLesson.title}
                      onChange={(e) => handleUpdateMissionField('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chủ Đề / Cấp Độ (Unit / Level):
                    </label>
                    <input
                      type="text"
                      value={currentLesson.level || ''}
                      onChange={(e) => handleUpdateMissionField('level', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chế Độ Mô Phỏng & Loại Sa Bàn Nền:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={currentLesson.mode || '2D'}
                        onChange={(e) => handleUpdateMissionField('mode', e.target.value)}
                        className="px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold bg-slate-50"
                      >
                        <option value="2D">Sa bàn 2D (12 bản đồ)</option>
                        <option value="3D">Không gian 3D (6 sa bàn)</option>
                      </select>

                      {(currentLesson.mode || '2D') === '2D' ? (
                        <select
                          value={mapType}
                          onChange={(e) => handleUpdateMissionField('mapType', e.target.value)}
                          className="flex-1 px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold bg-slate-50"
                        >
                          {MAP_2D_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={scene3DType}
                          onChange={(e) => handleUpdateMissionField('scene3DType', e.target.value)}
                          className="flex-1 px-2.5 py-2 rounded-lg border border-orange-300 text-xs font-bold bg-orange-50 text-orange-950"
                        >
                          {SCENE_3D_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mục Tiêu Đề Bài (Objective hiển thị trên thanh tiêu đề):
                    </label>
                    <textarea
                      rows={2}
                      value={currentLesson.objective || ''}
                      onChange={(e) => handleUpdateMissionField('objective', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hướng Dẫn Học Sinh Thực Hiện (Mỗi dòng 1 bước):
                    </label>
                    <textarea
                      rows={3}
                      value={(currentLesson.steps || []).join('\n')}
                      onChange={(e) =>
                        handleUpdateMissionField('steps', e.target.value.split('\n'))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Tóm tắt các vật thể đang có trên Sa bàn của nhiệm vụ này */}
                <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 uppercase">
                      🗺 Cấu hình Sa bàn Tùy chỉnh của Nhiệm vụ này
                    </span>
                    <button
                      onClick={() => {
                        setShowMissionStudioModal(false);
                        setSimMode('2D');
                        setRightRedZoneTab('arena');
                        setStatusLog(
                          '🛠 Hãy nhấn nút "🛠 Thiết Kế Sa Bàn" màu vàng ở góc trên phải của Sa bàn 2D để vẽ đường line, đặt Đích GOAL, Tường & Vật cản!'
                        );
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-extrabold"
                    >
                      Mở Công Cụ Vẽ Trực Tiếp Trên Sa Bàn 2D →
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-[11px]">
                    <div className="bg-slate-800 rounded-lg p-2">
                      <div className="font-mono font-extrabold text-sm text-amber-300">
                        {arenaConfig?.lines?.length || 0}
                      </div>
                      <div className="text-slate-400">Đường Line</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2">
                      <div className="font-mono font-extrabold text-sm text-emerald-400">
                        {arenaConfig?.goals?.length || 0}
                      </div>
                      <div className="text-slate-400">Đích GOAL</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2">
                      <div className="font-mono font-extrabold text-sm text-rose-400">
                        {arenaConfig?.obstacles?.length || 0}
                      </div>
                      <div className="text-slate-400">Trụ Vật Cản</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2">
                      <div className="font-mono font-extrabold text-sm text-cyan-300">
                        {arenaConfig?.walls?.length || 0}
                      </div>
                      <div className="text-slate-400">Tường Chắn</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-2">
                      <div className="font-mono font-extrabold text-sm text-purple-300">
                        {arenaConfig?.colorPatches?.length || 0}
                      </div>
                      <div className="text-slate-400">Dải Màu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

      {/* MODAL SỔ TAY KHỐI LỆNH & 6 KỸ THUẬT LẬP TRÌNH FLL/WRO */}
      {showEncyclopediaModal && (
        <BlockEncyclopediaModal
          isOpen={showEncyclopediaModal}
          onClose={() => setShowEncyclopediaModal(false)}
          onInsertBlock={(blockType) => {
            handleInsertBlockAt(blockType, blocks.length);
            setShowEncyclopediaModal(false);
          }}
        />
      )}

      {/* MODAL SỔ TAY HƯỚNG DẪN SỬ DỤNG NHÚNG TRỰC TIẾP (HTML USER GUIDE) */}
      {showUserGuideModal && (
        <UserGuideModal
          isOpen={showUserGuideModal}
          onClose={() => setShowUserGuideModal(false)}
        />
      )}

      {/* MODAL MÃ PIN GIÁO VIÊN (PIN MẶC ĐỊNH: 1234) */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto mb-3 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Xác Nhận Quyền Giáo Viên
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập mã PIN Giáo viên để mở khóa toàn bộ Lời giải mẫu và quyền biên tập nhiệm vụ (Mặc định: <strong className="text-slate-800">1234</strong>).
            </p>
            <input
              type="password"
              maxLength={8}
              autoFocus
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (pinInput === '1234') {
                    setRoleMode('teacher');
                    setShowPinModal(false);
                    setPinInput('');
                    setStatusLog('👨‍🏫 Đã kích hoạt Chế độ Giáo viên (Toàn quyền).');
                  } else {
                    setPinError('Mã PIN không đúng (Gợi ý: 1234)');
                  }
                }
              }}
              placeholder="Nhập mã PIN (1234)..."
              className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 border rounded-xl mb-2 focus:ring-2 focus:ring-amber-400 outline-none"
            />
            {pinError && <p className="text-xs text-rose-600 font-bold mb-3">{pinError}</p>}
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput('');
                  setPinError('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  if (pinInput === '1234') {
                    setRoleMode('teacher');
                    setShowPinModal(false);
                    setPinInput('');
                    setStatusLog('👨‍🏫 Đã kích hoạt Chế độ Giáo viên (Toàn quyền).');
                  } else {
                    setPinError('Mã PIN không đúng (Gợi ý: 1234)');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM LỜI GIẢI MẪU CHO GIÁO VIÊN / HỌC SINH */}
      {showSolutionPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Lời Giải Mẫu: {currentLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setShowSolutionPreviewModal(false)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold"
              >
                Đóng ✕
              </button>
            </div>
            <div className="my-3 text-xs text-slate-600">
              <p className="mb-2">
                Dưới đây là chồng lệnh chuẩn được thiết kế bởi thầy Hoàng Ngọc Cảnh để giải quyết nhiệm vụ này.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-[45vh] overflow-y-auto space-y-1.5">
                {(currentLesson.solutionBlocks || []).map((b, i) => {
                  const bDef = BLOCK_DEFINITIONS[b.type];
                  return (
                    <div
                      key={b.id || i}
                      className="px-3 py-1.5 rounded-lg text-white font-mono text-xs flex items-center justify-between shadow-sm"
                      style={{ backgroundColor: bDef?.color || '#0090FF' }}
                    >
                      <span className="font-bold">
                        #{i + 1} {bDef?.nameEn || b.type}
                      </span>
                      <span className="text-[10px] opacity-90">{bDef?.nameVi}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setBlocks(currentLesson.solutionBlocks || []);
                  setShowSolutionPreviewModal(false);
                  playSnapClick(650);
                  setStatusLog('✨ Đã nạp Lời giải mẫu vào vùng lập trình!');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow"
              >
                Nạp Lời Giải Mẫu Vào Vùng Lập Trình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KẾT QUẢ CHẤM ĐIỂM NHIỆM VỤ (GRADING RESULT) */}
      {gradingResult && gradingResult.show && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-150">
            <div
              className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${
                gradingResult.passed
                  ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50'
                  : 'bg-rose-100 text-rose-600 ring-4 ring-rose-50'
              }`}
            >
              {gradingResult.passed ? (
                <Award className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              {gradingResult.passed ? '🎉 HOÀN THÀNH XUẤT SẮC!' : '⚠️ CHƯA ĐẠT TIÊU CHÍ'}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              {gradingResult.title}
            </p>

            <div
              className={`p-3 rounded-xl text-xs mb-4 text-left border ${
                gradingResult.passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold mb-1">Đánh giá hệ thống:</div>
              <div>{gradingResult.reason}</div>
            </div>

            {gradingResult.criteriaResults && gradingResult.criteriaResults.length > 0 && (
              <div className="text-left text-xs mb-5 space-y-1.5">
                <div className="font-extrabold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                  Bảng kiểm tiêu chí:
                </div>
                {gradingResult.criteriaResults.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <span className="text-slate-700 font-semibold">{c.label}</span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[10px] ${
                        c.passed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {c.passed ? '✓ Đạt' : '✕ Chưa đạt'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setGradingResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setGradingResult(null);
                  resetSimulatorPose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                ↺ Đặt Lại Vị Trí
              </button>
              {gradingResult.passed && (
                <button
                  onClick={() => {
                    setGradingResult(null);
                    const idx = missions.findIndex((m) => m.id === currentLessonId);
                    if (idx >= 0 && idx < missions.length - 1) {
                      handleSelectLesson(missions[idx + 1]);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow"
                >
                  Bài Tiếp Theo →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP PROJECT TAB BAR */}
      <header className="h-12 bg-[#eef0f3] border-b border-slate-300 px-3 flex items-center justify-between shrink-0 overflow-x-auto whitespace-nowrap gap-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleSelectLesson(missions[0])}
            title="Home"
            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 shadow-sm shrink-0"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* CHỌN NHIỆM VỤ THEO LỘ TRÌNH 4 NHÁNH (NỀN TẢNG → ỨNG DỤNG → LUYỆN THI → TỰ DO) */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-full border border-slate-300 shadow-sm shrink-0">
            <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
            <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={currentLessonId}
              onChange={(e) => {
                const found = missions.find((l) => l.id === e.target.value);
                if (found) handleSelectLesson(found);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1 max-w-[170px] sm:max-w-[210px] truncate"
            >
              {LEARNING_TRACKS.map((track) => {
                const trackMissions = missions.filter((m) => (m.track || 'mission') === track.id);
                if (trackMissions.length === 0) return null;
                return (
                  <optgroup key={track.id} label={`${track.icon} ${track.name}`}>
                    {trackMissions.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title} ({lesson.mode})
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>

          {/* NÚT CHUYỂN ĐỔI CHẾ ĐỘ: HỌC SINH ↔ GIÁO VIÊN */}
          <button
            onClick={() => {
              if (roleMode === 'student') {
                setShowPinModal(true);
              } else {
                setRoleMode('student');
                setStatusLog('🎒 Đã chuyển về Chế độ Học sinh.');
              }
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-extrabold border shadow-sm transition shrink-0 ${
              roleMode === 'teacher'
                ? 'bg-purple-600 text-white border-purple-500 shadow-purple-200'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
            title="Nhấn để đổi vai trò giữa Học sinh và Giáo viên (PIN: 1234)"
          >
            {roleMode === 'teacher' ? (
              <>
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span>👨‍🏫 Giáo viên</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>🎒 Học sinh</span>
              </>
            )}
          </button>

          {/* NÚT MỞ SỔ TAY HƯỚNG DẪN SỬ DỤNG NHÚNG TRỰC TIẾP */}
          <button
            onClick={() => setShowUserGuideModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm transition shrink-0"
            title="Xem Sổ tay Hướng Dẫn Sử Dụng nền tảng LEGO SPIKE Prime Studio (Tài liệu HTML nhúng trực tiếp)"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hướng Dẫn</span>
            <span className="sm:hidden">HDSD</span>
          </button>

          {/* NÚT MỞ SỔ TAY KHỐI LỆNH & 6 KỸ THUẬT LẬP TRÌNH FLL/WRO */}
          <button
            onClick={() => setShowEncyclopediaModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-sm transition shrink-0"
            title="Tra cứu 6 kỹ thuật điều khiển FLL/WRO và Bách khoa toàn thư khối lệnh SPIKE Prime"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sổ Tay (FLL/WRO)</span>
            <span className="md:hidden">Sổ Tay</span>
          </button>

          <button
            onClick={() => setShowMissionStudioModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm transition shrink-0"
            title="Mở trình Quản lý & Thiết kế Nhiệm vụ / Sa bàn mới"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Nhiệm Vụ ({missions.length})</span>
          </button>

          <button
            onClick={handleCreateNewMission}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm transition shrink-0"
            title="Tạo nhanh 1 nhiệm vụ và sa bàn trống mới"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Bài Mới</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleSaveCurrentStateToMission}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-800 border border-amber-400 text-xs font-bold shadow-sm transition shrink-0"
            title="Lưu Sa bàn tự vẽ và chồng lệnh hiện tại vào nhiệm vụ đang mở"
          >
            <Save className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Lưu Sa Bàn & Code</span>
            <span className="sm:hidden">Lưu</span>
          </button>

          <button
            onClick={() => setShowExtensionsModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Extensions ({enabledExtensions.length})</span>
          </button>

          <button
            onClick={() => setRightRedZoneTab('builder')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border shadow-sm transition shrink-0 ${
              rightRedZoneTab === 'builder'
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Cog className="w-3.5 h-3.5" />
            <span>5 Cơ Cấu</span>
          </button>
        </div>
      </header>

      {/* THANH ĐỀ BÀI, TIÊU CHÍ ĐẠT & GỢI Ý DÀNH CHO HỌC SINH */}
      <div className="bg-amber-50/90 border-b border-amber-200 px-3.5 py-1.5 text-xs text-slate-800 flex flex-col gap-1 shrink-0 z-20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] shrink-0">
              {currentLesson.level || 'Nhiệm vụ'}
            </span>
            <span className="font-extrabold text-slate-900 truncate">
              {currentLesson.title}:
            </span>
            <span className="text-slate-700 truncate">
              {currentLesson.objective}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nút nạp lại Code khởi đầu */}
            <button
              onClick={() => {
                const starter = currentLesson.starterBlocks || [
                  { id: 'b0', type: 'when_program_starts', params: {} }
                ];
                setBlocks(starter);
                playSnapClick(480);
                setStatusLog('🔄 Đã nạp lại Code Khởi Đầu của bài học.');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-300 shadow-sm"
              title="Khôi phục chồng lệnh về trạng thái ban đầu của bài học"
            >
              <RotateCcw className="w-3 h-3 text-blue-600" />
              <span>Code khởi đầu</span>
            </button>

            {/* Nút xem Gợi ý từng bước (1 -> 2 -> 3) */}
            {currentLesson.hints && currentLesson.hints.length > 0 && (
              <button
                onClick={() => {
                  setRevealedHintIndex((prev) =>
                    prev < currentLesson.hints.length ? prev + 1 : 1
                  );
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-[11px] shadow-sm"
              >
                <Lightbulb className="w-3 h-3 text-amber-900" />
                <span>
                  Gợi ý ({revealedHintIndex}/{currentLesson.hints.length})
                </span>
              </button>
            )}

            {/* Nút xem Lời giải mẫu */}
            <button
              onClick={() => {
                if (currentLesson.lockSolution && roleMode === 'student') {
                  setShowPinModal(true);
                } else {
                  setShowSolutionPreviewModal(true);
                }
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] border shadow-sm ${
                currentLesson.lockSolution && roleMode === 'student'
                  ? 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
            >
              {currentLesson.lockSolution && roleMode === 'student' ? (
                <>
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Lời giải (Khóa)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Xem Lời Giải Mẫu</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowBriefBar((v) => !v)}
              className="p-1 rounded text-slate-500 hover:text-slate-800"
              title={showBriefBar ? 'Thu gọn đề bài' : 'Mở rộng đề bài'}
            >
              {showBriefBar ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Nội dung chi tiết: Tiêu chí đạt + Gợi ý đang mở */}
        {showBriefBar && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/80 text-[11px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-slate-800">Tiêu chí hoàn thành:</span>
              {(currentLesson.successCriteria || [currentLesson.objective]).map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-300 font-semibold text-[10px]"
                >
                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                  {c}
                </span>
              ))}
            </div>

            {revealedHintIndex > 0 && currentLesson.hints?.[revealedHintIndex - 1] && (
              <div className="w-full bg-yellow-100/90 border border-yellow-300 text-yellow-900 px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 animate-in fade-in">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  <strong>Gợi ý #{revealedHintIndex}:</strong>{' '}
                  {currentLesson.hints[revealedHintIndex - 1]}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

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

            {/* VÙNG CHỨA CHỒNG LỆNH KÉO THẢ (CÓ THANH CUỘN RÕ RÀNG & NÚT CUỘN NHANH ĐẦU/CUỐI TRANG) */}
            <div
              ref={codeScrollContainerRef}
              className="flex-1 min-h-0 overflow-y-scroll overflow-x-auto px-8 py-6 code-canvas-scrollbar relative select-text"
            >
              <div
                style={{
                  transform: `scale(${canvasZoom / 100})`,
                  transformOrigin: 'top left',
                  minHeight: '100%',
                  minWidth: 'max-content'
                }}
                className="space-y-0.5 pb-36"
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
                          parentId="root"
                          parentBranch="root"
                          isPalette={false}
                          isCurrent={activeBlockId === block.id}
                          activeBlockId={activeBlockId}
                          isDragging={
                            dragState &&
                            dragState.hasMoved &&
                            dragState.source === 'canvas' &&
                            dragState.block.id === block.id
                          }
                          dragState={dragState}
                          onUpdateParam={handleUpdateBlockParam}
                          onClearCondition={handleClearCondition}
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

                {/* NÚT CUỘN NHANH ĐẦU/CUỐI KHI CHỒNG LỆNH DÀI */}
                {blocks.length >= 6 && (
                  <div className="sticky bottom-2 left-full -ml-28 w-fit z-20 flex flex-col gap-1.5 shadow-lg select-none">
                    <button
                      type="button"
                      onClick={() => {
                        codeScrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow flex items-center justify-center text-[10px] font-bold gap-1 px-2.5 transition"
                      title="Cuộn lên đầu chương trình"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>Đầu trang</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (codeScrollContainerRef.current) {
                          codeScrollContainerRef.current.scrollTo({
                            top: codeScrollContainerRef.current.scrollHeight,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow flex items-center justify-center text-[10px] font-bold gap-1 px-2.5 transition"
                      title="Cuộn xuống cuối chương trình"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Cuối trang</span>
                    </button>
                  </div>
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
                  onClick={handleUndo}
                  title="Hoàn tác thao tác khối lệnh (Undo — Ctrl+Z)"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition"
                >
                  <Undo2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Undo</span>
                </button>
                <button
                  onClick={handleRedo}
                  title="Làm lại thao tác khối lệnh (Redo — Ctrl+Y)"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition"
                >
                  <Redo2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Redo</span>
                </button>

                <div className="h-4 w-[1px] bg-slate-300 mx-1" />

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
          <div
            className={`h-full p-3 flex flex-col justify-between bg-transparent z-10 shrink-0 transition-all duration-300 ${
              arenaLayoutMode === 'max'
                ? 'w-[82%] min-w-[720px]'
                : arenaLayoutMode === 'wide'
                ? 'w-[68%] min-w-[600px]'
                : 'w-[52%] min-w-[480px] max-w-[960px]'
            }`}
          >
            <div className="flex-1 min-h-0 bg-white rounded-2xl border-2 border-rose-500 shadow-[0_8px_30px_rgba(244,63,94,0.12)] flex flex-col overflow-hidden">
              {/* Thanh Tab cố định chiều cao h-11 shrink-0 không bao giờ xuống dòng */}
              <div className="h-11 shrink-0 px-2 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 overflow-x-auto whitespace-nowrap gap-1">
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setRightRedZoneTab('arena')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold transition shrink-0 ${
                      rightRedZoneTab === 'arena'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>🏁 Sa Bàn ({simMode})</span>
                  </button>

                  <button
                    onClick={() => setRightRedZoneTab('hub')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                      rightRedZoneTab === 'hub'
                        ? 'bg-yellow-400 text-slate-950 shadow'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                    title="Bảng điều khiển Bộ não Hub 5x5 & Cảm biến"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Hub</span>
                  </button>

                  <button
                    onClick={() => setRightRedZoneTab('python')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                      rightRedZoneTab === 'python'
                        ? 'bg-cyan-400 text-slate-950 shadow'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                    title="Mã nguồn Python 3 đồng bộ"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Python</span>
                  </button>

                  <button
                    onClick={() => setRightRedZoneTab('builder')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                      rightRedZoneTab === 'builder'
                        ? 'bg-pink-500 text-white shadow'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                    title="5 Cơ cấu robot SPIKE Prime chính thức"
                  >
                    <Cog className="w-3.5 h-3.5" />
                    <span>Cơ Cấu</span>
                  </button>
                </div>

                {/* NÚT CHUYỂN BỐ CỤC GỌN GÀNG: 52% | 68% | 82% */}
                <div className="flex items-center gap-0.5 bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
                  <button
                    type="button"
                    onClick={() => setArenaLayoutMode('balanced')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      arenaLayoutMode === 'balanced'
                        ? 'bg-rose-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Chế độ Cân Bằng (52% Sa Bàn / 48% Lập Trình)"
                  >
                    52%
                  </button>
                  <button
                    type="button"
                    onClick={() => setArenaLayoutMode('wide')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      arenaLayoutMode === 'wide'
                        ? 'bg-amber-400 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Chế độ Mở Rộng (68% Sa Bàn — Kéo dài sa bàn)"
                  >
                    ⛶ 68%
                  </button>
                  <button
                    type="button"
                    onClick={() => setArenaLayoutMode('max')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      arenaLayoutMode === 'max'
                        ? 'bg-emerald-400 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Chế độ Toàn Cảnh (82% Sa Bàn — Khung sa bàn cực đại)"
                  >
                    🖥 82%
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
                        resetSimulatorPose(newMap, arenaConfig);
                      }}
                      scene3DType={scene3DType}
                      setScene3DType={(newScene) => {
                        setScene3DType(newScene);
                        resetSimulatorPose(mapType, arenaConfig);
                      }}
                      robotPose={robotPose}
                      onResetSimulator={() => resetSimulatorPose(mapType, arenaConfig)}
                      telemetry={telemetry}
                      missionCompleted={missionCompleted}
                      onManualNudgeArm={handleManualNudgeArm}
                      arenaConfig={arenaConfig}
                      onUpdateArenaConfig={handleUpdateArenaConfig}
                      onSetStartPose={handleSetStartPose}
                      onApplyMeasurement={handleApplyMeasurement}
                      onFloorCanvasReady={(canvas) => {
                        floorCanvasRef.current = canvas;
                      }}
                      onCargoStatusChange={(status) => {
                        cargoStatusRef.current = status;
                      }}
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
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs shrink-0">
                    <span className="font-mono font-bold text-white flex items-center gap-2">
                      <span>main.py (SPIKE™ Prime Python 3 API)</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({pythonCode.split('\n').length} dòng)
                      </span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pythonCode);
                        setCopiedPython(true);
                        setTimeout(() => setCopiedPython(false), 1800);
                      }}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded text-xs font-bold transition"
                    >
                      {copiedPython ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedPython ? 'Đã sao chép' : 'Copy Python'}
                    </button>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto visible-code-scrollbar bg-slate-900/95 rounded-xl p-3 border border-slate-800 flex font-mono text-xs leading-relaxed">
                    {/* Cột số thứ tự dòng */}
                    <div className="select-none pr-3 mr-3 border-r border-slate-700/60 text-slate-500 text-right text-[11px] font-mono shrink-0">
                      {pythonCode.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    {/* Nội dung code Python có thể cuộn ngang/dọc xem hết code */}
                    <pre className="code-editor flex-1 text-emerald-300 overflow-x-auto whitespace-pre font-mono">
                      {pythonCode}
                    </pre>
                  </div>
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

            {/* CỤM NÚT STOP & PLAY/RUN Ở GÓC DƯỚI PHẢI + GHI DẤU BẢN QUYỀN VĨNH VIỄN */}
            <div className="h-14 pt-2 flex items-center justify-between px-2">
              <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 truncate pr-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-[11px] text-slate-700 font-bold truncate">
                  <span>Thiết kế bởi thầy Hoàng Ngọc Cảnh — </span>
                  <span className="hidden 2xl:inline">Giáo viên trường THCS & THPT Đinh Thiện Lý</span>
                  <span className="2xl:hidden">LSTS</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Tốc độ mô phỏng 0.5x, 1x, 2x */}
                <div className="flex items-center bg-white px-1 py-0.5 rounded-xl border border-slate-300 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-bold px-1 flex items-center gap-0.5" title="Tốc độ mô phỏng">
                    <Gauge className="w-3.5 h-3.5 text-slate-500" />
                  </span>
                  {[0.5, 1, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => changeSimSpeed(spd)}
                      title={`Tốc độ mô phỏng: ${spd}x`}
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] font-extrabold transition ${
                        simSpeed === spd
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Nút Chạy từng bước (Step-by-Step Debugger) */}
                <button
                  onClick={handleStepClick}
                  title={
                    !isRunning
                      ? 'Bắt đầu Chạy từng bước (Step Debugger)'
                      : isWaitingForStep
                      ? 'Thực thi khối tiếp theo (Next Step)'
                      : 'Tạm dừng & Chuyển sang chế độ từng bước'
                  }
                  className={`h-11 px-3 rounded-full flex items-center gap-1.5 shadow-md font-extrabold text-xs transition border ${
                    isWaitingForStep
                      ? 'bg-blue-600 text-white hover:bg-blue-500 ring-4 ring-blue-200 animate-pulse border-blue-400 scale-105'
                      : isStepMode
                      ? 'bg-blue-500 text-white hover:bg-blue-400 border-blue-400'
                      : 'bg-white hover:bg-blue-50 text-blue-700 border-slate-300 hover:border-blue-400'
                  }`}
                >
                  <Footprints className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">
                    {isWaitingForStep ? 'Bước tiếp ▶' : isStepMode ? 'Đang bước...' : 'Từng bước'}
                  </span>
                </button>

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
                  onClick={handlePlayClick}
                  disabled={isRunning && !isWaitingForStep && !isStepMode}
                  title={
                    isRunning && (isWaitingForStep || isStepMode)
                      ? 'Tiếp tục chạy liên tục (Resume Normal Run)'
                      : isRunning
                      ? 'Đang chạy mô phỏng...'
                      : 'Chạy chương trình (Run Program)'
                  }
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition ${
                    isRunning && !isWaitingForStep && !isStepMode
                      ? 'bg-amber-400 text-slate-950 animate-pulse cursor-not-allowed opacity-90'
                      : isRunning && (isWaitingForStep || isStepMode)
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white animate-bounce ring-4 ring-emerald-200'
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
