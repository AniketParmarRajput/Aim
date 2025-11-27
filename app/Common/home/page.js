"use client"
import React from "react";
import Card from "@/app/Components/Resuable/Card";

const Home = () => {
   const handle = (item) => {
    alert(`You clicked: ${item.title}`);
  };
  return (
    <>
      <Card handleCards={handle} />
    </>
  );
};

export default Home;
