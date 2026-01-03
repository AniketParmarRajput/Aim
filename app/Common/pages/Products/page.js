"use client"
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
 import { increment,decrement,rest } from '@/Redux/feacture/counterSlice';

const Page = () => {
  const count =useSelector((state) =>(state.counter.value))
   const dispatch=useDispatch();
  return (
    <div>
     {count}
     <button onClick={() =>dispatch(increment())}>in</button>
    </div>
  );
}

export default Page;
