/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  ArrowRight,
  Phone,
  Check,
  ShieldCheck,
  MapPin,
  Wrench,
} from 'lucide-react';
import {
  HERO_IMAGE_PATH,
  PARTNER_WORKSHOPS,
  SERVICES,
  formatVnd,
  type Language,
  type ServiceId,
} from './data/motofixData';
import { RescueWorkflow } from './components/RescueWorkflow';
import {
  HotlineModal,
  SafetyEscalationModal,
  StudentPassModal,
} from './components/Modals';

export default function App() {
  const [lang, setLang] = useState<Language>('vi');
  const [selectedServiceId, setSelectedServiceId] = useState<ServiceId>('tire_plug');
  const [isStudentPassActive, setIsStudentPassActive] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  // Modals
  const [hotlineOpen, setHotlineOpen] = useState(false);
  const [studentPassOpen, setStudentPassOpen] = useState(false);
  const [safetyModalLocation, setSafetyModalLocation] = useState<string | null>(null);

  const scrollToRescue = (svcId?: ServiceId) => {
    if (svcId) {
      setSelectedServiceId(svcId);
    }
    const el = document.getElementById('rescue-prototype');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const promises = [
    {
      value: lang === 'vi' ? '25k – 40k₫' : 'VND 25k–40k',
      label:
        lang === 'vi'
          ? 'Giá công niêm yết cố định, không tăng giá giờ cao điểm trong thí điểm'
          : 'Published introductory labor fees, zero surge pricing during pilot',
    },
    {
      value: lang === 'vi' ? '< 3 phút' : '< 3 min',
      label:
        lang === 'vi'
          ? 'Điều phối viên tiếp nhận, sàng lọc an toàn và gửi báo giá chi tiết'
          : 'Target dispatch confirmation, safety triage, and itemized quote',
    },
    {
      value: lang === 'vi' ? '≤ 15 phút' : '≤ 15 min',
      label:
        lang === 'vi'
          ? 'Mục tiêu >85% ca có mặt trong bán kính 1.5 km giờ trực (06:30–21:30)'
          : 'Target >85% arrival within 1.5 km micro-zone during staffed hours',
    },
    {
      value: '100%',
      label:
        lang === 'vi'
          ? 'Báo giá khóa trước khi làm, có quyền từ chối miễn phí không áp lực'
          : 'Explicit quote approval before work begins, free cancellation before dispatch',
    },
  ];

  const safetyPrinciples = [
    {
      num: '01.',
      title: lang === 'vi' ? 'Báo giá khóa trước khi chạm vào xe' : 'Quote locked before work starts',
      desc:
        lang === 'vi'
          ? 'Mọi khoản phí công, phụ tùng theo giá gốc hay phí kéo xe đều hiển thị rõ trên màn hình. Mọi hạng mục phát sinh đều bắt buộc gửi báo giá mới để bạn duyệt.'
          : 'Labor, parts at documented cost, and towing charges are itemized upfront. Any additional fault requires a separate approval on your screen.',
    },
    {
      num: '02.',
      title: lang === 'vi' ? 'Định danh kỹ thuật viên & thiết bị chuẩn' : 'Verified responder ID & standardized kit',
      desc:
        lang === 'vi'
          ? 'Hiển thị họ tên, mã số KTV, ảnh chân dung và biển số xe trực trước khi gặp mặt. KTV luôn mặc áo phản quang, mang thẻ ID và bộ đồ nghề được kiểm tra đầu ca.'
          : 'View full name, staff ID, photo, and scooter plate before arrival. Responders wear reflective vests and carry shift-inspected portable kits.',
    },
    {
      num: '03.',
      title: lang === 'vi' ? 'Tùy chọn an toàn dành cho sinh viên' : 'Student & women-safe protection controls',
      desc:
        lang === 'vi'
          ? 'Hỗ trợ chọn ưu tiên KTV nữ khi có ca trực, gửi đường dẫn theo dõi trực tiếp cùng biên lai cho người thân hoặc phụ huynh, và nút kết nối nhanh bảo vệ trường.'
          : 'Request a woman responder when available, share live tracking links and receipts with parents or friends, and escalate to campus security anytime.',
    },
    {
      num: '04.',
      title: lang === 'vi' ? 'An toàn xăng dầu & sẵn sàng cho xe máy điện' : 'Strict fuel safety & electric two-wheeler readiness',
      desc:
        lang === 'vi'
          ? 'Không vận chuyển hay tự rót xăng ngoài đường trong giai đoạn thí điểm — điều phối đến cây xăng gần nhất có hóa đơn gốc. Sẵn sàng quy trình kiểm tra an toàn điện cho xe máy điện.'
          : 'Zero roadside fuel decanting during pilot — we coordinate safe transfer to open stations. Vehicle-agnostic SOPs prepared for electric scooters.',
    },
    {
      num: '05.',
      title: lang === 'vi' ? 'Bảo vệ dữ liệu cá nhân theo Luật 91/2025/QH15' : 'Privacy by design (Law No. 91/2025/QH15)',
      desc:
        lang === 'vi'
          ? 'Không theo dõi vị trí nền liên tục. Tọa độ chỉ thu thập khi có yêu cầu đang mở và tự động xóa hoặc ẩn danh sau khi kết thúc đơn cứu hộ.'
          : 'No continuous background GPS tracking. Location is activated strictly for an active request and deleted or de-identified after service completion.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B1829]">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-xl font-extrabold tracking-tight text-[#0B1829] whitespace-nowrap shrink-0"
          >
            Moto<span className="text-[#EA6A12]">Fix</span>
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label={lang === 'vi' ? 'Điều hướng chính' : 'Primary Navigation'}
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#rescue-prototype"
              className="hover:text-[#0B1829] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'vi' ? 'Đặt cứu hộ' : 'Rescue Flow'}
            </a>
            <a
              href="#pricing"
              className="hover:text-[#0B1829] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'vi' ? 'Bảng giá' : 'Pricing'}
            </a>
            <a
              href="#safety"
              className="hover:text-[#0B1829] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'vi' ? 'An toàn' : 'Safety'}
            </a>
            <a
              href="#student-pass"
              className="hover:text-[#0B1829] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Student Pass
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <button
            type="button"
            onClick={() => scrollToRescue()}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'vi' ? 'Gọi cứu hộ ngay' : 'Request Rescue'}
          </button>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-10 pb-14 lg:pt-14 lg:pb-18 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Utility Row: Clean Unboxed Metadata + Functional VI/EN Switch */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/80">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600">
                <span className="font-semibold text-[#0B1829]">
                  {lang === 'vi' ? 'Khu vực thí điểm Vùng 1: ĐH Bách Khoa TP.HCM & KTX' : 'Pilot Zone 1: HCMUT Campus & Dormitories'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {lang === 'vi' ? 'Bán kính 1.5 km' : '1.5 km micro-zone'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {lang === 'vi' ? 'Giờ trực 06:30 – 21:30' : 'Staffed 06:30 – 21:30'}
                </span>
              </div>

              <div
                className="inline-flex items-center p-0.5 bg-slate-200/80 rounded-lg shrink-0"
                role="group"
                aria-label="Language"
              >
                <button
                  type="button"
                  onClick={() => setLang('vi')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    lang === 'vi'
                      ? 'bg-white text-[#0B1829] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    lang === 'en'
                      ? 'bg-white text-[#0B1829] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* 2-Column Hero Split with Balanced items-stretch */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <h1
                  className="text-[clamp(2.15rem,3.6vw,3.35rem)] font-extrabold tracking-tight leading-[1.12] text-[#0B1829] max-w-xl"
                  style={{ textWrap: 'balance' }}
                >
                  {lang === 'vi' ? (
                    <>
                      Báo giá trước khi làm.{' '}
                      <span className="text-[#EA6A12]">Cứu hộ xe máy sinh viên</span> ngay gần trường.
                    </>
                  ) : (
                    <>
                      We quote before we work.{' '}
                      <span className="text-[#EA6A12]">Campus-near motorcycle help</span> for students.
                    </>
                  )}
                </h1>

                <p className="mt-5 text-base sm:text-[17px] leading-relaxed text-slate-600 max-w-xl">
                  {lang === 'vi'
                    ? 'Lủng lốp sát giờ thi hay xe không đề được ngay cổng KTX? Đặt hỗ trợ trực tiếp trên trình duyệt — không cần tải app, biết rõ danh tính kỹ thuật viên, thời gian đến thực tế và biên lai điện tử minh bạch.'
                    : 'Flat tire before an exam or dead battery outside your dorm parking lot? Request verified help straight from your browser — no app download required, with upfront itemized quotes, live ETA, and digital receipts.'}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => scrollToRescue()}
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors whitespace-nowrap"
                  >
                    {lang === 'vi' ? 'Gửi yêu cầu cứu hộ ngay' : 'Start Rescue Request'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setHotlineOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#0B1829] bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4 text-[#EA6A12]" />
                    <span className="font-mono tabular-nums">028 3864 7256</span>
                  </button>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  {lang === 'vi'
                    ? 'Hỗ trợ qua Web di động, mã QR tại ký túc xá và Hotline/Zalo khi mất mạng.'
                    : 'Accessible via mobile web, campus QR posters, and offline hotline/Zalo fallback.'}
                </p>
              </div>

              {/* Right Column: Dominant 16:9 Editorial Visual */}
              <div className="lg:col-span-6">
                <div className="relative h-full min-h-[280px] sm:min-h-[340px] rounded-xl overflow-hidden border border-slate-200 bg-[#0B1829]">
                  {!heroImgFailed ? (
                    <img
                      src={HERO_IMAGE_PATH}
                      alt={
                        lang === 'vi'
                          ? 'Kỹ thuật viên MotoFix mặc áo phản quang đang kiểm tra và bơm lốp xe máy cho sinh viên gần trường đại học tại TP.HCM'
                          : 'MotoFix technician in reflective vest inspecting a student scooter tire near a Ho Chi Minh City university campus'
                      }
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-300 bg-gradient-to-br from-[#0B1829] to-[#162C4A]">
                      <Wrench className="w-10 h-10 text-[#EA6A12] mb-3" />
                      <p className="font-display font-semibold text-white">MotoFix Campus Roadside Team</p>
                      <p className="text-xs text-slate-400 mt-1">1.5 km Micro-Zone · HCMUT Pilot</p>
                    </div>
                  )}

                  {/* Measured Contrast Scrim for Caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081322]/90 via-[#081322]/55 to-transparent p-5 pt-12">
                    <p className="text-xs sm:text-sm font-medium text-white leading-snug">
                      {lang === 'vi'
                        ? 'Kỹ thuật viên mặc áo phản quang, xuất trình thẻ định danh và khóa báo giá trước khi kiểm tra xe.'
                        : 'Uniformed responders present verified staff ID and lock the itemized quote before touching your bike.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Key Promises Strip below the Hero Split */}
            <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promises.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <p className="font-mono text-2xl font-bold text-[#0B1829] tabular-nums tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE 6-STEP LIVE RESCUE PROTOTYPE */}
        <RescueWorkflow
          lang={lang}
          selectedServiceId={selectedServiceId}
          onSelectServiceId={setSelectedServiceId}
          isStudentPassActive={isStudentPassActive}
          onToggleStudentPass={setIsStudentPassActive}
          onOpenHotline={() => setHotlineOpen(true)}
          onOpenSafetyModal={(locName) => setSafetyModalLocation(locName)}
        />

        {/* SECTION 3: TRANSPARENT SERVICE MENU & VETTED WORKSHOPS */}
        <section id="pricing" className="py-16 lg:py-20 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-medium text-slate-500 mb-2">
                {lang === 'vi'
                  ? 'Bảng giá thí điểm minh bạch · Tách bạch phí công, phụ tùng và nhiên liệu'
                  : 'Transparent Introductory Menu · Labor, Parts & Fuel Separated'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1829]">
                {lang === 'vi'
                  ? 'Rõ giá ngay từ đầu — Không mập mờ, không ép thay phụ tùng'
                  : 'Clear Student Rates — No Hidden Charges, No Forced Upsells'}
              </h2>
            </div>

            {/* Clean Structured Pricing Grid (2x2 Asymmetric Weighting) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SERVICES.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold text-[#0B1829]">
                        {svc.title[lang]}
                      </h3>
                      <span className="font-mono text-lg font-bold text-[#EA6A12] tabular-nums whitespace-nowrap shrink-0">
                        {svc.priceDisplay[lang]}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {svc.scopeNote[lang]}
                    </p>

                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                      <strong className="text-slate-700 font-semibold">
                        {lang === 'vi' ? 'Bảo vệ khách hàng: ' : 'Customer protection: '}
                      </strong>
                      {svc.protectionRule[lang]}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-medium text-slate-500">
                      {svc.durationNote[lang]}
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToRescue(svc.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1829] hover:text-[#EA6A12] transition-colors whitespace-nowrap"
                    >
                      {lang === 'vi' ? 'Chọn dịch vụ này' : 'Select Service'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Vetted Partner Workshops Transparency Strip */}
            <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-[#0B1829]">
                    {lang === 'vi'
                      ? 'Mạng lưới tiệm sửa xe đối tác đã thẩm định (khi sự cố vượt phạm vi sửa tại chỗ)'
                      : 'Vetted Campus-Area Partner Workshops (For Heavy Mechanical Repairs)'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === 'vi'
                      ? 'MotoFix không hứa sửa mọi hỏng hóc ngoài đường. Các ca hỏng nặng được chuyển tiếp minh bạch kèm báo giá kéo xe trước khi đi.'
                      : 'MotoFix never promises unsafe roadside fixes. Major repairs are transparently referred with agreed transfer quotes.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                {PARTNER_WORKSHOPS.map((ws) => (
                  <div key={ws.id} className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#0B1829] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#EA6A12] shrink-0" />
                        {ws.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {ws.address} · {ws.distanceNote[lang]}
                      </p>
                      <p className="text-xs text-slate-600">{ws.specialty[lang]}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-slate-500">
                        {lang === 'vi' ? 'Ước tính kéo xe' : 'Est. towing'}
                      </p>
                      <p className="font-mono text-sm font-semibold text-[#0B1829] tabular-nums">
                        {formatVnd(ws.estimatedTowVnd, lang)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: TRUST & SAFETY CONTROLS + OPTIONAL STUDENT PASS */}
        <section id="safety" className="py-16 lg:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left 7 Cols: 5 Editorial Safety Principles */}
              <div className="lg:col-span-7">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  {lang === 'vi'
                    ? 'Tiêu chuẩn vận hành & Kiểm soát an toàn'
                    : 'Operating Standards & Trust Controls'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1829] mb-8">
                  {lang === 'vi'
                    ? 'An toàn đi trước tốc độ. Minh bạch trong từng biên lai.'
                    : 'Safety before speed. Verified proof on every job.'}
                </h2>

                <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                  {safetyPrinciples.map((rule) => (
                    <div key={rule.num} className="py-5 flex items-start gap-4">
                      <span className="font-mono text-sm font-semibold text-[#EA6A12] tabular-nums pt-0.5 shrink-0">
                        {rule.num}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-[#0B1829]">{rule.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mt-1">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Voluntary Student Pass Card */}
              <div id="student-pass" className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="bg-[#0B1829] text-white rounded-xl border border-slate-800 p-6 sm:p-7 space-y-6">
                  <div>
                    <p className="text-xs text-slate-400">
                      {lang === 'vi'
                        ? 'Gói thành viên tự nguyện · Không bắt buộc khi gọi cứu hộ'
                        : 'Voluntary membership · Rescue never requires a subscription'}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight text-white mt-2">
                      Student Pass
                    </h3>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="font-mono text-3xl font-bold text-[#FB923C] tabular-nums">
                        {lang === 'vi' ? '15.000₫' : 'VND 15,000'}
                      </span>
                      <span className="text-sm text-slate-400">
                        {lang === 'vi' ? '/ tháng (giá thí điểm)' : '/ month (pilot price)'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm text-slate-200 border-t border-slate-800 pt-5">
                    {[
                      lang === 'vi'
                        ? 'Ưu tiên hàng đợi điều phối trong khung giờ trực thí điểm'
                        : 'Priority dispatch queue during staffed campus hours',
                      lang === 'vi'
                        ? 'Giảm 15% phí công cho các dịch vụ cứu hộ tiêu chuẩn'
                        : '15% member discount on standard roadside labor fees',
                      lang === 'vi'
                        ? 'Lưu trữ toàn bộ lịch sử sửa chữa & biên lai điện tử'
                        : 'Digital service history & shareable receipt archive',
                      lang === 'vi'
                        ? '01 lần kiểm tra an toàn xe cơ bản miễn phí mỗi năm tại trường'
                        : '1 complimentary annual basic campus safety inspection',
                    ].map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#FB923C] mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-slate-400 leading-relaxed pt-4 border-t border-slate-800">
                    {lang === 'vi'
                      ? 'Lưu ý minh bạch: Gói thành viên không bao gồm sửa chữa hay thay thế phụ tùng miễn phí không giới hạn. Bạn có thể gọi cứu hộ theo từng lượt mà không cần đăng ký gói.'
                      : 'Clear scope: Excludes unlimited free repairs or replacement parts. On-demand rescue is always open to non-members.'}
                  </p>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setStudentPassOpen(true)}
                      className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#EA6A12] hover:bg-[#D45B0B] rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {isStudentPassActive
                        ? lang === 'vi'
                          ? 'Xem thẻ Student Pass đang kích hoạt'
                          : 'View Active Student Pass'
                        : lang === 'vi'
                        ? 'Đăng ký trải nghiệm Student Pass'
                        : 'Try Student Pass Pilot'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET FOOTER */}
      <footer className="bg-[#081322] text-slate-400 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800/80">
            <div className="md:col-span-5 space-y-3">
              <span className="font-display text-lg font-extrabold tracking-tight text-white">
                Moto<span className="text-[#EA6A12]">Fix</span>
              </span>
              <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
                {lang === 'vi'
                  ? 'Mạng lưới cứu hộ xe máy sinh viên gần trường — Báo giá trước khi làm. Dự án khởi nghiệp (IM1021) tại Trường ĐH Bách Khoa — ĐHQG TP.HCM.'
                  : 'Student Motorcycle Roadside Assistance Network — The campus-near help desk that quotes before it works. Entrepreneurship (IM1021) at VNU-HCM University of Technology (HCMUT).'}
              </p>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs">
              <p className="font-semibold text-white">
                {lang === 'vi' ? 'Vận hành thí điểm Vùng 1' : 'Zone 1 Pilot Operations'}
              </p>
              <p>268 Lý Thường Kiệt & KTX 497 Hòa Hảo, Q.10, TP.HCM</p>
              <p className="tabular-nums">
                {lang === 'vi' ? 'Giờ trực: 06:30 – 21:30 hàng ngày' : 'Staffed hours: 06:30 – 21:30 daily'}
              </p>
              <button
                type="button"
                onClick={() => setHotlineOpen(true)}
                className="text-[#FB923C] hover:underline font-mono tabular-nums"
              >
                Hotline / Zalo: 028 3864 7256
              </button>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <p className="font-semibold text-white">
                {lang === 'vi' ? 'Điều hướng nhanh' : 'Quick Links'}
              </p>
              <div className="flex flex-col gap-1.5">
                <a href="#rescue-prototype" className="hover:text-white transition-colors">
                  {lang === 'vi' ? 'Mô phỏng đặt cứu hộ 6 bước' : '6-Step Rescue Simulator'}
                </a>
                <a href="#pricing" className="hover:text-white transition-colors">
                  {lang === 'vi' ? 'Bảng giá dịch vụ minh bạch' : 'Transparent Pricing Menu'}
                </a>
                <a href="#safety" className="hover:text-white transition-colors">
                  {lang === 'vi' ? 'Quy chuẩn an toàn & Dữ liệu cá nhân' : 'Safety & Privacy Standards'}
                </a>
                <button
                  type="button"
                  onClick={() => setSafetyModalLocation(lang === 'vi' ? 'Khu vực ĐH Bách Khoa TP.HCM' : 'HCMUT Campus Zone')}
                  className="text-left hover:text-white transition-colors"
                >
                  {lang === 'vi' ? 'Kênh bảo vệ an toàn & Khiếu nại' : 'Safety Escalation & Complaints'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © 2026 MotoFix Mobility Services · {lang === 'vi' ? 'Nguyên mẫu giao diện khách hàng (Web MVP Prototype)' : 'Customer Web MVP Prototype'}
            </p>
            <p>
              {lang === 'vi'
                ? 'Tuân thủ Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 & Nghị định 248/2026'
                : 'Designed for Vietnam Law 91/2025/QH15 & Decree 248/2026 compliance'}
            </p>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE MODALS */}
      <HotlineModal
        isOpen={hotlineOpen}
        onClose={() => setHotlineOpen(false)}
        lang={lang}
      />

      <StudentPassModal
        isOpen={studentPassOpen}
        onClose={() => setStudentPassOpen(false)}
        lang={lang}
        isPassActive={isStudentPassActive}
        onActivatePass={() => setIsStudentPassActive(true)}
      />

      <SafetyEscalationModal
        isOpen={Boolean(safetyModalLocation)}
        onClose={() => setSafetyModalLocation(null)}
        lang={lang}
        locationName={safetyModalLocation || ''}
      />
    </div>
  );
}
