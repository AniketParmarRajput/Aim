"use client"
import React, { useState } from 'react'
// import { FixedSizeList as List } from "react-window";

const Page = () => {
  const [index,setindex]=useState(0);
    const users=["aniket", "tushar", "vinay", "vinit"]
    // const users= Array.from(
    //   {length:100000000},(_,i) =>`items ${i+1}`
    // );

    const handlenext=() =>{
     if (index < users.length - 1) {
      setindex(index + 1);
    }

    }
  return (

    // <List
    // height={400}
    // width={200}
    // itemCount={users.length}
    // itemSize={20}
    // itemData={users}
    // >
    //   {({index,data}) =>(
    //     <div>
    //       {data[index]}
    //       </div>
    //   )

    //   }

    // </List>
    <div>
      {/* {users.map((item, index)=>(
        <div key={index}>{[index]}</div>
      ))} */}
      <h2>{users[index]}</h2>
       <button onClick={handlenext}>
        Next
      </button>
    </div>
  )
}

export default Page