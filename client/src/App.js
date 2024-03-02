import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Solo from "./pages/solo/Solo";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="./pages/solo/Solo" element={<Solo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
