import { List, ListItem } from '@mui/material';
import React from 'react';
import StudentCard from './StudentCard.js';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  dragToArrangingFromAvailable,
  selectArrangingStudents,
} from '../../common/studentSlice.js';
import DND_TYPE from '../../../common/constants/dnd.js';

const ArrangingStudentList = ({
  droppedStudent,
  setDroppedStudent,
  draggedStudent,
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) => {
  const dispatch = useDispatch();
  const arrangingStudents = useSelector(selectArrangingStudents);

  const [, drop] = useDrop({
    accept: DND_TYPE.SCHEDULING_STUDENT,
    drop: ({ id }) => {
      dispatch(dragToArrangingFromAvailable({ id }));
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
            dragType={DND_TYPE.ARRANGING_STUDENT}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ArrangingStudentList;
