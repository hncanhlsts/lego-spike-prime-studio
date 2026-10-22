import React, { useState, useEffect, useRef } from 'react';
import {
  Map,
  Box,
  RotateCcw,
  CheckCircle2,
  Hand,
  Monitor,
  Wrench,
  Bot,
  Flag,
  BrickWall,
  ShieldAlert,
  Palette,
  PenTool,
  Eraser,
  Trash2,
  ImagePlus,
  RotateCw,
  Move,
  Slash,
  Undo2,
  Grid,
  Package,
  Sparkles,
  Camera
} from 'lucide-react';
import * as THREE from 'three';

const PATCH_COLORS = [
  { name: 'BLACK', label: 'Đen (0)', hex: '#0f172a', reflection: 12 },
  { name: 'RED', label: 'Đỏ (9)', hex: '#ef4444', reflection: 65 },
  { name: 'YELLOW', label: 'Vàng (7)', hex: '#eab308', reflection: 85 },
  { name: 'GREEN', label: 'Xanh lá (6)', hex: '#22c55e', reflection: 52 },
  { name: 'BLUE', label: 'Xanh dương (3)', hex: '#3b82f6', reflection: 42 }
];

export const MAP_2D_OPTIONS = [
  { value: 'line_track', label: 'Sa bàn 1: Dò Line Cong & Vật cản' },
  { value: 'maze', label: 'Sa bàn 2: Mê cung Góc vuông' },
  { value: 'sensor_lab', label: 'Sa bàn 3: Dải màu Cảm biến (Sensor Lab)' },
  { value: 'slalom_obstacles', label: 'Sa bàn 4: Zíc-zắc Né 3 Trụ (Slalom)' },
  { value: 'fll_challenge', label: 'Sa bàn 5: Thảm Thi Đấu FLL (M01-M03)' },
  { value: 'loop_circuit', label: 'Sa bàn 6: Đường Đua F1 Khép Kín' },
  { value: 'wro_smart_city', label: 'Sa bàn 7: WRO Đô Thị Thông Minh (Giao Lộ 4 Màu)' },
  { value: 'warehouse_grid', label: 'Sa bàn 8: Kho Hàng Tự Động (Lưới X-Y & Kiện Hàng)' },
  { value: 'rescue_line', label: 'Sa bàn 9: RoboCup Rescue Line (Gấp Khúc & Cứu Hộ)' },
  { value: 'sumo_ring', label: 'Sa bàn 10: Võ Đài Robot Sumo (Đẩy Khối Hàng)' },
  { value: 'parking_garage', label: 'Sa bàn 11: Bãi Đỗ Xe Tự Động (Chuồng P1-P3)' },
  { value: 'custom_blank', label: 'Sa bàn 12: Tự Thiết Kế 100% (Trống)' }
];

export const SCENE_3D_OPTIONS = [
  {
    value: '3d_grab_lift',
    label: '3D Sa bàn 1: Tay Gắp & Nâng Kiện Hàng Lên Bệ Cao (Grab & Lift)'
  },
  {
    value: '3d_drag_drop_sorting',
    label: '3D Sa bàn 2: Kéo - Thả & Phân Loại 3 Kiện Hàng Màu (Sorting)'
  },
  {
    value: '3d_forklift_pallet',
    label: '3D Sa bàn 3: Xe Nâng Forklift & Xếp Giá Kệ Kho 2 Tầng (Forklift)'
  },
  {
    value: '3d_tower_crane',
    label: '3D Sa bàn 4: Cần Cẩu Tháp Xoay & Tời Nâng Hàng Vượt Tường (Crane)'
  },
  {
    value: '3d_bulldozer_push',
    label: '3D Sa bàn 5: Xe Ủi Bulldozer — Đẩy & Gom Khối Năng Lượng (Push)'
  },
  {
    value: '3d_bridge_mission',
    label: '3D Sa bàn 6: Nhiệm Vụ FLL 3D — Hạ Cầu Rút & Vượt Dốc (Bridge)'
  }
];

const QUICK_LINE_TEMPLATES = [
  {
    id: 's_curve',
    label: 'Đường S-Curve',
    build: () => {
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        const x = Math.round(65 + t * 390);
        const y = Math.round(132 + Math.sin(t * Math.PI * 2) * 68);
        pts.push({ x, y });
      }
      return [{ id: `tpl_s_${Date.now()}`, points: pts, color: '#0f172a', width: 14 }];
    }
  },
  {
    id: 'figure_8',
    label: 'Hình Số 8',
    build: () => {
      const pts = [];
      for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * Math.PI * 2;
        const x = Math.round(260 + Math.sin(t) * 165);
        const y = Math.round(132 + Math.sin(t * 2) * 72);
        pts.push({ x, y });
      }
      return [{ id: `tpl_8_${Date.now()}`, points: pts, color: '#0f172a', width: 14 }];
    }
  },
  {
    id: 'zigzag',
    label: 'Zíc-Zắc Gấp Khúc',
    build: () => [
      {
        id: `tpl_zz_${Date.now()}`,
        points: [
          { x: 55, y: 205 },
          { x: 145, y: 60 },
          { x: 245, y: 205 },
          { x: 345, y: 60 },
          { x: 455, y: 185 }
        ],
        color: '#0f172a',
        width: 14
      }
    ]
  },
  {
    id: 'crossroad',
    label: 'Giao Lộ Ngã Tư',
    build: () => [
      {
        id: `tpl_cr1_${Date.now()}`,
        points: [
          { x: 40, y: 132 },
          { x: 480, y: 132 }
        ],
        color: '#0f172a',
        width: 14
      },
      {
        id: `tpl_cr2_${Date.now() + 1}`,
        points: [
          { x: 260, y: 25 },
          { x: 260, y: 240 }
        ],
        color: '#0f172a',
        width: 14
      },
      {
        id: `tpl_cr3_${Date.now() + 2}`,
        points: [
          { x: 80, y: 50 },
          { x: 440, y: 50 },
          { x: 440, y: 215 },
          { x: 80, y: 215 },
          { x: 80, y: 50 }
        ],
        color: '#0f172a',
        width: 12
      }
    ]
  }
];

// Khoảng cách từ điểm (px, py) tới đoạn thẳng (x1, y1) - (x2, y2)
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

export function normalizeLineObject(lineItem, idx = 0) {
  if (Array.isArray(lineItem)) {
    return {
      id: `legacy_line_${idx}`,
      points: lineItem,
      color: '#0f172a',
      colorName: 'BLACK',
      width: 14
    };
  }
  return {
    id: lineItem?.id || `line_${idx}`,
    points: Array.isArray(lineItem?.points) ? lineItem.points : [],
    color: lineItem?.color || '#0f172a',
    colorName: lineItem?.colorName || 'BLACK',
    width: lineItem?.width || 14
  };
}

