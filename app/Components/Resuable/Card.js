"use Client"
import React from "react";

const Card = ({handleCards}) => {
  const cards = [
    { title: "hello", des: "I am hello1" },
    { title: "hello2", des: "I am hello2" },
    { title: "Dynamic!", des: "Cards " },
      { title: "Dynamic!", des: "Cards " }
  ];

  return (
    <div className="w-full  p-4 border-3 border-red-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((item, index) => (
          <div key={index} className=" w-96 p-3 border rounded shadow" onClick={() =>handleCards(item)} >
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="text-gray-600">{item.des}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;


