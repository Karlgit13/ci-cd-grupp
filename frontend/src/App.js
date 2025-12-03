import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Meetups from './pages/Meetups';
import MeetupDetail from './pages/MeetupDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/meetups" element={<Meetups />} />
          <Route path="/meetups/:id" element={<MeetupDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
