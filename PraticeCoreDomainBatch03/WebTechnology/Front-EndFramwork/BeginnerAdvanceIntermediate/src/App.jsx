import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import Counter from "./pages/Counter.jsx";
import FetchData from "./pages/FetchData.jsx";
import Pagination from "./pages/pagination.jsx";
import PaginationPage from "./pages/PaginationPage.jsx";
// import ".App.css"

function App() {
  return (
    <Router>

      <Navbar />

      <Routes>

        <Route path="/counter" element={<Counter />} />
        <Route path="/fetch" element={<FetchData />} />
        <Route path="/pagination" element={<PaginationPage />} />

      </Routes>

    </Router>
  );
}

export default App;