// =====================================================================================
// bioglow.js — Mùa giải FIRST® LEGO® League Challenge 2026–2027: BIOGLOW™ (Founders Edition)
// Bố cục thảm (vị trí gần đúng theo "Wireframe & Grid" chính thức) + bảng tính điểm Robot Game
// Nguồn: Robot Game Rulebook, Challenge Updates (14/10/2026), Robot Game Excel Scorer.
// Thiết kế bởi thầy Hoàng Ngọc Cảnh — Giáo viên trường THCS & THPT Đinh Thiện Lý
// =====================================================================================

// ---------- KÍCH THƯỚC & TỈ LỆ ----------
// Thảm thi đấu mùa BIOGLOW: 200 cm × 114,3 cm (lưới 20 cm, cột A–J, hàng 1–6 tính từ dưới lên).
// Sa bàn 520×265 px → 2.3 px / cm, thảm nằm giữa, hai bên là khu để đồ (storage) của đội.
export const BIOGLOW_PX_PER_CM = 2.3;
export const BIOGLOW_FIELD = {
  x: 30,
  y: 1,
  w: 200 * BIOGLOW_PX_PER_CM, // 460 px
  h: 114.3 * BIOGLOW_PX_PER_CM // ≈ 263 px
};
export const BIOGLOW_GRID_CM = 20;

// Hai khu Home / Launch Area là 2 cung phần tư ở 2 góc dưới (bán kính ≈ 48 cm)
const LAUNCH_R = 48 * BIOGLOW_PX_PER_CM;
export const BIOGLOW_LAUNCH_AREAS = [
  { id: 'LEFT', label: 'LEFT LAUNCH', cx: BIOGLOW_FIELD.x, cy: BIOGLOW_FIELD.y + BIOGLOW_FIELD.h, r: LAUNCH_R, color: '#dc2626' },
  {
    id: 'RIGHT',
    label: 'RIGHT LAUNCH',
    cx: BIOGLOW_FIELD.x + BIOGLOW_FIELD.w,
    cy: BIOGLOW_FIELD.y + BIOGLOW_FIELD.h,
    r: LAUNCH_R,
    color: '#2563eb'
  }
];

// Vạch đen in trên thảm (dùng để dò line / căn chỉnh lại vị trí)
export const BIOGLOW_LINES = [
  [
    { x: 139, y: 76 },
    { x: 150, y: 58 },
    { x: 204, y: 58 }
  ],
  [
    { x: 337, y: 39 },
    { x: 361, y: 62 },
    { x: 418, y: 62 }
  ],
  [
    { x: 247, y: 167 },
    { x: 262, y: 194 }
  ]
];

// Mô hình nhiệm vụ: box = vị trí mô hình trên thảm (px của sa bàn). Vị trí là GẦN ĐÚNG để
// lập kế hoạch đường đi — luôn đối chiếu với thảm thật và Field Setup Guide trước khi thi.
export const BIOGLOW_MODELS = [
  { id: 'M01', name: 'Drone Survey', x: 228, y: 241, w: 76, h: 20, color: '#0ea5e9' },
  { id: 'M02', name: 'Exploding Seeds', x: 168, y: 130, w: 17, h: 20, color: '#a16207' },
  { id: 'M03', name: 'Flip the Rock', x: 32, y: 104, w: 32, h: 18, color: '#78716c' },
  { id: 'M04', name: 'Lucky Leaves', x: 39, y: 11, w: 35, h: 33, color: '#16a34a' },
  { id: 'M05', name: 'Reaching Roots', x: 116, y: 2, w: 14, h: 22, color: '#854d0e' },
  { id: 'M06', name: 'Leafcutter Frenzy', x: 366, y: 3, w: 22, h: 29, color: '#65a30d' },
  { id: 'M07', name: 'Humongous Fungus', x: 389, y: 3, w: 20, h: 29, color: '#c026d3' },
  { id: 'M08', name: 'Tangled', x: 137, y: 4, w: 22, h: 31, color: '#15803d' },
  { id: 'M09', name: 'Research Platform', x: 160, y: 4, w: 22, h: 31, color: '#0369a1' },
  { id: 'M10', name: 'Spider Habitat', x: 197, y: 16, w: 12, h: 13, color: '#f97316' },
  { id: 'M10', name: 'Snail Habitat', x: 262, y: 94, w: 16, h: 11, color: '#f97316' },
  { id: 'M11', name: 'Window to the Past', x: 341, y: 114, w: 26, h: 28, color: '#7c3aed' },
  { id: 'M12', name: 'Forest Elder', x: 467, y: 82, w: 16, h: 17, color: '#166534' },
  { id: 'M12', name: 'Post', x: 472, y: 131, w: 8, h: 16, color: '#166534' },
  { id: 'DOCK1', name: 'Dock (M13–15)', x: 447, y: 8, w: 35, h: 36, color: '#dc2626', dock: true },
  { id: 'DOCK2', name: 'Dock (M13–15)', x: 249, y: 102, w: 22, h: 35, color: '#dc2626', dock: true },
  { id: 'DOCK3', name: 'Dock (M13–15)', x: 315, y: 226, w: 22, h: 33, color: '#dc2626', dock: true }
];

