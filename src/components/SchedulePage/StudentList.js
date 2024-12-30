import {
  Avatar,
  Card,
  CardHeader,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import React from 'react';
import { useDrag } from 'react-dnd';
import * as dndItemTypes from '../../constants/dnd';

const StudentList = ({
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) => {
  const students = [
    {
      id: 1,
      name: 'Xiyuan',
      avatar: 'R',
      email: 'xiyuan.tyler@gmail.com',
    },
    {
      id: 2,
      name: 'Xiyuan',
      avatar: 'R',
      email: 'xiyuan.tyler@gmail.com',
    },
  ];

  return (
    <List>
      {students.map((student) => (
        <StudentCard
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

const StudentCard = ({
  student,
  selectedStudent,
  setDraggedStudent,
  setSelectedStudent,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: dndItemTypes.STUDENT_CARD,
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
    <ListItem
      sx={{
        px: 1,
        py: 0.5,
        opacity: isDragging ? 0.5 : 1,
      }}
      ref={drag}
      onMouseEnter={() => setSelectedStudent(student.id)}
      onMouseLeave={() => setSelectedStudent(null)}
    >
      <Card
        sx={{
          width: '100%',
          '--Card-radius': '18px',
          '&:hover': {
            backgroundColor: grey[300],
          },
        }}
        variant="outlined"
      >
        <CardHeader
          sx={{ width: '100%' }}
          avatar={
            <Avatar sx={{ bgcolor: blue[500] }} aria-label="student_card">
              {student.avatar}
            </Avatar>
          }
          title={<Typography variant="body2">{student.name}</Typography>}
          subheader={<Typography variant="body2">{student.email}</Typography>}
        />
      </Card>
    </ListItem>
  );
};

export default StudentList;
