import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Cpu,
  Plus,
  CheckCircle2,
  Code2,
  Sparkles,
  Play,
  Layers
} from 'lucide-react';
import SpikeBlockItem from './SpikeBlockItem';
import {
  SPIKE_CORE_CATEGORIES,
  SPIKE_EXTENSIONS,
  BLOCK_DEFINITIONS,
  BLOCK_SHAPE_GUIDE
} from '../data/spikeData';
import { SIM_SUPPORTED_BLOCKS } from '../utils/simPhysics';

const CORE_TECHNIQUES = [
  {
    id: 'tech_1',
    badge: 'Kỹ thuật 1 · Điều hướng cơ bản',
    title: 'Lập trình Tuần tự & Chuẩn hóa Góc Con Quay Hồi Chuyển (Gyro Yaw = 0°)',
    lessonId: 'F2',
    summary:
      'Trong thi đấu FLL/WRO, trước khi xuất phát từ vùng Base, luôn khai báo cặp động cơ bánh xe (set movement motors to A+B), tốc độ ổn định (40–60%) và đặt góc Yaw về 0° (set yaw angle to 0).',
    formula: 'Quãng đường (cm) = Số vòng quay × Chu vi bánh xe (17.5 cm với bánh chuẩn 56mm)',
    tips: [
      'Tốc độ 40–60% giúp bánh xe không bị trượt quán tính khi dừng hoặc rẽ.',
      'Dùng khối "move [↑] for (cm)" cho đoạn thẳng và "move [left/right: ±90]" để rẽ vuông góc.'
    ],
    sampleBlocks: ['set_movement_motors', 'set_movement_speed', 'set_yaw_angle_to_0', 'move_for_duration', 'move_with_steering']
  },
  {
    id: 'tech_2',
    badge: 'Kỹ thuật 2 · Cấu trúc lặp',
    title: 'Thu gọn Chương trình bằng Vòng lặp Chữ C (repeat & repeat until)',
    lessonId: 'F3',
    summary:
      'Thay vì ghép hàng chục khối di chuyển trùng lặp, đặt quy luật chuyển động vào bên trong miệng khối chữ C "repeat (n)" hoặc "repeat until <điều kiện>".',
    formula: 'Tổng góc quay khép kín = Số cạnh (n) × Góc rẽ mỗi đỉnh = 360°',
    tips: [
      'Dùng "repeat (n)" khi biết trước số lần lặp (ví dụ: đi 4 cạnh hình vuông).',
      'Dùng "repeat until < >" khi chưa biết quãng đường nhưng biết điều kiện kết thúc (gặp vạch màu hoặc gặp vật cản).'
    ],
    sampleBlocks: ['repeat_loop_line_follow', 'repeat_until_block', 'forever_loop']
  },
  {
    id: 'tech_3',
    badge: 'Kỹ thuật 3 · Chờ cảm biến',
    title: 'Bộ 3 Khối Vàng Trong Thi Đấu: Start Moving → Wait Until <Sensor> → Stop Moving',
    lessonId: 'F4',
    summary:
      'Sai lầm phổ biến của học sinh mới là chỉ dùng khối đi theo cm cố định (dễ lệch khi pin yếu). Đội thi chuyên nghiệp dùng cảm biến để quyết định thời điểm dừng.',
    formula: 'start moving [↑]  ➔  wait until <E is closer than 15 cm?>  ➔  stop moving',
    tips: [
      '"start moving" bật động cơ chạy liên tục rồi chuyển ngay sang khối tiếp theo.',
      '"wait until < >" giữ chương trình chờ cho đến khi cảm biến báo ĐÚNG thì mới chạy khối "stop moving".'
    ],
    sampleBlocks: ['start_moving', 'wait_until_sensor', 'sensor_is_closer_than', 'stop_moving']
  },
  {
    id: 'tech_4',
    badge: 'Kỹ thuật 4 · Rẽ nhánh cảm biến màu',
    title: 'Phát hiện Giao lộ & Phân loại Vạch Màu với If / Else',
    lessonId: 'F5',
    summary:
      'Cảm biến màu (Color Sensor - Port D) đọc được cả Mã màu (RED, GREEN, BLUE, YELLOW, BLACK, WHITE) lẫn Cường độ ánh sáng phản xạ (0–100%).',
    formula: 'if <D is color RED ?> then [Xử lý trạm Đỏ] else [Tiếp tục di chuyển]',
    tips: [
      'Khi cần kiểm tra liên tục trên đường đi, bắt buộc phải đặt khối "if < > then" BÊN TRONG vòng lặp "repeat until" hoặc "forever".',
      'Nếu đặt "if" ở ngoài vòng lặp, chương trình chỉ kiểm tra đúng 1 lần lúc mới chạy rồi bỏ qua!'
    ],
    sampleBlocks: ['if_then_block', 'if_else_block', 'sensor_is_color']
  },
  {
    id: 'tech_5',
    badge: 'Kỹ thuật 5 · Thuật toán Dò Line',
    title: 'Dò Line Bám Mép Vạch Đen (Bang-Bang 2 Trạng Thái & Tỉ Lệ P-Controller)',
    lessonId: 'F6',
    summary:
      'Robot dò line không đi giữa vạch đen mà đi dọc theo MÉP vạch (nơi độ phản xạ trung bình khoảng 50% giữa Đen 12% và Trắng 98%).',
    formula: 'Bang-Bang: Nếu Reflection < 50% (Đen) ➔ Lái phải (+40) | Ngược lại (Trắng) ➔ Lái trái (-40)',
    tips: [
      'Thuật toán 2 trạng thái (Bang-Bang) dùng khối "if <D reflection < 50% ?> then / else" lồng trong "repeat until".',
      'Thuật toán P-Controller nâng cao: Góc lái = (Reflection − 50) × Kp giúp xe chạy êm, không lắc đầu.'
    ],
    sampleBlocks: ['if_else_block', 'sensor_is_reflection', 'start_moving_steering']
  },
  {
    id: 'tech_6',
    badge: 'Kỹ thuật 6 · Cơ cấu chấp hành 3D',
    title: 'Điều khiển Tay Gắp, Xe Nâng Forklift & Cần Cẩu (Vị trí Tuyệt đối vs Tương đối)',
    lessonId: 'F7',
    summary:
      'Trong FLL/WRO, động cơ phụ (Port C) điều khiển cơ cấu tay nâng, càng nâng Forklift hoặc tay kẹp kiện hàng.',
    formula: 'Quy trình 6 bước: Hạ cần (10°) ➔ Tiến tới hàng ➔ Đóng kẹp (+90°) ➔ Nâng cần (75°) ➔ Chở tới đích ➔ Mở kẹp (-90°)',
    tips: [
      'Dùng "go [shortest path] to position (x)" (Vị trí tuyệt đối) cho tay nâng để luôn nâng/hạ đúng độ cao cố định.',
      'Dùng "go to relative position (±90)" (Vị trí tương đối) để đóng/mở ngàm kẹp một góc xác định.'
    ],
    sampleBlocks: ['motor_go_to_position', 'more_motor_go_relative', 'motor_run_for_duration']
  }
];

