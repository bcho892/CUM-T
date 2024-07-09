import { Route, Routes } from "react-router-dom";
import ManualTesting from "./pages/ManualTesting";
import Home from "./pages/Home";
import Visualisation from "./pages/Visualisation";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="manual-testing" element={<ManualTesting />} />
        <Route path="visualisation" element={<Visualisation />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
