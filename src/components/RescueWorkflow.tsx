import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Share2,
  Phone,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Star,
  Download,
  Lock,
  ShieldAlert,
  UserCheck,
  Clock,
  FileText,
} from 'lucide-react';
import {
  CAMPUS_LOCATIONS,
  PARTNER_WORKSHOPS,
  RESPONDERS,
  SERVICES,
  VEHICLE_LABELS,
  formatVnd,
  type CampusLocation,
  type Language,
  type ServiceId,
  type VehicleType,
} from '../data/motofixData';
import { CampusMap } from './CampusMap';

interface RescueWorkflowProps {
  lang: Language;
  selectedServiceId: ServiceId;
  onSelectServiceId: (id: ServiceId) => void;
  isStudentPassActive: boolean;
  onToggleStudentPass: (val: boolean) => void;
  onOpenHotline: () => void;
  onOpenSafetyModal: (locationName: string) => void;
}

type WorkflowStep = 1 | 2 | 3 | 4 | 5 | 6;
type PaymentMethod = 'vietqr' | 'momo' | 'cash';

export const RescueWorkflow: React.FC<RescueWorkflowProps> = ({
  lang,
  selectedServiceId,
  onSelectServiceId,
  isStudentPassActive,
  onToggleStudentPass,
  onOpenHotline,
  onOpenSafetyModal,
}) => {
  const [step, setStep] = useState<WorkflowStep>(1);
  const [vehicleType, setVehicleType] = useState<VehicleType>('scooter');
  const [locationId, setLocationId] = useState<string>(CAMPUS_LOCATIONS[0].id);
  const [phone, setPhone] = useState('0908 421 765');
  const [note, setNote] = useState('');
  const [preferFemaleResponder, setPreferFemaleResponder] = useState(false);
  const [shareTrustedContact, setShareTrustedContact] = useState(true);
  const [trustedContactPhone, setTrustedContactPhone] = useState('0913 558 204');
  const [formError, setFormError] = useState('');

  // Dispatch & Quote states
  const [triageStage, setTriageStage] = useState(0); // 0..3 checks
  const [quoteDeclined, setQuoteDeclined] = useState(false);
  const [responderProgress, setResponderProgress] = useState(0);
  const [servicePhase, setServicePhase] = useState<'enroute' | 'arrived' | 'working'>('enroute');

  // Extra work approval simulation (Section 6.3: "extra work requires a new approval")
  const [showAddonRequest, setShowAddonRequest] = useState(false);
  const [addonStatus, setAddonStatus] = useState<'none' | 'pending' | 'approved' | 'declined'>('none');

  // Receipt & Review states
  const [photoConsent, setPhotoConsent] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [trustChecks, setTrustChecks] = useState<string[]>(['exact_quote', 'verified_id', 'on_time']);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const selectedLocation = CAMPUS_LOCATIONS.find((l) => l.id === locationId) || CAMPUS_LOCATIONS[0];
  const responder = preferFemaleResponder ? RESPONDERS.female : RESPONDERS.male;
  const partnerWorkshop = PARTNER_WORKSHOPS[0];

  const baseLaborVnd =
    selectedService.id === 'workshop_tow'
      ? partnerWorkshop.estimatedTowVnd
      : selectedService.priceVnd ?? 30000;

  const studentPassDiscount =
    isStudentPassActive && selectedService.id !== 'workshop_tow'
      ? Math.round(baseLaborVnd * 0.15)
      : 0;

  const addonVnd = addonStatus === 'approved' ? selectedService.optionalAddon.priceVnd : 0;
  const totalVnd = Math.max(0, baseLaborVnd - studentPassDiscount + addonVnd);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Step 2: Automated realistic triage progression
  useEffect(() => {
    if (step !== 2) return;
    setTriageStage(0);
    const t1 = setTimeout(() => setTriageStage(1), 450);
    const t2 = setTimeout(() => setTriageStage(2), 950);
    const t3 = setTimeout(() => setTriageStage(3), 1450);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [step]);

  // Step 4: Animated responder route progress along campus map
  useEffect(() => {
    if (step !== 4 || !selectedLocation.inGeofence) return;
    setResponderProgress(0);
    setServicePhase('enroute');

    const interval = setInterval(() => {
      setResponderProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          setServicePhase('working');
          return 1;
        }
        const next = Math.min(1, prev + 0.08);
        if (next >= 0.72 && next < 1) {
          setServicePhase('arrived');
        }
        return next;
      });
    }, 220);

    return () => clearInterval(interval);
  }, [step, selectedLocation.inGeofence]);

  const handleSubmitIntake = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9 || digitsOnly.length > 11) {
      setFormError(
        lang === 'vi'
          ? 'Vui lòng nhập số điện thoại Việt Nam hợp lệ (9–11 chữ số).'
          : 'Please enter a valid Vietnam phone number (9–11 digits).'
      );
      return;
    }
    setFormError('');
    setQuoteDeclined(false);
    setAddonStatus('none');
    setShowAddonRequest(false);
    setStep(2);
  };

  const handleReset = () => {
    setStep(1);
    setQuoteDeclined(false);
    setResponderProgress(0);
    setAddonStatus('none');
    setShowAddonRequest(false);
    setReviewSubmitted(false);
    setComplaintSubmitted(false);
    setFormError('');
  };

  const handleShareTracking = () => {
    const summary =
      lang === 'vi'
        ? `[MotoFix] Đơn #MF-2026-0842 · KTV ${responder.name} (${responder.badgeId}, xe ${responder.vehiclePlate}) đang đến ${selectedLocation.name.vi}. ETA ${selectedLocation.etaMin}-${selectedLocation.etaMax} phút. Tổng báo giá đã duyệt: ${formatVnd(totalVnd, 'vi')}.`
        : `[MotoFix] Job #MF-2026-0842 · Responder ${responder.name} (${responder.badgeId}, plate ${responder.vehiclePlate}) heading to ${selectedLocation.name.en}. ETA ${selectedLocation.etaMin}-${selectedLocation.etaMax} min. Approved quote: ${formatVnd(totalVnd, 'en')}.`;

    navigator.clipboard?.writeText(summary).catch(() => {});
    showToast(
      lang === 'vi'
        ? 'Đã sao chép đường dẫn theo dõi & thông tin KTV gửi người thân.'
        : 'Copied live tracking link & responder details for your trusted contact.'
    );
  };

  const handleDownloadReceipt = () => {
    const receiptText = [
      '========================================',
      'MOTOFIX - STUDENT ROADSIDE ASSISTANCE',
      'DIGITAL JOB RECORD & RECEIPT',
      '========================================',
      `Job ID: MF-2026-0842`,
      `Location: ${selectedLocation.name[lang]} (${selectedLocation.address})`,
      `Vehicle: ${VEHICLE_LABELS[vehicleType][lang]}`,
      `Responder: ${responder.name} (${responder.badgeId} | ${responder.vehiclePlate})`,
      `Service: ${selectedService.title[lang]}`,
      `Base Service Fee: ${formatVnd(baseLaborVnd, lang)}`,
      studentPassDiscount > 0 ? `Student Pass (-15%): -${formatVnd(studentPassDiscount, lang)}` : null,
      addonVnd > 0 ? `Approved Parts Add-on: ${formatVnd(addonVnd, lang)}` : null,
      `Surge / Hidden Fee: ${formatVnd(0, lang)}`,
      `TOTAL PAID: ${formatVnd(totalVnd, lang)}`,
      `Payment Method: ${paymentMethod.toUpperCase()}`,
      `Evidence: ${selectedService.evidenceResult[lang]}`,
      'Privacy Notice (Law 91/2025/QH15): Live GPS trace auto-purged upon closure.',
    ]
      .filter(Boolean)
      .join('\n');

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MotoFix-Bien-Lai-MF-2026-0842.txt';
    a.click();
    URL.revokeObjectURL(url);

    showToast(
      lang === 'vi'
        ? 'Đã tải biên lai điện tử (có thể gửi trực tiếp cho phụ huynh).'
        : 'Downloaded digital receipt (ready to share with parents or guardians).'
    );
  };

  const toggleTrustCheck = (key: string) => {
    setTrustChecks((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const stepLabels = [
    { num: 1 as WorkflowStep, vi: '1. Gửi yêu cầu', en: '1. Request' },
    { num: 2 as WorkflowStep, vi: '2. Kiểm tra an toàn', en: '2. Safety Triage' },
    { num: 3 as WorkflowStep, vi: '3. KTV & Báo giá', en: '3. Responder & Quote' },
    { num: 4 as WorkflowStep, vi: '4. Điều phối & Sửa', en: '4. Live Service' },
    { num: 5 as WorkflowStep, vi: '5. Biên lai số', en: '5. Digital Receipt' },
    { num: 6 as WorkflowStep, vi: '6. Đánh giá', en: '6. Review' },
  ];

  const handleSelectLocationFromMap = (loc: CampusLocation) => {
    setLocationId(loc.id);
    if (step > 1) {
      showToast(
        lang === 'vi'
          ? `Để đổi tọa độ mới (${loc.name.vi}), bấm "Làm mới" về Bước 1.`
          : `Reset to Step 1 to submit a request at ${loc.name.en}.`
      );
    }
  };

  return (
    <section id="rescue-prototype" className="py-16 lg:py-20 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Quick Reset */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-500 mb-2">
              {lang === 'vi'
                ? 'Trải nghiệm quy trình 6 bước · Không cần tải app · Báo giá khóa trước khi làm'
                : 'Interactive 6-Step Customer Prototype · No App Install · Upfront Quote Lock'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1829]">
              {lang === 'vi'
                ? 'Mô phỏng đặt cứu hộ trực tiếp cho sinh viên'
                : 'Try the Live Student Rescue Request Flow'}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenHotline}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              {lang === 'vi' ? 'Hotline / Zalo dự phòng' : 'Fallback Hotline'}
            </button>
            {step > 1 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {lang === 'vi' ? 'Làm mới mô phỏng' : 'Reset Flow'}
              </button>
            )}
          </div>
        </div>

        {/* 6-Step Segmented Workflow Stepper */}
        <div className="mb-8 overflow-x-auto pb-1">
          <div className="inline-flex min-w-full bg-slate-100 p-1 rounded-lg border border-slate-200/80 gap-1">
            {stepLabels.map((item) => {
              const isCurrent = step === item.num;
              const isCompleted = step > item.num;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => {
                    if (item.num <= step || (item.num <= 3 && !quoteDeclined)) {
                      setStep(item.num);
                    }
                  }}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center ${
                    isCurrent
                      ? 'bg-[#0B1829] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-white text-[#0B1829] hover:bg-slate-50'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {lang === 'vi' ? item.vi : item.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toast feedback banner */}
        {toastMessage && (
          <div
            role="status"
            className="mb-6 px-4 py-3 rounded-lg bg-[#0B1829] text-white text-xs sm:text-sm flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FB923C] shrink-0" />
              {toastMessage}
            </span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs whitespace-nowrap"
            >
              {lang === 'vi' ? 'Ẩn' : 'Dismiss'}
            </button>
          </div>
        )}

        {/* Main 2-Column Prototype Workspace (Left: Interactive Flow | Right: Live Campus Geofence Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: Customer Interactive Screen */}
          <div className="lg:col-span-7 bg-[#F8FAFC] rounded-xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between">
            {/* STEP 1: LOW-FRICTION REQUEST INTAKE */}
            {step === 1 && (
              <form onSubmit={handleSubmitIntake} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <label className="text-sm font-semibold text-[#0B1829]">
                      {lang === 'vi' ? 'Chọn sự cố xe đang gặp' : 'Select Your Incident'}
                    </label>
                    <span className="text-xs text-slate-500">
                      {lang === 'vi' ? 'Giá công niêm yết cố định' : 'Fixed introductory labor fees'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SERVICES.map((svc) => {
                      const active = svc.id === selectedServiceId;
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => onSelectServiceId(svc.id)}
                          className={`text-left p-3.5 rounded-lg border transition-colors ${
                            active
                              ? 'bg-white border-[#EA6A12] ring-1 ring-[#EA6A12]'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-semibold text-[#0B1829]">
                              {svc.shortLabel[lang]}
                            </span>
                            <span
                              className={`font-mono text-xs font-semibold tabular-nums whitespace-nowrap ${
                                active ? 'text-[#EA6A12]' : 'text-slate-700'
                              }`}
                            >
                              {svc.priceDisplay[lang]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {svc.durationNote[lang]}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Vehicle Type & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      {lang === 'vi' ? 'Loại phương tiện' : 'Vehicle Type'}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-200/70 p-1 rounded-lg">
                      {(['scooter', 'underbone', 'manual', 'electric'] as VehicleType[]).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setVehicleType(v)}
                          className={`px-2.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                            vehicleType === v
                              ? 'bg-white text-[#0B1829] shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {VEHICLE_LABELS[v][lang]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="campus-loc" className="block text-xs font-semibold text-slate-700 mb-2">
                      {lang === 'vi' ? 'Vị trí dừng xe (hoặc chọn trên bản đồ)' : 'Breakdown Location (or pick on map)'}
                    </label>
                    <select
                      id="campus-loc"
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-[#0B1829]"
                    >
                      {CAMPUS_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name[lang]} ({loc.distanceKm} km)
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {selectedLocation.inGeofence
                        ? lang === 'vi'
                          ? `Trong vùng 1.5 km · Dự kiến đến trong ${selectedLocation.etaMin}–${selectedLocation.etaMax} phút`
                          : `Inside 1.5 km zone · Realistic ETA ${selectedLocation.etaMin}–${selectedLocation.etaMax} min`
                        : lang === 'vi'
                        ? 'Ngoài vùng 1.5 km · Hệ thống sẽ đề xuất tiệm đối tác hoặc báo giá rõ trước khi đi'
                        : 'Outside 1.5 km pilot zone · Honest referral or custom quote before dispatch'}
                    </p>
                  </div>
                </div>

                {/* Phone & Quick Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="student-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {lang === 'vi' ? 'Số điện thoại liên hệ' : 'Contact Phone'}
                    </label>
                    <input
                      id="student-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-lg text-[#0B1829]"
                    />
                  </div>
                  <div>
                    <label htmlFor="breakdown-note" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {lang === 'vi' ? 'Ghi chú nhanh (không bắt buộc)' : 'Quick Note (optional)'}
                    </label>
                    <input
                      id="breakdown-note"
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={
                        lang === 'vi'
                          ? 'Ví dụ: Xe Vision xanh, sát cổng nhà xe B4'
                          : 'e.g., Blue Honda Vision near B4 parking exit'
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-[#0B1829]"
                    />
                  </div>
                </div>

                {/* Student Safety & Membership Controls */}
                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  <p className="text-xs font-semibold text-slate-700">
                    {lang === 'vi' ? 'Tùy chọn an toàn & quyền lợi sinh viên' : 'Student Safety & Member Options'}
                  </p>
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferFemaleResponder}
                      onChange={(e) => setPreferFemaleResponder(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#EA6A12] focus:ring-[#EA6A12]"
                    />
                    <span>
                      <strong className="text-[#0B1829]">
                        {lang === 'vi' ? 'Ưu tiên kỹ thuật viên nữ khi có ca trực' : 'Request woman responder when available'}
                      </strong>{' '}
                      — {lang === 'vi' ? 'Hỗ trợ an tâm cho nữ sinh vào buổi tối hoặc bãi xe vắng.' : 'Women-safe escalation option for evening or quiet areas.'}
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareTrustedContact}
                      onChange={(e) => setShareTrustedContact(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#EA6A12] focus:ring-[#EA6A12]"
                    />
                    <span className="flex-1">
                      <strong className="text-[#0B1829]">
                        {lang === 'vi' ? 'Tạo link chia sẻ vị trí & biên lai cho người thân' : 'Share live tracking link & receipt with trusted contact'}
                      </strong>
                      {shareTrustedContact && (
                        <input
                          type="tel"
                          value={trustedContactPhone}
                          onChange={(e) => setTrustedContactPhone(e.target.value)}
                          aria-label={lang === 'vi' ? 'Số điện thoại người thân' : 'Trusted contact phone'}
                          className="mt-1.5 block w-full sm:w-56 px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-md text-[#0B1829]"
                        />
                      )}
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isStudentPassActive}
                      onChange={(e) => onToggleStudentPass(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#EA6A12] focus:ring-[#EA6A12]"
                    />
                    <span>
                      <strong className="text-[#0B1829]">
                        {lang === 'vi' ? 'Áp dụng thẻ Student Pass (-15% phí công & ưu tiên hàng đợi)' : 'Apply Student Pass (-15% labor discount & priority queue)'}
                      </strong>
                    </span>
                  </label>
                </div>

                {formError && (
                  <p className="text-xs font-medium text-red-600" role="alert">
                    {formError}
                  </p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {lang === 'vi'
                      ? 'Miễn phí hủy trước khi xác nhận báo giá. Không cần tạo tài khoản.'
                      : 'Free cancellation before quote approval. No account required.'}
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    {lang === 'vi' ? 'Gửi yêu cầu & Nhận báo giá' : 'Submit & Get Upfront Quote'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: DISPATCHER SAFETY TRIAGE */}
            {step === 2 && (
              <div className="space-y-6 my-auto py-2">
                <div>
                  <p className="font-mono text-xs text-slate-500 mb-1">
                    {lang === 'vi' ? 'Mã tiếp nhận #MF-2026-0842 · Mục tiêu điều phối < 3 phút' : 'Ticket #MF-2026-0842 · Dispatch target < 3 min'}
                  </p>
                  <h3 className="text-xl font-bold text-[#0B1829]">
                    {lang === 'vi'
                      ? 'Điều phối viên đang kiểm tra phạm vi & an toàn hiện trường'
                      : 'Dispatcher Safety & Scope Triage'}
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      idx: 1,
                      labelVi: selectedLocation.inGeofence
                        ? `Xác nhận vị trí nằm trong vùng 1.5 km (${selectedLocation.distanceKm} km từ trạm trực)`
                        : `Phát hiện vị trí ngoài vùng 1.5 km (${selectedLocation.distanceKm} km) — kích hoạt phương án giới thiệu đối tác`,
                      labelEn: selectedLocation.inGeofence
                        ? `Verified inside 1.5 km geofence (${selectedLocation.distanceKm} km from staging point)`
                        : `Detected outside 1.5 km pilot zone (${selectedLocation.distanceKm} km) — preparing vetted referral option`,
                      warn: !selectedLocation.inGeofence,
                    },
                    {
                      idx: 2,
                      labelVi: `Đánh giá an toàn tiếp cận: ${selectedLocation.name.vi} (không cản trở làn tốc độ cao)`,
                      labelEn: `Safety approach verified: ${selectedLocation.name.en} (safe curb access)`,
                      warn: false,
                    },
                    {
                      idx: 3,
                      labelVi:
                        vehicleType === 'electric'
                          ? 'Ghi nhận xe máy điện — áp dụng quy trình kiểm tra điện áp an toàn'
                          : `Xác nhận hạng mục "${selectedService.shortLabel.vi}" nằm trong phạm vi bộ đồ nghề chuẩn`,
                      labelEn:
                        vehicleType === 'electric'
                          ? 'Electric two-wheeler flagged — assigning safe electrical inspection checklist'
                          : `Confirmed "${selectedService.shortLabel.en}" matches portable response kit standards`,
                      warn: false,
                    },
                  ].map((check) => {
                    const done = triageStage >= check.idx;
                    return (
                      <div
                        key={check.idx}
                        className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${
                          done
                            ? check.warn
                              ? 'bg-amber-50 border-amber-200 text-amber-950'
                              : 'bg-white border-slate-200 text-[#0B1829]'
                            : 'bg-slate-100/60 border-slate-200/70 text-slate-400'
                        }`}
                      >
                        {check.warn && done ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        ) : (
                          <CheckCircle2
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              done ? 'text-emerald-600' : 'text-slate-300'
                            }`}
                          />
                        )}
                        <span className="text-sm">
                          {lang === 'vi' ? check.labelVi : check.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {!selectedLocation.inGeofence && triageStage >= 3 ? (
                  <div className="p-4 rounded-lg bg-white border border-amber-300 space-y-3">
                    <p className="text-sm font-semibold text-[#0B1829]">
                      {lang === 'vi'
                        ? 'Thông báo trung thực: Vị trí vượt quá bán kính 1.5 km thí điểm'
                        : 'Honest Coverage Notice: Location is outside our 1.5 km pilot zone'}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'vi'
                        ? 'MotoFix không điều xe vượt vùng khi chưa thống nhất ETA thực tế. Bạn có thể chọn giới thiệu tiệm đối tác gần nhất hoặc quay lại chọn điểm trong khu vực trường.'
                        : 'MotoFix never dispatches outside our active zone without an honest ETA and agreed quote. You can view our vetted workshop referral or switch to a campus location.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLocationId(CAMPUS_LOCATIONS[0].id);
                          setStep(1);
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#0B1829] hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {lang === 'vi' ? 'Chọn điểm trong vùng 1.5 km' : 'Switch to 1.5 km Campus Zone'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-4 py-2 text-xs font-semibold text-[#0B1829] border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {lang === 'vi' ? 'Xem báo giá kéo xe / đối tác' : 'View Partner Referral Quote'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      {lang === 'vi' ? '← Sửa thông tin yêu cầu' : '← Edit Request'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={triageStage < 2}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {lang === 'vi' ? 'Xem hồ sơ KTV & Báo giá chi tiết' : 'View Responder & Itemized Quote'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: VERIFIED RESPONDER CARD & UPFRONT ITEMIZED QUOTE */}
            {step === 3 && (
              <div className="space-y-5">
                {quoteDeclined ? (
                  <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-4 text-center my-6">
                    <CheckCircle2 className="w-9 h-9 text-slate-700 mx-auto" />
                    <h3 className="text-lg font-bold text-[#0B1829]">
                      {lang === 'vi'
                        ? 'Đã hủy yêu cầu — Không phát sinh bất kỳ chi phí nào'
                        : 'Request Cancelled — Zero Charge Applied'}
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      {lang === 'vi'
                        ? 'Tại MotoFix, bạn luôn có quyền xem trước báo giá và từ chối thoải mái mà không chịu áp lực hay phí ẩn.'
                        : 'With MotoFix, you can always inspect the itemized quote first and decline without pressure or hidden cancellation fees.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B1829] hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {lang === 'vi' ? 'Tạo yêu cầu mới' : 'Start New Request'}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Verified Responder Identity Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                        <img
                          src={responder.photo}
                          alt={responder.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-[#0B1829] flex items-center gap-1.5">
                            {responder.name}
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </h3>
                          <span className="font-mono text-xs font-semibold text-[#EA6A12] tabular-nums">
                            ETA {selectedLocation.etaMin}–{selectedLocation.etaMax} {lang === 'vi' ? 'phút' : 'min'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600 mt-1">
                          <span className="font-mono font-medium text-[#0B1829]">{responder.badgeId}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{responder.vehiclePlate}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{responder.rating.toFixed(1)}/5 ({responder.completedJobs} ca)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{responder.certifications[lang]}</p>
                      </div>
                    </div>

                    {/* Upfront Itemized Quote Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#0B1829] flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-[#EA6A12]" />
                          {lang === 'vi' ? 'Báo giá chi tiết — Khóa giá trước khi làm' : 'Itemized Quote — Locked Before Work'}
                        </span>
                        <span className="font-mono text-xs text-slate-500">#MF-2026-0842</span>
                      </div>

                      <div className="p-4 space-y-2.5 text-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-[#0B1829]">{selectedService.title[lang]}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {selectedService.id === 'workshop_tow'
                                ? `${partnerWorkshop.name} · ${partnerWorkshop.address}`
                                : selectedService.scopeNote[lang]}
                            </p>
                          </div>
                          <span className="font-mono font-semibold text-[#0B1829] tabular-nums whitespace-nowrap">
                            {formatVnd(baseLaborVnd, lang)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <span>
                            {lang === 'vi' ? 'Phụ tùng thay thế (tính đúng giá gốc có hóa đơn)' : 'Replacement parts (at documented cost)'}
                          </span>
                          <span className="font-mono tabular-nums">{formatVnd(0, lang)}</span>
                        </div>

                        {selectedService.id === 'fuel_coord' && (
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>
                              {lang === 'vi' ? 'Tiền xăng (trả trực tiếp tại cây xăng, không thu hộ)' : 'Fuel cost (paid directly to station)'}
                            </span>
                            <span className="font-mono tabular-nums">{formatVnd(0, lang)}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span>
                            {lang === 'vi' ? 'Phụ phí giờ cao điểm / thời tiết (Thí điểm)' : 'Surge / weather surcharge (Pilot)'}
                          </span>
                          <span className="font-mono text-emerald-700 font-medium tabular-nums">
                            {formatVnd(0, lang)}
                          </span>
                        </div>

                        {studentPassDiscount > 0 && (
                          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
                            <span>{lang === 'vi' ? 'Ưu đãi Student Pass (-15% phí công)' : 'Student Pass Discount (-15% labor)'}</span>
                            <span className="font-mono tabular-nums">-{formatVnd(studentPassDiscount, lang)}</span>
                          </div>
                        )}

                        <div className="flex items-baseline justify-between pt-3 border-t border-slate-200">
                          <span className="font-semibold text-[#0B1829]">
                            {lang === 'vi' ? 'Tổng thanh toán dự kiến' : 'Approved Total'}
                          </span>
                          <span className="font-mono text-xl font-bold text-[#EA6A12] tabular-nums">
                            {formatVnd(totalVnd, lang)}
                          </span>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
                        {selectedService.protectionRule[lang]}
                      </div>
                    </div>

                    {/* Safety Quick Actions + Approval Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={handleShareTracking}
                          className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#0B1829] whitespace-nowrap"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          {lang === 'vi' ? 'Chia sẻ người thân' : 'Share Link'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenSafetyModal(selectedLocation.name[lang])}
                          className="inline-flex items-center gap-1.5 font-medium text-red-700 hover:text-red-800 whitespace-nowrap"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {lang === 'vi' ? 'Báo an toàn' : 'Safety Escalation'}
                        </button>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setQuoteDeclined(true)}
                          className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                        >
                          {lang === 'vi' ? 'Từ chối (0₫)' : 'Decline (Free)'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(4)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap"
                        >
                          {lang === 'vi' ? 'Duyệt báo giá & Điều phối' : 'Approve Quote & Dispatch'}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 4: LIVE TRACKING & ON-SITE SERVICE + EXTRA WORK CONSENT */}
            {step === 4 && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-slate-500">
                      {lang === 'vi' ? 'Báo giá đã duyệt · KTV ' : 'Quote Approved · Responder '}
                      {responder.name} ({responder.badgeId})
                    </p>
                    <h3 className="text-lg font-bold text-[#0B1829] mt-0.5">
                      {servicePhase === 'enroute'
                        ? lang === 'vi'
                          ? 'Kỹ thuật viên đang di chuyển đến vị trí của bạn'
                          : 'Responder is en route to your location'
                        : servicePhase === 'arrived'
                        ? lang === 'vi'
                          ? 'Kỹ thuật viên đã đến nơi — Đang kiểm tra an toàn xe'
                          : 'Responder arrived — Performing safety inspection'
                        : lang === 'vi'
                        ? 'Đang thực hiện xử lý theo đúng báo giá đã duyệt'
                        : 'Performing approved roadside service'}
                    </h3>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#EA6A12] tabular-nums">
                    {Math.round(responderProgress * 100)}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#EA6A12] transition-all duration-200"
                    style={{ width: `${Math.round(responderProgress * 100)}%` }}
                  />
                </div>

                {/* Live Service Status Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <p className="font-semibold text-[#0B1829] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#EA6A12]" />
                      {lang === 'vi' ? '1. Điều phối' : '1. Dispatched'}
                    </p>
                    <p className="text-slate-500 mt-1">
                      {lang === 'vi' ? 'Xuất phát từ Trạm Lý Thường Kiệt' : 'Departed Ly Thuong Kiet staging'}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg border ${
                      responderProgress >= 0.72
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-100/70 border-slate-200/70 text-slate-400'
                    }`}
                  >
                    <p className="font-semibold flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {lang === 'vi' ? '2. Đã tới nơi' : '2. On Site'}
                    </p>
                    <p className="text-slate-500 mt-1">
                      {lang === 'vi' ? 'Kiểm tra áo phản quang & thẻ KTV' : 'Verify reflective vest & staff ID'}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg border ${
                      responderProgress >= 1
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-100/70 border-slate-200/70 text-slate-400'
                    }`}
                  >
                    <p className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {lang === 'vi' ? '3. Hoàn thiện' : '3. Completing'}
                    </p>
                    <p className="text-slate-500 mt-1">
                      {lang === 'vi' ? 'Ghi nhận ảnh kiểm tra & biên lai' : 'Logging evidence & digital receipt'}
                    </p>
                  </div>
                </div>

                {/* Extra Work Requires New Approval Demonstration */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#0B1829]">
                      {lang === 'vi'
                        ? 'Cơ chế chống tự ý thay phụ tùng (Quote Lock)'
                        : 'Anti-Upsell Protection (Extra Work Requires New Approval)'}
                    </p>
                    {!showAddonRequest && addonStatus === 'none' && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddonRequest(true);
                          setAddonStatus('pending');
                        }}
                        className="text-xs font-medium text-[#EA6A12] hover:underline whitespace-nowrap"
                      >
                        {lang === 'vi' ? 'Mô phỏng phát sinh phụ tùng →' : 'Simulate Extra Part Found →'}
                      </button>
                    )}
                  </div>

                  {addonStatus === 'none' && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'vi'
                        ? 'KTV không được phép tự ý thay bất kỳ linh kiện nào ngoài báo giá đã duyệt. Nếu phát hiện lỗi thêm khi kiểm tra, ứng dụng sẽ gửi báo giá bổ sung để bạn quyết định.'
                        : 'Responders cannot replace any part outside the approved quote. If a new fault is found, a separate approval request is sent to your screen.'}
                    </p>
                  )}

                  {addonStatus === 'pending' && (
                    <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold text-[#0B1829]">
                            {lang === 'vi' ? 'Yêu cầu duyệt phát sinh: ' : 'Additional Approval Requested: '}
                            {selectedService.optionalAddon.name[lang]}
                          </p>
                          <p className="text-xs text-slate-700 mt-0.5">
                            {selectedService.optionalAddon.reason[lang]}
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#0B1829] tabular-nums whitespace-nowrap">
                          +{formatVnd(selectedService.optionalAddon.priceVnd, lang)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAddonStatus('approved')}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B1829] hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
                        >
                          {lang === 'vi' ? 'Đồng ý thay (+giá gốc)' : 'Approve Part'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddonStatus('declined')}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap"
                        >
                          {lang === 'vi' ? 'Không thay, giữ báo giá cũ' : 'Decline, Keep Original Quote'}
                        </button>
                      </div>
                    </div>
                  )}

                  {addonStatus === 'approved' && (
                    <p className="text-xs text-emerald-700 font-medium">
                      {lang === 'vi'
                        ? `Đã ghi nhận xác nhận bổ sung: ${selectedService.optionalAddon.name.vi} (+${formatVnd(selectedService.optionalAddon.priceVnd, 'vi')}). Linh kiện cũ sẽ được bàn giao lại cho bạn kiểm tra.`
                        : `Approved add-on logged: ${selectedService.optionalAddon.name.en} (+${formatVnd(selectedService.optionalAddon.priceVnd, 'en')}). Old part returned for your inspection.`}
                    </p>
                  )}

                  {addonStatus === 'declined' && (
                    <p className="text-xs text-slate-700 font-medium">
                      {lang === 'vi'
                        ? 'Bạn đã từ chối hạng mục phát sinh. Tổng thanh toán giữ nguyên theo báo giá ban đầu.'
                        : 'Additional item declined. Your total remains locked at the original approved quote.'}
                    </p>
                  )}
                </div>

                {/* Bottom Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={handleShareTracking}
                      className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#0B1829] whitespace-nowrap"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {lang === 'vi' ? 'Gửi tiến độ cho người thân' : 'Share Live Status'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenSafetyModal(selectedLocation.name[lang])}
                      className="inline-flex items-center gap-1.5 font-medium text-red-700 hover:text-red-800 whitespace-nowrap"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {lang === 'vi' ? 'Cần hỗ trợ an toàn' : 'Safety Help'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap"
                  >
                    {lang === 'vi' ? 'Hoàn tất & Xem biên lai số' : 'Complete & View Digital Receipt'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: EVIDENCE & DIGITAL RECEIPT */}
            {step === 5 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-emerald-700 font-medium">
                      {lang === 'vi' ? 'ĐÃ HOÀN TẤT · BIÊN LAI #MF-2026-0842' : 'COMPLETED · RECEIPT #MF-2026-0842'}
                    </p>
                    <h3 className="text-lg font-bold text-[#0B1829] mt-0.5">
                      {lang === 'vi' ? 'Biên bản kiểm tra & Biên lai điện tử' : 'Inspection Record & Digital Receipt'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#0B1829] bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {lang === 'vi' ? 'Tải biên lai' : 'Download'}
                  </button>
                </div>

                {/* Before / After Technical Verification Log */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#0B1829] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#EA6A12]" />
                      {selectedService.evidenceLabel[lang]}
                    </span>
                    <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={photoConsent}
                        onChange={(e) => setPhotoConsent(e.target.checked)}
                        className="rounded border-slate-300 text-[#EA6A12]"
                      />
                      {lang === 'vi' ? 'Lưu ảnh trước/sau' : 'Store before/after photos'}
                    </label>
                  </div>
                  <p className="font-mono text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {selectedService.evidenceResult[lang]}
                  </p>
                </div>

                {/* Final Receipt Breakdown */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>{selectedService.title[lang]}</span>
                    <span className="font-mono text-[#0B1829] tabular-nums">{formatVnd(baseLaborVnd, lang)}</span>
                  </div>
                  {studentPassDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>{lang === 'vi' ? 'Giảm giá Student Pass (-15%)' : 'Student Pass (-15%)'}</span>
                      <span className="font-mono tabular-nums">-{formatVnd(studentPassDiscount, lang)}</span>
                    </div>
                  )}
                  {addonVnd > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>{selectedService.optionalAddon.name[lang]}</span>
                      <span className="font-mono text-[#0B1829] tabular-nums">{formatVnd(addonVnd, lang)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2.5 border-t border-slate-200 text-sm font-bold text-[#0B1829]">
                    <span>{lang === 'vi' ? 'Tổng thanh toán' : 'Total Paid'}</span>
                    <span className="font-mono text-lg text-[#EA6A12] tabular-nums">{formatVnd(totalVnd, lang)}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                    {(
                      [
                        { id: 'vietqr', label: 'VietQR' },
                        { id: 'momo', label: 'MoMo' },
                        { id: 'cash', label: lang === 'vi' ? 'Tiền mặt' : 'Cash' },
                      ] as { id: PaymentMethod; label: string }[]
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                          paymentMethod === m.id
                            ? 'bg-white text-[#0B1829] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap"
                  >
                    {lang === 'vi' ? 'Xác nhận thanh toán & Đánh giá' : 'Confirm Payment & Rate'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {lang === 'vi'
                    ? 'Tuân thủ Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15: Tọa độ vị trí trực tiếp sẽ được tự động xóa/ẩn danh ngay sau khi đóng đơn cứu hộ.'
                    : 'Compliant with Law on Personal Data Protection No. 91/2025/QH15: Live location trace is automatically deleted or de-identified upon job closure.'}
                </p>
              </div>
            )}

            {/* STEP 6: QUALITY REVIEW, RATING & POST-SERVICE ASSURANCE */}
            {step === 6 && (
              <div className="space-y-5">
                {reviewSubmitted ? (
                  <div className="p-6 bg-white rounded-xl border border-slate-200 text-center space-y-4 my-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="text-lg font-bold text-[#0B1829]">
                      {lang === 'vi'
                        ? 'Cảm ơn đánh giá của bạn — Chúc bạn đi học an toàn!'
                        : 'Thank you for your feedback — Ride safely!'}
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      {lang === 'vi'
                        ? 'Biên lai điện tử #MF-2026-0842 đã được lưu lại. Nếu vết vá hoặc lỗi vừa xử lý gặp vấn đề trong 48 giờ, MotoFix hỗ trợ kiểm tra lại miễn phí.'
                        : 'Digital receipt #MF-2026-0842 is saved. If the same repair issue recurs within 48 hours, MotoFix provides a complimentary recheck.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleDownloadReceipt}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#0B1829] border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {lang === 'vi' ? 'Tải lại biên lai' : 'Download Receipt'}
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#0B1829] hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {lang === 'vi' ? 'Trải nghiệm ca cứu hộ khác' : 'Try Another Scenario'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-slate-500">
                        {lang === 'vi' ? 'Kiểm soát chất lượng sau dịch vụ' : 'Post-Service Quality Control'}
                      </p>
                      <h3 className="text-lg font-bold text-[#0B1829] mt-0.5">
                        {lang === 'vi'
                          ? `Đánh giá trải nghiệm cùng KTV ${responder.name}`
                          : `Rate Your Service with ${responder.name}`}
                      </h3>
                    </div>

                    {/* Interactive Star Rating */}
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1.5 rounded-lg hover:bg-slate-200/70 transition-colors"
                          aria-label={`${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'fill-[#EA6A12] text-[#EA6A12]'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="font-mono text-sm font-semibold text-[#0B1829] ml-2 tabular-nums">
                        {rating}/5
                      </span>
                    </div>

                    {/* Verifiable Trust Audit Criteria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        {
                          key: 'exact_quote',
                          vi: 'Thu đúng 100% báo giá ban đầu',
                          en: 'Charged exact upfront quote',
                        },
                        {
                          key: 'verified_id',
                          vi: 'KTV mặc áo phản quang & đúng thẻ ID',
                          en: 'Responder wore vest & verified ID',
                        },
                        {
                          key: 'on_time',
                          vi: 'Đến đúng khung giờ dự kiến',
                          en: 'Arrived within stated ETA band',
                        },
                        {
                          key: 'respectful',
                          vi: 'Thái độ lịch sự, giải thích rõ ràng',
                          en: 'Respectful & clear explanation',
                        },
                      ].map((item) => {
                        const checked = trustChecks.includes(item.key);
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => toggleTrustCheck(item.key)}
                            className={`text-left px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-2 ${
                              checked
                                ? 'bg-white border-[#0B1829] text-[#0B1829]'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                checked ? 'text-[#EA6A12]' : 'text-slate-300'
                              }`}
                            />
                            {lang === 'vi' ? item.vi : item.en}
                          </button>
                        );
                      })}
                    </div>

                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={
                        lang === 'vi'
                          ? 'Góp ý thêm về trải nghiệm hoặc đề xuất cải thiện...'
                          : 'Optional note about your experience or suggestion...'
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-[#0B1829] placeholder:text-slate-400"
                    />

                    {/* Post-service Complaint / Recheck Assurance */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setComplaintSubmitted(true);
                          showToast(
                            lang === 'vi'
                              ? 'Đã mở phiếu kiểm tra lại / khiếu nại — Quản lý ca trực sẽ liên hệ trong 15 phút.'
                              : 'Recheck / complaint ticket opened — Shift lead will reach out within 15 minutes.'
                          );
                        }}
                        className="text-xs font-medium text-slate-600 hover:text-red-700 underline underline-offset-2"
                      >
                        {complaintSubmitted
                          ? lang === 'vi'
                            ? 'Đã ghi nhận yêu cầu kiểm tra lại'
                            : 'Recheck request logged'
                          : lang === 'vi'
                          ? 'Báo cáo sự cố / Yêu cầu kiểm tra lại miễn phí'
                          : 'Report issue / Request free recheck'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewSubmitted(true)}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap"
                      >
                        {lang === 'vi' ? 'Gửi đánh giá & Hoàn tất' : 'Submit Review'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Interactive 1.5 km Campus Geofence Map */}
          <div className="lg:col-span-5">
            <CampusMap
              lang={lang}
              selectedLocation={selectedLocation}
              onSelectLocation={handleSelectLocationFromMap}
              responderProgress={step >= 5 ? 1 : responderProgress}
              isDispatchActive={step >= 4}
              interactive={step === 1}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
