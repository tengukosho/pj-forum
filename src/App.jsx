import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}
