import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import AppNavbar from "./components/wrappers/AppNavbar/AppNavbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppNavbar />
        <div className="flex flex-col w-full items-center">
          <div className="max-w-[1100px] w-full pt-8">
            <AppRoutes />
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
