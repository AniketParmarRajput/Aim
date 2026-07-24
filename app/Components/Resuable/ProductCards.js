import React, { useState } from "react";

const Card = ({
  title,
  value,
  icon,
  onClick,
   item,
  handleAction,
  showImageOnNoValue = false,
  noValueImage,
  onClick1
}) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    handleAction("addToCart", "add");
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div
      onClick={onClick}
      className="group flex h-80 w-67.5 cursor-pointer flex-col justify-between rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative flex h-45 items-center justify-center rounded-xl bg-slate-100 overflow-hidden">
        {noValueImage && showImageOnNoValue ? (
          <img src={noValueImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          icon
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {added ? (
            <div className="text-center text-white text-[11px] font-medium py-1.5">Added ✓</div>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 rounded-full bg-blue-600 py-1.5 text-[11px] font-medium text-white transition hover:bg-blue-700">Add to cart</button>
              <button onClick={(e) => { e.stopPropagation(); handleAction("buyNow", "buy"); }} className="flex-1 rounded-full bg-slate-900 py-1.5 text-[11px] font-medium text-white transition hover:bg-slate-800">Buy now</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-between">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {value !== undefined && (
          <p className="text-sm text-slate-500">{value}</p>
        )}
        <div>
          <p className="flex-1 py-2 text-sm font-medium text-blue-600 underline" onClick={onClick1}>
         view details
        </p>
        </div>
      </div>
    </div>
  );
};

export default Card;

