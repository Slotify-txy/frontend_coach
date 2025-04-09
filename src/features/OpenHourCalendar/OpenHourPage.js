import { Box } from '@mui/material';
import React, { useState } from 'react';
import { ActionBar } from './ActionBar';
import OpenHourCalendar from './OpenHourCalendar';
import { useSelector } from 'react-redux';
import { useGetOpenHoursQuery } from '../../app/services/slotApiSlice';
import { convertSlots } from '../../common/util/slotUtil';
import AUTH_STATUS from '../../common/constants/authStatus';

const OpenHour = ({
  navBarHeight,
  setOpenHourCalendarRange,
  openHourCalendarView,
  setOpenHourCalendarView,
  openHourCalendarDate,
  setOpenHourCalendarDate,
}) => {
  const [planningOpenHours, setPlanningOpenHours] = useState([]);
  const { user, status } = useSelector((state) => state.auth);
  const { data: publishedOpenHours, isFetching } = useGetOpenHoursQuery(
    { coachId: user?.id },
    {
      selectFromResult: (result) => {
        result.data = convertSlots(result.data ?? []);
        return result;
      },
      skip: status != AUTH_STATUS.AUTHENTICATED || user == null,
    }
  );
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
          publishedOpenHours={publishedOpenHours}
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
          isFetching={isFetching}
          planningOpenHours={planningOpenHours}
          setPlanningOpenHours={setPlanningOpenHours}
        />
      </Box>
    </Box>
  );
};

export default OpenHour;
