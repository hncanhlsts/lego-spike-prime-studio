// =====================================================================================
// bioglowMissions.js — Chạy ảo 15 nhiệm vụ Robot Game FLL 2026–27 BIOGLOW trên sa bàn 2D
//
// Sa bàn 2D chỉ mô phỏng: vị trí robot, hướng (yaw) và góc tay cần cổng C (0° = hạ sát thảm, 85° = nâng cao).
// Vì vậy mỗi mission được QUY ƯỚC thành các thao tác đo được:
//   • đưa MŨI robot (nơi gắn phụ kiện, cách tâm 18 px) vào vùng mission,
//   • đúng hướng tiếp cận (nếu mission yêu cầu),
//   • HẠ (≤ 20°) hoặc NÂNG (≥ 65°) tay cần trong vùng đó,
//   • không chạm vào mô hình cấm (M10, con katydid của M04),
//   • kết thúc trong Home để giữ Precision Token.
// Điểm mỗi mục lấy đúng theo bảng điểm chính thức. Cơ chế thật của mô hình LEGO khác — xem video Robot Game Missions.
// Thiết kế bởi thầy Hoàng Ngọc Cảnh — Giáo viên trường THCS & THPT Đinh Thiện Lý
// =====================================================================================
import { BIOGLOW_MODELS, BIOGLOW_PX_PER_CM, BIOGLOW_START_POSE } from './bioglow';

export const ARM_DOWN = 20; // tay cần coi là "hạ" khi ≤ 20°
export const ARM_UP = 65; // tay cần coi là "nâng" khi ≥ 65°
export const FRONT_PX = 18; // phụ kiện ở mũi robot, cách tâm 18 px (≈ 8 cm)
const ZONE_PAD = 10; // vùng thao tác = mô hình nới rộng 10 px (≈ 4 cm)
const BODY_PAD = 8; // thân robot (tính từ tâm) chạm mô hình khi vào sát 8 px

export const NORTH = -90;
export const SOUTH = 90;
export const EAST = 0;
export const WEST = 180;

// Vùng khảo sát của M01 (ô vuông nghiêng trên thảm, cạnh vạch đen giữa sân)
const SURVEY_AREA = { x: 262, y: 203, w: 20, h: 18 };

const modelBox = (id, nth = 0) => BIOGLOW_MODELS.filter((m) => m.id === id)[nth];
const pad = (b, p) => ({ x: b.x - p, y: b.y - p, w: b.w + 2 * p, h: b.h + 2 * p });
const inBox = (pt, b) => !!b && pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h;
const front = (s) => {
  const r = (s.angle * Math.PI) / 180;
  return { x: s.x + Math.cos(r) * FRONT_PX, y: s.y + Math.sin(r) * FRONT_PX };
};
const angDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

export const HOME_LEFT_BOX = { x: 30, y: 168, w: 96, h: 96 };
export const HOME_RIGHT_BOX = { x: 394, y: 168, w: 96, h: 96 };
export const RIGHT_START_POSE = { x: 448, y: 222, angle: 180 };

// Vùng thao tác của từng mission / dock (cho bộ chấm và để vẽ lên sa bàn)
export const MISSION_ZONES = {
  M01: pad(modelBox('M01'), ZONE_PAD),
  M01_SURVEY: pad(SURVEY_AREA, 4),
  M02: pad(modelBox('M02'), ZONE_PAD),
  M03: pad(modelBox('M03'), ZONE_PAD),
  M04: pad(modelBox('M04'), ZONE_PAD),
  M05: pad(modelBox('M05'), ZONE_PAD),
  M06: pad(modelBox('M06'), ZONE_PAD),
  M07: pad(modelBox('M07'), ZONE_PAD),
  M08: pad(modelBox('M08'), ZONE_PAD),
  M09: pad(modelBox('M09'), ZONE_PAD),
  M11: pad(modelBox('M11'), ZONE_PAD),
  M12: pad(modelBox('M12', 0), ZONE_PAD),
  M12_POST: pad(modelBox('M12', 1), ZONE_PAD),
  DOCK1: pad(modelBox('DOCK1'), ZONE_PAD),
  DOCK2: pad(modelBox('DOCK2'), ZONE_PAD),
  DOCK3: pad(modelBox('DOCK3'), ZONE_PAD)
};
// Vùng CẤM chạm (thân robot)
const NO_TOUCH = {
  SPIDER: pad(modelBox('M10', 0), BODY_PAD),
  SNAIL: pad(modelBox('M10', 1), BODY_PAD),
  KATYDID: pad(modelBox('M04'), BODY_PAD)
};

// ---------- Các phép kiểm tra trên nhật ký chạy ----------
// snaps: ảnh chụp trạng thái sau MỖI khối lệnh {x, y, angle, arm}; trail: các điểm tâm robot khi di chuyển
const firstSnapIdx = (snaps, from, pred) => {
  for (let i = from; i < snaps.length; i++) if (pred(snaps[i])) return i;
  return -1;
};
const armDownIn = (zone) => (s) => s.arm <= ARM_DOWN && inBox(front(s), zone);
const armUpIn = (zone) => (s) => s.arm >= ARM_UP && inBox(front(s), zone);
const facingIn = (zone, heading, tol = 20) => (s) => inBox(front(s), zone) && angDiff(s.angle, heading) <= tol;
const touched = (trail, box) => (trail || []).some((p) => inBox(p, box));

