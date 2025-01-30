import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as SlotStatusConstants from '../../common/constants/slotStatus';
import {
  convertStatusToText,
  getStatusColor,
} from '../../common/util/slotUtil';
import { useGetStudentByIdQuery } from '../../app/services/studentApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthStatus from '../../common/constants/authStatus';
import {
  addArrangingStudent,
  selectAllStudents,
} from './StudentList/studentSlice';

const CustomEventComponent = ({
  event,
  setPlanningSlots,
  setSelectedStudent,
  hoveredEvent,
  setHoveredEvent,
}) => {
  const start = moment(event.start).format('hh:mm A');
  const end = moment(event.end).format('hh:mm A');
  const status = event.status;
  const backgroundColor = getStatusColor(status);
  const dispatch = useDispatch();
  const allStudents = useSelector(selectAllStudents);
  const student = useMemo(
    () => allStudents.find((student) => student.id == event.studentId),
    [allStudents, event]
  );
  const deleteSlot = useCallback(() => {
    if (event.status !== SlotStatusConstants.PLANNING) {
      return;
    }
    setPlanningSlots((prev) => prev.filter((slot) => slot.id !== event.id));
    dispatch(addArrangingStudent(student));
    setSelectedStudent(null);
  }, [event]);

  return (
    <Box
      sx={{
        height: '100%',
        paddingX: '0.3rem',
        overflow: 'hidden',
        backgroundColor: backgroundColor,
        borderRadius: '8px',
      }}
      onMouseEnter={() => {
        setSelectedStudent(student);
        setHoveredEvent(event.id);
      }}
      onMouseLeave={() => {
        setSelectedStudent(null);
        setHoveredEvent(null);
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 0.2,
        }}
      >
        <Stack direction="row" spacing={1}>
          <Avatar
            sx={{ width: 20, height: 20 }}
            src={student?.picture}
            alt={student?.name}
          />
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {student?.name}
          </Typography>
        </Stack>

        {
          // todo: make ui better
          hoveredEvent === event.id && (
            <Tooltip title="Delete">
              <IconButton
                onClick={deleteSlot}
                onMouseDown={(e) => e.stopPropagation()} // otherwise, it triggers with onDragStart
                sx={{ padding: 0.2 }}
                aria-label="delete"
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )
        }
      </Box>
      <Typography sx={{ fontSize: 15 }}>
        {start} - {end}
      </Typography>
    </Box>
  );
};

export default CustomEventComponent;
