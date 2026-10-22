// =====================================================================================
// simPhysics.js — Hình học sa bàn, cảm biến và va chạm cho bộ mô phỏng 2D
// LEGO® SPIKE™ Prime Studio — Thiết kế bởi thầy Hoàng Ngọc Cảnh
// Giáo viên trường THCS & THPT Đinh Thiện Lý
// =====================================================================================

export const ARENA_W = 520;
export const ARENA_H = 265;
export const PX_PER_CM = 1.1; // 1 cm trên sa bàn = 1.1 px (đồng bộ với khối move ... cm)
export const SENSOR_OFFSET_PX = 18; // Cảm biến D/E gắn ở mũi robot, cách tâm 18 px
export const ROBOT_RADIUS_PX = 12; // Bán kính va chạm (tính từ tâm robot)

// Vật cản & tường được VẼ SẴN trong từng sa bàn mẫu (đồng bộ với VirtualSimulatorPanel)
export const PRESET_SOLIDS = {
  line_track: [{ x: 425, y: 106.5, w: 36, h: 52, kind: 'obstacle' }],
  maze: [
    { x: 40, y: 35, w: 260, h: 14, kind: 'wall' },
    { x: 40, y: 135, w: 155, h: 14, kind: 'wall' },
    { x: 290, y: 35, w: 14, h: 210, kind: 'wall' },
    { x: 185, y: 135, w: 14, h: 110, kind: 'wall' }
  ],
  sensor_lab: [{ x: 435, y: 102.5, w: 32, h: 60, kind: 'obstacle' }],
  slalom_obstacles: [
    { x: 169, y: 90, w: 32, h: 40, kind: 'obstacle' },
    { x: 279, y: 135, w: 32, h: 40, kind: 'obstacle' },
    { x: 374, y: 85, w: 32, h: 40, kind: 'obstacle' }
  ],
  parking_garage: [
    { x: 161, y: 70, w: 36, h: 52, kind: 'obstacle' },
    { x: 361, y: 70, w: 36, h: 52, kind: 'obstacle' }
  ]
};

// Ô đích được VẼ SẴN trong từng sa bàn mẫu (có id để dùng cho điều kiện "đi qua theo thứ tự")
export const PRESET_GOALS = {
  line_track: [{ id: 'line_finish', x: 345, y: 100, w: 70, h: 65, label: 'FINISH' }],
  maze: [{ id: 'maze_goal', x: 210, y: 185, w: 70, h: 55, label: 'GOAL' }],
  slalom_obstacles: [{ id: 'slalom_goal', x: 445, y: 95, w: 58, h: 75, label: 'GOAL' }],
  fll_challenge: [
    { id: 'M01', x: 225, y: 24, w: 68, h: 38, label: 'M01: SOLAR' },
    { id: 'M02', x: 425, y: 50, w: 74, h: 48, label: 'M02: DROP' },
    { id: 'M03', x: 375, y: 175, w: 74, h: 55, label: 'M03: CRANE' },
    { id: 'LAUNCH', x: 25, y: 165, w: 95, h: 85, label: 'LAUNCH AREA' }
  ],
  wro_smart_city: [
    { id: 'HOSPITAL', x: 162, y: 15, w: 56, h: 32, label: 'HOSPITAL' },
    { id: 'PARK', x: 322, y: 15, w: 56, h: 32, label: 'PARK' },
    { id: 'PORT', x: 162, y: 218, w: 56, h: 32, label: 'PORT' },
    { id: 'SOLAR', x: 322, y: 218, w: 56, h: 32, label: 'SOLAR' },
    { id: 'SMART_HUB', x: 435, y: 102, w: 65, h: 60, label: 'SMART HUB' }
  ],
  warehouse_grid: [{ id: 'PACKING', x: 405, y: 175, w: 80, h: 56, label: 'PACKING ZONE' }],
  rescue_line: [{ id: 'SAFE', x: 412, y: 170, w: 70, h: 44, label: 'SAFE POINT' }],
  parking_garage: [{ id: 'P2', x: 245, y: 40, w: 68, h: 95, label: 'P2' }]
};

export const DEFAULT_START_POSES = {
  maze: { x: 75, y: 88, angle: 0 },
  fll_challenge: { x: 65, y: 205, angle: 0 },
  loop_circuit: { x: 140, y: 42, angle: 0 },
  rescue_line: { x: 65, y: 200, angle: 0 },
  parking_garage: { x: 65, y: 195, angle: 0 },
  sumo_ring: { x: 205, y: 132, angle: 0 },
  warehouse_grid: { x: 90, y: 130, angle: 0 },
  wro_smart_city: { x: 60, y: 132, angle: 0 }
};

// Chuẩn hóa vật cản tự đặt (hỗ trợ cả kiểu {x,y,r} cũ và {x,y,w,h} mới)
export function normalizeRect(o) {
  if (o.w && o.h) return { x: o.x, y: o.y, w: o.w, h: o.h };
  const r = o.r || 18;
  return { x: o.x - r, y: o.y - r, w: r * 2, h: r * 2 };
}

export function getSolids(mapType, arenaConfig) {
  const solids = [...(PRESET_SOLIDS[mapType] || [])];
  for (const o of arenaConfig?.obstacles || []) solids.push({ ...normalizeRect(o), kind: 'obstacle' });
  for (const w of arenaConfig?.walls || []) solids.push({ x: w.x, y: w.y, w: w.w, h: w.h, kind: 'wall' });
  return solids;
}

