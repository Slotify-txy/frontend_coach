import { Box, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ActionBar } from './ActionBar';
import ScheduleCalendar from './OpenHourCalendar';

const OpenHour = ({ navBarHeight }) => {
  const [availableOpenHours, setAvailableOpenHours] = useState([]);
  useEffect(() => {
    console.log('availableOpenHours', availableOpenHours);
  }, [availableOpenHours]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100% - ${navBarHeight}px)`,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <ScheduleCalendar
          height={'100%'}
          availableOpenHours={availableOpenHours}
          setAvailableOpenHours={setAvailableOpenHours}
        />
      </Box>
      <Divider orientation="vertical" sx={{ ml: 1 }} />
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
