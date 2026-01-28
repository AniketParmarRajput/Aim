import Image from "next/image";
import React from "react";

const Card = ({
  title,
  value,
  icon,
  onClick,
   item,
  handleAction,
  showImageOnNoValue = false,
  noValueImage,
}) => {
  console.log(handleAction)
  return (
    <div
      onClick={onClick}
      className="flex h-[320px] w-[270px] cursor-pointer flex-col justify-between rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image / Icon Section */}
      <div className="flex h-[180px] items-center justify-center rounded-xl bg-slate-100">
        {icon}
      </div>

      {/* Title / Value */}
      <div className="mt-3 flex justify-between">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {value !== undefined && (
          <p className="text-sm text-slate-500">{value}</p>
        )}
        <div>
          <p className="flex-1    py-2 text-sm font-medium text-blue-600 underline ">
         view details
        </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <button  className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700"  onClick={() => handleAction("addToCart", "add")}>
          Add to Cart
        </button>
        <button className="flex-1 rounded-lg bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-800"  onClick={() => handleAction("buyNow", "buy")}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Card;

