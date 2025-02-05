import {
  Avatar,
  Box,
  Card,
  CardHeader,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import update from 'immutability-helper';
import StudentCard from './StudentCard.js';
import { useDrop } from 'react-dnd';
import * as DnDTypes from '../../../common/constants/dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  dragToAvailable,
  selectArrangingStudents,
  selectAvailableStudents,
} from './studentSlice.js';

const ArrangingStudentList = ({
  droppedStudent,
  setDroppedStudent,
  draggedStudent,
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) => {
  const dispatch = useDispatch();
  const availableStudents = useSelector(selectAvailableStudents);
  const arrangingStudents = useSelector(selectArrangingStudents);

  const [, drop] = useDrop({
    accept: DnDTypes.SCHEDULING_STUDENT,
    drop: ({ id }) => {
      const student = availableStudents.find((student) => student.id === id);
      if (student) {
        const index = availableStudents.findIndex(
          (student) => student.id === id
        );
        dispatch(dragToAvailable({ index, student }));
      }
    },
  });

  return (
    <List sx={{ height: '100%', py: 0 }} ref={drop}>
      {arrangingStudents.map((student, index) => (
        <ListItem
          key={student.id}
          sx={{
            px: 1,
            py: 0.5,
          }}
        >
          <StudentCard
            key={student.id}
            student={student}
            draggedStudent={draggedStudent}
            setDraggedStudent={setDraggedStudent}
            listedStudents={arrangingStudents}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            index={index}
            droppedStudent={droppedStudent}
            setDroppedStudent={setDroppedStudent}
            dragType={DnDTypes.ARRANGING_STUDENT}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ArrangingStudentList;
