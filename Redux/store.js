import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './feacture/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Ye 'counter' key global state me access hoga
  },
});