import React from "react";

const Card = () => {
  const cards = [
    { title: "hello", des: "I am hello1" },
    { title: "hello2", des: "I am hello2" },
    { title: "Dynamic!", des: "Cards can be added anytime" },
  ];

  return (
    <div className="w-full border-2 border-red-500 p-4">
      <div className="flex justify-between w-1/2 gap-4 flex-wrap">
        {cards.map((item, index) => (
          <div key={index} className="p-3 border rounded shadow">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="text-gray-600">{item.des}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;


