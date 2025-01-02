import {
  Avatar,
  Card,
  CardHeader,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import React, { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AVAILABLE } from '../../constants/slotStatus';

const StudentList = ({
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) => {
  const students = [
    {
      id: 10,
      name: 'Xiyuan',
      avatar: 'R',
      email: 'xiyuan.tyler@gmail.com',
    },
  ];

  return (
    <List>
      {students.map((student) => (
        <ListItem
          key={student.id}
          sx={{
            px: 1,
            py: 0.5,
          }}
        >
          <StudentCard
            student={student}
            selectedStudent={selectedStudent}
            setDraggedStudent={setDraggedStudent}
            setSelectedStudent={setSelectedStudent}
          />
        </ListItem>
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
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback(() => {
    setIsDragging(true);
    setDraggedStudent({
      id: uuidv4(),
      studentId: student.id,
      name: student.name,
      email: student.email,
      status: AVAILABLE,
    });
  }, [student, setDraggedStudent, setIsDragging]);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedStudent(null);
  }, [setDraggedStudent, setIsDragging]);

  const onMouseEnter = useCallback(
    () => setSelectedStudent(student.id),
    [student, setSelectedStudent]
  );
  const onMouseLeave = useCallback(
    () => setSelectedStudent(null),
    [setSelectedStudent]
  );

  return (
    <Card
      sx={{
        width: '100%',
        opacity: isDragging ? 0.5 : 1,
        '--Card-radius': '18px',
        '&:hover': {
          backgroundColor: grey[300],
        },
      }}
      variant="outlined"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
  );
};

export default StudentList;
