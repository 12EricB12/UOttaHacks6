import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Solo from "./pages/solo/Solo";
import Multiplayer from "./pages/multiplayer/Multiplayer";

function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pages/solo/Solo" element={<Solo />} />
          <Route path="/pages/multiplayer/Multiplayer" element={<Multiplayer />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
