export type Language = 'vi' | 'en';

export type ServiceId = 'tire_plug' | 'battery_jump' | 'fuel_coord' | 'workshop_tow';

export type VehicleType = 'scooter' | 'underbone' | 'manual' | 'electric';

export interface ServiceOption {
  id: ServiceId;
  priceVnd: number | null;
  priceDisplay: { vi: string; en: string };
  title: { vi: string; en: string };
  shortLabel: { vi: string; en: string };
  durationNote: { vi: string; en: string };
  scopeNote: { vi: string; en: string };
  protectionRule: { vi: string; en: string };
  evidenceLabel: { vi: string; en: string };
  evidenceResult: { vi: string; en: string };
  optionalAddon: {
    name: { vi: string; en: string };
    priceVnd: number;
    reason: { vi: string; en: string };
  };
}

export interface CampusLocation {
  id: string;
  name: { vi: string; en: string };
  address: string;
  distanceKm: number;
  etaMin: number;
  etaMax: number;
  inGeofence: boolean;
  mapX: number; // SVG coordinate 0-500
  mapY: number; // SVG coordinate 0-380
}

export interface ResponderProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  badgeId: string;
  vehiclePlate: string;
  vehicleModel: string;
  photo: string;
  completedJobs: number;
  rating: number;
  certifications: { vi: string; en: string };
}

export interface PartnerWorkshop {
  id: string;
  name: string;
  address: string;
  distanceNote: { vi: string; en: string };
  specialty: { vi: string; en: string };
  estimatedTowVnd: number;
  mapX: number;
  mapY: number;
}

export const HERO_IMAGE_PATH = '/src/assets/images/hero_campus_rescue_1795667026487.jpg';

