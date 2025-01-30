import {
  Avatar,
  Box,
  Card,
  CardHeader,
  List,
  ListItem,
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
import * as DnDTypes from '../../../common/constants/dnd';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import {
  dragToCalendar,
  dragWithinArranging,
  dragWithinScheduling,
  selectArrangingStudents,
  selectSchedulingStudents,
} from './studentSlice';

const StudentCard = ({
  student,
  draggedStudent,
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
  index,
  droppedStudent,
  setDroppedStudent,
  dragType,
}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const schedulingStudents = useSelector(selectSchedulingStudents);
  const arrangingStudents = useSelector(selectArrangingStudents);
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      dragType === DnDTypes.SCHEDULING_STUDENT
        ? dispatch(dragWithinScheduling({ dragIndex, hoverIndex }))
        : dispatch(dragWithinArranging({ dragIndex, hoverIndex }));
    },
    [dragType, schedulingStudents, arrangingStudents]
  );

  const [{ handlerId }, drop] = useDrop({
    accept: dragType,
    collect: (monitor) => {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: dragType,
    item: () => {
      return { id: student.id, index, dragType };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      monitor,
    }),
    end: ({ id, index }, monitor) => {
      if (monitor.didDrop() && id === droppedStudent) {
        dispatch(dragToCalendar({ index }));
        setDroppedStudent(null);
        setDraggedStudent(null);
        setSelectedStudent(null);
      }
    },
  });
  drag(drop(ref));

  const onMouseEnter = useCallback(() => {
    if (!draggedStudent) {
      setSelectedStudent(student);
    }
  }, [student, setSelectedStudent, draggedStudent]);
  const onMouseLeave = useCallback(() => {
    if (!draggedStudent) {
      setSelectedStudent(null);
    }
  }, [setSelectedStudent, draggedStudent]);

  useEffect(() => {
    isDragging ? setDraggedStudent(student) : setDraggedStudent(null);
  }, [isDragging, student]);

  const backgroundColor = useMemo(() => {
    if (selectedStudent && student.id === selectedStudent.id) {
      return grey[300];
    }
    return '#fff';
  }, [selectedStudent, student]);

  return (
    <Card
      sx={{
        width: '100%',
        backgroundColor,
        opacity: isDragging ? 0 : 1,
        '--Card-radius': '18px',
        '&:hover': {
          backgroundColor:
            student.id === selectedStudent?.id ? grey[300] : '#fff',
        },
      }}
      variant="outlined"
      ref={ref}
      data-handler-id={handlerId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardHeader
        sx={{ width: '100%' }}
        avatar={
          <Avatar
            alt={student.name}
            src={student.picture}
            sx={{ bgcolor: blue[500] }}
            aria-label="student_card"
          />
        }
        title={<Typography variant="body2">{student.name}</Typography>}
        subheader={<Typography variant="body2">{student.email}</Typography>}
      />
    </Card>
  );
};

export default StudentCard;