// 3 vòng treo của tổ M04 (tọa độ x trên sa bàn, cách nhau ≈ 5 cm). Mũi robot phải cách tâm vòng ≤ 5 px (≈ 2 cm).
export const M04_LOOPS = { left: 45, center: 56, right: 68 };
const loopAt = (pt) => {
  for (const [k, x] of Object.entries(M04_LOOPS)) if (Math.abs(pt.x - x) <= 5) return k;
  return null;
};

// ---------- QUY ƯỚC MÔ PHỎNG & ĐIỂM CỦA 15 MISSION ----------
// Mỗi mission: evaluate(run, opts) → { points, max, checks: [{ label, ok, pts }] }
export const BIOGLOW_MISSION_RULES = {
  M01: {
    name: 'Drone Survey',
    home: 'left',
    max: 30,
    howTo: 'Giúp phi công phóng drone: mũi robot vào vùng M01, NÂNG tay cần → drone không còn chạm thảm (20). Bonus +10: bản đồ LiDAR lật hẳn, dấu quét ít nhất một phần trong vùng khảo sát (ô vuông nghiêng cạnh vạch đen) → tới đó và HẠ tay cần. 🚫 Robot phải rời mô hình trước khi hết trận.',
    evaluate: ({ snaps }) => {
      const a = firstSnapIdx(snaps, 0, armUpIn(MISSION_ZONES.M01));
      const b = a >= 0 ? firstSnapIdx(snaps, a + 1, armDownIn(MISSION_ZONES.M01_SURVEY)) : -1;
      return [
        { label: 'Drone không còn chạm thảm', ok: a >= 0, pts: 20 },
        { label: 'Bonus: bản đồ LiDAR lật hẳn, dấu quét trong vùng khảo sát', ok: b >= 0, pts: 10 }
      ];
    }
  },
  M02: {
    name: 'Exploding Seeds',
    home: 'left',
    max: 30,
    howTo: 'Giải phóng 3 hạt khỏi quả: mỗi hạt không còn chạm thân cây được 10 điểm. Quy ước sa bàn: tiến vào M02 theo hướng BẮC và HẠ tay cần → cả 3 hạt bung (30); tiếp cận lệch hướng chỉ 1 hạt rơi (10). Lưu ý: khi thi, hướng các ống xanh có thể thay đổi.',
    evaluate: ({ snaps }) => {
      const hit = firstSnapIdx(snaps, 0, armDownIn(MISSION_ZONES.M02));
      const good = hit >= 0 && angDiff(snaps[hit].angle, NORTH) <= 25;
      return [
        { label: 'Hạt thứ 1 không còn chạm thân cây', ok: hit >= 0, pts: 10 },
        { label: 'Hạt thứ 2 và 3 không còn chạm thân cây (tiếp cận hướng Bắc)', ok: good, pts: 20 }
      ];
    }
  },
  M03: {
    name: 'Flip the Rock',
    home: 'left',
    max: 30,
    howTo: 'Tiến vào M03 theo hướng TÂY (sát tường trái), HẠ tay cần để lật đá và hạ cờ. Bonus: NÂNG tay cần lại (đặt đá về chỗ cũ).',
    evaluate: ({ snaps }) => {
      const d = firstSnapIdx(snaps, 0, armDownIn(MISSION_ZONES.M03));
      const u = d >= 0 ? firstSnapIdx(snaps, d + 1, armUpIn(MISSION_ZONES.M03)) : -1;
      return [
        { label: 'Cờ nghiên cứu hạ xuống', ok: d >= 0, pts: 20 },
        { label: 'Bonus: đá trả về vị trí cũ', ok: u >= 0, pts: 10 }
      ];
    }
  },
  M04: {
    name: 'Lucky Leaves',
    home: 'left',
    max: 30,
    noEquipment: true,
    howTo:
      'Tổ có 3 vòng treo (trái · giữa · phải): 2 vòng là LÁ, 1 vòng là con KATYDID — trọng tài xếp ngẫu nhiên. Đưa mũi robot đúng vòng lá (sai số ±2 cm), HẠ rồi NÂNG tay cần để kéo lá ra. Kéo nhầm vòng katydid → katydid rời leaf habitat → cả mission 0 điểm. Thân robot chạm tổ → katydid lệch chỗ → mất bonus.',
    evaluate: ({ snaps, trail }, opts = {}) => {
      const z = MISSION_ZONES.M04;
      const katPos = opts.katydid || 'center';
      // Kéo 1 vòng = HẠ tay cần rồi NÂNG lại khi mũi robot đứng ngay vòng đó
      const pulled = [];
      for (let i = 0; i < snaps.length; i++) {
        if (!armDownIn(z)(snaps[i])) continue;
        const loop = loopAt(front(snaps[i]));
        if (!loop) continue;
        const up = firstSnapIdx(snaps, i + 1, (s) => s.arm >= ARM_UP);
        if (up >= 0 && loopAt(front(snaps[up])) === loop && inBox(front(snaps[up]), z) && !pulled.includes(loop)) {
          pulled.push(loop);
        }
      }
      const katydidOut = pulled.includes(katPos);
      const leaves = pulled.filter((l) => l !== katPos).length;
      const disturbed = touched(trail, NO_TOUCH.KATYDID);
      const katName = { left: 'trái', center: 'giữa', right: 'phải' }[katPos];
      return [
        { label: `Katydid (vòng ${katName}) còn trong leaf habitat`, ok: !katydidOut, pts: 0 },
        { label: 'Một lá rời khỏi tổ', ok: !katydidOut && leaves >= 1, pts: 10 },
        {
          label: 'Bonus: lá thứ hai rời tổ, katydid giữ nguyên vị trí (thân robot không chạm tổ)',
          ok: !katydidOut && leaves >= 2 && !disturbed,
          pts: 20
        }
      ];
    }
  },
  M05: {
    name: 'Reaching Roots',
    home: 'left',
    max: 20,
    howTo: 'Đẩy rễ cây: mũi robot vào M05 theo hướng BẮC → kéo dài hoàn toàn (20). Vào vùng nhưng lệch hướng → một phần (10).',
    evaluate: ({ snaps }) => {
      const any = firstSnapIdx(snaps, 0, (s) => inBox(front(s), MISSION_ZONES.M05));
      const full = firstSnapIdx(snaps, 0, facingIn(MISSION_ZONES.M05, NORTH, 15));
      return [
        { label: 'Rễ cây kéo dài một phần', ok: any >= 0, pts: 10 },
        { label: 'Rễ cây kéo dài hoàn toàn (đẩy đúng hướng Bắc)', ok: full >= 0, pts: 10 }
      ];
    }
  },
  M06: {
    name: 'Leafcutter Frenzy',
    home: 'right',
    max: 40,
    howTo:
      'Con kiến nằm trên thanh răng trước tổ, mang 4 mảnh lá. Đẩy kiến vào tổ: mũi robot vào M06 theo hướng BẮC. "Đi quá nhanh lá sẽ văng": tốc độ khi đẩy ≤ 30% giữ đủ 4 mảnh (40đ), ≤ 50% còn 2 mảnh (20đ), nhanh hơn văng hết (0đ). Điểm chỉ tính khi kiến chạm tổ.',
    evaluate: ({ snaps }) => {
      const i = firstSnapIdx(snaps, 0, facingIn(MISSION_ZONES.M06, NORTH, 20));
      const spd = i >= 0 ? snaps[i].speed ?? 50 : null;
      const frags = i < 0 ? 0 : spd <= 30 ? 4 : spd <= 50 ? 2 : 0;
      return [
        { label: 'Kiến được đẩy chạm tổ', ok: i >= 0, pts: 0 },
        { label: `Mảnh lá 1–2 trong tổ${i >= 0 ? ` (tốc độ đẩy ${spd}%)` : ''}`, ok: frags >= 2, pts: 20 },
        { label: 'Mảnh lá 3–4 trong tổ (đẩy chậm ≤ 30%)', ok: frags >= 4, pts: 20 }
      ];
    }
  },
  M07: {
    name: 'Humongous Fungus',
    home: 'right',
    max: 20,
    howTo: 'Đẩy sợi nấm: mũi robot vào M07 theo hướng BẮC. (Bonus kết nối với rễ cây đội đối diện chỉ có khi thi 2 bàn ghép — không mô phỏng.)',
    evaluate: ({ snaps }) => {
      const ok = firstSnapIdx(snaps, 0, facingIn(MISSION_ZONES.M07, NORTH, 15)) >= 0;
      return [{ label: 'Sợi nấm kéo dài hoàn toàn', ok, pts: 20 }];
    }
  },
  M08: {
    name: 'Tangled',
    home: 'left',
    max: 30,
    howTo: 'Mũi robot vào M08 theo hướng BẮC, HẠ tay cần gỡ dây leo xuống thảm.',
    evaluate: ({ snaps }) => {
      const ok = firstSnapIdx(snaps, 0, (s) => armDownIn(MISSION_ZONES.M08)(s) && angDiff(s.angle, NORTH) <= 25) >= 0;
      return [{ label: 'Dây leo chạm thảm', ok, pts: 30 }];
    }
  },
  M09: {
    name: 'Research Platform',
    home: 'left',
    max: 30,
    howTo: 'Trong vùng M09: NÂNG tay cần (nâng bệ, 10) → HẠ tay cần (thả bẫy camera, 10). Đứng đúng hướng BẮC khi thao tác thì hạt rơi khỏi cây (+10).',
    evaluate: ({ snaps }) => {
      const z = MISSION_ZONES.M09;
      const u = firstSnapIdx(snaps, 0, armUpIn(z));
      const d = u >= 0 ? firstSnapIdx(snaps, u + 1, armDownIn(z)) : -1;
      const n = firstSnapIdx(snaps, 0, (s) => (armUpIn(z)(s) || armDownIn(z)(s)) && angDiff(s.angle, NORTH) <= 15);
      return [
        { label: 'Bệ nghiên cứu được nâng', ok: u >= 0, pts: 10 },
        { label: 'Bẫy camera đã thả', ok: d >= 0, pts: 10 },
        { label: 'Hạt rời khỏi cây (thao tác đúng hướng Bắc)', ok: n >= 0, pts: 10 }
      ];
    }
  },
  M10: {
    name: 'Fragile Microhabitats',
    home: 'left',
    max: 20,
    howTo: 'Điểm "cho không" nếu robot KHÔNG chạm tổ nhện (cột D, hàng 6) và tổ ốc sên (cột F, hàng 4) suốt trận. Được chấm trong MỌI bài BIOGLOW.',
    evaluate: ({ trail }) => [
      { label: 'Tổ nhện còn nguyên vị trí', ok: !touched(trail, NO_TOUCH.SPIDER), pts: 10 },
      { label: 'Tổ ốc sên còn nguyên vị trí', ok: !touched(trail, NO_TOUCH.SNAIL), pts: 10 }
    ]
  },
  M11: {
    name: 'Window to the Past',
    home: 'right',
    max: 20,
    howTo: 'Mũi robot vào M11 theo hướng TÂY (từ Home phải sang), HẠ tay cần đóng nắp che rễ xuống thảm.',
    evaluate: ({ snaps }) => {
      const ok = firstSnapIdx(snaps, 0, armDownIn(MISSION_ZONES.M11)) >= 0;
      return [{ label: 'Nắp che rễ hạ xuống, chạm thảm', ok, pts: 20 }];
    }
  },
  M12: {
    name: 'Forest Elder',
    home: 'right',
    max: 30,
    howTo: 'Mũi robot vào vùng cây cổ thụ (sát tường phải) theo hướng ĐÔNG, NÂNG tay cần dựng gậy chống (20). Sau đó tới cột phía dưới và HẠ tay cần quàng dây buộc (+10).',
    evaluate: ({ snaps }) => {
      const u = firstSnapIdx(snaps, 0, armUpIn(MISSION_ZONES.M12));
      const t = u >= 0 ? firstSnapIdx(snaps, u + 1, armDownIn(MISSION_ZONES.M12_POST)) : -1;
      return [
        { label: 'Gậy chống nâng hoàn toàn, chạm cây', ok: u >= 0, pts: 20 },
        { label: 'Dây buộc quàng quanh cột', ok: t >= 0, pts: 10 }
      ];
    }
  },
  M13: {
    name: 'Keystone Species',
    home: 'right',
    max: 30,
    dock: 'DOCK1',
    howTo: 'Đội tự lắp loài chủ chốt bằng gạch túi số 20 (được tính là thiết bị, khai báo khi kiểm tra trước trận). Chở từ Home tới dock đặt M13, HẠ tay cần đặt lên bệ phục hồi → cây non được nâng lên (30).',
    evaluate: ({ snaps }, opts = {}) => {
      const dock = MISSION_ZONES[opts.dock || 'DOCK1'];
      const ok = firstSnapIdx(snaps, 0, armDownIn(dock)) >= 0;
      return [{ label: 'Loài chủ chốt trên bệ, cây non được nâng', ok, pts: 30 }];
    }
  },
  M14: {
    name: 'Seeds of Renewal',
    home: 'right',
    max: 40,
    dock: 'DOCK3',
    howTo: 'Gieo hạt đội đã thu thập vào trạm gieo trồng: mỗi hạt nằm trong trạm 5 điểm, bonus +5 mỗi hạt chạm thảm. Quy ước sa bàn (4 hạt chở từ Home): HẠ tay cần ≤ 20° trong dock → 4 hạt vào trạm và chạm thảm (40); hạ chưa sát (21–45°) → vào trạm nhưng không chạm thảm (20).',
    evaluate: ({ snaps }, opts = {}) => {
      const dock = MISSION_ZONES[opts.dock || 'DOCK3'];
      const inside = firstSnapIdx(snaps, 0, (s) => s.arm <= 45 && inBox(front(s), dock));
      const touching = firstSnapIdx(snaps, 0, armDownIn(dock));
      return [
        { label: '4 hạt nằm trong trạm gieo trồng', ok: inside >= 0, pts: 20 },
        { label: 'Bonus: 4 hạt chạm thảm', ok: touching >= 0, pts: 20 }
      ];
    }
  },
  M15: {
    name: 'Biocentric Architecture',
    home: 'left',
    max: 40,
    dock: 'DOCK2',
    noEquipment: true,
    howTo:
      'Mô hình có 3 bộ phận: NÂNG tay cần → mái tổ chim (Nesting Canopy) nâng lên (10); đẩy thẳng vào theo hướng BẮC → khung giếng trời (Garden Skylight) trượt vào hoàn toàn (10); HẠ tay cần → cửa ủ phân (Compost Hatch) mở chạm thảm (10). Environmental Bonus +10 (chỉ 1 bonus) khi hoàn thành nhu cầu lớn nhất của dock đang đặt mô hình: Mine → mái tổ chim, City → giếng trời, Farm → cửa ủ phân.',
    evaluate: ({ snaps }, opts = {}) => {
      const dockId = opts.dock || 'DOCK2';
      const dock = MISSION_ZONES[dockId];
      const dockType = opts.dockType || DOCK_TYPES[dockId];
      const canopy = firstSnapIdx(snaps, 0, armUpIn(dock)) >= 0;
      const skylight = firstSnapIdx(snaps, 0, facingIn(dock, NORTH, 15)) >= 0;
      const hatch = firstSnapIdx(snaps, 0, armDownIn(dock)) >= 0;
      const need = { mine: canopy, city: skylight, farm: hatch }[dockType];
      const needName = { mine: 'mái tổ chim', city: 'giếng trời', farm: 'cửa ủ phân' }[dockType];
      return [
        { label: 'Mái tổ chim (Nesting Canopy) được nâng', ok: canopy, pts: 10 },
        { label: 'Giếng trời (Garden Skylight) vào hoàn toàn', ok: skylight, pts: 10 },
        { label: 'Cửa ủ phân (Compost Hatch) mở, chạm thảm', ok: hatch, pts: 10 },
        {
          label: `Environmental Bonus — ${DOCK_NAMES[dockType] || dockType}: ${needName}`,
          ok: !!need,
          pts: dockType ? 10 : 0
        }
      ];
    }
  }
};

