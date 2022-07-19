import React from "react";
import Rank from "./Components/Rank/Rank";
import Rankings from "./Components/Ranking/Rankings";
import { Outlet, Link } from "react-router-dom";

function App() {
    return (
        <>
            <Outlet />
        </>
    )
}

export default App;