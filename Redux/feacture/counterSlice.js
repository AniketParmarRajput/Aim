import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    value:0,
}

const counterSlice = createSlice({
    name:"counter",
    initialState,
    reducers:{
        increment: (state) =>{
            state.value +=1
        },
        decrement:(state) =>{
            state.value -=1
        },
        reset:(state) =>{
            state.value =0;
        }
    }
})

//export name compnett can be used it
export const {increment,decrement,rest}=counterSlice.actions;

// exportslice store can be used it
export default counterSlice.reducer;