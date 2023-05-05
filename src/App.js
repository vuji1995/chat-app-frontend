import "./App.css";
import { ContextProvider } from "./context/Context";
import LoginPage from "./pages/loginPage";
import Dashboard from "./pages/dashboardPage";
import RegisterPage from "./pages/registerPage";
import ProfilePage from "./pages/profilePage";
import PatchPassword from "./pages/patchPassword";
import SingleConversation from "./Components/SingleConversation";
import ForgotPassword from "./pages/forgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <ContextProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" Component={LoginPage} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route path="/signup" Component={RegisterPage} />
            <Route path="/profile" Component={ProfilePage} />
            <Route path="/chat" Component={SingleConversation} />
            <Route path="/forgotPassword" Component={ForgotPassword} />
            <Route path="/resetPassword/:token" Component={PatchPassword} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </ContextProvider>
  );
}

export default App;