// Vùng "ghé mission" để chấm bài trên sa bàn: mở rộng quanh mô hình 10 px (≈ 4 cm)
const PAD = 10;
const seen = new Set();
export const BIOGLOW_GOALS = BIOGLOW_MODELS.filter((m) => {
  // Mỗi id chỉ lấy vùng đầu tiên (M10/M12 có 2 phần, dock lấy riêng từng cái)
  if (seen.has(m.id)) return false;
  seen.add(m.id);
  return true;
}).map((m) => ({
  id: m.id,
  x: Math.max(BIOGLOW_FIELD.x, m.x - PAD),
  y: Math.max(BIOGLOW_FIELD.y, m.y - PAD),
  w: m.w + PAD * 2,
  h: m.h + PAD * 2,
  label: m.id,
  hidden: true
}));
BIOGLOW_GOALS.push({ id: 'HOME_LEFT', x: 30, y: 168, w: 96, h: 96, label: 'Home trái', hidden: true });
BIOGLOW_GOALS.push({ id: 'HOME_RIGHT', x: 394, y: 168, w: 96, h: 96, label: 'Home phải', hidden: true });

// Hai dải để đồ hai bên thảm = tường (robot không đi ra ngoài thảm)
export const BIOGLOW_SOLIDS = [
  { x: 0, y: 0, w: BIOGLOW_FIELD.x, h: 265, kind: 'wall' },
  { x: BIOGLOW_FIELD.x + BIOGLOW_FIELD.w, y: 0, w: 520 - (BIOGLOW_FIELD.x + BIOGLOW_FIELD.w), h: 265, kind: 'wall' }
];

export const BIOGLOW_START_POSE = { x: 72, y: 222, angle: 0 };

