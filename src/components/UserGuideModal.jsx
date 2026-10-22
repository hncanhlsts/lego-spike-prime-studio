import React, { useState } from 'react';
import {
  BookOpen,
  X,
  ExternalLink,
  Ruler,
  Maximize2,
  Footprints,
  Compass,
  KeyRound,
  Play,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('iframe'); // 'iframe' | 'quick'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white tracking-tight">
                  Sổ Tay Hướng Dẫn Sử Dụng — LEGO® SPIKE™ Prime Studio
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Tài Liệu HTML
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Thiết kế bởi thầy <strong className="text-amber-400 font-semibold">Hoàng Ngọc Cảnh</strong> — <span className="hidden sm:inline">THCS & THPT Đinh Thiện Lý</span><span className="sm:hidden">LSTS</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="./huong-dan-su-dung.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition"
              title="Mở tài liệu trong một thẻ trình duyệt mới độc lập"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở tab mới ↗</span>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
              title="Đóng cửa sổ hướng dẫn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL BODY: EMBEDDED IFRAME OF HUONG-DAN-SU-DUNG.HTML */}
        <div className="flex-1 w-full h-full bg-slate-100 relative">
          <iframe
            src="./huong-dan-su-dung.html"
            title="Hướng dẫn sử dụng LEGO SPIKE Prime Studio"
            className="w-full h-full border-0"
          />
        </div>

        {/* MODAL FOOTER */}
        <div className="h-11 px-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Tài liệu HTML được nhúng trực tiếp, tự động cập nhật đồng bộ với nền tảng.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
          >
            Đóng Hướng Dẫn
          </button>
        </div>

      </div>
    </div>
  );
}
