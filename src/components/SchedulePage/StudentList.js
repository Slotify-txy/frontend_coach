import { Avatar, Box, Chip, List, ListItem } from '@mui/material';
import React from 'react';
import { useDrag } from 'react-dnd';
import * as dndItemTypes from '../../constants/dnd';

const StudentList = ({
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) => {
  const students = Array(1).fill({
    id: 10,
    name: 'Xiyuan',
  });

  return (
    <List sx={{ width: 150, overflowY: 'scroll' }}>
      {students.map((student) => (
        <StudentChip
          key={student.id}
          student={student}
          selectedStudent={selectedStudent}
          setDraggedStudent={setDraggedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      ))}
    </List>
  );
};

const StudentChip = ({
  student,
  selectedStudent,
  setDraggedStudent,
  setSelectedStudent,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: dndItemTypes.STUDENT_CHIP,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // useEffect(() => {
  //     if (isDragging) {
  //         setDraggedStudent({ name: student.name })
  //     } else {
  //         setDraggedStudent(null)
  //     }
  // }, [isDragging])

  return (
    <ListItem sx={{ px: 1, py: 0.5, opacity: isDragging ? 0.5 : 1 }} ref={drag}>
      <Box
        onMouseEnter={() => setSelectedStudent(student.id)}
        onMouseLeave={() => setSelectedStudent(null)}
      >
        <Chip
          avatar={
            <Avatar alt={student.name} src="/static/images/avatar/1.jpg" />
          }
          label={student.name}
          variant="outlined"
          sx={{
            borderColor: `${selectedStudent == student.id ? 'green' : '#bdbdbd'}`,
          }}
        />
      </Box>
    </ListItem>
  );
};

export default StudentList;
