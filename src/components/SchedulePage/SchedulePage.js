import { Box, Divider } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useState } from 'react';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import ScheduleCalendar from './ScheduleCalendar';
import StudentList from './StudentList';

const moment = extendMoment(Moment);

const SchedulePage = ({ navBarHeight }) => {
  const {
    data: allSlots,
    isFetching: isFetchingAllSlots,
    isSuccess: isAllSlotsSuccess,
  } = useGetSlotsQuery({ coachId: 10 });
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  if (isFetchingAllSlots) {
    console.log(allSlots);
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
      <Divider orientation="vertical" sx={{ ml: 0.5 }} />
      <Box sx={{ flex: 1 }}>
        <ScheduleCalendar
          height={'100%'}
          allSlots={allSlots}
          draggedStudent={draggedStudent}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      </Box>
      <Divider orientation="vertical" sx={{ ml: 0.5 }} />

      <Box sx={{ height: '100%', width: 70 }}>
        {/* <ActionBar allSlots={allSlots} isFetchingAllSlots={isFetchingAllSlots} /> */}
      </Box>
    </Box>
  );
};

export default SchedulePage;
