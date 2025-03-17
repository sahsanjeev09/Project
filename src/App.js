import React, { useState } from "react";
import LoginForm from "./Components/LoginForm";
import SignupForm from './Components/SignupForm';
import HomeContent from './Components/HomeContent';
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderContent = () => {
    switch (currentPage) {
      case "login":
        return <LoginForm onRegisterClick={() => setCurrentPage("signup")} />;
      case "signup":
        return <SignupForm onLoginClick={() => setCurrentPage("login")} />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="App">
      <Header onLoginClick={() => setCurrentPage("login")} />
      <main className="p-8">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;


