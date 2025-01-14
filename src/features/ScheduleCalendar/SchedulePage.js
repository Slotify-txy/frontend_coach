import { Box, Divider } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useState } from 'react';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import ScheduleCalendar from './ScheduleCalendar';
import StudentList from './StudentList';

const moment = extendMoment(Moment);

const SchedulePage = ({
  navBarHeight,
  setScheduleCalendarRange,
  scheduleCalendarView,
  setScheduleCalendarView,
  scheduleCalendarDate,
  setScheduleCalendarDate,
}) => {
  const {
    data: allSlots,
    isFetching: isFetchingAllSlots,
    isSuccess: isAllSlotsSuccess,
  } = useGetSlotsQuery({ coachId: 10 });
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  if (isFetchingAllSlots) {
    allSlots;
    return;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100% - ${navBarHeight}px)`,
      }}
    >
      <Box sx={{ height: '100%', width: 300 }}>
        <StudentList
          setDraggedStudent={setDraggedStudent}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      </Box>
      <Box sx={{ flex: 1, ml: 1 }}>
        <ScheduleCalendar
          allSlots={allSlots}
          draggedStudent={draggedStudent}
          setDraggedStudent={setDraggedStudent}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          hoveredEvent={hoveredEvent}
          setHoveredEvent={setHoveredEvent}
          scheduleCalendarView={scheduleCalendarView}
          setScheduleCalendarView={setScheduleCalendarView}
          setScheduleCalendarRange={setScheduleCalendarRange}
          scheduleCalendarDate={scheduleCalendarDate}
          setScheduleCalendarDate={setScheduleCalendarDate}
        />
      </Box>
      <Box sx={{ height: '100%', width: 70 }}>
        {/* <ActionBar allSlots={allSlots} isFetchingAllSlots={isFetchingAllSlots} /> */}
      </Box>
    </Box>
  );
};

export default SchedulePage;
