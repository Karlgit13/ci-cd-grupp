import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Meetups from './pages/Meetups';
import MeetupDetail from './pages/MeetupDetail';
import Profile from './pages/Profile';
import CreateMeetup from './pages/CreateMeetup';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Render Trigger: pnpm redeploy */}
        <Routes>
          <Route path="/" element={<Meetups />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/meetups" element={<Meetups />} />
          <Route path="/meetups/:id" element={<MeetupDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-meetup" element={<CreateMeetup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
