import { Box, Divider } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import ScheduleCalendar from './ScheduleCalendar';
// import StudentList from './StudentList';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAvailableStudentsQuery,
  useGetStudentsByCoachIdQuery,
} from '../../app/services/studentApiSlice';
import StudentList from './StudentList/StudentList';
import { ActionBar } from './ActionBar';
import { useGetOpenHoursQuery } from '../../app/services/openHourApiSlice';
import { convertSlots } from '../../common/util/slotUtil';
import AUTH_STATUS from '../../common/constants/authStatus';
import { addToArrangingFromCalendar } from './StudentList/studentSlice';

const moment = extendMoment(Moment);

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
  const [planningSlots, setPlanningSlots] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      planningSlots.forEach((slot) => {
        dispatch(addToArrangingFromCalendar({ id: slot.studentId }));
      });
    };
  }, [planningSlots]);

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
          planningSlots={planningSlots}
          setPlanningSlots={setPlanningSlots}
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
        <ActionBar
          planningSlots={planningSlots}
          setPlanningSlots={setPlanningSlots}
        />
      </Box>
    </Box>
  );
};

export default SchedulePage;