// Loại dock theo vị trí (suy ra từ hình nền thảm — xem bioglow.js)
export const DOCK_TYPES = { DOCK1: 'mine', DOCK2: 'farm', DOCK3: 'city' };
const DOCK_NAMES = { mine: 'Mine dock', farm: 'Farm dock', city: 'City dock' };

// Mission có biểu tượng 🚫 No Equipment Constraint (theo phiếu điểm chính thức) và vùng mô hình tương ứng:
// mô hình còn chạm thiết bị (robot) khi hết trận → mission đó không được điểm.
const NO_EQUIPMENT_ZONES = {
  M01: ['M01'],
  M04: ['M04'],
  M05: ['M05'],
  M07: ['M07'],
  M09: ['M09'],
  M12: ['M12', 'M12_POST'],
  M15: ['__DOCK__']
};

export const ALL_MISSION_IDS = Object.keys(BIOGLOW_MISSION_RULES);

const PRECISION_POINTS = [0, 10, 15, 25, 35, 50, 50];

// Chấm một lượt chạy ảo trên thảm BIOGLOW
// run: { snaps, trail, finalPose, collision }  ·  opts: { missions: ['M02', ...], dock, dockType }
export function evaluateBioglowRun(rawRun, opts = {}) {
  // Giới hạn thời gian trận (mặc định 150 s): thao tác xảy ra sau thời điểm này không được tính,
  // robot coi như dừng tại vị trí lúc hết giờ. snaps[i].t = giây thực tế ước tính khi khối i kết thúc.
  const limit = opts.timeLimit ?? 150;
  const allSnaps = rawRun.snaps || [];
  const totalTime = allSnaps.length ? allSnaps[allSnaps.length - 1].t ?? 0 : 0;
  const overTime = totalTime > limit;
  const inTime = allSnaps.filter((s) => (s.t ?? 0) <= limit);
  const lastIn = inTime[inTime.length - 1];
  const run = {
    ...rawRun,
    snaps: inTime,
    finalPose: overTime ? (lastIn ? { x: lastIn.x, y: lastIn.y, angle: lastIn.angle } : rawRun.startPose || rawRun.finalPose) : rawRun.finalPose
  };
  const res = evaluateBioglowRunInner(run, opts);
  return { ...res, totalTime, overTime, timeLimit: limit };
}

