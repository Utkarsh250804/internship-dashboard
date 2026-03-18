import { useState } from "react";
import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/register";
import "./App.css";


function App() {
    const [count , setcount] = useState(0);

    return (
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </>
    );
}

export default App;