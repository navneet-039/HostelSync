import { createContext,useEffect,useState } from "react";

import axios from 'axios';

export const AppContext=createContext();
const AppContextProvider=(props)=>{
  return (
    <AppContext.Provider value={value}>
      {props.children}

    </AppContext.Provider>
  )
}

export default AppContextProvider;