function evaluateBioglowRunInner(run, opts = {}) {
  const ids = opts.missions && opts.missions.length ? opts.missions : ALL_MISSION_IDS;
  const list = ids.includes('M10') ? ids : [...ids, 'M10']; // M10 luôn được chấm
  const fpEnd = run.finalPose || {};
  const endFront = fpEnd.x !== undefined ? front({ x: fpEnd.x, y: fpEnd.y, angle: fpEnd.angle || 0 }) : null;
  const missions = list.map((id) => {
    const rule = BIOGLOW_MISSION_RULES[id];
    let checks = rule.evaluate(run, opts);
    const zoneKeys = NO_EQUIPMENT_ZONES[id];
    if (zoneKeys && endFront) {
      const zones = zoneKeys.map((k) => MISSION_ZONES[k === '__DOCK__' ? opts.dock || rule.dock : k]);
      const stillTouching = zones.some((z) => inBox(endFront, z) || inBox(fpEnd, z));
      const anyScored = checks.some((c) => c.ok && c.pts > 0);
      if (anyScored || stillTouching) {
        if (stillTouching) checks = checks.map((c) => ({ ...c, ok: false }));
        checks = [...checks, { label: '🚫 Robot không còn chạm mô hình khi hết trận', ok: !stillTouching, pts: 0 }];
      }
    }
    const points = checks.reduce((a, c) => a + (c.ok ? c.pts : 0), 0);
    const max = checks.reduce((a, c) => a + c.pts, 0); // tối đa theo các mục được chấm trong lượt này
    return { id, name: rule.name, points, max, checks };
  });
  const fp = run.finalPose || {};
  const atHome = inBox(fp, HOME_LEFT_BOX) || inBox(fp, HOME_RIGHT_BOX);
  // Robot dừng ngoài Home thì đội phải chạm tay vào robot → mất 1 Precision Token. Va chạm tường cũng mất 1.
  const tokens = 6 - (atHome ? 0 : 1) - (run.collision ? 1 : 0);
  const tokenPoints = PRECISION_POINTS[Math.max(0, tokens)];
  const missionPoints = missions.reduce((a, m) => a + m.points, 0);
  return { missions, atHome, tokens, tokenPoints, missionPoints, total: missionPoints + tokenPoints };
}

