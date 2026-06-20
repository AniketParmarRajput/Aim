"use client"

import React, { useState } from 'react';

const Page = () => {
  const [task,setTask]= useState("")

  const handleSave = (e) => {
  e.preventDefault();
  console.log(task);
  setTask("");
};

  return (
    <div>
      <input
      type='text'
      placeholder='enter task '
      value={task}
      onChange={(e) =>setTask(e.target.value)}
      />
      <button onClick={handleSave}>
        submit
      </button>
    </div>
  );
}

export default Page;


