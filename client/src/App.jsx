import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Main from "./pages/Main";
import About from "./pages/About";
import Updates from "./pages/Updates";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path="about" element={<About />} />
        <Route path="update" element={<Updates />} />
      </Route>
    </Routes>
  );
}
