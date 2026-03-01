import { BrowserRouter } from "react-router-dom";
import Router from "./router.jsx";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Router />
    </BrowserRouter>
  );
}
