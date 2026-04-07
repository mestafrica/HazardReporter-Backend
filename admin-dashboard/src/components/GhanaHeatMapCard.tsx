const GhanaHeatMapCard = () => {
  return (
    <div className="self-start rounded-2xl bg-white p-2 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800">
          Hazard Distribution
        </h3>
      </div>

      <div className="flex items-center justify-center">
        <svg
          viewBox="0 0 220 320"
          className="h-[190px] w-full max-w-[145px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heatA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="30%" stopColor="#fb923c" />
              <stop offset="60%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            <filter id="blurPatch">
              <feGaussianBlur stdDeviation="7" />
            </filter>

            <clipPath id="ghanaClip">
              <path d="M91 12c10 0 22 4 28 15 4 8 12 16 20 24 9 10 10 20 9 31-1 9-3 16 3 24 11 16 11 30 0 44-10 13-7 24-4 37 4 18 6 36 2 52-4 16-1 30 4 44 5 15 4 29-7 40-10 10-23 11-36 9-11-2-20 2-30 7-14 8-28 7-41-3-12-9-21-22-19-38 2-13-1-24-8-35-11-16-12-35-4-53 7-16 7-31 3-47-4-17-3-32 8-46 12-16 17-32 11-52-5-16 2-28 17-35 10-5 19-11 28-18 5-3 10-5 16-5z" />
            </clipPath>
          </defs>

          <path
            d="M91 12c10 0 22 4 28 15 4 8 12 16 20 24 9 10 10 20 9 31-1 9-3 16 3 24 11 16 11 30 0 44-10 13-7 24-4 37 4 18 6 36 2 52-4 16-1 30 4 44 5 15 4 29-7 40-10 10-23 11-36 9-11-2-20 2-30 7-14 8-28 7-41-3-12-9-21-22-19-38 2-13-1-24-8-35-11-16-12-35-4-53 7-16 7-31 3-47-4-17-3-32 8-46 12-16 17-32 11-52-5-16 2-28 17-35 10-5 19-11 28-18 5-3 10-5 16-5z"
            fill="url(#heatA)"
            stroke="#f8fafc"
            strokeWidth="5"
          />

          <g clipPath="url(#ghanaClip)" filter="url(#blurPatch)" opacity="0.9">
            <circle cx="62" cy="65" r="26" fill="#fde047" />
            <circle cx="116" cy="84" r="34" fill="#fb923c" />
            <circle cx="142" cy="144" r="40" fill="#ef4444" />
            <circle cx="82" cy="178" r="44" fill="#f97316" />
            <circle cx="132" cy="232" r="34" fill="#dc2626" />
            <circle cx="70" cy="270" r="30" fill="#fb923c" />
            <circle cx="164" cy="274" r="28" fill="#b91c1c" />
          </g>
        </svg>
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 px-3 py-3 text-[10px] text-slate-700">
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Regional Hotspot
        </p>

        <div className="flex items-center justify-between">
          <span>High</span>
          <span className="text-red-500">Red</span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span>Moderate</span>
          <span className="text-orange-500">Moderate</span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span>Low</span>
          <span className="text-amber-500">Low</span>
        </div>
      </div>
    </div>
  );
};

export default GhanaHeatMapCard;