export default function VirtualSimulatorPanel({
  simMode,
  setSimMode,
  mapType,
  setMapType,
  scene3DType = '3d_grab_lift',
  setScene3DType,
  robotPose,
  onResetSimulator,
  telemetry,
  missionCompleted,
  onManualNudgeArm,
  arenaConfig,
  onUpdateArenaConfig,
  onSetStartPose,
  onFloorCanvasReady,
  onCargoStatusChange
}) {
  const canvas2DRef = useRef(null);
  const floorCanvasRef = useRef(null);
  const mount3DRef = useRef(null);
  const sceneObjectsRef = useRef(null);
  const bgImageCacheRef = useRef({ src: '', img: null });

  // Chế độ Thiết kế Sa bàn trực tiếp trên Canvas 2D
  const [isEditingArena, setIsEditingArena] = useState(false);
  // Tools: 'draw_line' | 'straight_line' | 'move_drag' | 'start_pose' | 'goal' | 'obstacle' | 'wall_h' | 'wall_v' | 'color_patch' | 'cargo_box' | 'eraser'
  const [editorTool, setEditorTool] = useState('draw_line');
  const [selectedPatchColor, setSelectedPatchColor] = useState(PATCH_COLORS[1]);
  const [selectedLineColor, setSelectedLineColor] = useState(PATCH_COLORS[0]);
  const [selectedLineWidth, setSelectedLineWidth] = useState(14);
  const [snapToGrid, setSnapToGrid] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTick, setDrawingTick] = useState(0);
  const [hoverPt, setHoverPt] = useState(null);
  const currentLineRef = useRef([]);
  const draggedItemRef = useRef(null); // { group: 'goals'|'obstacles'|'walls'|'colorPatches'|'cargos'|'startPose', id, offsetX, offsetY }

  // Chế độ tương tác chuột trong 3D: 'orbit' (Xoay Camera) | 'drag_cargo' (Kéo thả Kiện hàng 3D)
  const [interaction3DMode, setInteraction3DMode] = useState('drag_cargo');
  const [showArenaGallery, setShowArenaGallery] = useState(false);

  // Chọn bất kỳ sa bàn nào (2D hoặc 3D) — tự động chuyển chế độ mô phỏng tương ứng
  const handleSelectAnyArena = (value) => {
    if (String(value).startsWith('3d_')) {
      if (setScene3DType) setScene3DType(value);
      setIsEditingArena(false);
      setSimMode('3D');
    } else {
      setMapType(value);
      setSimMode('2D');
    }
    setShowArenaGallery(false);
  };
  const interaction3DModeRef = useRef('drag_cargo');
  useEffect(() => {
    interaction3DModeRef.current = interaction3DMode;
  }, [interaction3DMode]);

  const safeArena = arenaConfig || {
    startPose: { x: 75, y: 132, angle: 0 },
    backgroundUrl: '',
    lines: [],
    walls: [],
    obstacles: [],
    goals: [],
    colorPatches: [],
    cargos: []
  };

  // Tải ảnh nền sa bàn tùy chỉnh (nếu có)
  useEffect(() => {
    const bgSrc = safeArena.backgroundUrl || safeArena.backgroundImage || '';
    if (!bgSrc) {
      bgImageCacheRef.current = { src: '', img: null };
      return;
    }
    if (bgImageCacheRef.current.src !== bgSrc) {
      const img = new Image();
      img.onload = () => {
        bgImageCacheRef.current = { src: bgSrc, img };
        setDrawingTick((t) => t + 1);
      };
      img.src = bgSrc;
    }
  }, [safeArena.backgroundUrl, safeArena.backgroundImage]);

  // Chuyển đổi tọa độ chuột sang tọa độ chính xác tuyệt đối trên Canvas (520 x 265)
  // Lưu ý: Canvas không dùng object-contain nên khung rect khớp 100% với vùng vẽ bitmap.
  const getCanvasCoords = (e) => {
    const canvas = canvas2DRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: 0, y: 0 };

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const rawX = (e.clientX - rect.left) * scaleX;
    const rawY = (e.clientY - rect.top) * scaleY;
    const clampedX = Math.max(0, Math.min(canvas.width, rawX));
    const clampedY = Math.max(0, Math.min(canvas.height, rawY));

    if (snapToGrid && editorTool !== 'draw_line' && editorTool !== 'eraser') {
      return {
        x: Math.round(clampedX / 10) * 10,
        y: Math.round(clampedY / 10) * 10
      };
    }

    return {
      x: Math.round(clampedX * 10) / 10,
      y: Math.round(clampedY * 10) / 10
    };
  };

  const findDraggableAtPoint = (pt) => {
    // 1. Kiểm tra Robot Start Pose
    const sp = safeArena.startPose || { x: robotPose.x, y: robotPose.y, angle: robotPose.angle };
    if (Math.hypot(pt.x - sp.x, pt.y - sp.y) <= 22) {
      return { group: 'startPose', id: 'startPose', offsetX: pt.x - sp.x, offsetY: pt.y - sp.y };
    }
    // 2. Kiện hàng (cargos)
    for (const c of safeArena.cargos || []) {
      if (pt.x >= c.x && pt.x <= c.x + (c.w || 24) && pt.y >= c.y && pt.y <= c.y + (c.h || 24)) {
        return { group: 'cargos', id: c.id, offsetX: pt.x - c.x, offsetY: pt.y - c.y };
      }
    }
    // 3. Vật cản (obstacles)
    for (const o of safeArena.obstacles || []) {
      const ox = o.w ? o.x : o.x - (o.r || 18);
      const oy = o.h ? o.y : o.y - (o.r || 18);
      const ow = o.w || (o.r || 18) * 2;
      const oh = o.h || (o.r || 18) * 2;
      if (pt.x >= ox && pt.x <= ox + ow && pt.y >= oy && pt.y <= oy + oh) {
        return { group: 'obstacles', id: o.id, offsetX: pt.x - ox, offsetY: pt.y - oy };
      }
    }
    // 4. Dải màu (colorPatches)
    for (const p of safeArena.colorPatches || []) {
      if (pt.x >= p.x && pt.x <= p.x + p.w && pt.y >= p.y && pt.y <= p.y + p.h) {
        return { group: 'colorPatches', id: p.id, offsetX: pt.x - p.x, offsetY: pt.y - p.y };
      }
    }
    // 5. Tường chắn (walls)
    for (const w of safeArena.walls || []) {
      if (pt.x >= w.x && pt.x <= w.x + w.w && pt.y >= w.y && pt.y <= w.y + w.h) {
        return { group: 'walls', id: w.id, offsetX: pt.x - w.x, offsetY: pt.y - w.y };
      }
    }
    // 6. Ô Đích (goals)
    for (const g of safeArena.goals || []) {
      if (pt.x >= g.x && pt.x <= g.x + g.w && pt.y >= g.y && pt.y <= g.y + g.h) {
        return { group: 'goals', id: g.id, offsetX: pt.x - g.x, offsetY: pt.y - g.y };
      }
    }
    return null;
  };

  const handleCanvasPointerDown = (e) => {
    if (!isEditingArena || simMode !== '2D' || !onUpdateArenaConfig) return;
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore capture error
      }
    }

    const pt = getCanvasCoords(e);
    setHoverPt(pt);

    if (editorTool === 'move_drag') {
      const hit = findDraggableAtPoint(pt);
      if (hit) {
        draggedItemRef.current = hit;
        setIsDrawing(true);
      }
      return;
    }

    if (editorTool === 'start_pose') {
      const nextStart = {
        x: Math.round(pt.x),
        y: Math.round(pt.y),
        angle: safeArena.startPose?.angle || 0
      };
      onUpdateArenaConfig({
        ...safeArena,
        startPose: nextStart
      });
      if (onSetStartPose) onSetStartPose(nextStart);
      return;
    }

    if (editorTool === 'draw_line') {
      setIsDrawing(true);
      currentLineRef.current = [pt, { x: pt.x + 0.1, y: pt.y + 0.1 }];
      setDrawingTick((t) => t + 1);
      return;
    }

    if (editorTool === 'straight_line') {
      setIsDrawing(true);
      currentLineRef.current = [pt, pt];
      setDrawingTick((t) => t + 1);
      return;
    }

    if (editorTool === 'goal') {
      const newGoal = {
        id: `goal_${Date.now()}`,
        x: Math.round(pt.x - 32),
        y: Math.round(pt.y - 26),
        w: 64,
        h: 52,
        label: 'GOAL'
      };
      onUpdateArenaConfig({
        ...safeArena,
        goals: [...(safeArena.goals || []), newGoal]
      });
      return;
    }

    if (editorTool === 'obstacle') {
      const newObs = {
        id: `obs_${Date.now()}`,
        x: Math.round(pt.x - 18),
        y: Math.round(pt.y - 22),
        w: 36,
        h: 44,
        label: 'OBS'
      };
      onUpdateArenaConfig({
        ...safeArena,
        obstacles: [...(safeArena.obstacles || []), newObs]
      });
      return;
    }

    if (editorTool === 'wall_h') {
      const newWall = {
        id: `wall_${Date.now()}`,
        x: Math.round(pt.x - 45),
        y: Math.round(pt.y - 6),
        w: 90,
        h: 12
      };
      onUpdateArenaConfig({
        ...safeArena,
        walls: [...(safeArena.walls || []), newWall]
      });
      return;
    }

    if (editorTool === 'wall_v') {
      const newWall = {
        id: `wall_${Date.now()}`,
        x: Math.round(pt.x - 6),
        y: Math.round(pt.y - 45),
        w: 12,
        h: 90
      };
      onUpdateArenaConfig({
        ...safeArena,
        walls: [...(safeArena.walls || []), newWall]
      });
      return;
    }

    if (editorTool === 'color_patch') {
      const newPatch = {
        id: `patch_${Date.now()}`,
        x: Math.round(pt.x - 18),
        y: Math.round(pt.y - 24),
        w: 36,
        h: 48,
        color: selectedPatchColor.name,
        hex: selectedPatchColor.hex,
        reflection: selectedPatchColor.reflection
      };
      onUpdateArenaConfig({
        ...safeArena,
        colorPatches: [...(safeArena.colorPatches || []), newPatch]
      });
      return;
    }

    if (editorTool === 'cargo_box') {
      const newCargo = {
        id: `cargo_${Date.now()}`,
        x: Math.round(pt.x - 13),
        y: Math.round(pt.y - 13),
        w: 26,
        h: 26,
        color: selectedPatchColor.name,
        hex: selectedPatchColor.hex,
        label: 'CARGO'
      };
      onUpdateArenaConfig({
        ...safeArena,
        cargos: [...(safeArena.cargos || []), newCargo]
      });
      return;
    }

    if (editorTool === 'eraser') {
      const hitRect = (r) => {
        const rx = r.w ? r.x : r.x - (r.r || 18);
        const ry = r.h ? r.y : r.y - (r.r || 18);
        const rw = r.w || (r.r || 18) * 2;
        const rh = r.h || (r.r || 18) * 2;
        return pt.x >= rx - 4 && pt.x <= rx + rw + 4 && pt.y >= ry - 4 && pt.y <= ry + rh + 4;
      };
      const hitLine = (rawLine) => {
        const line = normalizeLineObject(rawLine);
        const pts = line.points;
        const thresh = Math.max(12, (line.width || 14) * 0.85);
        if (pts.length === 1) return Math.hypot(pts[0].x - pt.x, pts[0].y - pt.y) <= thresh;
        for (let i = 0; i < pts.length - 1; i++) {
          if (distToSegment(pt.x, pt.y, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y) <= thresh) {
            return true;
          }
        }
        return false;
      };

      onUpdateArenaConfig({
        ...safeArena,
        goals: (safeArena.goals || []).filter((g) => !hitRect(g)),
        obstacles: (safeArena.obstacles || []).filter((o) => !hitRect(o)),
        walls: (safeArena.walls || []).filter((w) => !hitRect(w)),
        colorPatches: (safeArena.colorPatches || []).filter((c) => !hitRect(c)),
        cargos: (safeArena.cargos || []).filter((c) => !hitRect(c)),
        lines: (safeArena.lines || []).filter((l) => !hitLine(l))
      });
    }
  };

  const handleCanvasPointerMove = (e) => {
    if (!isEditingArena || simMode !== '2D') return;
    const pt = getCanvasCoords(e);
    setHoverPt(pt);

    if (!isDrawing) return;

    if (editorTool === 'move_drag' && draggedItemRef.current && onUpdateArenaConfig) {
      const { group, id, offsetX, offsetY } = draggedItemRef.current;
      const nx = Math.round(pt.x - offsetX);
      const ny = Math.round(pt.y - offsetY);

      if (group === 'startPose') {
        const nextStart = {
          x: nx,
          y: ny,
          angle: safeArena.startPose?.angle ?? robotPose.angle
        };
        onUpdateArenaConfig({ ...safeArena, startPose: nextStart });
        if (onSetStartPose) onSetStartPose(nextStart);
        return;
      }

      onUpdateArenaConfig({
        ...safeArena,
        [group]: (safeArena[group] || []).map((item) =>
          item.id === id ? { ...item, x: nx, y: ny } : item
        )
      });
      return;
    }

    if (editorTool === 'draw_line') {
      const pts = currentLineRef.current;
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(pt.x - last.x, pt.y - last.y) >= 2) {
        currentLineRef.current = [...pts, pt];
        setDrawingTick((t) => t + 1);
      }
      return;
    }

    if (editorTool === 'straight_line') {
      const pts = currentLineRef.current;
      if (pts.length >= 1) {
        currentLineRef.current = [pts[0], pt];
        setDrawingTick((t) => t + 1);
      }
    }
  };

  const handleCanvasPointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    draggedItemRef.current = null;

    if (
      (editorTool === 'draw_line' || editorTool === 'straight_line') &&
      currentLineRef.current.length >= 2 &&
      onUpdateArenaConfig
    ) {
      const newLine = {
        id: `line_${Date.now()}`,
        points: currentLineRef.current,
        color: selectedLineColor.hex,
        colorName: selectedLineColor.name,
        width: selectedLineWidth
      };
      onUpdateArenaConfig({
        ...safeArena,
        lines: [...(safeArena.lines || []), newLine]
      });
    }
    currentLineRef.current = [];
    setDrawingTick((t) => t + 1);
  };

  const handleUndoLastLine = () => {
    if (!onUpdateArenaConfig) return;
    if ((safeArena.lines || []).length > 0) {
      onUpdateArenaConfig({
        ...safeArena,
        lines: safeArena.lines.slice(0, -1)
      });
    }
  };

  const handleApplyQuickLineTemplate = (tpl) => {
    if (!onUpdateArenaConfig) return;
    const builtLines = tpl.build();
    onUpdateArenaConfig({
      ...safeArena,
      lines: [...(safeArena.lines || []), ...builtLines]
    });
  };

  const handleUploadBackgroundMat = (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateArenaConfig) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdateArenaConfig({
        ...safeArena,
        backgroundUrl: String(ev.target?.result || '')
      });
    };
    reader.readAsDataURL(file);
  };

  // VẼ SA BÀN 2D TRÊN CANVAS
  useEffect(() => {
    if (simMode !== '2D') return;
    const canvas = canvas2DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 1. Vẽ nền sa bàn (Hoặc ảnh Thảm thi đấu FLL/WRO tùy chỉnh)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);

    const bgSrc = safeArena.backgroundUrl || safeArena.backgroundImage || '';
    if (bgImageCacheRef.current.img && bgSrc) {
      ctx.drawImage(bgImageCacheRef.current.img, 0, 0, W, H);
    } else {
      ctx.strokeStyle = snapToGrid && isEditingArena ? '#cbd5e1' : '#e2e8f0';
      ctx.lineWidth = 1;
      const step = snapToGrid && isEditingArena ? 20 : 25;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    // 2. Vẽ các bản đồ mẫu 2D đa dạng (12 Preset Maps)
    if (mapType === 'line_track') {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(65, H / 2);
      ctx.bezierCurveTo(180, H / 2 - 75, 275, H / 2 + 75, 410, H / 2);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(425, H / 2 - 26, 36, 52);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.strokeRect(425, H / 2 - 26, 36, 52);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 10px Inter';
      ctx.fillText('OBSTACLE (E)', 406, H / 2 - 32);
    } else if (mapType === 'maze') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(40, 35, 260, 14);
      ctx.fillRect(40, 135, 155, 14);
      ctx.fillRect(290, 35, 14, 210);
      ctx.fillRect(185, 135, 14, 110);

      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fillRect(55, 60, 55, 55);
      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 10px Inter';
      ctx.fillText('START', 65, 92);

      ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
      ctx.fillRect(210, 185, 70, 55);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(210, 185, 70, 55);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 11px Inter';
      ctx.fillText('GOAL', 228, 216);
    } else if (mapType === 'sensor_lab') {
      const colors = [
        { hex: '#ef4444', name: 'RED (9)' },
        { hex: '#eab308', name: 'YELLOW (7)' },
        { hex: '#22c55e', name: 'GREEN (6)' },
        { hex: '#3b82f6', name: 'BLUE (3)' }
      ];
      colors.forEach((col, i) => {
        ctx.fillStyle = col.hex;
        ctx.fillRect(170 + i * 52, 40, 30, 185);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px Inter';
        ctx.fillText(col.name, 166 + i * 52, 34);
      });

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(435, H / 2 - 30, 32, 60);
    } else if (mapType === 'slalom_obstacles') {
      const pillars = [
        { x: 185, y: 110, label: 'TRỤ 1' },
        { x: 295, y: 155, label: 'TRỤ 2' },
        { x: 390, y: 105, label: 'TRỤ 3' }
      ];
      pillars.forEach((p) => {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(p.x - 16, p.y - 20, 32, 40);
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x - 16, p.y - 20, 32, 40);
        ctx.fillStyle = '#b91c1c';
        ctx.font = 'bold 9px Inter';
        ctx.fillText(p.label, p.x - 14, p.y - 25);
      });
      ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
      ctx.fillRect(445, 95, 58, 75);
      ctx.strokeStyle = '#16a34a';
      ctx.strokeRect(445, 95, 58, 75);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 11px Inter';
      ctx.fillText('GOAL', 458, 136);
    } else if (mapType === 'fll_challenge') {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.16)';
      ctx.fillRect(25, 165, 95, 85);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 165, 95, 85);
      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 10px Inter';
      ctx.fillText('LAUNCH AREA', 36, 242);

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(120, 205);
      ctx.lineTo(250, 205);
      ctx.lineTo(250, 75);
      ctx.lineTo(420, 75);
      ctx.stroke();

      const stations = [
        { x: 225, y: 24, w: 68, h: 38, color: '#eab308', name: 'M01: SOLAR' },
        { x: 425, y: 50, w: 74, h: 48, color: '#22c55e', name: 'M02: DROP' },
        { x: 375, y: 175, w: 74, h: 55, color: '#ef4444', name: 'M03: CRANE' }
      ];
      stations.forEach((st) => {
        ctx.fillStyle = st.color + '33';
        ctx.fillRect(st.x, st.y, st.w, st.h);
        ctx.strokeStyle = st.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(st.x, st.y, st.w, st.h);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px Inter';
        ctx.fillText(st.name, st.x + 5, st.y + st.h / 2 + 3);
      });
    } else if (mapType === 'loop_circuit') {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.roundRect(75, 42, 370, 180, 65);
      ctx.stroke();

      // Vạch Xuất phát / Đích kẻ caro
      ctx.fillStyle = '#eab308';
      ctx.fillRect(195, 32, 12, 22);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px Inter';
      ctx.fillText('START / FINISH', 175, 26);
    } else if (mapType === 'wro_smart_city') {
      // Sa bàn 7: WRO Smart City — Mạng lưới giao lộ đường đen + 4 Khu vực phân loại màu
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 12;
      ctx.beginPath();
      // Trục ngang chính
      ctx.moveTo(45, 132);
      ctx.lineTo(475, 132);
      // 2 trục dọc tạo 2 ngã tư
      ctx.moveTo(190, 35);
      ctx.lineTo(190, 230);
      ctx.moveTo(350, 35);
      ctx.lineTo(350, 230);
      ctx.stroke();

      // 4 Trạm phân loại màu ở 4 đầu nhánh
      const zones = [
        { x: 162, y: 15, w: 56, h: 32, hex: '#ef4444', label: 'HOSPITAL (RED)' },
        { x: 322, y: 15, w: 56, h: 32, hex: '#22c55e', label: 'PARK (GREEN)' },
        { x: 162, y: 218, w: 56, h: 32, hex: '#3b82f6', label: 'PORT (BLUE)' },
        { x: 322, y: 218, w: 56, h: 32, hex: '#eab308', label: 'SOLAR (YELLOW)' }
      ];
      zones.forEach((z) => {
        ctx.fillStyle = z.hex;
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7.5px Inter';
        ctx.fillText(z.label, z.x + 3, z.y + 19);
      });

      // Ô Đích trung tâm thành phố
      ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
      ctx.fillRect(435, 102, 65, 60);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(435, 102, 65, 60);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 9px Inter';
      ctx.fillText('SMART HUB', 442, 136);
    } else if (mapType === 'warehouse_grid') {
      // Sa bàn 8: Kho Hàng Tự Động Amazon (Lưới đường line X-Y & các kệ hàng)
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 8;
      for (let gx = 90; gx <= 430; gx += 85) {
        ctx.beginPath();
        ctx.moveTo(gx, 30);
        ctx.lineTo(gx, 235);
        ctx.stroke();
      }
      for (let gy = 55; gy <= 215; gy += 75) {
        ctx.beginPath();
        ctx.moveTo(50, gy);
        ctx.lineTo(470, gy);
        ctx.stroke();
      }

      const pods = [
        { x: 175, y: 55, label: 'KỆ A1', hex: '#f97316' },
        { x: 260, y: 130, label: 'KỆ B2', hex: '#eab308' },
        { x: 345, y: 55, label: 'KỆ C1', hex: '#8b5cf6' }
      ];
      pods.forEach((p) => {
        ctx.fillStyle = p.hex;
        ctx.fillRect(p.x - 16, p.y - 16, 32, 32);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(p.x - 16, p.y - 16, 32, 32);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px Inter';
        ctx.fillText(p.label, p.x - 12, p.y + 3);
      });

      ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
      ctx.fillRect(405, 175, 80, 56);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(405, 175, 80, 56);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 9.5px Inter';
      ctx.fillText('PACKING ZONE', 411, 206);
    } else if (mapType === 'rescue_line') {
      // Sa bàn 9: RoboCup Rescue Line — Dò line gấp khúc + Marker xanh rẽ hướng + Vùng cứu hộ bạc
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 12;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(50, 200);
      ctx.lineTo(155, 200);
      ctx.lineTo(155, 70);
      ctx.lineTo(295, 70);
      ctx.lineTo(295, 185);
      ctx.lineTo(400, 185);
      ctx.stroke();

      // Marker xanh lá báo rẽ phải/trái chuẩn RoboCup Rescue
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(135, 180, 14, 14);
      ctx.fillRect(161, 76, 14, 14);
      ctx.fillRect(275, 165, 14, 14);

      // Vùng Cứu hộ (Evacuation Zone)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(400, 45, 95, 180);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(400, 45, 95, 180);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9px Inter';
      ctx.fillText('RESCUE ZONE', 415, 65);

      // 2 Nạn nhân (Quả cầu bạc / đen) & Góc thoát nạn tam giác xanh
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(412, 170, 70, 44);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SAFE POINT', 420, 195);
    } else if (mapType === 'sumo_ring') {
      // Sa bàn 10: Võ Đài Robot Sumo (Dohyo tròn đen viền trắng/đỏ)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(260, 132, 112, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(260, 132, 108, 0, Math.PI * 2);
      ctx.stroke();

      // 2 Vạch Shikiri-sen ở giữa võ đài
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(235, 108, 6, 48);
      ctx.fillRect(279, 108, 6, 48);

      // Các khối mục tiêu đối thủ để đẩy ra khỏi vòng
      const targets = [
        { x: 305, y: 120, label: 'DUMMY 1' },
        { x: 265, y: 80, label: 'DUMMY 2' },
        { x: 265, y: 172, label: 'DUMMY 3' }
      ];
      targets.forEach((t) => {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(t.x - 14, t.y - 14, 28, 28);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(t.x - 14, t.y - 14, 28, 28);
      });
    } else if (mapType === 'parking_garage') {
      // Sa bàn 11: Bãi Đỗ Xe Tự Động Thông Minh (3 Chuồng Đỗ P1, P2, P3)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(45, 195);
      ctx.lineTo(465, 195);
      ctx.stroke();

      const bays = [
        { x: 145, y: 40, w: 68, h: 95, name: 'P1 ( occupied )', occupied: true },
        { x: 245, y: 40, w: 68, h: 95, name: 'P2 ( TRỐNG )', occupied: false },
        { x: 345, y: 40, w: 68, h: 95, name: 'P3 ( occupied )', occupied: true }
      ];
      bays.forEach((b) => {
        ctx.fillStyle = b.occupied ? 'rgba(239, 68, 68, 0.18)' : 'rgba(34, 197, 94, 0.25)';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = b.occupied ? '#ef4444' : '#16a34a';
        ctx.lineWidth = 3;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 8.5px Inter';
        ctx.fillText(b.name, b.x + 5, b.y + 16);

        if (b.occupied) {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(b.x + 16, b.y + 30, 36, 52);
        }
      });
    }

    // 3. Vẽ các đối tượng Tùy chỉnh (Custom Arena Objects) do Giáo viên / Học sinh thiết kế thêm
    // 3a. Đường Line tự vẽ (Hỗ trợ cả mảng điểm cũ và object {points, color, width})
    (safeArena.lines || []).forEach((rawLine, idx) => {
      const line = normalizeLineObject(rawLine, idx);
      if (!line.points || line.points.length < 2) return;
      ctx.strokeStyle = line.color || '#0f172a';
      ctx.lineWidth = line.width || 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      line.points.forEach((pt, pIdx) => {
        if (pIdx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
    });

    // Đường đang kéo chuột vẽ trực tiếp (Freehand hoặc Straight Line)
    if (isDrawing && currentLineRef.current.length >= 2) {
      ctx.save();
      ctx.strokeStyle = selectedLineColor.hex;
      ctx.lineWidth = selectedLineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      currentLineRef.current.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();
    }

    // 3b. Dải màu cảm biến (Color Patches)
    (safeArena.colorPatches || []).forEach((patch) => {
      ctx.fillStyle = patch.hex || '#ef4444';
      ctx.fillRect(patch.x, patch.y, patch.w, patch.h);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(patch.x, patch.y, patch.w, patch.h);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter';
      ctx.fillText(patch.color, patch.x + 3, patch.y + patch.h / 2 + 3);
    });

    // 3c. Ô Đích (Goals)
    (safeArena.goals || []).forEach((goal) => {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.28)';
      ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(goal.x, goal.y, goal.w, goal.h);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 11px Inter';
      ctx.fillText(goal.label || 'GOAL', goal.x + 10, goal.y + goal.h / 2 + 4);
    });

    // 3d. Tường Mê cung (Walls)
    (safeArena.walls || []).forEach((wall) => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    });

    // 3e. Vật cản Siêu âm (Obstacles)
    (safeArena.obstacles || []).forEach((obs) => {
      const ox = obs.w ? obs.x : obs.x - (obs.r || 18);
      const oy = obs.h ? obs.y : obs.y - (obs.r || 18);
      const ow = obs.w || (obs.r || 18) * 2;
      const oh = obs.h || (obs.r || 18) * 2;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ox, oy, ow, oh);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.strokeRect(ox, oy, ow, oh);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Inter';
      ctx.fillText(obs.label || 'OBS', ox + 5, oy + oh / 2 + 3);
    });

    // 3f. Kiện hàng 2D (Cargo Boxes)
    (safeArena.cargos || []).forEach((cargo) => {
      ctx.fillStyle = cargo.hex || '#f97316';
      ctx.fillRect(cargo.x, cargo.y, cargo.w || 26, cargo.h || 26);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(cargo.x, cargo.y, cargo.w || 26, cargo.h || 26);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7.5px Inter';
      ctx.fillText('BOX', cargo.x + 4, cargo.y + 16);
    });

    // Chụp lại bản đồ mặt sàn 2D (trước khi vẽ vết bánh xe & thân Robot) để cảm biến màu đọc chính xác 100% pixel mặt sàn
    if (!floorCanvasRef.current && typeof document !== 'undefined') {
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      floorCanvasRef.current = off;
    }
    if (floorCanvasRef.current) {
      const fCtx = floorCanvasRef.current.getContext('2d', { willReadFrequently: true });
      fCtx.clearRect(0, 0, W, H);
      fCtx.drawImage(canvas, 0, 0);
      if (onFloorCanvasReady) {
        onFloorCanvasReady(floorCanvasRef.current);
      }
    }

    // 4. Đường vết di chuyển của Robot
    if (robotPose.trail && robotPose.trail.length > 1) {
      ctx.strokeStyle = 'rgba(234, 51, 150, 0.55)';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      robotPose.trail.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 5. Vẽ Robot LEGO SPIKE Prime với nhãn cổng A, B, D, E rõ ràng cho Học sinh
    ctx.save();
    ctx.translate(robotPose.x, robotPose.y);
    ctx.rotate((robotPose.angle * Math.PI) / 180);

    // Chùm sóng siêu âm Distance Sensor (Port E)
    ctx.fillStyle = 'rgba(14, 184, 214, 0.18)';
    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(22 + Math.min(robotPose.distanceCm * 1.4, 150), -26);
    ctx.lineTo(22 + Math.min(robotPose.distanceCm * 1.4, 150), 26);
    ctx.closePath();
    ctx.fill();

    // 2 Bánh xe xanh (Port A Trái, Port B Phải)
    ctx.fillStyle = '#0090FF';
    ctx.fillRect(-16, -25, 32, 8);
    ctx.fillRect(-16, 17, 32, 8);

    // Khung Magenta Driving Base
    ctx.fillStyle = '#EA3396';
    ctx.fillRect(-20, -17, 40, 34);

    // Thân Hub vàng ở giữa
    ctx.fillStyle = '#FFD500';
    ctx.fillRect(-14, -12, 28, 24);

    // Nhãn cổng A và B ngay trên 2 bánh xe
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px Inter';
    ctx.fillText('A', -3, -19);
    ctx.fillText('B', -3, 24);

    // Mắt Cảm biến màu (Port D) & Khoảng cách (Port E) ở mũi Robot
    ctx.fillStyle = '#0EB8D6';
    ctx.beginPath();
    ctx.arc(21, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 7px Inter';
    ctx.fillText('D/E', 15, 2.5);

    ctx.restore();

    // 6. VẼ CON TRỎ XEM TRƯỚC CHÍNH XÁC TẠI VỊ TRÍ CHUỘT KHI ĐANG THIẾT KẾ SA BÀN
    if (isEditingArena && hoverPt) {
      ctx.save();
      if (editorTool === 'draw_line' || editorTool === 'straight_line') {
        ctx.fillStyle = selectedLineColor.hex + '66';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(hoverPt.x, hoverPt.y, selectedLineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Tâm chữ thập chính xác tại đầu bút
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hoverPt.x - 4, hoverPt.y);
        ctx.lineTo(hoverPt.x + 4, hoverPt.y);
        ctx.moveTo(hoverPt.x, hoverPt.y - 4);
        ctx.lineTo(hoverPt.x, hoverPt.y + 4);
        ctx.stroke();
      } else if (editorTool === 'goal') {
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(hoverPt.x - 32, hoverPt.y - 26, 64, 52);
      } else if (editorTool === 'obstacle') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(hoverPt.x - 18, hoverPt.y - 22, 36, 44);
      } else if (editorTool === 'wall_h') {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(hoverPt.x - 45, hoverPt.y - 6, 90, 12);
      } else if (editorTool === 'wall_v') {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(hoverPt.x - 6, hoverPt.y - 45, 12, 90);
      } else if (editorTool === 'color_patch') {
        ctx.strokeStyle = selectedPatchColor.hex;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(hoverPt.x - 18, hoverPt.y - 24, 36, 48);
      } else if (editorTool === 'cargo_box') {
        ctx.strokeStyle = selectedPatchColor.hex;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(hoverPt.x - 13, hoverPt.y - 13, 26, 26);
      } else if (editorTool === 'eraser') {
        ctx.strokeStyle = '#e11d48';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hoverPt.x, hoverPt.y, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nhãn tọa độ chuột thời gian thực ngay cạnh con trỏ
      const labelText = `(${Math.round(hoverPt.x)}, ${Math.round(hoverPt.y)})`;
      ctx.font = 'bold 9px monospace';
      const lx = Math.min(W - 58, hoverPt.x + 10);
      const ly = Math.max(16, hoverPt.y - 10);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.fillRect(lx - 2, ly - 10, 54, 13);
      ctx.fillStyle = '#fde047';
      ctx.fillText(labelText, lx, ly);
      ctx.restore();
    }
  }, [
    simMode,
    mapType,
    robotPose,
    safeArena,
    isDrawing,
    drawingTick,
    isEditingArena,
    hoverPt,
    editorTool,
    selectedLineColor,
    selectedLineWidth,
    selectedPatchColor,
    snapToGrid
  ]);

  // ================= KHÔNG GIAN 3D (THREE.JS) VỚI 6 SA BÀN CƠ CẤU KÉO THẢ, GẮP NÂNG, FORKLIFT, CẦN CẨU, BULLDOZER =================
  useEffect(() => {
    if (simMode !== '3D') return;
    const container = mount3DRef.current;
    if (!container) return;

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 265;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    let camYaw = 0.78;
    let camPitch = 0.56;
    let camDist = 11.2;

    const updateCameraOrbit = () => {
      camera.position.x = 0.6 + Math.cos(camPitch) * Math.cos(camYaw) * camDist;
      camera.position.y = Math.max(1.8, Math.sin(camPitch) * camDist);
      camera.position.z = Math.cos(camPitch) * Math.sin(camYaw) * camDist;
      camera.lookAt(0.6, 0.7, 0);
    };
    updateCameraOrbit();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
    dirLight.position.set(8, 14, 7);
    scene.add(dirLight);

    // Mặt sàn thảm thi đấu 3D
    const matFloorGeo = new THREE.PlaneGeometry(14, 10);
    const matFloorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75
    });
    const matFloor = new THREE.Mesh(matFloorGeo, matFloorMat);
    matFloor.rotation.x = -Math.PI / 2;
    matFloor.position.y = -0.01;
    scene.add(matFloor);

    const grid = new THREE.GridHelper(14, 14, 0x38bdf8, 0x334155);
    scene.add(grid);

    // Nhóm Robot LEGO SPIKE Prime 3D
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    const chassisGeo = new THREE.BoxGeometry(2.1, 0.35, 1.55);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0xea3396, roughness: 0.3 });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.position.y = 0.45;
    robotGroup.add(chassisMesh);

    const hubGeo = new THREE.BoxGeometry(1.55, 0.65, 1.2);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xffd500, roughness: 0.25 });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubMesh.position.set(-0.1, 0.95, 0);
    robotGroup.add(hubMesh);

    const wheelGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.24, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0090ff, roughness: 0.4 });

    const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
    leftWheel.rotation.x = Math.PI / 2;
    leftWheel.position.set(0.18, 0.52, -0.92);
    robotGroup.add(leftWheel);

    const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);
    rightWheel.rotation.x = Math.PI / 2;
    rightWheel.position.set(0.18, 0.52, 0.92);
    robotGroup.add(rightWheel);

    // Cơ cấu chấp hành cổng C (Thay đổi hình dáng theo từng Sa bàn 3D: Tay gắp, Forklift, Cần cẩu, Bulldozer)
    const armPivot = new THREE.Group();
    armPivot.position.set(0.95, 0.85, 0);
    robotGroup.add(armPivot);

    const beamGeo = new THREE.BoxGeometry(1.65, 0.16, 0.14);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x0eb8d6 });
    const leftBeam = new THREE.Mesh(beamGeo, beamMat);
    leftBeam.position.set(0.75, 0, -0.36);
    armPivot.add(leftBeam);

    const rightBeam = new THREE.Mesh(beamGeo, beamMat);
    rightBeam.position.set(0.75, 0, 0.36);
    armPivot.add(rightBeam);

    const gripperGroup = new THREE.Group();
    gripperGroup.position.set(1.55, -0.1, 0);
    armPivot.add(gripperGroup);

    const fingerGeo = new THREE.BoxGeometry(0.48, 0.22, 0.12);
    const fingerMat = new THREE.MeshStandardMaterial({
      color: scene3DType === '3d_forklift_pallet' ? 0xfacc15 : 0xff8c1a
    });
    const leftFinger = new THREE.Mesh(fingerGeo, fingerMat);
    leftFinger.position.set(0.22, 0, -0.32);
    gripperGroup.add(leftFinger);

    const rightFinger = new THREE.Mesh(fingerGeo, fingerMat);
    rightFinger.position.set(0.22, 0, 0.32);
    gripperGroup.add(rightFinger);

    // Nếu là Sa bàn Cần cẩu tháp (3d_tower_crane), dựng thêm trụ tháp cao trên Robot
    if (scene3DType === '3d_tower_crane') {
      const mastGeo = new THREE.BoxGeometry(0.28, 1.4, 0.28);
      const mastMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(0.65, 1.45, 0);
      robotGroup.add(mast);
      armPivot.position.set(0.75, 1.95, 0);
    }

    // Nếu là Sa bàn Bulldozer (3d_bulldozer_push), thêm lưỡi ủi chữ U phía trước
    if (scene3DType === '3d_bulldozer_push') {
      const bladeGeo = new THREE.BoxGeometry(0.18, 0.42, 1.35);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0.35, -0.05, 0);
      gripperGroup.add(blade);
    }

    // Danh sách các Kiện hàng 3D (Cargo Items) và Vùng Đích (Drop Zones / Platforms) theo từng Sa bàn 3D
    const cargoItems = [];
    const dropZones = [];
    let drawbridgeLeaf = null;

    const addDropZone = (x, z, w, d, colorHex, yHeight = 0.04) => {
      const zoneGroup = new THREE.Group();
      const padGeo = new THREE.BoxGeometry(w, yHeight, d);
      const padMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        transparent: true,
        opacity: yHeight > 0.2 ? 0.92 : 0.38
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(x, yHeight / 2, z);
      zoneGroup.add(pad);

      const edges = new THREE.EdgesGeometry(padGeo);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: colorHex })
      );
      line.position.copy(pad.position);
      zoneGroup.add(line);
      scene.add(zoneGroup);
      dropZones.push({ x, z, w, d, topY: yHeight, colorHex });
    };

    const addCargoCube = (x, y, z, colorHex, size = 0.56, label = 'CARGO') => {
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.28 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y + size / 2, z);
      mesh.userData = {
        isCargo: true,
        size,
        baseY: y + size / 2,
        initialPos: new THREE.Vector3(x, y + size / 2, z),
        label
      };
      scene.add(mesh);
      cargoItems.push(mesh);
      return mesh;
    };

    if (scene3DType === '3d_grab_lift') {
      // Sa bàn 1: Kiện hàng xanh lá ở gần + Bệ nâng cao màu vàng ở phía trước
      addCargoCube(2.6, 0, 0, 0x22c55e, 0.58, 'GREEN CARGO');
      addDropZone(4.2, 0, 1.5, 1.5, 0xfacc15, 0.85);
    } else if (scene3DType === '3d_drag_drop_sorting') {
      // Sa bàn 2: Kéo - Thả & Phân loại 3 Kiện hàng Đỏ, Xanh lá, Xanh dương vào 3 Ô Đích
      addCargoCube(2.2, 0, -1.35, 0xef4444, 0.54, 'RED CARGO');
      addCargoCube(2.5, 0, 0, 0x22c55e, 0.54, 'GREEN CARGO');
      addCargoCube(2.2, 0, 1.35, 0x3b82f6, 0.54, 'BLUE CARGO');

      addDropZone(4.4, -1.75, 1.35, 1.25, 0xef4444, 0.06);
      addDropZone(4.4, 0, 1.35, 1.25, 0x22c55e, 0.06);
      addDropZone(4.4, 1.75, 1.35, 1.25, 0x3b82f6, 0.06);
    } else if (scene3DType === '3d_forklift_pallet') {
      // Sa bàn 3: Xe Nâng Forklift & Giá kệ kho 2 tầng
      addCargoCube(2.35, 0, 0, 0xf97316, 0.62, 'PALLET CRATE');

      // Dựng Kệ Kho 2 Tầng
      const rackMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });
      const postGeo = new THREE.BoxGeometry(0.14, 2.2, 0.14);
      [
        [3.7, -0.8],
        [3.7, 0.8],
        [4.9, -0.8],
        [4.9, 0.8]
      ].forEach(([px, pz]) => {
        const post = new THREE.Mesh(postGeo, rackMat);
        post.position.set(px, 1.1, pz);
        scene.add(post);
      });
      // Tầng 1 và Tầng 2
      addDropZone(4.3, 0, 1.3, 1.65, 0x22c55e, 0.08);
      const shelfGeo = new THREE.BoxGeometry(1.3, 0.1, 1.65);
      const shelfMat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
      const shelf = new THREE.Mesh(shelfGeo, shelfMat);
      shelf.position.set(4.3, 1.15, 0);
      scene.add(shelf);
      dropZones.push({ x: 4.3, z: 0, w: 1.3, d: 1.65, topY: 1.2, colorHex: 0xfacc15 });
    } else if (scene3DType === '3d_tower_crane') {
      // Sa bàn 4: Cần cẩu tháp nâng kiện hàng vượt qua Tường chắn sang vùng xây dựng
      addCargoCube(2.3, 0, 0, 0x38bdf8, 0.56, 'CONTAINER');
      const wallGeo = new THREE.BoxGeometry(0.25, 0.85, 3.2);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const barrierWall = new THREE.Mesh(wallGeo, wallMat);
      barrierWall.position.set(3.25, 0.425, 0);
      scene.add(barrierWall);

      addDropZone(4.35, 0, 1.5, 2.2, 0x22c55e, 0.06);
    } else if (scene3DType === '3d_bulldozer_push') {
      // Sa bàn 5: Tay gạt Bulldozer đẩy 3 khối năng lượng vào vùng GOAL lớn
      addCargoCube(1.9, 0, -0.55, 0xfacc15, 0.48, 'ENERGY 1');
      addCargoCube(2.2, 0, 0, 0xfacc15, 0.48, 'ENERGY 2');
      addCargoCube(1.9, 0, 0.55, 0xfacc15, 0.48, 'ENERGY 3');

      addDropZone(4.3, 0, 1.7, 2.8, 0x22c55e, 0.05);
    } else if (scene3DType === '3d_bridge_mission') {
      // Sa bàn 6: Nhiệm vụ FLL Hạ Cầu Rút & Chở Hàng Qua Cầu
      addCargoCube(1.85, 0, 0, 0xa855f7, 0.52, 'FLL CARGO');

      // Bệ cầu cố định bên trái & Nhịp cầu gập bản lề
      const rampGeo = new THREE.BoxGeometry(1.2, 0.22, 1.6);
      const rampMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      const rampLeft = new THREE.Mesh(rampGeo, rampMat);
      rampLeft.position.set(2.8, 0.11, 0);
      scene.add(rampLeft);

      const bridgePivot = new THREE.Group();
      bridgePivot.position.set(3.4, 0.22, 0);
      scene.add(bridgePivot);

      const leafGeo = new THREE.BoxGeometry(1.5, 0.12, 1.5);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0xf97316 });
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.position.set(0.75, 0, 0);
      bridgePivot.add(leafMesh);
      bridgePivot.rotation.z = 0.65; // Ban đầu cầu dựng nghiêng lên
      drawbridgeLeaf = bridgePivot;

      addDropZone(5.1, 0, 1.4, 1.6, 0x22c55e, 0.06);
    }

    sceneObjectsRef.current = {
      scene,
      camera,
      renderer,
      robotGroup,
      armPivot,
      leftFinger,
      rightFinger,
      cargoItems,
      dropZones,
      drawbridgeLeaf,
      grabbedCargo: null,
      updateCameraOrbit,
      setCameraPreset: (preset) => {
        if (preset === 'top') {
          camYaw = 1.57;
          camPitch = 1.38;
          camDist = 11.5;
        } else if (preset === 'side') {
          camYaw = 1.57;
          camPitch = 0.22;
          camDist = 10.2;
        } else {
          camYaw = 0.78;
          camPitch = 0.56;
          camDist = 11.2;
        }
        updateCameraOrbit();
      }
    };

    // Raycaster hỗ trợ Kéo - Thả trực tiếp các Kiện hàng 3D bằng chuột trên mặt sa bàn
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPt = new THREE.Vector3();

    let isOrbitDragging = false;
    let draggedCargoMesh = null;
    let prevX = 0;
    let prevY = 0;

    const getPointerNDC = (ev) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e) => {
      getPointerNDC(e);
      raycaster.setFromCamera(pointerNDC, camera);

      // Kiểm tra xem người dùng có click trúng Kiện hàng 3D không
      const hits = raycaster.intersectObjects(cargoItems, false);
      if (hits.length > 0 && interaction3DModeRef.current === 'drag_cargo') {
        draggedCargoMesh = hits[0].object;
        if (sceneObjectsRef.current?.grabbedCargo === draggedCargoMesh) {
          sceneObjectsRef.current.grabbedCargo = null;
        }
        dragPlane.constant = -draggedCargoMesh.position.y;
        return;
      }

      isOrbitDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e) => {
      if (draggedCargoMesh) {
        getPointerNDC(e);
        raycaster.setFromCamera(pointerNDC, camera);
        if (raycaster.ray.intersectPlane(dragPlane, intersectPt)) {
          const half = (draggedCargoMesh.userData.size || 0.56) / 2;
          let targetY = half;
          for (const dz of dropZones) {
            if (
              Math.abs(intersectPt.x - dz.x) <= dz.w / 2 &&
              Math.abs(intersectPt.z - dz.z) <= dz.d / 2
            ) {
              targetY = dz.topY + half;
            }
          }
          draggedCargoMesh.position.set(
            Math.max(-5.5, Math.min(6.0, intersectPt.x)),
            targetY,
            Math.max(-4.0, Math.min(4.0, intersectPt.z))
          );
        }
        return;
      }

      if (!isOrbitDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      camYaw += dx * 0.01;
      camPitch = Math.max(0.15, Math.min(1.45, camPitch + dy * 0.008));
      updateCameraOrbit();
    };

    const onPointerUp = () => {
      isOrbitDragging = false;
      draggedCargoMesh = null;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camDist = Math.max(5.5, Math.min(18, camDist + e.deltaY * 0.006));
      updateCameraOrbit();
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [simMode, scene3DType]);

  // Đồng bộ tư thế Robot, Tay nâng, Tay kẹp & Tương tác Vật lý với các Kiện hàng 3D
  useEffect(() => {
    if (simMode !== '3D' || !sceneObjectsRef.current) return;
    const state3D = sceneObjectsRef.current;
    const {
      robotGroup,
      armPivot,
      leftFinger,
      rightFinger,
      cargoItems,
      dropZones,
      drawbridgeLeaf
    } = state3D;

    const worldX = (robotPose.x - 90) / 42;
    const worldZ = (robotPose.y - 132) / 42;
    robotGroup.position.set(worldX, 0, worldZ);
    robotGroup.rotation.y = -(robotPose.angle * Math.PI) / 180;

    const armRad = ((robotPose.armAngle - 25) * Math.PI) / 180;
    armPivot.rotation.z = armRad;

    const fingerOffset = robotPose.gripperClosed ? 0.21 : 0.38;
    leftFinger.position.z = -fingerOffset;
    rightFinger.position.z = fingerOffset;

    robotGroup.updateMatrixWorld(true);
    const tipWorld = new THREE.Vector3(1.72, -0.08, 0);
    armPivot.localToWorld(tipWorld);

    // 1. Nếu là Sa bàn Cầu rút FLL (3d_bridge_mission): Khi Robot tiến gần cầu và hạ cần (armAngle <= 25), cầu hạ phẳng xuống!
    if (drawbridgeLeaf) {
      if (worldX >= 1.3 && robotPose.armAngle <= 28) {
        drawbridgeLeaf.rotation.z = 0;
      } else if (worldX < 0.5 && robotPose.trail?.length <= 1) {
        drawbridgeLeaf.rotation.z = 0.65;
      }
    }

    // 2. Nếu là Sa bàn Bulldozer (3d_bulldozer_push): Đẩy tất cả các kiện hàng nằm trước lưỡi ủi
    if (scene3DType === '3d_bulldozer_push') {
      cargoItems.forEach((cube) => {
        const dist = Math.hypot(cube.position.x - tipWorld.x, cube.position.z - tipWorld.z);
        if (dist < 0.85 && robotPose.armAngle <= 45) {
          const rad = -(robotPose.angle * Math.PI) / 180;
          cube.position.x = Math.min(5.2, tipWorld.x + Math.cos(rad) * 0.42);
          cube.position.z = tipWorld.z - Math.sin(rad) * 0.35;
        }
      });
    }

    // 3. Cơ chế Gắp / Nâng Forklift / Cần cẩu với các Kiện hàng 3D
    const isHoldingActive =
      robotPose.gripperClosed ||
      robotPose.cargoGrabbed ||
      (scene3DType === '3d_forklift_pallet' && robotPose.armAngle > 45);

    if (isHoldingActive) {
      if (!state3D.grabbedCargo) {
        let nearest = null;
        let minDist = 1.35;
        cargoItems.forEach((cube) => {
          const d = Math.hypot(cube.position.x - tipWorld.x, cube.position.z - tipWorld.z);
          if (d < minDist) {
            minDist = d;
            nearest = cube;
          }
        });
        if (nearest) {
          state3D.grabbedCargo = nearest;
        }
      }
      if (state3D.grabbedCargo) {
        state3D.grabbedCargo.position.set(
          tipWorld.x,
          Math.max(0.28, tipWorld.y),
          tipWorld.z
        );
      }
    } else if (state3D.grabbedCargo) {
      // Khi mở tay kẹp hoặc hạ càng nâng: đặt kiện hàng xuống mặt sàn hoặc lên Bệ cao / Kệ kho
      const dropped = state3D.grabbedCargo;
      const half = (dropped.userData.size || 0.56) / 2;
      let landingY = half;
      for (const dz of dropZones) {
        if (
          Math.abs(dropped.position.x - dz.x) <= dz.w / 2 + 0.25 &&
          Math.abs(dropped.position.z - dz.z) <= dz.d / 2 + 0.25
        ) {
          landingY = Math.max(landingY, dz.topY + half);
        }
      }
      dropped.position.y = landingY;
      state3D.grabbedCargo = null;
    }

    // Kiểm tra số lượng kiện hàng 3D đã đặt thành công vào vùng đích (DropZone)
    if (onCargoStatusChange) {
      let inZoneCount = 0;
      cargoItems.forEach((cube) => {
        const insideAny = dropZones.some(
          (dz) =>
            Math.abs(cube.position.x - dz.x) <= dz.w / 2 + 0.35 &&
            Math.abs(cube.position.z - dz.z) <= dz.d / 2 + 0.35
        );
        if (insideAny) inZoneCount += 1;
      });
      onCargoStatusChange({
        inZoneCount,
        totalCargo: cargoItems.length,
        isHolding: Boolean(state3D.grabbedCargo),
        bridgeLowered: Boolean(drawbridgeLeaf && drawbridgeLeaf.rotation.z <= 0.05)
      });
    }

    // Nếu người dùng bấm Reset về điểm xuất phát ban đầu, khôi phục vị trí các kiện hàng 3D
    if (
      robotPose.trail &&
      robotPose.trail.length <= 1 &&
      !robotPose.gripperClosed &&
      !robotPose.cargoGrabbed &&
      Math.abs(robotPose.armAngle - 35) < 2
    ) {
      state3D.grabbedCargo = null;
      cargoItems.forEach((cube) => {
        if (cube.userData.initialPos) {
          cube.position.copy(cube.userData.initialPos);
        }
      });
    }
  }, [simMode, scene3DType, robotPose]);

  return (
    <div className="flex flex-col h-full bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden">
      {/* HEADER KHU VỰC 3: THANH CÔNG CỤ SA BÀN CỐ ĐỊNH 1 DÒNG (H-11), KHÔNG BAO GIỜ BỊ ÉP DỌC */}
      <div className="h-11 shrink-0 flex items-center justify-between gap-1.5 px-2.5 bg-slate-950 border-b border-slate-800 whitespace-nowrap overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          {/* NÚT MỞ THƯ VIỆN 18 SA BÀN (12 SA BÀN 2D + 6 SA BÀN 3D) */}
          <button
            type="button"
            onClick={() => setShowArenaGallery((v) => !v)}
            className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-extrabold border transition shrink-0 whitespace-nowrap ${
              showArenaGallery
                ? 'bg-fuchsia-500 text-white border-fuchsia-300'
                : 'bg-fuchsia-600/20 text-fuchsia-200 border-fuchsia-500/50 hover:bg-fuchsia-600/40'
            }`}
            title="Mở Thư viện 18 Sa bàn: 12 sa bàn 2D và 6 sa bàn 3D"
          >
            <Grid className="w-3.5 h-3.5 shrink-0" />
            <span>Thư viện Sa bàn (2D: {MAP_2D_OPTIONS.length} | 3D: {SCENE_3D_OPTIONS.length})</span>
          </button>

          {/* MENU CHUNG: CHỌN 1 SA BÀN 2D HOẶC 3D, TỰ ĐỘNG CHUYỂN CHẾ ĐỘ */}
          <select
            value={simMode === '3D' ? scene3DType : mapType}
            onChange={(e) => handleSelectAnyArena(e.target.value)}
            className={`text-[11px] font-bold h-7 px-2 rounded-lg border focus:outline-none cursor-pointer shrink-0 whitespace-nowrap max-w-[220px] ${
              simMode === '3D'
                ? 'bg-orange-500/20 text-orange-200 border-orange-500/50'
                : 'bg-slate-900 text-slate-100 border-slate-700'
            }`}
          >
            <optgroup label={`🗺 SA BÀN 2D (${MAP_2D_OPTIONS.length})`} className="bg-slate-900 text-emerald-300">
              {MAP_2D_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                  {opt.label}
                </option>
              ))}
            </optgroup>
            <optgroup label={`🧊 SA BÀN 3D — KÉO THẢ, GẮP NÂNG (${SCENE_3D_OPTIONS.length})`} className="bg-slate-900 text-orange-300">
              {SCENE_3D_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                  {opt.label}
                </option>
              ))}
            </optgroup>
          </select>

          {simMode === '2D' && (
            <button
              type="button"
              onClick={() => setIsEditingArena((v) => !v)}
              className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-bold border transition shrink-0 whitespace-nowrap ${
                isEditingArena
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/40'
              }`}
              title="Bật công cụ tự vẽ đường Line chính xác tại con trỏ chuột, kéo thả Vật cản, Ô Đích, Kiện hàng và vị trí Robot"
            >
              <Wrench className="w-3.5 h-3.5 shrink-0" />
              <span>{isEditingArena ? '✓ Đóng Thiết Kế' : '🛠 Thiết Kế Sa Bàn'}</span>
            </button>
          )}

          {/* Ô trạng thái cố định kích thước 1 dòng */}
          <span
            className={`inline-flex items-center gap-1 h-7 px-2 rounded-full text-[11px] font-bold border shrink-0 whitespace-nowrap ${
              missionCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 shrink-0 ${
                missionCompleted ? 'text-emerald-400' : 'text-slate-600'
              }`}
            />
            <span>{missionCompleted ? 'Hoàn thành!' : 'Sẵn sàng'}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setSimMode('2D')}
              className={`inline-flex items-center gap-1 h-6 px-2 rounded text-[11px] font-bold transition shrink-0 whitespace-nowrap ${
                simMode === '2D'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5 shrink-0" />
              <span>2D</span>
            </button>
            <button
              onClick={() => setSimMode('3D')}
              className={`inline-flex items-center gap-1 h-6 px-2 rounded text-[11px] font-bold transition shrink-0 whitespace-nowrap ${
                simMode === '3D'
                  ? 'bg-orange-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5 shrink-0" />
              <span>3D ({SCENE_3D_OPTIONS.length})</span>
            </button>
          </div>

          <button
            onClick={onResetSimulator}
            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold h-7 px-2 rounded-lg border border-slate-700 shrink-0 whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* THANH CÔNG CỤ THIẾT KẾ SA BÀN 2D (ĐẶT TÁCH BIỆT PHÍA TRÊN CANVAS ĐỂ KHÔNG CHE VÙNG VẼ LINE) */}
      {isEditingArena && simMode === '2D' && (
        <div className="shrink-0 bg-slate-950 border-b border-amber-400/50 px-2.5 py-1.5 flex flex-col gap-1.5 z-20">
          {/* Hàng 1: Các công cụ vẽ & đặt vật thể */}
          <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap pb-0.5">
            <button
              type="button"
              onClick={() => setEditorTool('draw_line')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'draw_line'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Giữ chuột kéo để vẽ đường Line tự do ngay tại đầu con trỏ"
            >
              <PenTool className="w-3 h-3" />
              Vẽ Line Tự Do
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('straight_line')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'straight_line'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Nhấn giữ từ điểm đầu kéo tới điểm cuối để kẻ đoạn thẳng chính xác"
            >
              <Slash className="w-3 h-3" />
              Kẻ Đoạn Thẳng
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('move_drag')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'move_drag'
                  ? 'bg-sky-400 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Nhấn giữ vào bất kỳ vật thể nào (Robot, Đích, Vật cản, Tường, Kiện hàng) để kéo sang vị trí khác"
            >
              <Move className="w-3 h-3" />
              Kéo Di Chuyển Vật
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('start_pose')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'start_pose'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Bot className="w-3 h-3" />
              Đặt Robot
            </button>

            <button
              type="button"
              onClick={() => {
                const nextStart = {
                  x: safeArena.startPose?.x ?? robotPose.x,
                  y: safeArena.startPose?.y ?? robotPose.y,
                  angle: ((safeArena.startPose?.angle ?? robotPose.angle) + 45) % 360
                };
                onUpdateArenaConfig({ ...safeArena, startPose: nextStart });
                if (onSetStartPose) onSetStartPose(nextStart);
              }}
              className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded text-[10px] font-bold bg-slate-800 text-amber-300 hover:bg-slate-700"
              title="Xoay hướng xuất phát của Robot thêm 45 độ"
            >
              <RotateCw className="w-3 h-3" />
              45°
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('goal')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'goal'
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Flag className="w-3 h-3" />
              + Đích GOAL
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('obstacle')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'obstacle'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              + Vật Cản (E)
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('cargo_box')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'cargo_box'
                  ? 'bg-orange-400 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Package className="w-3 h-3" />
              + Kiện Hàng
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('wall_h')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'wall_h'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <BrickWall className="w-3 h-3" />
              + Tường Ngang
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('wall_v')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'wall_v'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <BrickWall className="w-3 h-3 rotate-90" />
              + Tường Dọc
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('color_patch')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'color_patch'
                  ? 'bg-cyan-400 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Palette className="w-3 h-3" />
              + Dải Màu (D)
            </button>

            <button
              type="button"
              onClick={() => setEditorTool('eraser')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${
                editorTool === 'eraser'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Eraser className="w-3 h-3" />
              Xóa 1 Vật
            </button>
          </div>

          {/* Hàng 2: Chọn màu/độ dày Line, Mẫu đường Line nhanh, Bắt lưới, Undo & Xóa */}
          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-300 border-t border-slate-800 pt-1 overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-2">
              {editorTool === 'draw_line' || editorTool === 'straight_line' ? (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Màu Line:</span>
                    {PATCH_COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedLineColor(c)}
                        className={`w-4 h-4 rounded-full border ${
                          selectedLineColor.name === c.name
                            ? 'ring-2 ring-amber-400 scale-110 border-white'
                            : 'border-slate-600 opacity-75'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.label}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
                    <span className="text-slate-400">Cỡ bút:</span>
                    {[8, 14, 22].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedLineWidth(w)}
                        className={`px-1.5 py-0.5 rounded font-bold ${
                          selectedLineWidth === w
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {w}px
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-slate-400">Mẫu nhanh:</span>
                    {QUICK_LINE_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleApplyQuickLineTemplate(tpl)}
                        className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700"
                      >
                        + {tpl.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : editorTool === 'color_patch' || editorTool === 'cargo_box' ? (
                <div className="flex items-center gap-1">
                  <span>Chọn màu vật thể:</span>
                  {PATCH_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedPatchColor(c)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-white ${
                        selectedPatchColor.name === c.name ? 'ring-2 ring-white' : 'opacity-70'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-amber-300 font-semibold">
                  {editorTool === 'move_drag'
                    ? '💡 Nhấn giữ chuột vào Đích, Vật cản, Tường, Kiện hàng hoặc Robot để kéo sang vị trí mới!'
                    : '💡 Nhấn chuột trực tiếp tại vị trí mong muốn trên Sa bàn (tọa độ hiển thị ngay đầu con trỏ)!'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setSnapToGrid((v) => !v)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold border ${
                  snapToGrid
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Bắt điểm thẳng hàng theo lưới 10px"
              >
                <Grid className="w-3 h-3" />
                <span>Lưới 10px</span>
              </button>

              <button
                type="button"
                onClick={handleUndoLastLine}
                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded font-bold border border-slate-700"
                title="Hoàn tác đường Line vừa vẽ"
              >
                <Undo2 className="w-3 h-3" />
                <span>Undo Line</span>
              </button>

              <label className="cursor-pointer inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded font-bold border border-slate-700">
                <ImagePlus className="w-3 h-3" />
                <span>Thảm FLL</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadBackgroundMat}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() =>
                  onUpdateArenaConfig({
                    startPose: { x: 75, y: 132, angle: 0 },
                    backgroundUrl: '',
                    lines: [],
                    walls: [],
                    obstacles: [],
                    goals: [],
                    colorPatches: [],
                    cargos: []
                  })
                }
                className="inline-flex items-center gap-1 bg-rose-950 hover:bg-rose-900 text-rose-300 px-2 py-0.5 rounded font-bold border border-rose-800"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa hết</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KHUNG MÔ PHỎNG 2D HOẶC 3D (KHÔNG DÙNG OBJECT-CONTAIN ĐỂ TỌA ĐỘ CHUỘT CHÍNH XÁC 100%) */}
      <div className="relative flex-1 min-h-0 bg-slate-950 flex items-center justify-center overflow-hidden">
        {simMode === '2D' ? (
          <canvas
            ref={canvas2DRef}
            width={520}
            height={265}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerLeave={() => {
              setHoverPt(null);
              handleCanvasPointerUp();
            }}
            className={`w-full h-full block bg-slate-100 touch-none ${
              isEditingArena
                ? editorTool === 'move_drag'
                  ? 'cursor-move ring-2 ring-inset ring-sky-400'
                  : 'cursor-crosshair ring-2 ring-inset ring-amber-400'
                : ''
            }`}
          />
        ) : (
          <div ref={mount3DRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        )}

        {/* LỚP PHỦ THƯ VIỆN 18 SA BÀN (DẠNG THẺ, NỔI BÊN TRONG KHUNG — KHÔNG LÀM NHẢY KÍCH THƯỚC) */}
        {showArenaGallery && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur p-3 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-white uppercase tracking-wide">
                📚 Thư viện Sa bàn — Nhấn vào thẻ để mở
              </span>
              <button
                type="button"
                onClick={() => setShowArenaGallery(false)}
                className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold"
              >
                Đóng ✕
              </button>
            </div>

            <div className="text-[11px] font-extrabold text-orange-300 mb-1.5">
              🧊 {SCENE_3D_OPTIONS.length} SA BÀN 3D — KÉO THẢ, GẮP NÂNG, XE NÂNG, CẦN CẨU, XE ỦI, CẦU RÚT
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 mb-3">
              {SCENE_3D_OPTIONS.map((opt, i) => {
                const active = simMode === '3D' && scene3DType === opt.value;
                const icons = ['🦾', '📦', '🚜', '🏗️', '🚧', '🌉'];
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectAnyArena(opt.value)}
                    className={`text-left rounded-lg p-2 border-2 transition ${
                      active
                        ? 'border-orange-400 bg-orange-500/25'
                        : 'border-slate-700 bg-slate-900 hover:border-orange-400/70'
                    }`}
                  >
                    <div className="text-lg leading-none mb-1">{icons[i] || '🧊'}</div>
                    <div className="text-[10px] font-bold text-slate-100 leading-snug whitespace-normal">
                      {opt.label.replace(/^3D Sa bàn \d+: /, '')}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] font-extrabold text-emerald-300 mb-1.5">
              🗺 {MAP_2D_OPTIONS.length} SA BÀN 2D — DÒ LINE, MÊ CUNG, CẢM BIẾN, THI ĐẤU
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5">
              {MAP_2D_OPTIONS.map((opt) => {
                const active = simMode === '2D' && mapType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectAnyArena(opt.value)}
                    className={`text-left rounded-lg p-2 border-2 transition ${
                      active
                        ? 'border-emerald-400 bg-emerald-500/20'
                        : 'border-slate-700 bg-slate-900 hover:border-emerald-400/70'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-slate-100 leading-snug whitespace-normal">
                      {opt.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Thông báo hoàn thành nhiệm vụ dạng Overlay nổi cố định góc dưới phải */}
        {missionCompleted && simMode === '2D' && !isEditingArena && (
          <div className="absolute bottom-2.5 right-3 pointer-events-none bg-emerald-950/90 backdrop-blur border border-emerald-400/60 text-emerald-200 px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Hoàn thành nhiệm vụ! Sẵn sàng kết nối Robot thật</span>
          </div>
        )}

        {/* Cửa sổ nổi Màn hình Hiển thị (Display Extension) */}
        {telemetry.displayMessage && (
          <div className="absolute top-2.5 right-3 pointer-events-none bg-teal-950/95 border-2 border-teal-400 text-teal-100 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-extrabold">
            <Monitor className="w-4 h-4 text-teal-300" />
            <span>Display: "{telemetry.displayMessage}"</span>
          </div>
        )}

        {/* THANH ĐIỀU KHIỂN TƯƠNG TÁC TRỰC TIẾP TRONG KHÔNG GIAN 3D */}
        {simMode === '3D' && (
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2 bg-slate-900/95 backdrop-blur border border-slate-700 px-2.5 py-1.5 rounded-xl text-[10px] overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setInteraction3DMode('drag_cargo')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold ${
                  interaction3DMode === 'drag_cargo'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title="Nhấn giữ chuột vào Kiện hàng 3D để kéo thả sang vị trí bất kỳ trên mặt sàn"
              >
                <Hand className="w-3 h-3" />
                Kéo Thả Kiện Hàng 3D
              </button>
              <button
                type="button"
                onClick={() => setInteraction3DMode('orbit')}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold ${
                  interaction3DMode === 'orbit'
                    ? 'bg-sky-400 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Camera className="w-3 h-3" />
                Xoay Camera
              </button>
              <button
                type="button"
                onClick={() => sceneObjectsRef.current?.setCameraPreset?.('top')}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                title="Góc nhìn từ trên đỉnh xuống"
              >
                Đỉnh
              </button>
              <button
                type="button"
                onClick={() => sceneObjectsRef.current?.setCameraPreset?.('iso')}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                title="Góc nhìn nghiêng 3D mặc định"
              >
                3D
              </button>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onManualNudgeArm('forward')}
                className="px-2 py-0.5 rounded bg-pink-600 hover:bg-pink-500 text-white font-bold"
                title="Cho xe tiến tới gần kiện hàng"
              >
                ↑ Tiến
              </button>
              <button
                onClick={() => onManualNudgeArm('backward')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                title="Cho xe lùi lại"
              >
                ↓ Lùi
              </button>
              <button
                onClick={() => onManualNudgeArm('turnLeft')}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                title="Xoay trái 15°"
              >
                ↺
              </button>
              <button
                onClick={() => onManualNudgeArm('turnRight')}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                title="Xoay phải 15°"
              >
                ↻
              </button>
              <button
                onClick={() => onManualNudgeArm('lift')}
                className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                ⬆ Nâng (75°)
              </button>
              <button
                onClick={() => onManualNudgeArm('lower')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
              >
                ⬇ Hạ (10°)
              </button>
              <button
                onClick={() => onManualNudgeArm('toggleGrip')}
                className="px-2 py-0.5 rounded bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold"
              >
                {robotPose.gripperClosed ? 'Mở Gắp (-90°)' : 'Đóng Gắp (+90°)'}
              </button>
            </div>
          </div>
        )}

        <div className="absolute top-2 left-2.5 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <span className="bg-slate-950/90 text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
            Driving Base (A+B): X={Math.round(robotPose.x)} Y={Math.round(robotPose.y)} | Yaw=
            {Math.round(telemetry.gyroYaw)}°
          </span>
          <span className="bg-slate-950/90 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
            [E] distance = {Math.round(telemetry.distanceSensor.cm)} cm
          </span>
          <span className="bg-slate-950/90 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
            [D] color = {telemetry.colorSensor.color} ({telemetry.colorSensor.reflection}%)
          </span>
        </div>
      </div>
    </div>
  );
}
