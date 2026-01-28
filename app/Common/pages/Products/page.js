"use client"
import Card from '@/app/Components/Resuable/Card';
import Products from '@/app/Components/Resuable/ProductCards';
// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
//  import { increment,decrement,rest } from '@/Redux/feacture/counterSlice';

// const Page = () => {
//   const count =useSelector((state) =>(state.counter.value))
//    const dispatch=useDispatch();
//   return (
//     <div>
//      {count}
//      <button onClick={() =>dispatch(increment())}>in</button>
//     </div>
//   );
// }

// export default Page;
import React from 'react';

const page = () => {
  const tittle =["menu1","menu2","menu3", "menu4"];
  const handlecard=(item) =>{
    alert(item)
  }
  const handleProductAction=(actionType,type) =>{
    if(actionType==="addToCart"){
      console.log(type)
     alert("Adding to cart: " + type);
    }
    else   {
    alert("Buying now:" + type);
    // your buy-now logic
  }
  }
  return (
    <div className='m-5'>

   <h1 className='flex justify-center font-bold'>Products List</h1>
    <div className='flex gap-5 p-7'>
     {tittle.map((item,index) =>(
      <Products key={index} title={item} 
      onClick={() =>handlecard(item)}
      handleAction={handleProductAction}
      />
     ))}
    </div>
     </div>
  );
}

export default page;

