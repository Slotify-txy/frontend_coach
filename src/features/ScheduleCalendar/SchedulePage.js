import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ScheduleCalendar from './ScheduleCalendar';
// import StudentList from './StudentList';
import { useDispatch } from 'react-redux';

import StudentList from './StudentList/StudentList';
import { ActionBar } from './ActionBar';
import { setPlanningSlots } from '../common/slotSlice';

const SchedulePage = ({
  navBarHeight,
  setScheduleCalendarRange,
  scheduleCalendarView,
  setScheduleCalendarView,
  scheduleCalendarDate,
  setScheduleCalendarDate,
}) => {
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [droppedStudent, setDroppedStudent] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setPlanningSlots([]));
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100% - ${navBarHeight}px)`,
      }}
    >
      <Box sx={{ height: '100%', width: 500 }}>
        <StudentList
          droppedStudent={droppedStudent}
          setDroppedStudent={setDroppedStudent}
          draggedStudent={draggedStudent}
          setDraggedStudent={setDraggedStudent}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      </Box>
      <Box sx={{ flex: 1, ml: 1 }}>
        <ScheduleCalendar
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
          setDroppedStudent={setDroppedStudent}
        />
      </Box>
      <Box sx={{ height: '100%', width: 70 }}>
        <ActionBar />
      </Box>
    </Box>
  );
};

export default SchedulePage;