// ---------- BẢNG TÍNH ĐIỂM ROBOT GAME (theo Excel Scorer chính thức) ----------
// type: 'yesno' | 'count' (0..max) | 'choice' (options)
export const BIOGLOW_SCORE_ITEMS = [
  {
    mission: 'EI',
    title: 'Equipment Inspection',
    titleVi: 'Kiểm tra thiết bị',
    items: [
      {
        key: 'ei',
        type: 'yesno',
        text: 'Robot và toàn bộ thiết bị vừa trong 1 launch area, cao dưới 305 mm',
        en: 'The robot and all equipment fit completely in one launch area and under the height limit'
      }
    ]
  },
  {
    mission: 'M01',
    title: 'Drone Survey',
    titleVi: 'Khảo sát bằng drone',
    noEquipment: true,
    items: [
      { key: 'm01a', type: 'yesno', text: 'Drone không còn chạm thảm', en: 'The drone is no longer touching the mat' },
      {
        key: 'm01b',
        type: 'yesno',
        bonus: true,
        text: 'Bonus: bản đồ LiDAR lật hẳn, dấu quét ít nhất một phần trong vùng khảo sát',
        en: 'and the LiDAR map is completely flipped over, with the scan marker at least partly in the survey area'
      }
    ]
  },
  {
    mission: 'M02',
    title: 'Exploding Seeds',
    titleVi: 'Hạt nổ tung',
    items: [{ key: 'm02', type: 'count', max: 3, text: 'Số hạt không còn chạm thân cây', en: 'Number of seeds no longer touching the stalk' }]
  },
  {
    mission: 'M03',
    title: 'Flip the Rock',
    titleVi: 'Lật hòn đá',
    items: [
      { key: 'm03a', type: 'yesno', text: 'Cờ nghiên cứu đã hạ xuống', en: 'The research flag is down' },
      { key: 'm03b', type: 'yesno', bonus: true, text: 'Bonus: hòn đá được trả về vị trí ban đầu', en: 'and the rock has been returned to its original starting position' }
    ]
  },
  {
    mission: 'M04',
    title: 'Lucky Leaves',
    titleVi: 'Những chiếc lá may mắn',
    noEquipment: true,
    items: [
      { key: 'm04a', type: 'count', max: 2, text: 'Số lá không còn chạm tổ', en: 'Number of leaves no longer touching the nest' },
      { key: 'm04b', type: 'yesno', text: 'Con katydid ít nhất một phần trong vùng leaf habitat', en: 'The katydid is at least partly in the leaf habitat' },
      {
        key: 'm04c',
        type: 'yesno',
        bonus: true,
        text: 'Bonus: katydid ở vị trí ban đầu và luôn trong leaf habitat suốt trận',
        en: 'and the katydid is in its original position and remained at least partly in the leaf habitat throughout the match'
      }
    ]
  },
  {
    mission: 'M05',
    title: 'Reaching Roots',
    titleVi: 'Rễ cây vươn xa',
    noEquipment: true,
    items: [
      {
        key: 'm05',
        type: 'choice',
        options: [
          { v: 0, label: 'Không' },
          { v: 1, label: 'Một phần' },
          { v: 2, label: 'Hoàn toàn' }
        ],
        text: 'Rễ cây được kéo dài',
        en: 'The plant root is extended'
      }
    ]
  },
  {
    mission: 'M06',
    title: 'Leafcutter Frenzy',
    titleVi: 'Kiến cắt lá',
    items: [
      { key: 'm06a', type: 'yesno', text: 'Con kiến chạm tổ', en: 'The ant is touching the nest' },
      { key: 'm06b', type: 'count', max: 4, text: 'Số mảnh lá nằm trong tổ', en: 'Number of leaf fragments contained within the nest' }
    ]
  },
  {
    mission: 'M07',
    title: 'Humongous Fungus',
    titleVi: 'Nấm khổng lồ',
    noEquipment: true,
    items: [
      { key: 'm07a', type: 'yesno', text: 'Sợi nấm (mycelium) kéo dài hoàn toàn', en: 'The mycelium is completely extended' },
      {
        key: 'm07b',
        type: 'count',
        max: 2,
        bonus: true,
        text: 'Bonus: số kết nối giữa mycelium và rễ cây của đội đối diện',
        en: "Number of connections formed between one team's extended mycelium and the opposing team's fully extended plant root"
      }
    ]
  },
  {
    mission: 'M08',
    title: 'Tangled',
    titleVi: 'Dây leo quấn',
    items: [{ key: 'm08', type: 'yesno', text: 'Dây leo chạm thảm', en: 'The vine is touching the mat' }]
  },
  {
    mission: 'M09',
    title: 'Research Platform',
    titleVi: 'Bệ nghiên cứu',
    noEquipment: true,
    items: [
      { key: 'm09a', type: 'yesno', text: 'Bệ nghiên cứu được nâng lên', en: 'The research platform is raised' },
      { key: 'm09b', type: 'yesno', text: 'Bẫy camera đã triển khai', en: 'The camera trap is deployed' },
      { key: 'm09c', type: 'yesno', text: 'Hạt giống không còn chạm cây', en: 'The seed is no longer touching the tree' }
    ]
  },
  {
    mission: 'M10',
    title: 'Fragile Microhabitats',
    titleVi: 'Vi môi trường mong manh',
    noEquipment: true,
    items: [
      { key: 'm10a', type: 'yesno', def: 1, text: 'Tổ nhện ở nguyên vị trí ban đầu', en: 'The spider habitat is in its original starting position' },
      { key: 'm10b', type: 'yesno', def: 1, text: 'Tổ ốc sên ở nguyên vị trí ban đầu', en: 'The snail habitat is in its original starting position' }
    ]
  },
  {
    mission: 'M11',
    title: 'Window to the Past',
    titleVi: 'Cửa sổ quá khứ',
    items: [{ key: 'm11', type: 'yesno', text: 'Nắp che rễ hạ xuống, chạm thảm', en: 'The root cover is down, touching the mat' }]
  },
  {
    mission: 'M12',
    title: 'Forest Elder',
    titleVi: 'Cây cổ thụ',
    noEquipment: true,
    items: [
      { key: 'm12a', type: 'yesno', text: 'Gậy chống nâng hoàn toàn, chạm cây', en: 'The cane is completely raised, touching the tree' },
      { key: 'm12b', type: 'yesno', text: 'Dây buộc quấn quanh cột', en: 'The support tie is around the post' }
    ]
  },
  {
    mission: 'M13',
    title: 'Keystone Species',
    titleVi: 'Loài chủ chốt',
    items: [
      {
        key: 'm13',
        type: 'yesno',
        text: 'Loài chủ chốt của đội ở trên bệ phục hồi và cây non được nâng lên',
        en: 'Your keystone species is on the restoration platform, and the young trees are raised'
      }
    ]
  },
  {
    mission: 'M14',
    title: 'Seeds of Renewal',
    titleVi: 'Hạt giống tái sinh',
    items: [
      { key: 'm14a', type: 'count', max: 4, text: 'Số hạt nằm trong trạm gieo trồng', en: 'Number of seeds contained within the replantation station' },
      { key: 'm14b', type: 'count', max: 4, bonus: true, text: 'Bonus: trong số đó, số hạt chạm thảm', en: 'and touching the mat' }
    ]
  },
  {
    mission: 'M15',
    title: 'Biocentric Architecture',
    titleVi: 'Kiến trúc sinh thái',
    noEquipment: true,
    items: [
      { key: 'm15a', type: 'yesno', text: 'Mái tổ chim (nesting canopy) được nâng lên', en: 'The nesting canopy is raised' },
      { key: 'm15b', type: 'yesno', text: 'Giếng trời khu vườn vào hoàn toàn', en: 'The garden skylight is completely in' },
      { key: 'm15c', type: 'yesno', text: 'Cửa ủ phân mở hoàn toàn, chạm thảm', en: 'The compost hatch is completely opened, touching the mat' },
      {
        key: 'm15dock',
        type: 'choice',
        options: [
          { v: 0, label: 'Mine' },
          { v: 1, label: 'City' },
          { v: 2, label: 'Farm' }
        ],
        text: 'Mô hình M15 đặt ở dock nào',
        en: 'Dock location'
      }
    ]
  },
  {
    mission: 'PT',
    title: 'Precision Tokens',
    titleVi: 'Thẻ chính xác',
    items: [{ key: 'pt', type: 'count', max: 6, def: 6, text: 'Số thẻ chính xác còn lại', en: 'Number of precision tokens remaining' }]
  }
];

