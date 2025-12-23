"use client";
import React, { useState, useCallback } from "react";

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () =>{
    console.log("Clicked");
  }

  return (
    <>
      <button className="text-red-500"onClick={() => setCount(count + 1)}>Increase</button>
      <Child onClick={handleClick} />
      {count}
    </>
  );
}

const Child = React.memo(function Child({ onClick }) {
  console.log("Child rendered");
  return <button className="text-red-500" onClick={onClick}>Child Button</button>;
});

export default Parent;





