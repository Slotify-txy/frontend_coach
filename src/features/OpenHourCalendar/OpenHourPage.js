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
  const [planningOpenHours, setPlanningOpenHours] = useState([]);

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
          planningOpenHours={planningOpenHours}
          setPlanningOpenHours={setPlanningOpenHours}
          openHourCalendarView={openHourCalendarView}
          setOpenHourCalendarView={setOpenHourCalendarView}
          setOpenHourCalendarRange={setOpenHourCalendarRange}
          openHourCalendarDate={openHourCalendarDate}
          setOpenHourCalendarDate={setOpenHourCalendarDate}
        />
      </Box>
      <Box sx={{ height: '100%', width: 70 }}>
        <ActionBar
          planningOpenHours={planningOpenHours}
          setPlanningOpenHours={setPlanningOpenHours}
        />
      </Box>
    </Box>
  );
};

export default OpenHour;
