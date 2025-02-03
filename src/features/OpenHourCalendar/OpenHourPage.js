import { Box, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ActionBar } from './ActionBar';
import OpenHourCalendar from './OpenHourCalendar';

const OpenHour = ({
  navBarHeight,
  setOpenHourCalendarRange,
  openHourCalendarView,
  setOpenHourCalendarView,
  openHourCalendarDate,
  setOpenHourCalendarDate,
}) => {
  const [availableOpenHours, setAvailableOpenHours] = useState([]);
  // useEffect(() => {
  //   console.log('availableOpenHours', availableOpenHours);
  // }, [availableOpenHours]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100% - ${navBarHeight}px)`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          ml: 1,
        }}
      >
        <OpenHourCalendar
          availableOpenHours={availableOpenHours}
          setAvailableOpenHours={setAvailableOpenHours}
          openHourCalendarView={openHourCalendarView}
          setOpenHourCalendarView={setOpenHourCalendarView}
          setOpenHourCalendarRange={setOpenHourCalendarRange}
          openHourCalendarDate={openHourCalendarDate}
          setOpenHourCalendarDate={setOpenHourCalendarDate}
        />
      </Box>
      <Box sx={{ height: '100%', width: 70 }}>
        <ActionBar
          availableOpenHours={availableOpenHours}
          setAvailableOpenHours={setAvailableOpenHours}
        />
      </Box>
    </Box>
  );
};

export default OpenHour;
