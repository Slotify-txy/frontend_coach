import { Box, Divider } from '@mui/material';
import React from 'react';
import { useGetOpenHoursQuery } from '../../app/services/openHourApiSlice';
import { ActionBar } from './ActionBar';
import ScheduleCalendar from './OpenHourCalendar';

const OpenHour = ({ navBarHeight }) => {
  const { data, isFetching, isSuccess } = useGetOpenHoursQuery({ coachId: 10 });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100% - ${navBarHeight}px)`,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <ScheduleCalendar height={'100%'} data={data} isFetching={isFetching} />
      </Box>
      <Divider orientation="vertical" sx={{ ml: 1 }} />
      <Box sx={{ height: '100%', width: 70 }}>
        <ActionBar data={data} isFetching={isFetching} />
      </Box>
    </Box>
  );
};

export default OpenHour;
