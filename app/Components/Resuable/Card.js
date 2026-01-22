
import Image from "next/image";
import React from "react";

const Card = ({
  title,
  value,
  icon,
  onClick,
  showImageOnNoValue = false,
  noValueImage,

}) => {
  return (
    <div
      onClick={onClick}
      className="flex h-[110px] w-full cursor-pointer flex-col justify-between rounded-lg bg-white p-4 shadow-md transition-all hover:scale-105 hover:bg-gray-50 hover:shadow-lg hover:ring-2 hover:ring-blue-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col justify-between gap-4">
          <h3 className="md: h-8 text-sm font-medium text-gray-500">{title}</h3>
          {value !== undefined && value !== null ? (
            <p className="text-base font-semibold">{value}</p>
          ) : showImageOnNoValue && noValueImage ? (
            <Image src={noValueImage} alt={title} width={30} height={30} />
          ) : (
            <p className="text-base font-semibold">NA</p>
          )}
        </div>
        <div className="animate__animated animate__pulse animate__infinite animate__slow rounded-full bg-blue-100 p-3 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Card;
