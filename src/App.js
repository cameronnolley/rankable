import React from "react";
import Rank from "./Components/Rank/Rank";
import Rankings from "./Components/Ranking/Rankings";
import { Outlet, Link } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Rank />} />
                    <Route path="rankings" element={<Rankings />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App;