// ---------- BỘ LẬP ĐƯỜNG ĐI (dùng để sinh LỜI GIẢI MẪU) ----------
// Sinh chuỗi khối từ danh sách thao tác. Quy ước góc: 0 = Đông, 90 = Nam, -90 = Bắc, 180 = Tây (rẽ phải = góc dương).
const norm = (a) => ((a + 540) % 360) - 180;
const r1 = (v) => Math.round(v * 2) / 2;
export function planBlocks(prefix, start, actions) {
  let { x, y, angle } = start;
  let n = 0;
  const id = () => `${prefix}_${n++}`;
  const out = [];
  const turnTo = (h) => {
    const d = Math.round(norm(h - angle));
    if (d !== 0) {
      out.push({
        id: id(),
        type: 'move_with_steering',
        params: { steering: d, steeringText: d > 0 ? `right: ${d}` : `left: ${Math.abs(d)}`, value: 1, unit: 'rotations' }
      });
      angle = angle + d;
    }
  };
  const fwd = (px, dir = 'forward') => {
    const cm = r1(px / BIOGLOW_PX_PER_CM);
    if (cm <= 0) return;
    out.push({ id: id(), type: 'move_for_duration', params: { direction: dir, value: cm, unit: 'cm' } });
    const s = dir === 'forward' ? 1 : -1;
    const rad = (angle * Math.PI) / 180;
    const realPx = cm * BIOGLOW_PX_PER_CM;
    x += Math.cos(rad) * realPx * s;
    y += Math.sin(rad) * realPx * s;
  };
  const goTo = (tx, ty) => {
    if (Math.hypot(tx - x, ty - y) < 1) return; // đã ở đúng chỗ — không quay
    const h = (Math.atan2(ty - y, tx - x) * 180) / Math.PI;
    turnTo(h);
    fwd(Math.hypot(tx - x, ty - y));
  };
  for (const a of actions) {
    if (a.speed !== undefined) {
      out.push({ id: id(), type: 'set_movement_speed', params: { speed: a.speed } });
    } else if (a.arm !== undefined) {
      out.push({ id: id(), type: 'motor_go_to_position', params: { port: 'C', direction: 'shortest path', position: a.arm } });
    } else if (a.to) {
      goTo(a.to[0], a.to[1]);
    } else if (a.face !== undefined) {
      turnTo(a.face);
    } else if (a.back) {
      fwd(a.back * BIOGLOW_PX_PER_CM, 'backward');
    } else if (a.approach) {
      // Đưa MŨI robot tới điểm approach theo hướng heading: đi tới điểm chờ, quay, rồi tiến thẳng `run` px
      const [fx, fy] = a.approach;
      const h = a.heading;
      const rad = (h * Math.PI) / 180;
      const cx = fx - Math.cos(rad) * FRONT_PX;
      const cy = fy - Math.sin(rad) * FRONT_PX;
      const run = a.run ?? 30;
      goTo(cx - Math.cos(rad) * run, cy - Math.sin(rad) * run);
      turnTo(h);
      fwd(run);
    }
  }
  return out;
}

