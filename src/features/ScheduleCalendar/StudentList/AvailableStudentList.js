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
import DND_TYPE from '../../../common/constants/dnd.js';
import { useDrop } from 'react-dnd';
import {
  dragToArrangingFromAvailable,
  selectArrangingStudents,
  selectFilteredAvailableStudents,
  selectIsSearching,
  selectAvailableStudents,
  dragToAvailableFromArranging,
} from '../../common/studentSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../common/authSlice.js';

const AvailableStudentList = ({
  droppedStudent,
  setDroppedStudent,
  draggedStudent,
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) => {
  const dispatch = useDispatch();
  const availableStudents = useSelector(selectAvailableStudents);
  const filteredAvailableStudents = useSelector(
    selectFilteredAvailableStudents
  );
  const arrangingStudents = useSelector(selectArrangingStudents);
  const isSearching = useSelector(selectIsSearching);

  const displayedStudents = isSearching
    ? filteredAvailableStudents
    : availableStudents;

  const [, drop] = useDrop({
    accept: DND_TYPE.ARRANGING_STUDENT,
    drop: ({ id }) => {
      // const student = arrangingStudents.find((student) => student.id === id);
      // if (student) {
      //   const index = arrangingStudents.findIndex(
      //     (student) => student.id === id
      //   );
      dispatch(dragToAvailableFromArranging({ id }));
      // }
    },
  });
  return (
    <List sx={{ height: '100%', py: 0 }} ref={drop}>
      {displayedStudents.map((student, index) => (
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
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            index={index}
            droppedStudent={droppedStudent}
            setDroppedStudent={setDroppedStudent}
            dragType={DND_TYPE.SCHEDULING_STUDENT}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default AvailableStudentList;
