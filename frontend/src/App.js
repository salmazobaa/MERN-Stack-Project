import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";

function App() {
  return (
    <Routes>
      <Route pasth="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        </Route>
    </Routes>
    
  );
}

export default App;