export function defaultBioglowScoreState() {
  const st = {};
  for (const grp of BIOGLOW_SCORE_ITEMS) for (const it of grp.items) st[it.key] = it.def ?? 0;
  return st;
}

const PRECISION_POINTS = [0, 10, 15, 25, 35, 50, 50];

// Tính điểm từng mission — công thức khớp với Robot Game Excel Scorer chính thức
export function scoreBioglow(s) {
  const v = (k) => Number(s[k] || 0);
  const per = {
    EI: v('ei') ? 20 : 0,
    M01: (v('m01a') ? 20 : 0) + (v('m01a') && v('m01b') ? 10 : 0),
    M02: v('m02') * 10,
    M03: (v('m03a') ? 20 : 0) + (v('m03a') && v('m03b') ? 10 : 0),
    M04: (v('m04a') >= 1 && v('m04b') ? 10 : 0) + (v('m04a') >= 2 && v('m04b') && v('m04c') ? 20 : 0),
    M05: v('m05') * 10,
    M06: v('m06a') ? v('m06b') * 10 : 0,
    M07: (v('m07a') ? 20 : 0) + (v('m07a') ? v('m07b') * 10 : 0),
    M08: v('m08') ? 30 : 0,
    M09: (v('m09a') ? 10 : 0) + (v('m09b') ? 10 : 0) + (v('m09c') ? 10 : 0),
    M10: (v('m10a') ? 10 : 0) + (v('m10b') ? 10 : 0),
    M11: v('m11') ? 20 : 0,
    M12: (v('m12a') ? 20 : 0) + (v('m12b') ? 10 : 0),
    M13: v('m13') ? 30 : 0,
    M14: v('m14a') * 5 + Math.min(v('m14a'), v('m14b')) * 5,
    M15:
      (v('m15a') ? 10 : 0) +
      (v('m15b') ? 10 : 0) +
      (v('m15c') ? 10 : 0) +
      // Environmental bonus: hoàn thành "nhu cầu sinh thái lớn nhất" của dock đang đặt mô hình
      ((v('m15dock') === 0 && v('m15a')) || (v('m15dock') === 1 && v('m15b')) || (v('m15dock') === 2 && v('m15c')) ? 10 : 0),
    PT: PRECISION_POINTS[Math.max(0, Math.min(6, v('pt')))]
  };
  const total = Object.values(per).reduce((a, b) => a + b, 0);
  return { per, total };
}

// Điểm tối đa (khi có đội đối diện để lấy bonus M07)
export const BIOGLOW_MAX_SCORE = 20 + 30 + 30 + 30 + 30 + 20 + 40 + 40 + 30 + 30 + 20 + 20 + 30 + 30 + 40 + 40 + 50;

export const BIOGLOW_MATCH_SECONDS = 150;

export const BIOGLOW_RESOURCES = [
  { label: 'Trang tài liệu mùa giải (FIRST)', url: 'https://www.firstinspires.org/resources/library/fll/season-materials' },
  { label: 'Robot Game Rulebook (PDF)', url: 'https://firstinspires.blob.core.windows.net/fll/challenge/2026-27/fll-challenge-bioglow-rgr.pdf' },
  { label: 'Challenge Updates (PDF)', url: 'https://firstinspires.blob.core.windows.net/fll/challenge/2026-27/fll-challenge-bioglow-updates.pdf' },
  { label: 'Wireframe & Grid (PDF)', url: 'https://firstinspires.blob.core.windows.net/fll/challenge/2026-27/fll-challenge-bioglow-wireframe-grid.pdf' }
];