export default function BlockEncyclopediaModal({
  onClose,
  onInsertBlock,
  onSelectLessonById
}) {
  const [activeTab, setActiveTab] = useState('techniques'); // 'techniques' | 'blocks' | 'shapes'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allCategories = useMemo(
    () => [...SPIKE_CORE_CATEGORIES, ...SPIKE_EXTENSIONS],
    []
  );

  const filteredBlocks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return Object.entries(BLOCK_DEFINITIONS).filter(([typeKey, def]) => {
      if (selectedCategory !== 'all' && def.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const pySample = def.pythonTemplate ? def.pythonTemplate(def.defaultParams || {}) : '';
      return (
        typeKey.toLowerCase().includes(q) ||
        (def.nameEn || '').toLowerCase().includes(q) ||
        (def.nameVi || '').toLowerCase().includes(q) ||
        (def.description || '').toLowerCase().includes(q) ||
        (def.sectionCode || '').toLowerCase().includes(q) ||
        pySample.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide">
                📘 Học Viện LEGO® SPIKE™ Prime — Kỹ Thuật Điều Khiển & Từ Điển Khối Lệnh
              </h3>
              <p className="text-[11px] text-slate-400">
                Tài liệu nền tảng dành cho Học sinh & Đội tuyển Robotics FLL / WRO • Thiết kế bởi thầy Hoàng Ngọc Cảnh (THCS & THPT Đinh Thiện Lý)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold"
          >
            Đóng ✕
          </button>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('techniques')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'techniques'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              6 Kỹ Thuật Lập Trình Điều Khiển (Nền Tảng FLL/WRO)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('blocks')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'blocks'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Tra Cứu Tất Cả Khối Lệnh ({Object.keys(BLOCK_DEFINITIONS).length} Khối)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shapes')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                activeTab === 'shapes'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              6 Hình Dạng Khối Lệnh (Shapes)
            </button>
          </div>

          {activeTab === 'blocks' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm khối lệnh (VD: reflection, repeat, wait, motor...)"
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: 6 KỸ THUẬT LẬP TRÌNH ĐIỀU KHIỂN CỐT LÕI */}
        {activeTab === 'techniques' && (
          <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-amber-900 uppercase">
                  🎯 Lộ trình học chuẩn Sư phạm Robotics (Từ Cơ bản đến Thi đấu FLL / WRO)
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Mỗi kỹ thuật dưới đây đi kèm công thức điều khiển, các khối lệnh trọng tâm và 1 bài tập thực hành tương ứng trên sa bàn.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CORE_TECHNIQUES.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between hover:border-amber-400 transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-extrabold uppercase">
                        {tech.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectLessonById) onSelectLessonById(tech.lessonId);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold shadow-sm"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Thực hành Bài {tech.lessonId} →
                      </button>
                    </div>

                    <h5 className="text-sm font-extrabold text-slate-900 mb-1.5">
                      {tech.title}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                      {tech.summary}
                    </p>

                    <div className="bg-slate-900 text-amber-300 font-mono text-[11px] px-3 py-2 rounded-xl mb-2.5">
                      {tech.formula}
                    </div>

                    <ul className="space-y-1 mb-3">
                      {tech.tips.map((tip, i) => (
                        <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 mr-1">
                      Khối lệnh sử dụng:
                    </span>
                    {tech.sampleBlocks.map((bKey) => {
                      const bDef = BLOCK_DEFINITIONS[bKey];
                      if (!bDef) return null;
                      return (
                        <button
                          key={bKey}
                          type="button"
                          onClick={() => onInsertBlock && onInsertBlock(bKey)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm hover:brightness-110"
                          style={{ backgroundColor: bDef.color }}
                          title="Nhấn để thêm khối này vào chương trình"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          {bDef.nameEn}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TỪ ĐIỂN TRA CỨU TẤT CẢ KHỐI LỆNH */}
        {activeTab === 'blocks' && (
          <div className="flex-1 min-h-0 flex overflow-hidden">
            {/* Cột lọc danh mục bên trái */}
            <div className="w-52 bg-slate-50 border-r border-slate-200 p-2.5 overflow-y-auto space-y-1 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tất cả danh mục ({Object.keys(BLOCK_DEFINITIONS).length})
              </button>
              {allCategories.map((cat) => {
                const count = Object.values(BLOCK_DEFINITIONS).filter(
                  (d) => d.category === cat.id
                ).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border border-white/50"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate">{cat.nameEn}</span>
                    </span>
                    <span className="text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Danh sách chi tiết khối lệnh */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/60">
              {filteredBlocks.map(([typeKey, def]) => {
                const isSimSupported = SIM_SUPPORTED_BLOCKS.has(typeKey);
                const pyCode = def.pythonTemplate
                  ? def.pythonTemplate(def.defaultParams || {})
                  : '# Python API';
                return (
                  <div
                    key={typeKey}
                    className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="text-[10px] font-extrabold text-white px-2 py-0.5 rounded"
                          style={{ backgroundColor: def.color }}
                        >
                          Mục {def.sectionCode}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {def.nameVi}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSimSupported
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {isSimSupported ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Mô phỏng trực tiếp trên Sa bàn
                            </>
                          ) : (
                            <>
                              <Code2 className="w-3 h-3 text-slate-500" />
                              Sinh mã Python 3
                            </>
                          )}
                        </span>
                      </div>

                      <div className="py-1 overflow-x-auto">
                        <SpikeBlockItem
                          block={{ id: `enc_${typeKey}`, type: typeKey, params: def.defaultParams }}
                          isPalette={true}
                        />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {def.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2 shrink-0 lg:w-72">
                      <div className="w-full bg-slate-950 text-emerald-300 font-mono text-[10px] p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
                        <div className="text-[9px] text-slate-400 mb-0.5 uppercase font-sans font-bold">
                          Mã Python SPIKE 3 tương ứng:
                        </div>
                        <code>{pyCode}</code>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onInsertBlock) onInsertBlock(typeKey);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Thêm khối này vào chương trình
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: 6 HÌNH DẠNG KHỐI LỆNH */}
        {activeTab === 'shapes' && (
          <div className="flex-1 overflow-y-auto p-5 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BLOCK_SHAPE_GUIDE.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 mb-2">
                      {item.nameVi}
                    </div>
                    <div
                      className={`text-xs font-mono font-bold text-white px-3 py-1.5 mb-3 inline-block shadow ${
                        item.id === 'hat'
                          ? 'rounded-t-2xl rounded-b-md'
                          : item.id === 'reporter'
                          ? 'rounded-full'
                          : item.id === 'boolean'
                          ? 'spike-boolean-slot px-4'
                          : 'rounded-lg'
                      }`}
                      style={{ backgroundColor: item.color }}
                    >
                      {item.sampleText}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
