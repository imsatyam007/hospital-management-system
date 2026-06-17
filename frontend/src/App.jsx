import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="min-h-screen">
      <AppRoutes />
      <ToastContainer />
    </div>
  );
}

export default App;