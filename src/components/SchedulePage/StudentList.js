import { List, ListItem } from '@mui/material';
import React, { useCallback, useState } from 'react';

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
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback(() => {
    setIsDragging(true);
    setDraggedStudent({ title: student.id, name: student.name });
  }, [student, setDraggedStudent, setIsDragging]);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedStudent(null);
  }, [setDraggedStudent, setIsDragging]);

  return (
    <ListItem
      sx={{
        px: 1,
        py: 0.5,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {/* <Card
        sx={{
          width: '100%',
          '--Card-radius': '18px',
          '&:hover': {
            backgroundColor: grey[300],
          },
        }}
        variant="outlined"
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setSelectedStudent(student.id)}
        onMouseLeave={() => setSelectedStudent(null)}
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
      </Card> */}

      <div
        key={student.id}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onMouseEnter={() => setSelectedStudent(student.id)}
        onMouseLeave={() => setSelectedStudent(null)}
      >
        123
      </div>
    </ListItem>
  );
};

export default StudentList;
