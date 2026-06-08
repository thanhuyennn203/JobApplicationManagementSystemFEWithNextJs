"use client";

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-[#003d1f] via-[#005c2e] to-[#007a40] overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 border border-green-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/3 w-60 h-60 border border-green-300 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-500 rounded-full opacity-20 blur-xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Logo + Headline */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-black text-white">top<span className="text-[#7fff9a]">cv</span><span className="text-[#7fff9a] text-xs align-super">®</span></span>
              <span className="text-white/60 text-xs">Tiếp lợi thế, nối thành công</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-2" style={{ textShadow: "0 0 30px rgba(0,177,79,0.5)" }}>
              EXPLOSIVE <span className="text-[#7fff9a]">OFFERS</span>
            </h1>
            <p className="text-green-200 text-sm sm:text-base font-medium mb-3">
              Power up your business for a breakthrough
            </p>
            <p className="text-green-300/70 text-xs">
              Program from 01–30/06/2026. For details, please contact your dedicated account manager or Hotline: 1900 068 889 (ext. 1)
            </p>
          </div>

          {/* Right: Promo Cards */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Power-up Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 min-w-[180px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#00b14f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Power-up</span>
              </div>
              <p className="text-white font-semibold text-sm">Gift Package</p>
              <p className="text-white font-bold text-lg">Power-up</p>
              <p className="text-green-300 text-xs">Up to 150 million VND</p>
            </div>

            {/* Buy 1 Get 1 */}
            <div className="bg-gradient-to-br from-[#00b14f] to-[#007a40] rounded-2xl p-4 min-w-[160px] relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full" />
              <p className="text-white font-bold text-lg leading-tight mb-0.5">Buy 1</p>
              <p className="text-[#7fff9a] font-black text-xl">Get 1 FREE</p>
              <p className="text-white/80 text-xs mt-1">Top Jobs × Top Jobs</p>
            </div>

            {/* New Customer Voucher */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 min-w-[140px] text-center">
              <p className="text-white/70 text-xs mb-1">New Customer</p>
              <p className="text-white font-semibold text-sm">Voucher</p>
              <div className="mt-2 bg-[#00b14f] rounded-xl px-3 py-1">
                <span className="text-white font-black text-2xl">50%</span>
                <span className="text-white/80 text-xs"> OFF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}