export function getGoals(mapType, arenaConfig) {
  return [...(PRESET_GOALS[mapType] || []), ...(arenaConfig?.goals || [])];
}

export function pointInRect(px, py, r, pad = 0) {
  return px >= r.x - pad && px <= r.x + r.w + pad && py >= r.y - pad && py <= r.y + r.h + pad;
}

// Robot (tâm px,py) có chạm vật rắn nào không?
export function findCollision(px, py, solids) {
  for (const s of solids) {
    if (pointInRect(px, py, s, ROBOT_RADIUS_PX)) return s;
  }
  return null;
}

// Dò tia siêu âm theo hướng robot → trả về khoảng cách (cm) tới vật cản/tường/biên sa bàn gần nhất
export function raycastDistanceCm(px, py, angleDeg, solids, maxCm = 200) {
  const rad = (angleDeg * Math.PI) / 180;
  const sx = px + Math.cos(rad) * SENSOR_OFFSET_PX;
  const sy = py + Math.sin(rad) * SENSOR_OFFSET_PX;
  const maxPx = maxCm * PX_PER_CM;
  for (let d = 0; d <= maxPx; d += 1.5) {
    const x = sx + Math.cos(rad) * d;
    const y = sy + Math.sin(rad) * d;
    if (x <= 0 || y <= 0 || x >= ARENA_W || y >= ARENA_H) {
      return Math.max(1, Math.round(d / PX_PER_CM));
    }
    for (const s of solids) {
      if (pointInRect(x, y, s)) return Math.max(1, Math.round(d / PX_PER_CM));
    }
  }
  return maxCm;
}

const COLOR_REFS = [
  { name: 'BLACK', rgb: [15, 23, 42], reflection: 12 },
  { name: 'WHITE', rgb: [248, 250, 252], reflection: 98 },
  { name: 'RED', rgb: [239, 68, 68], reflection: 65 },
  { name: 'YELLOW', rgb: [234, 179, 8], reflection: 85 },
  { name: 'GREEN', rgb: [34, 197, 94], reflection: 52 },
  { name: 'BLUE', rgb: [59, 130, 246], reflection: 42 }
];

// Phân loại điểm ảnh RGB thành màu SPIKE + % ánh sáng phản xạ
export function classifyRgb(r, g, b) {
  let best = COLOR_REFS[1];
  let bestD = Infinity;
  for (const c of COLOR_REFS) {
    const d = (r - c.rgb[0]) ** 2 + (g - c.rgb[1]) ** 2 + (b - c.rgb[2]) ** 2;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  // Đen / Trắng / Xám: dùng độ sáng thật (cho phép dò line tỉ lệ ở mép vạch)
  const isGray = Math.max(r, g, b) - Math.min(r, g, b) < 40;
  if (isGray || best.name === 'BLACK' || best.name === 'WHITE') {
    const reflection = Math.round(Math.max(0, Math.min(100, ((lum - 20) / 230) * 88 + 10)));
    return { color: reflection < 35 ? 'BLACK' : 'WHITE', reflection };
  }
  return { color: best.name, reflection: best.reflection };
}

// Đọc màu trung bình 3x3 điểm ảnh của mặt sàn (không gồm robot) tại vị trí cảm biến
export function sampleFloorColor(floorCanvas, x, y) {
  if (!floorCanvas) return null;
  try {
    const ctx = floorCanvas.getContext('2d', { willReadFrequently: true });
    const ix = Math.max(1, Math.min(ARENA_W - 2, Math.round(x)));
    const iy = Math.max(1, Math.min(ARENA_H - 2, Math.round(y)));
    const data = ctx.getImageData(ix - 1, iy - 1, 3, 3).data;
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    return classifyRgb(r / 9, g / 9, b / 9);
  } catch {
    return null;
  }
}

export function sensorPoint(px, py, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: px + Math.cos(rad) * SENSOR_OFFSET_PX, y: py + Math.sin(rad) * SENSOR_OFFSET_PX };
}

// Các khối được bộ mô phỏng thực thi thật (các khối khác chỉ sinh mã Python)
export const SIM_SUPPORTED_BLOCKS = new Set([
  'when_program_starts',
  'motor_set_speed',
  'motor_run_for_duration',
  'motor_go_to_position',
  'motor_start',
  'motor_stop',
  'set_movement_motors',
  'set_movement_speed',
  'set_motor_rotation_distance',
  'move_for_duration',
  'move_with_steering',
  'start_moving',
  'start_moving_steering',
  'stop_moving',
  'more_movement_tank',
  'light_matrix_turn_on_for_seconds',
  'light_matrix_turn_on',
  'light_matrix_set_pixel',
  'light_matrix_write',
  'light_matrix_turn_off',
  'set_center_button_light',
  'light_up_distance_sensor',
  'play_beep_for_seconds',
  'music_play_note',
  'music_play_drum',
  'play_sound_until_done',
  'stop_all_sounds',
  'wait_seconds',
  'repeat_loop_line_follow',
  'forever_loop',
  'if_then_block',
  'if_else_block',
  'repeat_until_block',
  'wait_until_sensor',
  'set_yaw_angle_to_0',
  'more_motor_go_relative',
  'more_motor_start_power',
  'display_write',
  'stop_all_cap',
  'sensor_is_color',
  'sensor_is_reflection',
  'sensor_is_pressed',
  'sensor_is_closer_than',
  'op_lt',
  'op_eq',
  'op_gt'
]);
