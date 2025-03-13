import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/NavBar/NavBar';
import OpenHour from './features/OpenHourCalendar/OpenHourPage';
import SchedulePage from './features/ScheduleCalendar/SchedulePage';
import moment from 'moment';
import CALENDAR_VIEW from './common/constants/calendarView';
import Tab from './common/constants/tab';
import { useLocation } from 'react-router-dom';
import Login from './components/Login';
import AUTH_STATUS from './common/constants/authStatus';
import { useGetUserQuery } from './app/services/userApiSlice';
import { useSelector } from 'react-redux';
import StudentPage from './features/StudentDisplay/StudentPage';
import { useGetStudentsByCoachIdQuery } from './app/services/studentApiSlice';
import { useLoginMutation } from './app/services/authApiSlice'; //It's not being used, but it's required

function App() {
  const height = 48;
  const py = 8;

  const { user, status } = useSelector((state) => state.auth);
  const { isFetching } = useGetUserQuery(null, {
    skip: status != AUTH_STATUS.AUTHENTICATED,
  });

  useGetStudentsByCoachIdQuery(
    { coachId: user?.id },
    {
      skip: status != AUTH_STATUS.AUTHENTICATED || user == null,
    }
  );

  const { pathname } = useLocation();
  const [tab, setTab] = useState(pathname.substring(1));

  const [openHourCalendarDate, setOpenHourCalendarDate] = useState(new Date());
  const [openHourCalendarView, setOpenHourCalendarView] = useState(
    CALENDAR_VIEW.WEEK
  );
  const [openHourCalendarRange, setOpenHourCalendarRange] = useState({
    start: moment().startOf('week'),
    end: moment().endOf('week'),
  });

  const [scheduleCalendarDate, setScheduleCalendarDate] = useState(new Date());
  const [scheduleCalendarView, setScheduleCalendarView] = useState(
    CALENDAR_VIEW.WEEK
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

  useEffect(() => {
    setTab(pathname.substring(1));
  }, [pathname]);

  const buildNavBar = useCallback(() => {
    switch (tab) {
      case Tab.OPEN_HOUR:
        return (
          <NavBar
            calendarView={openHourCalendarView}
            setCalendarView={setOpenHourCalendarView}
            calendarRange={openHourCalendarRange}
            setCalendarDate={setOpenHourCalendarDate}
            tab={tab}
            setTab={setTab}
          />
        );
      case Tab.SCHEDULE:
        return (
          <NavBar
            calendarView={scheduleCalendarView}
            setCalendarView={setScheduleCalendarView}
            calendarRange={scheduleCalendarRange}
            setCalendarDate={setScheduleCalendarDate}
            tab={tab}
            setTab={setTab}
          />
        );
      case Tab.STUDENT:
        return (
          <NavBar
            calendarView={scheduleCalendarView}
            setCalendarView={setScheduleCalendarView}
            calendarRange={scheduleCalendarRange}
            setCalendarDate={setScheduleCalendarDate}
            tab={tab}
            setTab={setTab}
          />
        );
    }
  }, [tab]);

  return (
    <Box sx={{ height: '100vh', bgcolor: '#f8fafe' }}>
      <Box
        sx={{
          height: height,
          py: `${py}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {buildNavBar()}
      </Box>
      <Login />
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
          path="/student"
          element={
            <StudentPage
              navBarHeight={height + 2 * py}
              scheduleCalendarView={scheduleCalendarView}
              setScheduleCalendarRange={setScheduleCalendarRange}
              scheduleCalendarDate={scheduleCalendarDate}
              setScheduleCalendarDate={setScheduleCalendarDate}
            />
          }
        />
        <Route path="/" element={<Navigate to="/schedule" replace />} />
      </Routes>
    </Box>
  );
}

export default App;
