// =====================================================================================
// FllMatchScorerModal.jsx — Đồng hồ trận đấu 2:30 + Bảng tính điểm Robot Game mùa BIOGLOW (2026–27)
// Dùng khi luyện tập trên bàn thật hoặc trên sa bàn: bấm giờ, chấm điểm từng mission, lưu lịch sử lượt chạy.
// Thiết kế bởi thầy Hoàng Ngọc Cảnh — Giáo viên trường THCS & THPT Đinh Thiện Lý
// =====================================================================================
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timer, Play, Pause, RotateCcw, Trophy, Save, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';
import {
  BIOGLOW_SCORE_ITEMS,
  BIOGLOW_MATCH_SECONDS,
  BIOGLOW_MAX_SCORE,
  BIOGLOW_RESOURCES,
  defaultBioglowScoreState,
  scoreBioglow
} from '../data/bioglow';
import { fmtClock } from '../utils/matchTime';

const HISTORY_KEY = 'fll_bioglow_score_history_v1';
const PLAN_KEY = 'fll_match_plan_v1';
const LAST_SIM_RUN_KEY = 'fll_bioglow_last_sim_run';
const PRECISION_PTS = [0, 10, 15, 25, 35, 50, 50];

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeJson = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // trình duyệt chặn lưu trữ — chỉ giữ trong phiên
  }
};

