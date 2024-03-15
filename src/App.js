import logo from './logo.svg';
import './App.css';
import { Box } from '@mui/material';
import { NavBar } from './component/NavBar/NavBar';
import { Routes, Route } from 'react-router-dom'
import OpenHour from './component/OpenHour/OpenHour';
import SchedulePage from './component/SchedulePage/SchedulePage';

function App() {

  const navBarHeight = 70

  return (
    <Box sx={{ height: '100vh' }}>
      <Box sx={{ height: navBarHeight }}>
        <NavBar />
      </Box>
      <Routes>
        <Route path="/open_hour" element={<OpenHour navBarHeight={navBarHeight} />} />
        <Route path="/schedule" element={<SchedulePage navBarHeight={navBarHeight} />} />
        <Route path="/" element={<SchedulePage navBarHeight={navBarHeight} />} />
      </Routes>

    </Box>

  );
}

export default App;
