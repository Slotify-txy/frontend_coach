import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/NavBar/NavBar';
import OpenHour from './features/OpenHourCalendar/OpenHourPage';
import SchedulePage from './features/ScheduleCalendar/SchedulePage';
import moment from 'moment';
import * as CalendarViewConstants from './common/constants/calendarView';
import * as TabConstants from './common/constants/tab';
import { useLocation } from 'react-router-dom';

function App() {
  const height = 48;
  const py = 8;
  const { pathname } = useLocation();
  const [tab, setTab] = useState(pathname.substring(1));

  const [openHourCalendarDate, setOpenHourCalendarDate] = useState(new Date());
  const [openHourCalendarView, setOpenHourCalendarView] = useState(
    CalendarViewConstants.WEEK
  );
  const [openHourCalendarRange, setOpenHourCalendarRange] = useState({
    start: moment().startOf('week'),
    end: moment().endOf('week'),
  });

  const [scheduleCalendarDate, setScheduleCalendarDate] = useState(new Date());
  const [scheduleCalendarView, setScheduleCalendarView] = useState(
    CalendarViewConstants.WEEK
  );
  const [scheduleCalendarRange, setScheduleCalendarRange] = useState({
    start: moment().startOf('week'),
    end: moment().endOf('week'),
  });

  useEffect(() => {
    setOpenHourCalendarRange({
      start: moment(openHourCalendarDate).startOf('week'),
      end: moment(openHourCalendarDate).endOf('week'),
    });
  }, [openHourCalendarDate]);

  useEffect(() => {
    setScheduleCalendarRange({
      start: moment(scheduleCalendarDate).startOf('week'),
      end: moment(scheduleCalendarDate).endOf('week'),
    });
  }, [scheduleCalendarDate]);

  return (
    <Box sx={{ height: '100vh', bgcolor: '#f8fafe' }}>
      <Box sx={{ height: height, py: `${py}px` }}>
        {tab == TabConstants.OPEN_HOUR ? (
          <NavBar
            calendarView={openHourCalendarView}
            setCalendarView={setOpenHourCalendarView}
            calendarRange={openHourCalendarRange}
            setCalendarDate={setOpenHourCalendarDate}
            tab={tab}
            setTab={setTab}
          />
        ) : (
          <NavBar
            calendarView={scheduleCalendarView}
            setCalendarView={setScheduleCalendarView}
            calendarRange={scheduleCalendarRange}
            setCalendarDate={setScheduleCalendarDate}
            tab={tab}
            setTab={setTab}
          />
        )}
      </Box>
      <Routes>
        <Route
          path="/open_hour"
          element={
            <OpenHour
              navBarHeight={height + 2 * py}
              openHourCalendarView={openHourCalendarView}
              setOpenHourCalendarRange={setOpenHourCalendarRange}
              openHourCalendarDate={openHourCalendarDate}
              setOpenHourCalendarDate={setOpenHourCalendarDate}
            />
          }
        />
        <Route
          path="/schedule"
          element={
            <SchedulePage
              navBarHeight={height + 2 * py}
              scheduleCalendarView={scheduleCalendarView}
              setScheduleCalendarRange={setScheduleCalendarRange}
              scheduleCalendarDate={scheduleCalendarDate}
              setScheduleCalendarDate={setScheduleCalendarDate}
            />
          }
        />
        <Route
          path="/"
          element={
            <SchedulePage
              navBarHeight={height + 2 * py}
              scheduleCalendarView={scheduleCalendarView}
              setScheduleCalendarRange={setScheduleCalendarRange}
              scheduleCalendarDate={scheduleCalendarDate}
              setScheduleCalendarDate={setScheduleCalendarDate}
            />
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
