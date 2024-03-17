import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Clicker from "./components/Clicker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path=":path?" element={<Clicker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
