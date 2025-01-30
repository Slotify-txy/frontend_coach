import {
  Avatar,
  Box,
  Card,
  CardHeader,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ActionBar } from './ActionBar';
import SchedulingStudentList from './SchedulingStudentList';
import ArrangingStudentList from './ArrangingStudentList';

const StudentList = ({
  droppedStudent,
  setDroppedStudent,
  draggedStudent,
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) => {
  const actionBarHeight = 50;
  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ height: actionBarHeight }}>
        <ActionBar />
      </Box>
      <Stack
        direction="row"
        sx={{ height: `calc(100% - ${actionBarHeight}px)` }}
      >
        <Box sx={{ width: '50%', overflowY: 'auto' }}>
          <SchedulingStudentList
            droppedStudent={droppedStudent}
            setDroppedStudent={setDroppedStudent}
            draggedStudent={draggedStudent}
            setDraggedStudent={setDraggedStudent}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
        </Box>
        <Box sx={{ width: '50%', overflowY: 'auto' }}>
          <ArrangingStudentList
            droppedStudent={droppedStudent}
            setDroppedStudent={setDroppedStudent}
            draggedStudent={draggedStudent}
            setDraggedStudent={setDraggedStudent}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default StudentList;
