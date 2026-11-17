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

const HISTORY_KEY = 'fll_bioglow_score_history_v1';

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
    `min-w-[34px] px-2 py-1 rounded-lg text-[11px] font-extrabold border transition ${
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
              <p className="text-[11px] text-emerald-200 truncate">
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
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase">
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
              <p className="text-[11px] text-slate-500 mt-2">
                Đã dùng {fmt(elapsed)} · Bíp cảnh báo khi còn 0:30 và khi hết giờ.
              </p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 text-center text-white">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase">Tổng điểm lượt này</div>
              <div className="text-5xl font-black text-amber-300 tabular-nums">{total}</div>
              <div className="text-[11px] text-slate-400">/ {BIOGLOW_MAX_SCORE} điểm</div>
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
                  <button type="button" onClick={clearHistory} className="text-[11px] text-rose-600 font-bold inline-flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Xóa
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-[11px] text-slate-500">Chưa có lượt nào. Chấm điểm rồi bấm "Lưu lượt chạy" để theo dõi độ ổn định của đội.</p>
              ) : (
                <>
                  <div className="flex gap-2 mb-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Cao nhất: {best}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">Trung bình: {avg}</span>
                  </div>
                  <ul className="space-y-1 max-h-48 overflow-y-auto">
                    {history.map((h) => (
                      <li key={h.id} className="flex items-center justify-between gap-2 text-[11px] border-b border-slate-100 pb-1">
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
                  className="flex items-center gap-1.5 text-[11px] text-sky-700 hover:underline"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" /> {r.label}
                </a>
              ))}
            </div>
          </div>

          {/* Cột phải: phiếu chấm từng mission */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-100/60">
            <div className="mb-3 flex items-start gap-2 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
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
                        <span className={`text-[11px] leading-snug ${it.bonus ? 'text-violet-700 font-semibold' : 'text-slate-700'}`} title={it.en}>
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