// ---------- KẾ HOẠCH TRẬN 2:30: ghép nhiều lượt chạy (run) ----------
function MatchPlanner() {
  const [plan, setPlan] = useState(() => readJson(PLAN_KEY, { changeover: 8, runs: [] }));
  const [manual, setManual] = useState({ title: '', seconds: '', points: '' });
  const [note, setNote] = useState('');
  const save = (next) => {
    setPlan(next);
    writeJson(PLAN_KEY, next);
  };

  const addFromSim = () => {
    const last = readJson(LAST_SIM_RUN_KEY, null);
    if (!last) {
      setNote('Chưa có lượt chạy nào trên thảm BIOGLOW. Hãy chạy một bài B01–B16 trên sa bàn trước.');
      return;
    }
    save({ ...plan, runs: [...plan.runs, { id: Date.now(), ...last }] });
    setNote(`Đã thêm "${last.title}" (${fmtClock(last.seconds)}).`);
  };
  const addManual = () => {
    const sec = Number(manual.seconds);
    if (!manual.title.trim() || !(sec > 0)) {
      setNote('Nhập tên lượt chạy và số giây đo được trên robot thật.');
      return;
    }
    save({
      ...plan,
      runs: [
        ...plan.runs,
        { id: Date.now(), title: manual.title.trim(), seconds: sec, atHome: true, missions: {}, manualPoints: Number(manual.points) || 0 }
      ]
    });
    setManual({ title: '', seconds: '', points: '' });
    setNote('');
  };
  const move = (i, d) => {
    const runs = [...plan.runs];
    const j = i + d;
    if (j < 0 || j >= runs.length) return;
    [runs[i], runs[j]] = [runs[j], runs[i]];
    save({ ...plan, runs });
  };
  const remove = (i) => save({ ...plan, runs: plan.runs.filter((_, k) => k !== i) });

  // Dòng thời gian: lượt 1 bắt đầu ở 0:00; giữa các lượt cộng thời gian về Home + thay phụ kiện + launch lại
  let clock = 0;
  const timeline = plan.runs.map((r, i) => {
    const start = i === 0 ? 0 : clock + Number(plan.changeover || 0);
    const end = start + Number(r.seconds || 0);
    clock = end;
    return { ...r, start, end, fits: end <= BIOGLOW_MATCH_SECONDS };
  });
  const counted = timeline.filter((r) => r.fits);
  // Điểm: mỗi mission lấy lượt chạy tốt nhất (không cộng trùng); M10 tính theo lượt tệ nhất (chạm 1 lần là mất)
  const best = {};
  let m10 = 20;
  let manualPts = 0;
  counted.forEach((r) => {
    Object.entries(r.missions || {}).forEach(([id, pts]) => {
      if (id === 'M10') m10 = Math.min(m10, pts);
      else best[id] = Math.max(best[id] || 0, pts);
    });
    manualPts += r.manualPoints || 0;
  });
  const missionPts = Object.values(best).reduce((a, b) => a + b, 0) + manualPts;
  const notHome = timeline.filter((r) => !r.atHome).length + timeline.filter((r) => !r.fits).length;
  const tokens = Math.max(0, 6 - notHome);
  const total = missionPts + m10 + PRECISION_PTS[tokens];
  const used = timeline.length ? timeline[timeline.length - 1].end : 0;

  return (
    <div className="bg-white rounded-xl border border-emerald-300 shadow-sm p-3 mb-3">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-extrabold text-slate-900">🗺 Kế hoạch trận 2:30 — ghép các lượt chạy</h4>
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          Thay phụ kiện giữa 2 lượt
          <input
            type="number"
            min="0"
            value={plan.changeover}
            onChange={(e) => save({ ...plan, changeover: Number(e.target.value) })}
            className="w-14 h-8 px-2 rounded-lg border border-slate-300 text-xs"
          />
          giây
        </label>
      </div>

      {/* Thanh thời gian 0:00 → 2:30 */}
      <div className="relative h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden mb-2">
        {timeline.map((r, i) => (
          <div
            key={r.id}
            className={`absolute top-0 h-full flex items-center justify-center text-[11px] font-extrabold text-white truncate px-1 ${
              r.fits ? (i % 2 ? 'bg-emerald-600' : 'bg-emerald-700') : 'bg-rose-600'
            }`}
            style={{
              left: `${Math.min(100, (r.start / BIOGLOW_MATCH_SECONDS) * 100)}%`,
              width: `${Math.max(1, Math.min(100, ((r.end - r.start) / BIOGLOW_MATCH_SECONDS) * 100))}%`
            }}
            title={`${r.title}: ${fmtClock(r.start)} → ${fmtClock(r.end)}`}
          >
            R{i + 1}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600 mb-2">
        <span>0:00</span>
        <span className={used > BIOGLOW_MATCH_SECONDS ? 'text-rose-700 font-bold' : 'font-bold text-slate-800'}>
          Đã dùng {fmtClock(used)} · còn {fmtClock(Math.max(0, BIOGLOW_MATCH_SECONDS - used))}
        </span>
        <span>2:30</span>
      </div>

      {timeline.length > 0 && (
        <ul className="space-y-1 mb-2">
          {timeline.map((r, i) => (
            <li key={r.id} className="flex flex-wrap items-center gap-2 text-xs border-b border-slate-100 pb-1">
              <span className="font-extrabold w-7">R{i + 1}</span>
              <span className="flex-1 min-w-[140px] truncate" title={r.title}>
                {r.title}
              </span>
              <span className="font-mono">
                {fmtClock(r.start)}→{fmtClock(r.end)}
              </span>
              <span className={r.fits ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                {r.fits ? '✓ kịp' : '✕ quá 2:30'}
              </span>
              {!r.atHome && <span className="text-amber-700 font-bold">không về Home (−1 token)</span>}
              <span className="text-slate-500">
                {Object.entries(r.missions || {})
                  .filter(([id, p]) => p > 0 && id !== 'M10')
                  .map(([id, p]) => `${id} ${p}`)
                  .join(' · ') || (r.manualPoints ? `${r.manualPoints}đ` : '')}
              </span>
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="h-7 w-7 rounded border border-slate-300" title="Lên">
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} className="h-7 w-7 rounded border border-slate-300" title="Xuống">
                  ↓
                </button>
                <button type="button" onClick={() => remove(i)} className="h-7 w-7 rounded border border-rose-300 text-rose-700" title="Xóa">
                  ✕
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addFromSim}
          className="h-8 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold"
        >
          + Thêm lượt vừa chạy trên sa bàn
        </button>
        <span className="text-xs text-slate-500">hoặc nhập lượt đo trên robot thật:</span>
        <input
          value={manual.title}
          onChange={(e) => setManual({ ...manual, title: e.target.value })}
          placeholder="Tên lượt (VD: Run 2 trái)"
          className="h-8 px-2 rounded-lg border border-slate-300 text-xs w-40"
        />
        <input
          type="number"
          value={manual.seconds}
          onChange={(e) => setManual({ ...manual, seconds: e.target.value })}
          placeholder="giây"
          className="h-8 px-2 rounded-lg border border-slate-300 text-xs w-16"
        />
        <input
          type="number"
          value={manual.points}
          onChange={(e) => setManual({ ...manual, points: e.target.value })}
          placeholder="điểm"
          className="h-8 px-2 rounded-lg border border-slate-300 text-xs w-16"
        />
        <button type="button" onClick={addManual} className="h-8 px-3 rounded-lg border border-slate-300 text-xs font-bold">
          Thêm
        </button>
      </div>
      {note && <p className="text-xs text-slate-600 mt-1.5">{note}</p>}

      {timeline.length > 0 && (
        <div className="mt-2 text-xs bg-slate-900 text-white rounded-lg px-3 py-2 flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Mission: <strong className="text-amber-300">{missionPts}</strong>
          </span>
          <span>
            M10: <strong className="text-amber-300">{m10}</strong>
          </span>
          <span>
            Token còn {tokens}/6: <strong className="text-amber-300">{PRECISION_PTS[tokens]}</strong>
          </span>
          <span>
            Ước tính trận (chưa gồm Equipment Inspection 20đ): <strong className="text-amber-300 text-sm">{total}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // Trình duyệt chặn lưu trữ: lịch sử chỉ tồn tại trong phiên này
  }
}

function beep(freq = 880, sec = 0.25) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + sec);
  } catch {
    // Âm thanh bị chặn — bỏ qua
  }
}

const fmt = (s) => {
  const m = Math.floor(Math.max(0, s) / 60);
  const r = Math.max(0, s) % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
};

export default function FllMatchScorerModal({ onClose }) {
  // ---------- ĐỒNG HỒ TRẬN ĐẤU ----------
  const [remaining, setRemaining] = useState(BIOGLOW_MATCH_SECONDS);
  const [running, setRunning] = useState(false);
  const endAtRef = useRef(null);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 30 && !warnedRef.current) {
        warnedRef.current = true;
        beep(660, 0.2);
      }
      if (left <= 0) {
        setRunning(false);
        beep(440, 0.9);
      }
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  const startPause = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (remaining <= 0) return;
    endAtRef.current = Date.now() + remaining * 1000;
    if (remaining === BIOGLOW_MATCH_SECONDS) beep(990, 0.3);
    setRunning(true);
  };

  const resetTimer = () => {
    setRunning(false);
    warnedRef.current = false;
    setRemaining(BIOGLOW_MATCH_SECONDS);
  };

  const elapsed = BIOGLOW_MATCH_SECONDS - remaining;
  const pct = (remaining / BIOGLOW_MATCH_SECONDS) * 100;
  const timerColor = remaining === 0 ? '#dc2626' : remaining <= 30 ? '#f59e0b' : '#16a34a';

  // ---------- BẢNG ĐIỂM ----------
  const [state, setState] = useState(defaultBioglowScoreState);
  const [runNote, setRunNote] = useState('');
  const [history, setHistory] = useState(loadHistory);
  const { per, total } = useMemo(() => scoreBioglow(state), [state]);

  const setVal = (key, v) => setState((prev) => ({ ...prev, [key]: v }));

  const saveRun = () => {
    const entry = {
      id: Date.now(),
      at: new Date().toLocaleString('vi-VN'),
      total,
      usedSeconds: elapsed,
      note: runNote.trim(),
      per
    };
    const next = [entry, ...history].slice(0, 30);
    setHistory(next);
    saveHistory(next);
    setRunNote('');
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const best = history.reduce((m, h) => Math.max(m, h.total), 0);
  const avg = history.length ? Math.round(history.reduce((a, h) => a + h.total, 0) / history.length) : 0;

  const btn = (active) =>
    `min-w-[34px] px-2 py-1 rounded-lg text-xs font-extrabold border transition ${
      active
        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
    }`;

  const renderControl = (it) => {
    const cur = Number(state[it.key] ?? 0);
    if (it.type === 'yesno') {
      return (
        <div className="flex gap-1">
          <button type="button" className={btn(cur === 0)} onClick={() => setVal(it.key, 0)}>
            Không
          </button>
          <button type="button" className={btn(cur === 1)} onClick={() => setVal(it.key, 1)}>
            Có
          </button>
        </div>
      );
    }
    if (it.type === 'count') {
      return (
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: it.max + 1 }, (_, n) => (
            <button key={n} type="button" className={btn(cur === n)} onClick={() => setVal(it.key, n)}>
              {n}
            </button>
          ))}
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-1">
        {it.options.map((o) => (
          <button key={o.v} type="button" className={btn(cur === o.v)} onClick={() => setVal(it.key, o.v)}>
            {o.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 bg-emerald-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Trophy className="w-5 h-5 text-amber-300 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold uppercase tracking-wide truncate">
                FLL Challenge 2026–27 · BIOGLOW™ — Đồng hồ trận & Tính điểm Robot Game
              </h3>
              <p className="text-xs text-emerald-200 truncate">
                Công thức khớp Robot Game Excel Scorer chính thức (cập nhật theo Challenge Updates 14/10/2026). Điểm tối đa {BIOGLOW_MAX_SCORE}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shrink-0"
          >
            Đóng ✕
          </button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
          {/* Cột trái: đồng hồ + tổng điểm + lịch sử */}
          <div className="lg:w-80 shrink-0 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 p-4 space-y-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-500 uppercase">
                <Timer className="w-3.5 h-3.5" /> Trận đấu 2:30
              </div>
              <div className="font-mono text-6xl font-black my-2 tabular-nums" style={{ color: timerColor }}>
                {fmt(remaining)}
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden mb-3">
                <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: timerColor }} />
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={startPause}
                  disabled={remaining === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-extrabold"
                >
                  {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  {running ? 'Tạm dừng' : remaining === BIOGLOW_MATCH_SECONDS ? 'Bắt đầu' : 'Tiếp tục'}
                </button>
                <button
                  type="button"
                  onClick={resetTimer}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-extrabold"
                >
                  <RotateCcw className="w-4 h-4" /> Đặt lại
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Đã dùng {fmt(elapsed)} · Bíp cảnh báo khi còn 0:30 và khi hết giờ.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 text-center text-white">
              <div className="text-xs font-extrabold text-slate-400 uppercase">Tổng điểm lượt này</div>
              <div className="text-5xl font-black text-amber-300 tabular-nums">{total}</div>
              <div className="text-xs text-slate-400">/ {BIOGLOW_MAX_SCORE} điểm</div>
              <input
                type="text"
                value={runNote}
                onChange={(e) => setRunNote(e.target.value)}
                placeholder="Ghi chú (VD: Run 1+2, đổi tay gắp…)"
                className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs text-slate-900"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={saveRun}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold"
                >
                  <Save className="w-3.5 h-3.5" /> Lưu lượt chạy
                </button>
                <button
                  type="button"
                  onClick={() => setState(defaultBioglowScoreState())}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-extrabold"
                >
                  Xóa phiếu
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-800">Lịch sử luyện tập ({history.length})</span>
                {history.length > 0 && (
                  <button type="button" onClick={clearHistory} className="text-xs text-rose-600 font-bold inline-flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Xóa
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-xs text-slate-500">Chưa có lượt nào. Chấm điểm rồi bấm "Lưu lượt chạy" để theo dõi độ ổn định của đội.</p>
              ) : (
                <>
                  <div className="flex gap-2 mb-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Cao nhất: {best}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">Trung bình: {avg}</span>
                  </div>
                  <ul className="space-y-1 max-h-48 overflow-y-auto">
                    {history.map((h) => (
                      <li key={h.id} className="flex items-center justify-between gap-2 text-xs border-b border-slate-100 pb-1">
                        <span className="text-slate-500 truncate">
                          {h.at}
                          {h.note ? ` · ${h.note}` : ''}
                        </span>
                        <span className="font-extrabold text-slate-900 shrink-0">{h.total}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-3 space-y-1">
              <div className="text-xs font-extrabold text-slate-800 mb-1">Tài liệu chính thức</div>
              {BIOGLOW_RESOURCES.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-sky-700 hover:underline"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" /> {r.label}
                </a>
              ))}
            </div>
          </div>

          {/* Cột phải: kế hoạch trận + phiếu chấm từng mission */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-100/60">
            <MatchPlanner />
            <div className="mb-3 flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Mission có biểu tượng 🚫 (No Equipment Constraint): mô hình KHÔNG được tính điểm nếu còn chạm thiết bị của đội khi hết trận.
                Bonus M07 chỉ có khi thi cùng đội đối diện. Điểm Gracious Professionalism® (2–4) được cộng vào Core Values, không cộng vào đây.
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {BIOGLOW_SCORE_ITEMS.map((grp) => (
                <div key={grp.mission} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-3 py-1.5 bg-emerald-700 text-white flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold truncate">
                      {grp.mission.startsWith('M') ? `${grp.mission} · ` : ''}
                      {grp.title}
                      <span className="font-semibold text-emerald-200"> — {grp.titleVi}</span>
                      {grp.noEquipment ? ' 🚫' : ''}
                    </span>
                    <span className="text-xs font-black bg-white/15 rounded px-2 py-0.5 shrink-0">{per[grp.mission] ?? 0}</span>
                  </div>
                  <div className="p-2.5 space-y-2">
                    {grp.items.map((it) => (
                      <div key={it.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span className={`text-xs leading-snug ${it.bonus ? 'text-violet-700 font-semibold' : 'text-slate-700'}`} title={it.en}>
                          {it.text}
                        </span>
                        <div className="shrink-0">{renderControl(it)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
