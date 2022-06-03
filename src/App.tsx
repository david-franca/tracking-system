import { Route, Routes } from "react-router-dom";

import { Issues } from "./pages/Issues";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/issues" element={<Issues />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
