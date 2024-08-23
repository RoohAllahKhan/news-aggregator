import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import NewsFeed from "./components/NewsFeed";
import NewsSearch from "./components/NewsSearch";

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  console.log(isLoggedIn);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
        <Route path="/search" element={<NewsSearch />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

const Home: React.FC = () => {
  return (
    <div className="App">
        <NewsFeed />
    </div>
    // <div style={{ padding: "20px" }}>
    //   <h1>Welcome to the Homepage!</h1>
    //   <p>This is the homepage of your application.</p>
    // </div>
  );
};

export default App;
