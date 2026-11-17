// =====================================================================================
// matchTime.js — Ước tính THỜI GIAN THẬT robot SPIKE Prime cần để chạy từng khối lệnh
// (sa bàn chạy nhanh hơn thực tế, nên cần quy đổi để luyện chiến thuật trận 2:30 của FLL)
//
// Giả định (Driving Base chuẩn, bánh 56 mm, 2 Medium Angular Motor):
//   • 100% tốc độ ≈ 1110°/s không tải → khi chạy trên thảm ≈ 43 cm/s  → v = 0,43 × tốc độ% (cm/s)
//   • Mỗi lần khởi hành + phanh mất thêm ≈ 0,3 s
//   • Quay tại chỗ: khoảng cách 2 bánh ≈ 11,2 cm → quay 90° mỗi bánh lăn ≈ 8,8 cm
//   • Tay cần cổng C (tốc độ 75%, có tải): ≈ 600°/s + 0,25 s
// Đây là số ƯỚC TÍNH để lập kế hoạch — hãy đo lại trên robot thật của đội và chỉnh hệ số bên dưới.
// =====================================================================================

export const TIME_MODEL = {
  cmPerSecPerPercent: 0.43,
  startStopSec: 0.3,
  wheelTrackCm: 11.2,
  armDegPerSec: 600,
  armOverheadSec: 0.25,
  blockOverheadSec: 0.05
};

const cmFrom = (value, unit) => {
  const v = Math.abs(Number(value) || 0);
  if (unit === 'cm') return v;
  if (unit === 'in' || unit === 'inches') return v * 2.54;
  if (unit === 'rotations') return v * 17.6;
  if (unit === 'degrees') return (v / 360) * 17.6;
  return null; // seconds
};

// ctx: { moveSpeed, armBefore, armAfter }
export function estimateBlockSeconds(block, ctx = {}) {
  const p = block?.params || {};
  const M = TIME_MODEL;
  const speed = Math.max(5, Math.min(100, Number(ctx.moveSpeed ?? 50)));
  const v = M.cmPerSecPerPercent * speed;
  switch (block?.type) {
    case 'move_for_duration': {
      if (p.unit === 'seconds') return Number(p.value) || 0;
      return cmFrom(p.value, p.unit) / v + M.startStopSec;
    }
    case 'gyro_move_straight': {
      const s = Math.max(5, Math.min(100, Number(p.speed ?? 50)));
      return Math.abs(Number(p.value) || 0) / (M.cmPerSecPerPercent * s) + M.startStopSec;
    }
    case 'move_with_steering': {
      // Sa bàn quay robot đúng bằng giá trị steering (độ) → mỗi bánh lăn cung tròn tương ứng
      const deg = Math.abs(Number(p.steering) || 0);
      const arcCm = (Math.PI * M.wheelTrackCm * deg) / 360;
      return arcCm / v + M.startStopSec;
    }
    case 'motor_go_to_position':
    case 'more_motor_go_relative': {
      const d = Math.abs((ctx.armAfter ?? 0) - (ctx.armBefore ?? 0));
      const deg = block.type === 'more_motor_go_relative' ? Math.abs(Number(p.position) || 90) : Math.max(d, 20);
      return deg / M.armDegPerSec + M.armOverheadSec;
    }
    case 'motor_run_for_duration': {
      if (p.unit === 'seconds') return Number(p.value) || 0;
      const deg = p.unit === 'rotations' ? Math.abs(p.value) * 360 : Math.abs(Number(p.value) || 0);
      return deg / M.armDegPerSec + M.armOverheadSec;
    }
    case 'wait_seconds':
      return Math.max(0, Number(p.seconds ?? 1));
    case 'light_matrix_turn_on_for_seconds':
    case 'display_write':
      return Number(p.seconds ?? 1);
    case 'play_beep_for_seconds':
      return Number(p.seconds ?? 0.3);
    default:
      return M.blockOverheadSec;
  }
}

export const MATCH_SECONDS = 150;

export const fmtClock = (s) => {
  const t = Math.max(0, Math.round(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};
