import { Box, Stack } from '@mui/material';
import React from 'react';
// import { SlotAction } from './SlotAction'
import Logo from './Logo';
import { Profile } from './Profile';
import CalendarControl from './CalendarControl';

export const NavBar = ({
  calendarView,
  setCalendarView,
  calendarRange,
  setCalendarDate,
  tab,
  setTab,
}) => {
  console.log(calendarRange);
  return (
    <Box>
      <Stack
        sx={{
          flexDirection: 'row',
          px: 4,
          alignItems: 'center',
        }}
      >
        <Box mr={5}>
          <Logo />
        </Box>
        <Box flex={1} mr={3}>
          <CalendarControl
            calendarView={calendarView}
            setCalendarView={setCalendarView}
            calendarRange={calendarRange}
            setCalendarDate={setCalendarDate}
            tab={tab}
            setTab={setTab}
          />
        </Box>
        <Stack
          sx={{
            ml: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Profile />
        </Stack>
      </Stack>
    </Box>
  );
};
