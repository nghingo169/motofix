import React from 'react';
import {
  CAMPUS_LOCATIONS,
  PARTNER_WORKSHOPS,
  STAGING_POINT,
  type CampusLocation,
  type Language,
} from '../data/motofixData';

interface CampusMapProps {
  lang: Language;
  selectedLocation: CampusLocation;
  onSelectLocation: (loc: CampusLocation) => void;
  responderProgress: number; // 0 to 1 (0 = at staging point, 1 = arrived at customer)
  isDispatchActive: boolean;
  interactive: boolean;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  lang,
  selectedLocation,
  onSelectLocation,
  responderProgress,
  isDispatchActive,
  interactive,
}) => {
  // Compute responder animated position along an L-shaped campus road path from staging point to selected pin
  const midX = selectedLocation.mapX;
  const midY = STAGING_POINT.mapY;

  let respX = STAGING_POINT.mapX;
  let respY = STAGING_POINT.mapY;

  if (isDispatchActive && selectedLocation.inGeofence) {
    if (responderProgress <= 0.5) {
      const t = responderProgress / 0.5;
      respX = STAGING_POINT.mapX + (midX - STAGING_POINT.mapX) * t;
      respY = STAGING_POINT.mapY + (midY - STAGING_POINT.mapY) * t;
    } else {
      const t = (responderProgress - 0.5) / 0.5;
      respX = midX + (selectedLocation.mapX - midX) * t;
      respY = midY + (selectedLocation.mapY - midY) * t;
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0B1829] text-white rounded-xl border border-slate-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800/90 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {lang === 'vi'
              ? 'Bản đồ vùng phục vụ 1.5 km — Khu vực ĐH Bách Khoa'
              : '1.5 km Campus Geofence — HCMUT Pilot Zone'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'vi'
              ? 'Giờ trực thí điểm: 06:30 – 21:30 · Chọn điểm ghim trên bản đồ để kiểm tra ETA'
              : 'Staffed pilot hours: 06:30 – 21:30 · Select a campus pin to check live ETA'}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono text-xs text-slate-300 tabular-nums">
            {selectedLocation.inGeofence
              ? `${selectedLocation.distanceKm.toFixed(2)} km`
              : `${selectedLocation.distanceKm.toFixed(1)} km`}
          </span>
        </div>
      </div>

      {/* Crisp Architectural Campus Vector Map */}
      <div className="relative flex-1 min-h-[300px] sm:min-h-[340px] bg-[#081322]">
        <svg
          viewBox="0 0 500 340"
          className="w-full h-full object-cover select-none"
          role="img"
          aria-label={
            lang === 'vi'
              ? 'Bản đồ vùng cứu hộ 1.5 km quanh Đại học Bách Khoa TP.HCM'
              : '1.5 km rescue coverage map around HCMUT campus'
          }
        >
          {/* Subtle campus urban block grid */}
          <defs>
            <pattern id="campus-grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke="#142640"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>
          <rect width="500" height="340" fill="url(#campus-grid)" />

          {/* Campus Grounds & Dormitory Footprints */}
          <rect
            x="220"
            y="108"
            width="106"
            height="72"
            rx="4"
            fill="#122844"
            stroke="#24426B"
            strokeWidth="1"
          />
          <text x="273" y="142" textAnchor="middle" fill="#8FB3DC" fontSize="9.5" fontWeight="600">
            ĐH BÁCH KHOA
          </text>
          <text x="273" y="154" textAnchor="middle" fill="#6483A8" fontSize="7.5">
            HCMUT Campus
          </text>

          <rect
            x="118"
            y="224"
            width="78"
            height="48"
            rx="4"
            fill="#122844"
            stroke="#24426B"
            strokeWidth="1"
          />
          <text x="157" y="246" textAnchor="middle" fill="#8FB3DC" fontSize="8.5" fontWeight="600">
            KTX BÁCH KHOA
          </text>
          <text x="157" y="258" textAnchor="middle" fill="#6483A8" fontSize="7.5">
            497 Hòa Hảo
          </text>

          {/* Major District 10 Street Arteries */}
          {/* Lý Thường Kiệt (diagonal vertical corridor) */}
          <path
            d="M 192 10 L 248 330"
            stroke="#1E3657"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 192 10 L 248 330"
            stroke="#2C4A73"
            strokeWidth="1"
            strokeDasharray="4 4"
            fill="none"
          />
          {/* Tô Hiến Thành */}
          <path
            d="M 60 118 L 485 118"
            stroke="#1E3657"
            strokeWidth="7"
            fill="none"
          />
          {/* 3 Tháng 2 / Hòa Hảo */}
          <path
            d="M 30 248 L 480 222"
            stroke="#1E3657"
            strokeWidth="6.5"
            fill="none"
          />
          {/* Thành Thái */}
          <path
            d="M 340 20 L 372 330"
            stroke="#1E3657"
            strokeWidth="6.5"
            fill="none"
          />

          {/* Road Name Labels */}
          <text
            x="208"
            y="78"
            fill="#567396"
            fontSize="8"
            transform="rotate(79, 208, 78)"
            letterSpacing="0.06em"
          >
            LÝ THƯỜNG KIỆT
          </text>
          <text x="92" y="112" fill="#567396" fontSize="8" letterSpacing="0.05em">
            TÔ HIẾN THÀNH
          </text>
          <text x="64" y="242" fill="#567396" fontSize="8" letterSpacing="0.05em">
            HÒA HẢO
          </text>
          <text
            x="362"
            y="292"
            fill="#567396"
            fontSize="8"
            transform="rotate(-84, 362, 292)"
            letterSpacing="0.05em"
          >
            THÀNH THÁI
          </text>

          {/* 1.5 km Micro-Zone Geofence Boundary */}
          <circle
            cx={STAGING_POINT.mapX}
            cy={STAGING_POINT.mapY}
            r="142"
            fill="#EA6A12"
            fillOpacity="0.055"
            stroke="#EA6A12"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />
          <text
            x={STAGING_POINT.mapX - 96}
            y={STAGING_POINT.mapY - 118}
            fill="#F59E56"
            fontSize="8.5"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="600"
          >
            R = 1.5 KM GEOFENCE
          </text>

          {/* Active Dispatch Route Line */}
          {selectedLocation.inGeofence && (
            <polyline
              points={`${STAGING_POINT.mapX},${STAGING_POINT.mapY} ${midX},${midY} ${selectedLocation.mapX},${selectedLocation.mapY}`}
              fill="none"
              stroke={isDispatchActive ? '#F97316' : '#64748B'}
              strokeWidth={isDispatchActive ? '2.5' : '1.5'}
              strokeDasharray={isDispatchActive ? '0' : '4 4'}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Out-of-zone warning dashed connector */}
          {!selectedLocation.inGeofence && (
            <line
              x1={STAGING_POINT.mapX}
              y1={STAGING_POINT.mapY}
              x2={selectedLocation.mapX}
              y2={selectedLocation.mapY}
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Vetted Partner Workshops (Small Slate Squares) */}
          {PARTNER_WORKSHOPS.map((ws) => (
            <g key={ws.id} transform={`translate(${ws.mapX}, ${ws.mapY})`}>
              <rect
                x="-5"
                y="-5"
                width="10"
                height="10"
                rx="2"
                fill="#1E293B"
                stroke="#94A3B8"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="-9"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="7"
              >
                {ws.name.replace('Tiệm sửa xe đối tác ', 'Đối tác ').replace('Trung tâm đối tác ', 'Đối tác ')}
              </text>
            </g>
          ))}

          {/* Permitted Staging Point */}
          <g transform={`translate(${STAGING_POINT.mapX}, ${STAGING_POINT.mapY})`}>
            <circle r="7" fill="#0B1829" stroke="#FFFFFF" strokeWidth="2" />
            <circle r="2.8" fill="#EA6A12" />
            <text
              x="0"
              y="18"
              textAnchor="middle"
              fill="#E2E8F0"
              fontSize="7.5"
              fontWeight="600"
            >
              {lang === 'vi' ? 'Trạm trực MotoFix' : 'Staging Point'}
            </text>
          </g>

          {/* Clickable Campus Locations */}
          {CAMPUS_LOCATIONS.map((loc) => {
            const isSelected = loc.id === selectedLocation.id;
            const fillColor = !loc.inGeofence
              ? isSelected
                ? '#DC2626'
                : '#7F1D1D'
              : isSelected
              ? '#EA6A12'
              : '#334155';

            return (
              <g
                key={loc.id}
                transform={`translate(${loc.mapX}, ${loc.mapY})`}
                onClick={() => interactive && onSelectLocation(loc)}
                className={interactive ? 'cursor-pointer' : ''}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
                onKeyDown={(e) => {
                  if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectLocation(loc);
                  }
                }}
                aria-label={loc.name[lang]}
              >
                {isSelected && (
                  <circle
                    r="13"
                    fill={loc.inGeofence ? '#EA6A12' : '#EF4444'}
                    fillOpacity="0.24"
                  />
                )}
                <circle
                  r={isSelected ? '6.5' : '5'}
                  fill={fillColor}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? '2' : '1.2'}
                />
                <text
                  x={loc.mapX > 380 ? -10 : 10}
                  y="3"
                  textAnchor={loc.mapX > 380 ? 'end' : 'start'}
                  fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                  fontSize={isSelected ? '8.5' : '7.5'}
                  fontWeight={isSelected ? '700' : '500'}
                >
                  {loc.id === 'hcmut_gate1'
                    ? 'Cổng 1 BK'
                    : loc.id === 'ktx_bk'
                    ? 'KTX BK'
                    : loc.id === 'hcmut_tht'
                    ? 'Cổng Tô Hiến Thành'
                    : loc.id === 'ltk_tt'
                    ? 'LTK – Thành Thái'
                    : lang === 'vi'
                    ? 'Ngoài 1.5km'
                    : 'Outside 1.5km'}
                </text>
              </g>
            );
          })}

          {/* Moving Responder Marker when Dispatch is Active */}
          {isDispatchActive && selectedLocation.inGeofence && (
            <g
              transform={`translate(${respX}, ${respY})`}
              style={{ transition: 'transform 180ms linear' }}
            >
              <rect
                x="-11"
                y="-11"
                width="22"
                height="22"
                rx="11"
                fill="#EA6A12"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <text
                x="0"
                y="3.5"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                MF
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Crisp Footer Legend & Active Location Telemetry */}
      <div className="px-5 py-3.5 bg-[#081322] border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA6A12] inline-block" />
            {lang === 'vi' ? 'Vị trí xe bạn' : 'Your location'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-white bg-[#0B1829] inline-block" />
            {lang === 'vi' ? 'Trạm trực' : 'Staging point'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] border border-slate-400 bg-slate-800 inline-block" />
            {lang === 'vi' ? 'Tiệm đối tác' : 'Partner shop'}
          </span>
        </div>

        <div className="font-mono text-xs tabular-nums text-slate-200">
          {selectedLocation.inGeofence ? (
            <span>
              ETA: <strong className="text-[#FB923C]">{selectedLocation.etaMin}–{selectedLocation.etaMax} {lang === 'vi' ? 'phút' : 'min'}</strong>
            </span>
          ) : (
            <span className="text-red-400 font-medium">
              {lang === 'vi' ? 'Ngoài vùng 1.5 km · Cần báo giá riêng' : 'Outside 1.5 km · Referral required'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