export const SERVICES: ServiceOption[] = [
  {
    id: 'tire_plug',
    priceVnd: 30000,
    priceDisplay: { vi: '30.000₫', en: 'VND 30,000' },
    title: {
      vi: 'Vá lốp không săm đủ điều kiện',
      en: 'Eligible tubeless puncture plug',
    },
    shortLabel: { vi: 'Vá lốp không săm', en: 'Tubeless Tire Plug' },
    durationNote: { vi: '10–15 phút tại chỗ', en: '10–15 min on-site' },
    scopeNote: {
      vi: 'Kiểm tra tình trạng lốp trước; chỉ vá các vết đâm an toàn trên mặt lốp (tread). Không vá thành lốp (sidewall) hoặc vị trí giao thông nguy hiểm.',
      en: 'Inspect first; plug only a repairable tread puncture. No sidewall repair or unsafe roadside work.',
    },
    protectionRule: {
      vi: 'Nếu vết rách không đủ điều kiện vá an toàn, KTV sẽ giải thích rõ và chuyển phương án tiệm đối tác/kéo xe — bạn có quyền từ chối không mất phí.',
      en: 'If unsuitable for a safe plug, the responder explains why and offers a vetted workshop referral or towing — decline with zero fee.',
    },
    evidenceLabel: {
      vi: 'Áp suất lốp sau kiểm tra & bơm chuẩn',
      en: 'Post-service tire pressure & tread check',
    },
    evidenceResult: {
      vi: 'Trước: 0.4 bar (đinh 3mm mặt lốp) → Sau: 2.25 bar (kín khí 100%)',
      en: 'Before: 0.4 bar (3mm tread nail) → After: 2.25 bar (verified airtight)',
    },
    optionalAddon: {
      name: { vi: 'Thay chân van lốp không săm (giá gốc vật tư)', en: 'Tubeless valve stem replacement (at cost)' },
      priceVnd: 20000,
      reason: {
        vi: 'Phát hiện chân van cao su bị nứt gây xì chậm sau khi bơm thử.',
        en: 'Cracked rubber valve stem detected causing slow air leak during pressure check.',
      },
    },
  },
  {
    id: 'battery_jump',
    priceVnd: 40000,
    priceDisplay: { vi: '40.000₫', en: 'VND 40,000' },
    title: {
      vi: 'Kích bình ắc quy di động',
      en: 'Portable battery jump-start',
    },
    shortLabel: { vi: 'Kích bình ắc quy', en: 'Battery Jump-Start' },
    durationNote: { vi: '10–15 phút tại chỗ', en: '10–15 min on-site' },
    scopeNote: {
      vi: 'Xác nhận đúng cực bình và thông số điện áp xe (hỗ trợ cả xe ga, xe số & kiểm tra điện cơ bản xe máy điện). Không ép khởi động nếu mạch điện mất an toàn.',
      en: 'Confirm battery polarity and vehicle requirements; no forced start where the condition is unsafe.',
    },
    protectionRule: {
      vi: 'Không tự ý thay bình mới. Nếu bình chai hoàn toàn không tích điện, việc thay bình yêu cầu báo giá vật tư riêng và bạn bấm xác nhận.',
      en: 'No unauthorized battery swap. Replacement requires a separate itemized parts quote and explicit approval.',
    },
    evidenceLabel: {
      vi: 'Đo điện áp ắc quy & dòng sạc thực tế',
      en: 'Battery voltage & charging check',
    },
    evidenceResult: {
      vi: 'Trước: 9.8V (không đề được) → Sau kích nổ & nổ máy: 13.4V ổn định',
      en: 'Before: 9.8V (no crank) → Post-jump running: 13.4V stable',
    },
    optionalAddon: {
      name: { vi: 'Vệ sinh cọc bình & thay cầu chì 15A (giá gốc)', en: 'Terminal cleaning & 15A fuse (at cost)' },
      priceVnd: 15000,
      reason: {
        vi: 'Cầu chì phụ bị đứt sau khi kiểm tra đồng hồ đo điện.',
        en: 'Secondary 15A fuse found blown during voltage inspection.',
      },
    },
  },
  {
    id: 'fuel_coord',
    priceVnd: 25000,
    priceDisplay: { vi: '25.000₫ phí điều phối', en: 'VND 25,000 fee' },
    title: {
      vi: 'Điều phối trạm xăng khẩn cấp',
      en: 'Emergency fuel-station coordination',
    },
    shortLabel: { vi: 'Hỗ trợ hết xăng', en: 'Fuel Coordination' },
    durationNote: { vi: 'Điều phối nhanh < 15 phút', en: 'Coordinated < 15 min' },
    scopeNote: {
      vi: 'Trong giai đoạn thí điểm, MotoFix không vận chuyển hay tự rót xăng ngoài đường để đảm bảo an toàn PCCC. Chúng tôi điều phối đưa xe đến trạm xăng gần nhất đang mở.',
      en: 'During the pilot, MotoFix does not transport or dispense fuel. We guide you to the nearest open station or coordinate safe towing.',
    },
    protectionRule: {
      vi: 'Tiền xăng được bạn thanh toán trực tiếp tại cây xăng có hóa đơn bán lẻ. Phí 25.000₫ của MotoFix chỉ tính cho công điều phối và hỗ trợ di chuyển.',
      en: 'Fuel is purchased and dispensed directly at the retailer with a station receipt. The VND 25,000 fee covers coordination only.',
    },
    evidenceLabel: {
      vi: 'Xác nhận bàn giao tại trạm xăng đối chiếu',
      en: 'Station arrival & retailer receipt confirmation',
    },
    evidenceResult: {
      vi: 'Đã đưa xe an toàn đến Cửa hàng xăng dầu Petrolimex Lý Thường Kiệt (450m)',
      en: 'Safely assisted to Petrolimex Ly Thuong Kiet Station (450m) — fuel paid directly to station',
    },
    optionalAddon: {
      name: { vi: 'Hỗ trợ đẩy/kéo đoạn dốc hầm xe KTX', en: 'Dormitory basement ramp assistance' },
      priceVnd: 10000,
      reason: {
        vi: 'Xe hết xăng ở tầng hầm B2 cần 2 người hỗ trợ đưa lên mặt đường an toàn.',
        en: 'Vehicle stranded in B2 basement requiring assisted ramp transfer.',
      },
    },
  },
  {
    id: 'workshop_tow',
    priceVnd: null,
    priceDisplay: { vi: 'Báo giá trước khi điều phối', en: 'Quote before dispatch' },
    title: {
      vi: 'Giới thiệu tiệm đối tác / Kéo xe',
      en: 'Vetted workshop referral / towing',
    },
    shortLabel: { vi: 'Tiệm đối tác / Kéo xe', en: 'Workshop / Towing' },
    durationNote: { vi: 'Báo giá trước trong 3 phút', en: 'Quoted within 3 min' },
    scopeNote: {
      vi: 'Dành cho lỗi động cơ, đứt dây curoa, rách lốp có săm hoặc hỏng hóc ngoài phạm vi sửa tại chỗ. Kết nối tiệm sửa xe đối tác đã thẩm định quanh trường.',
      en: 'For major mechanical issues, snapped belts, torn inner tubes, or unsafe roadside conditions. Connects you with vetted campus-area workshops.',
    },
    protectionRule: {
      vi: 'Công khai rõ tên tiệm, địa chỉ, ước tính chi phí kéo xe và mọi khoản hoa hồng giới thiệu (nếu có). Chỉ đặt lịch khi bạn đồng ý.',
      en: 'Provider name, destination, expected charge, and any referral fee are disclosed upfront. Consent required before booking.',
    },
    evidenceLabel: {
      vi: 'Bàn giao xe cho tiệm sửa chữa đã thẩm định',
      en: 'Verified workshop handover log',
    },
    evidenceResult: {
      vi: 'Đã bàn giao tại Tiệm đối tác Minh Tâm (312 Lý Thường Kiệt) — Kèm phiếu tiếp nhận minh bạch',
      en: 'Handed over to Minh Tam Partner Workshop (312 Ly Thuong Kiet) with itemized intake slip',
    },
    optionalAddon: {
      name: { vi: 'Hỗ trợ giữ đồ/mũ bảo hiểm gửi về văn phòng trực', en: 'Helmet / bag safekeeping coordination' },
      priceVnd: 0,
      reason: {
        vi: 'Hỗ trợ miễn phí cho sinh viên cần quay lại phòng thi kịp giờ.',
        en: 'Complimentary support so students can make it to class or exams on time.',
      },
    },
  },
];

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'hcmut_gate1',
    name: { vi: 'Cổng 1 ĐH Bách Khoa (268 Lý Thường Kiệt)', en: 'HCMUT Gate 1 (268 Ly Thuong Kiet)' },
    address: '268 Lý Thường Kiệt, P.14, Q.10',
    distanceKm: 0.35,
    etaMin: 6,
    etaMax: 9,
    inGeofence: true,
    mapX: 245,
    mapY: 162,
  },
  {
    id: 'ktx_bk',
    name: { vi: 'Bãi xe KTX Bách Khoa (497 Hòa Hảo)', en: 'HCMUT Dormitory Parking (497 Hoa Hao)' },
    address: '497 Hòa Hảo, P.7, Q.10',
    distanceKm: 0.65,
    etaMin: 8,
    etaMax: 11,
    inGeofence: true,
    mapX: 165,
    mapY: 248,
  },
  {
    id: 'hcmut_tht',
    name: { vi: 'Cổng Tô Hiến Thành — ĐH Bách Khoa', en: 'To Hien Thanh Gate — HCMUT' },
    address: 'Tô Hiến Thành, P.14, Q.10',
    distanceKm: 0.8,
    etaMin: 9,
    etaMax: 12,
    inGeofence: true,
    mapX: 315,
    mapY: 118,
  },
  {
    id: 'ltk_tt',
    name: { vi: 'Ngã tư Lý Thường Kiệt – Thành Thái', en: 'Ly Thuong Kiet – Thanh Thai Junction' },
    address: 'Giao lộ Lý Thường Kiệt & Thành Thái, Q.10',
    distanceKm: 1.15,
    etaMin: 11,
    etaMax: 14,
    inGeofence: true,
    mapX: 358,
    mapY: 222,
  },
  {
    id: 'outside_zone',
    name: { vi: 'Vòng xoay Dân Chủ (Ngoài vùng 1.5 km)', en: 'Dan Chu Roundabout (Outside 1.5 km zone)' },
    address: 'Cách mạng Tháng 8, Q.3 (2.4 km từ trạm trực)',
    distanceKm: 2.4,
    etaMin: 22,
    etaMax: 30,
    inGeofence: false,
    mapX: 454,
    mapY: 64,
  },
];

