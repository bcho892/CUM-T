import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import AppNavbar from "./components/wrappers/AppNavbar/AppNavbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppNavbar />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
