import { Box } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/NavBar/NavBar';
import SchedulePage from './components/SchedulePage/SchedulePage';
import OpenHour from './features/OpenHour/OpenHour';

function App() {
  const navBarHeight = 70;

  return (
    <Box sx={{ height: '100vh' }}>
      <Box sx={{ height: navBarHeight }}>
        <NavBar />
      </Box>
      <Routes>
        <Route
          path="/open_hour"
          element={<OpenHour navBarHeight={navBarHeight} />}
        />
        <Route
          path="/schedule"
          element={<SchedulePage navBarHeight={navBarHeight} />}
        />
        <Route
          path="/"
          element={<SchedulePage navBarHeight={navBarHeight} />}
        />
      </Routes>
    </Box>
  );
}

export default App;
