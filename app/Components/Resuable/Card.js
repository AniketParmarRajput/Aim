import React from "react";

const Card = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = "bg-indigo-50",
  onClick,
  active = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col justify-between w-full cursor-pointer
        rounded-2xl bg-brand-light p-4.5 transition-all duration-200
        border-[1.5px] hover:-translate-y-0.5
        hover:shadow-[0_6px_24px_rgba(99,102,241,0.12)]
        ${active
          ? "border-indigo-400 shadow-[0_6px_24px_rgba(99,102,241,0.15)]"
          : "border-[#e4e8f4] hover:border-indigo-200"
        }
      `}
    >
      {/* Top row — icon + arrow */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-10 h-10 rounded-[11px] flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[13px] transition-all group-hover:bg-indigo-50 group-hover:text-indigo-500">
          →
        </div>
      </div>

      {/* Bottom — value or title + subtitle */}
      {value !== undefined && value !== null ? (
        <>
          <p className="text-[22px] font-bold text-gray-900 leading-tight">{value}</p>
          <p className="text-[12px] text-gray-400 mt-0.5">{subtitle || title}</p>
        </>
      ) : (
        <>
          <p className="text-[15px] font-700 font-bold text-gray-900">{title}</p>
          {subtitle && <p className="text-[12px] text-gray-400 mt-0.5">{subtitle}</p>}
        </>
      )}
    </div>
  );
};

export default Card;