export const STAGING_POINT = {
  name: { vi: 'Trạm trực MotoFix (Vùng 1)', en: 'MotoFix Staging Point (Zone 1)' },
  address: 'Hẻm 268 Lý Thường Kiệt (được cấp phép)',
  mapX: 256,
  mapY: 192,
};

export const PARTNER_WORKSHOPS: PartnerWorkshop[] = [
  {
    id: 'ws_minhtam',
    name: 'Tiệm sửa xe đối tác Minh Tâm',
    address: '312 Lý Thường Kiệt, Q.10',
    distanceNote: { vi: 'Cách cổng 1 khoảng 400m', en: '400m from Gate 1' },
    specialty: { vi: 'Sửa động cơ, thay lốp có săm/không săm, điện xe ga', en: 'Engine, full tire replacement, scooter electrical' },
    estimatedTowVnd: 55000,
    mapX: 215,
    mapY: 122,
  },
  {
    id: 'ws_thanhdat',
    name: 'Trung tâm đối tác Thành Đạt',
    address: '158 Tô Hiến Thành, Q.10',
    distanceNote: { vi: 'Cách cổng Tô Hiến Thành 500m', en: '500m from To Hien Thanh Gate' },
    specialty: { vi: 'Thay ắc quy chính hãng, phanh, chẩn đoán xe máy điện', en: 'OEM batteries, brakes, electric two-wheeler diagnostics' },
    estimatedTowVnd: 65000,
    mapX: 352,
    mapY: 156,
  },
];