// Thao tác dựng sẵn cho lời giải
export const LEFT_HOME = [BIOGLOW_START_POSE.x, BIOGLOW_START_POSE.y];
export const RIGHT_HOME = [RIGHT_START_POSE.x, RIGHT_START_POSE.y];

// ---------- 16 BÀI CHẠY ẢO (B01–B15 theo từng mission + B16 trận đấu ảo) ----------
// path: thao tác sinh lời giải mẫu · start: 'left' | 'right'
export const BIOGLOW_LESSON_SPECS = [
  {
    no: 'B01', missions: ['M01'], start: 'left', grid: 'F1', level: 'Trung bình',
    title: 'M01 Drone Survey — Phóng drone & lật bản đồ LiDAR',
    hints: ['Đi gần sát mép dưới thảm, hướng Đông, tới vùng M01 (cột F, hàng 1).', 'Nâng tay cần lên 80° để phóng drone.', 'Bonus: quay lên hướng Bắc tại ô vuông nghiêng cạnh vạch đen, hạ tay cần xuống 10°.'],
    path: [{ approach: [250, 240], heading: EAST, run: 30 }, { arm: 80 }, { approach: [272, 212], heading: NORTH, run: 0 }, { arm: 10 }, { to: LEFT_HOME }]
  },
  {
    no: 'B02', missions: ['M02'], start: 'left', grid: 'D3', level: 'Dễ',
    title: 'M02 Exploding Seeds — Kích nổ quả hạt từ phía Nam',
    hints: ['M02 ở cột D, hàng 3. Tới điểm chờ ngay phía dưới rồi quay hướng Bắc (−90°).', 'Tiến thẳng khoảng 13 cm, hạ tay cần 10° rồi nâng lại 80°.', 'Lùi ra trước khi quay về Home.'],
    path: [{ approach: [176, 140], heading: NORTH, run: 30 }, { arm: 10 }, { arm: 80 }, { back: 15 }, { to: LEFT_HOME }]
  },
  {
    no: 'B03', missions: ['M03'], start: 'left', grid: 'A4', level: 'Dễ',
    title: 'M03 Flip the Rock — Lật đá, hạ cờ, trả đá về chỗ cũ',
    hints: ['M03 sát tường trái (cột A, hàng 4): tiếp cận theo hướng Tây (180°).', 'Hạ tay cần 10° (lật đá), rồi nâng 80° (trả đá) để lấy bonus.', 'Lùi 13 cm rồi về Home.'],
    path: [{ approach: [58, 113], heading: WEST, run: 30 }, { arm: 10 }, { arm: 80 }, { back: 13 }, { to: LEFT_HOME }]
  },
  {
    no: 'B04', missions: ['M04'], start: 'left', grid: 'A6', level: 'Khó',
    title: 'M04 Lucky Leaves — Kéo đúng 2 vòng lá, tránh vòng katydid',
    katydid: 'center',
    hints: [
      'Bài này katydid ở vòng GIỮA (vòng tô vàng trên thảm); 2 lá ở vòng TRÁI và PHẢI, cách nhau ≈ 10 cm. Khi thi thật trọng tài xếp ngẫu nhiên — hãy viết 3 My Block "kéo vòng trái/giữa/phải".',
      'Mũi robot hướng Bắc, dừng ngay dưới vòng trái (cách mép dưới tổ ~3 cm), hạ 10° → nâng 80°. Thân robot không được chạm tổ.',
      'Lùi ~5 cm, dịch sang phải ~10 cm, lặp lại với vòng phải rồi về Home.'
    ],
    path: [
      { approach: [45, 50], heading: NORTH, run: 30 }, { arm: 10 }, { arm: 80 }, { back: 6 },
      { approach: [68, 50], heading: NORTH, run: 20 }, { arm: 10 }, { arm: 80 }, { back: 12 },
      { to: LEFT_HOME }
    ]
  },
  {
    no: 'B05', missions: ['M05'], start: 'left', grid: 'C6', level: 'Dễ',
    title: 'M05 Reaching Roots — Đẩy rễ cây đúng hướng Bắc',
    hints: ['M05 ở mép trên, cột C. Đẩy thẳng hướng Bắc mới kéo dài hoàn toàn.', 'Dùng gyro move straight để không lệch hướng khi đẩy.', 'Lùi ra rồi về Home.'],
    path: [{ approach: [123, 18], heading: NORTH, run: 40 }, { back: 17 }, { to: LEFT_HOME }]
  },
  {
    no: 'B06', missions: ['M06'], start: 'right', grid: 'H6', level: 'Trung bình',
    title: 'M06 Leafcutter Frenzy — Đẩy kiến về tổ thật chậm',
    hints: [
      'Xuất phát từ Home PHẢI, đi nhanh (50–60%) tới điểm chờ ngay dưới M06 (cột H, hàng 6).',
      'TRƯỚC khi đẩy: "set movement speed to 30 %". Đẩy quá nhanh lá sẽ văng khỏi tổ!',
      'Quay hướng Bắc, đẩy thẳng ~17 cm, rồi đặt lại tốc độ 50% để về Home cho nhanh.'
    ],
    path: [
      { speed: 50 }, { to: [377, 84] }, { face: NORTH }, { speed: 30 },
      { approach: [377, 26], heading: NORTH, run: 40 },
      { speed: 50 }, { back: 17 }, { to: RIGHT_HOME }
    ]
  },
  {
    no: 'B07', missions: ['M07'], start: 'right', grid: 'I6', level: 'Dễ',
    title: 'M07 Humongous Fungus — Đẩy sợi nấm',
    hints: ['Từ Home phải, tới điểm chờ dưới M07 (cột I, hàng 6).', 'Quay hướng Bắc, đẩy thẳng ~17 cm.', 'Bonus kết nối với đội đối diện chỉ có khi thi 2 bàn ghép.'],
    path: [{ approach: [399, 26], heading: NORTH, run: 40 }, { back: 17 }, { to: RIGHT_HOME }]
  },
  {
    no: 'B08', missions: ['M08'], start: 'left', grid: 'C6', level: 'Trung bình',
    title: 'M08 Tangled — Gỡ dây leo khỏi cây',
    hints: ['M08 ở mép trên, cột C–D (bên trái M09).', 'Tiếp cận hướng Bắc, hạ tay cần 10° để kéo dây leo xuống thảm.', 'Nâng tay cần lại trước khi lùi để không kéo đổ cây.'],
    path: [{ approach: [148, 28], heading: NORTH, run: 40 }, { arm: 10 }, { arm: 80 }, { back: 17 }, { to: LEFT_HOME }]
  },
  {
    no: 'B09', missions: ['M09'], start: 'left', grid: 'D6', level: 'Khó',
    title: 'M09 Research Platform — Nâng bệ, thả bẫy camera, lấy hạt',
    hints: ['M09 ngay cạnh tổ nhện M10 — đừng để thân robot lệch sang phải!', 'Hướng Bắc: nâng 80° (bệ) → hạ 10° (camera) → nâng 80°.', 'Giữ đúng hướng Bắc khi thao tác thì hạt mới rơi khỏi cây.'],
    path: [{ approach: [171, 28], heading: NORTH, run: 40 }, { arm: 80 }, { arm: 10 }, { arm: 80 }, { back: 17 }, { to: LEFT_HOME }]
  },
  {
    no: 'B10', missions: ['M10', 'M11'], start: 'left', grid: 'D6 · F4', level: 'Trung bình',
    title: 'M10 Fragile Microhabitats — Băng qua sân tới M11, không chạm tổ ốc sên',
    hints: ['Tổ ốc sên ở cột F, hàng 4, ngay cạnh dock giữa sân. Vẽ đường đi bằng Thước Đo trước!', 'Đi chéo thấp (dưới tổ ốc sên) rồi tiếp cận M11 theo hướng Đông.', 'Hạ tay cần 10° tại M11, về lại Home trái theo đúng đường cũ.'],
    path: [{ approach: [343, 128], heading: EAST, run: 30 }, { arm: 10 }, { arm: 80 }, { back: 13 }, { to: LEFT_HOME }]
  },
  {
    no: 'B11', missions: ['M11'], start: 'right', grid: 'H3', level: 'Dễ',
    title: 'M11 Window to the Past — Đóng nắp che rễ',
    hints: ['Từ Home phải, M11 ở cột H, hàng 3 (giữa sân bên phải).', 'Tiếp cận theo hướng Tây (180°), hạ tay cần 10°.', 'Nâng tay cần, lùi ra rồi về Home phải.'],
    path: [{ approach: [365, 128], heading: WEST, run: 30 }, { arm: 10 }, { arm: 80 }, { back: 13 }, { to: RIGHT_HOME }]
  },
  {
    no: 'B12', missions: ['M12'], start: 'right', grid: 'J4', level: 'Khó',
    title: 'M12 Forest Elder — Dựng gậy chống & buộc dây vào cột',
    hints: ['Cây cổ thụ sát tường phải (cột J, hàng 4): tiếp cận hướng Đông, nâng tay cần 80°.', 'Lùi ra, đi xuống ~21 cm tới cột phía dưới, hướng Đông, hạ tay cần 10°.', 'Coi chừng va vào tường phải!'],
    path: [{ approach: [470, 90], heading: EAST, run: 30 }, { arm: 80 }, { back: 13 }, { approach: [474, 139], heading: EAST, run: 20 }, { arm: 10 }, { arm: 80 }, { back: 9 }, { to: RIGHT_HOME }]
  },
  {
    no: 'B13', missions: ['M13'], dock: 'DOCK1', start: 'right', grid: 'J6', level: 'Trung bình',
    title: 'M13 Keystone Species — Đưa loài chủ chốt lên bệ phục hồi',
    hints: ['Bài này đặt mô hình M13 ở MINE dock (góc trên phải, cột J, hàng 6).', 'Từ Home phải đi thẳng hướng Bắc.', 'Hạ tay cần 10° để đặt loài chủ chốt lên bệ.'],
    path: [{ arm: 80 }, { approach: [464, 40], heading: NORTH, run: 40 }, { arm: 10 }, { back: 17 }, { to: RIGHT_HOME }]
  },
  {
    no: 'B14', missions: ['M14'], dock: 'DOCK3', start: 'right', grid: 'G1', level: 'Trung bình',
    title: 'M14 Seeds of Renewal — Gieo 4 hạt vào trạm',
    hints: ['Bài này đặt mô hình M14 ở CITY dock (mép dưới, cột G, hàng 1).', 'Từ Home phải đi sát mép dưới theo hướng Tây.', 'Hạ tay cần hẳn 10° để hạt chạm thảm (bonus). Hạ 30° chỉ được một nửa điểm.'],
    path: [{ arm: 80 }, { approach: [334, 240], heading: WEST, run: 30 }, { arm: 10 }, { arm: 80 }, { back: 13 }, { to: RIGHT_HOME }]
  },
  {
    no: 'B15', missions: ['M15'], dock: 'DOCK2', start: 'left', grid: 'F4', level: 'Khó',
    title: 'M15 Biocentric Architecture — Farm dock: mái tổ chim, giếng trời, cửa ủ phân + bonus',
    hints: ['Bài này đặt M15 ở FARM dock (giữa sân, cột F, hàng 4) — sát tổ ốc sên M10! Nhu cầu lớn nhất của Farm là CỬA Ủ PHÂN → +10 bonus.', 'Tiếp cận từ phía Nam theo hướng Bắc (đẩy giếng trời vào), nâng 80° (mái tổ chim), hạ 10° (mở cửa ủ phân).', 'M15 có biểu tượng 🚫: phải lùi robot ra khỏi mô hình trước khi hết trận, nếu không cả mission bằng 0.'],
    path: [{ approach: [260, 135], heading: NORTH, run: 30 }, { arm: 80 }, { arm: 10 }, { arm: 80 }, { back: 13 }, { to: LEFT_HOME }]
  },
  {
    no: 'B16', missions: [], start: 'left', grid: 'Cả sân', level: 'Thi đấu', minScore: 150,
    title: 'Trận đấu ảo — Run 1 từ Home trái, đạt ≥ 150 điểm',
    hints: ['Tất cả 15 mission đều được chấm. Chọn các mission gần Home trái và gom thành 1 lượt chạy.', 'Gợi ý chuỗi: M03 → M08 → M02 → về Home.', 'Robot phải về Home khi kết thúc, nếu không sẽ mất Precision Token.'],
    path: [
      { approach: [58, 113], heading: WEST, run: 30 }, { arm: 10 }, { arm: 80 }, { back: 13 },
      { approach: [148, 28], heading: NORTH, run: 40 }, { arm: 10 }, { arm: 80 }, { back: 17 },
      { approach: [176, 140], heading: NORTH, run: 30 }, { arm: 10 }, { arm: 80 }, { back: 15 },
      { to: LEFT_HOME }
    ]
  }
];

export const startPoseFor = (side) => (side === 'right' ? { ...RIGHT_START_POSE } : { ...BIOGLOW_START_POSE });
