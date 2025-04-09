import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ScheduleCalendar from './ScheduleCalendar';
import { useDispatch, useSelector } from 'react-redux';

import StudentList from './StudentList/StudentList';
import { ActionBar } from './ActionBar';
import { setPlanningSlots } from '../common/slotSlice';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import { convertSlots } from '../../common/util/slotUtil';
import AUTH_STATUS from '../../common/constants/authStatus';

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

  const { user, status } = useSelector((state) => state.auth);

  const {
    data: allSlots,
    isSuccess: isAllSlotsSuccess,
    isFetching: isAllSlotsFetching,
  } = useGetSlotsQuery(
    { coachId: user?.id },
    {
      selectFromResult: (result) => {
        result.data = convertSlots(result.data ?? []);
        return result;
      },
      skip: status != AUTH_STATUS.AUTHENTICATED || user == null,
    }
  );

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
          allSlots={allSlots}
          isAllSlotsSuccess={isAllSlotsSuccess}
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
        <ActionBar isAllSlotsFetching={isAllSlotsFetching} />
      </Box>
    </Box>
  );
};

export default SchedulePage;