export const RESPONDERS: Record<'male' | 'female', ResponderProfile> = {
  male: {
    id: 'resp_duc',
    name: 'Nguyễn Minh Đức',
    gender: 'male',
    badgeId: 'MF-Z1-024',
    vehiclePlate: '59-X1 402.18',
    vehicleModel: 'Honda Wave RSX — Xe trực cứu hộ',
    photo: '/src/assets/images/responder_portrait_nam_1795667027342.jpg',
    completedJobs: 148,
    rating: 4.9,
    certifications: {
      vi: 'Đã xác minh lý lịch · Tập huấn an toàn điện & vá lốp chuẩn',
      en: 'ID verified · Trained in electrical safety & tread plug SOPs',
    },
  },
  female: {
    id: 'resp_mai',
    name: 'Nguyễn Thị Mai',
    gender: 'female',
    badgeId: 'MF-Z1-018',
    vehiclePlate: '59-P2 819.04',
    vehicleModel: 'Honda Vision — Xe trực cứu hộ',
    photo: '/src/assets/images/responder_portrait_linh_1795667027497.jpg',
    completedJobs: 112,
    rating: 5.0,
    certifications: {
      vi: 'KTV nữ chuyên trách · Đã xác minh lý lịch & quy trình an toàn',
      en: 'Women-safe responder · ID verified & safety SOP certified',
    },
  },
};

export const VEHICLE_LABELS: Record<VehicleType, { vi: string; en: string }> = {
  scooter: { vi: 'Xe tay ga', en: 'Scooter' },
  underbone: { vi: 'Xe số', en: 'Underbone' },
  manual: { vi: 'Xe côn tay', en: 'Manual' },
  electric: { vi: 'Xe máy điện', en: 'Electric 2W' },
};

export const formatVnd = (amount: number, lang: Language): string => {
  const formatted = amount.toLocaleString('vi-VN');
  return lang === 'vi' ? `${formatted}₫` : `VND ${amount.toLocaleString('en-US')}`;
};
