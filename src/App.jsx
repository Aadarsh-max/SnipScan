import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UrlShortner from "./pages/UrlShortner";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortner />} />
      </Routes>
    </Router>
  );
};

export default App;
