import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes";
import AppNavbar from "./components/wrappers/AppNavbar/AppNavbar";
import { TempeartureDataContextProvider } from "./context/TemperatureDataContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppNavbar />
        <div className="flex flex-col w-full items-center">
          <TempeartureDataContextProvider>
            <div className="max-w-[1100px] w-full pt-8">
              <AppRoutes />
            </div>
          </TempeartureDataContextProvider>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
