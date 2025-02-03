import { Box, Divider } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import ScheduleCalendar from './ScheduleCalendar';
// import StudentList from './StudentList';
import * as AuthStatus from '../../common/constants/authStatus';
import { useSelector } from 'react-redux';
import {
  useGetSchedulingStudentsQuery,
  useGetStudentsByCoachIdQuery,
} from '../../app/services/studentApiSlice';
import StudentList from './StudentList/StudentList';

const moment = extendMoment(Moment);

const SchedulePage = ({
  navBarHeight,
  setScheduleCalendarRange,
  scheduleCalendarView,
  setScheduleCalendarView,
  scheduleCalendarDate,
  setScheduleCalendarDate,
}) => {
  const { user, status } = useSelector((state) => state.auth);

  const {
    data: allSlots,
    isFetching: isFetchingAllSlots,
    isSuccess: isAllSlotsSuccess,
  } = useGetSlotsQuery(
    { coachId: user?.id },
    {
      skip: status != AuthStatus.AUTHENTICATED || user == null,
    }
  );

  const { isFetching: isFetchingSchedulingStudents } =
    useGetSchedulingStudentsQuery(
      { coachId: user?.id },
      {
        skip: status != AuthStatus.AUTHENTICATED || user == null,
      }
    );

  const { isFetching: isFetchingAllStudents } = useGetStudentsByCoachIdQuery(
    { coachId: user?.id },
    {
      skip: status != AuthStatus.AUTHENTICATED || user == null,
    }
  );
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [droppedStudent, setDroppedStudent] = useState(null);

  if (
    isFetchingAllSlots ||
    isFetchingSchedulingStudents ||
    isFetchingAllStudents
  ) {
    <Box>Loading...</Box>;
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
      <Box sx={{ height: '100%', width: 250 }}>
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
          setDroppedStudent={setDroppedStudent}
        />
      </Box>
      <Box sx={{ height: '100%', width: 70 }}>
        {/* <ActionBar allSlots={allSlots} isFetchingAllSlots={isFetchingAllSlots} /> */}
      </Box>
    </Box>
  );
};

export default SchedulePage;
