import React from "react";
import { HashRouter, Routes, Route} from "react-router-dom";
import Home from '../home/Home';

const AppView = () =>{
    return(
        <>
            <HashRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
            </Routes>
            </HashRouter>
        </>
    );
}

export default AppView;
