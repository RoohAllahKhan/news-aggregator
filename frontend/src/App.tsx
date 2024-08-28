import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import NewsFeed from "./components/NewsFeed";
import NewsSearch from "./components/NewsSearch";
import Preferences from "./components/Preferences";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<NewsSearch />} />
        <Route path="/preferences" element={<ProtectedRoute element={<Preferences />} />} />
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
  );
};

export default App;
