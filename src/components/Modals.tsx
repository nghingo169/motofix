import React, { useState } from 'react';
import { X, Phone, ShieldAlert, Check, Copy, CreditCard, QrCode } from 'lucide-react';
import { type Language } from '../data/motofixData';

interface HotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const HotlineModal: React.FC<HotlineModalProps> = ({ isOpen, onClose, lang }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const phoneNumber = '028 3864 7256';
  const handleCopy = () => {
    navigator.clipboard?.writeText(phoneNumber.replace(/\s+/g, '')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotline-modal-title"
    >
      <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 id="hotline-modal-title" className="text-lg font-bold text-[#0B1829]">
              {lang === 'vi' ? 'Tổng đài & Zalo điều phối dự phòng' : 'Fallback Hotline & Zalo Dispatch'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'vi'
                ? 'Hỗ trợ khi mất mạng, lỗi GPS hoặc điện thoại sắp hết pin'
                : 'Available when GPS fails, mobile data drops, or battery is low'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label={lang === 'vi' ? 'Đóng' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-5">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">
                {lang === 'vi' ? 'Đường dây nóng điều phối (06:30 – 21:30)' : 'Dispatch hotline (06:30 – 21:30)'}
              </p>
              <p className="font-mono text-xl font-bold text-[#0B1829] tabular-nums mt-0.5">
                {phoneNumber}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (lang === 'vi' ? 'Đã chép' : 'Copied') : (lang === 'vi' ? 'Sao chép' : 'Copy')}
            </button>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg border border-slate-200">
            <div className="w-20 h-20 rounded-lg bg-[#0B1829] text-white flex flex-col items-center justify-center shrink-0">
              <QrCode className="w-11 h-11 text-white" />
              <span className="font-mono text-[9px] text-[#FB923C] mt-0.5">ZALO OA</span>
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-[#0B1829]">
                {lang === 'vi' ? 'Quét mã QR tại bảng tin KTX / Bãi xe' : 'Scan Campus & Dormitory QR Posters'}
              </p>
              <p className="text-xs mt-1">
                {lang === 'vi'
                  ? 'Gửi vị trí Zalo hoặc đọc mã cổng trường cho điều phối viên. Bạn vẫn nhận đủ tên KTV, thời gian đến và báo giá bằng tin nhắn trước khi làm.'
                  : 'Share your Zalo pin or gate number with our dispatcher. You still receive responder ID, ETA, and an itemized quote by message before work starts.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>
            <a
              href="tel:02838647256"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              {lang === 'vi' ? 'Gọi trực tiếp' : 'Call Now'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StudentPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onActivatePass: (studentId: string, name: string) => void;
  isPassActive: boolean;
}

export const StudentPassModal: React.FC<StudentPassModalProps> = ({
  isOpen,
  onClose,
  lang,
  onActivatePass,
  isPassActive,
}) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [campusEmail, setCampusEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError(lang === 'vi' ? 'Vui lòng nhập họ và tên sinh viên.' : 'Please enter your full name.');
      return;
    }
    if (!/^[0-9A-Za-z]{6,12}$/.test(studentId.trim())) {
      setError(lang === 'vi' ? 'MSSV hợp lệ gồm 6–12 ký tự (ví dụ: 2352799).' : 'Enter a valid 6–12 character student ID.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campusEmail.trim())) {
      setError(lang === 'vi' ? 'Vui lòng nhập email trường hợp lệ.' : 'Please enter a valid campus email address.');
      return;
    }

    setError('');
    setSubmitted(true);
    onActivatePass(studentId.trim(), name.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pass-modal-title"
    >
      <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 id="pass-modal-title" className="text-lg font-bold text-[#0B1829]">
              {lang === 'vi' ? 'Đăng ký thẻ Student Pass (Thí điểm)' : 'Activate Student Pass (Pilot)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'vi'
                ? '15.000₫ / tháng · Tự nguyện, hủy bất kỳ lúc nào · Không bắt buộc để gọi cứu hộ'
                : 'VND 15,000 / month · Optional, cancel anytime · Never required for emergency calls'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label={lang === 'vi' ? 'Đóng' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted || isPassActive ? (
          <div className="py-5 space-y-5">
            <div className="p-5 rounded-xl bg-[#0B1829] text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-extrabold text-base tracking-tight">
                  Moto<span className="text-[#EA6A12]">Fix</span> Student Pass
                </span>
                <span className="font-mono text-xs text-emerald-400">
                  {lang === 'vi' ? 'Đang kích hoạt' : 'Active'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                <div>
                  <p className="text-slate-400">{lang === 'vi' ? 'Chủ thẻ' : 'Member'}</p>
                  <p className="font-medium text-white mt-0.5">{name || 'Sinh viên HCMUT'}</p>
                </div>
                <div>
                  <p className="text-slate-400">{lang === 'vi' ? 'Mã số sinh viên' : 'Student ID'}</p>
                  <p className="font-mono text-white tabular-nums mt-0.5">{studentId || '2352799'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                {lang === 'vi'
                  ? 'Ưu đãi giảm 15% phí công cứu hộ và ưu tiên hàng đợi đã được tự động áp dụng trong mô phỏng đặt cứu hộ.'
                  : 'Your 15% labor fee discount and priority queue are now active in the rescue simulator.'}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap"
              >
                {lang === 'vi' ? 'Quay lại đặt cứu hộ' : 'Return to Rescue Prototype'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-5 space-y-4">
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3.5 leading-relaxed">
              {lang === 'vi'
                ? 'Quyền lợi bao gồm: ưu tiên điều phối trong giờ trực, giảm 15% phí công tiêu chuẩn, lưu lịch sử biên lai điện tử và 1 lần kiểm tra an toàn xe cơ bản/năm. Không bao gồm sửa chữa hay thay phụ tùng miễn phí không giới hạn.'
                : 'Includes priority queue in staffed hours, 15% discount on standard labor fees, digital service history, and 1 annual basic safety check. Excludes unlimited free repairs and parts.'}
            </div>

            <div>
              <label htmlFor="pass-name" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'vi' ? 'Họ và tên' : 'Full Name'}
              </label>
              <input
                id="pass-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'vi' ? 'Nguyễn Văn An' : 'Nguyen Van An'}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="pass-sid" className="block text-xs font-medium text-slate-700 mb-1.5">
                  {lang === 'vi' ? 'Mã số sinh viên (MSSV)' : 'Student ID'}
                </label>
                <input
                  id="pass-sid"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="2352799"
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label htmlFor="pass-email" className="block text-xs font-medium text-slate-700 mb-1.5">
                  {lang === 'vi' ? 'Email sinh viên' : 'Campus Email'}
                </label>
                <input
                  id="pass-email"
                  type="email"
                  value={campusEmail}
                  onChange={(e) => setCampusEmail(e.target.value)}
                  placeholder="ten.ban@hcmut.edu.vn"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-sm font-semibold text-[#0B1829] tabular-nums">
                {lang === 'vi' ? '15.000₫ / tháng' : 'VND 15,000 / mo'}
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  {lang === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap"
                >
                  <CreditCard className="w-4 h-4" />
                  {lang === 'vi' ? 'Kích hoạt thử' : 'Activate Trial'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface SafetyEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  locationName: string;
}

export const SafetyEscalationModal: React.FC<SafetyEscalationModalProps> = ({
  isOpen,
  onClose,
  lang,
  locationName,
}) => {
  const [alertSent, setAlertSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-modal-title"
    >
      <div className="bg-white rounded-xl border border-red-200 max-w-md w-full p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-red-700">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h3 id="safety-modal-title" className="text-base font-bold text-[#0B1829]">
              {lang === 'vi' ? 'Hỗ trợ an toàn & Bảo vệ trường' : 'Safety Escalation & Campus Security'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label={lang === 'vi' ? 'Đóng' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-sm text-slate-600">
          {alertSent ? (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5">
              <p className="font-semibold">
                {lang === 'vi'
                  ? 'Đã gửi tín hiệu ưu tiên đến Trực ban MotoFix & Bảo vệ cổng'
                  : 'Priority alert logged with MotoFix Shift Lead & Campus Security'}
              </p>
              <p className="text-xs text-emerald-800">
                {lang === 'vi'
                  ? `Tọa độ đã gửi: ${locationName}. Điều phối viên đang gọi xác nhận trực tiếp.`
                  : `Location sent: ${locationName}. Shift commander is calling you directly.`}
              </p>
            </div>
          ) : (
            <>
              <p className="leading-relaxed">
                {lang === 'vi'
                  ? 'Nếu bạn cảm thấy không an toàn về vị trí dừng xe, thời tiết tối muộn hoặc có nghi ngại về danh tính người tiếp cận, hãy kích hoạt cảnh báo ngay:'
                  : 'If you feel unsafe due to traffic, late hours, or an unverified person approaching, trigger an immediate escalation:'}
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    {lang === 'vi' ? 'Phòng Bảo vệ ĐH Bách Khoa (Cổng 1)' : 'HCMUT Campus Security (Gate 1)'}
                  </span>
                  <span className="font-mono font-semibold text-[#0B1829] tabular-nums">028 3865 1670</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    {lang === 'vi' ? 'Chỉ huy ca trực MotoFix' : 'MotoFix Shift Commander'}
                  </span>
                  <span className="font-mono font-semibold text-[#0B1829] tabular-nums">028 3864 7256</span>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setAlertSent(false);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>
            {!alertSent && (
              <button
                onClick={() => setAlertSent(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap"
              >
                {lang === 'vi' ? 'Gửi cảnh báo khẩn ngay' : 'Send Immediate Alert'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
