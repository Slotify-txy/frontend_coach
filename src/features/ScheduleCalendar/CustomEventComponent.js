import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SLOT_STATUS from '../../common/constants/slotStatus';
import { getStatusColor } from '../../common/util/slotUtil';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllStudents,
  addToArrangingFromCalendar,
} from './StudentList/studentSlice';
import { useDeleteSlotByIdMutation } from '../../app/services/slotApiSlice';
import EventAction from '../../components/EventAction';
import CancelIcon from '@mui/icons-material/Cancel';

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
  const [deleteSlotById] = useDeleteSlotByIdMutation();

  const deleteSlot = useCallback(() => {
    if (event.status !== SLOT_STATUS.PLANNING_SCHEDULE) {
      deleteSlotById(event.id);
      return;
    }
    setPlanningSlots((prev) => prev.filter((slot) => slot.id !== event.id));
    dispatch(addToArrangingFromCalendar({ id: event.studentId }));
    setSelectedStudent(null);
  }, [event, setPlanningSlots, setSelectedStudent]);

  const buildEventAction = useCallback(() => {
    switch (status) {
      case SLOT_STATUS.PLANNING_SCHEDULE:
      case SLOT_STATUS.REJECTED:
        return (
          <EventAction title="Delete" onClick={deleteSlot} Icon={DeleteIcon} />
        );
      case SLOT_STATUS.PENDING:
      case SLOT_STATUS.APPOINTMENT:
        return (
          <EventAction title="Cancel" onClick={deleteSlot} Icon={CancelIcon} />
        );
    }
  }, [status, deleteSlot]);

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
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Avatar
            sx={{ width: 18, height: 18 }}
            src={student?.picture}
            alt={student?.name}
          />
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {student?.name}
          </Typography>
          {/* <Chip
            label={student?.location}
            size="small"
            color="primary"
            sx={{ fontSize: 11, height: 18 }}
          /> */}
        </Stack>

        {
          // todo: make ui better
          hoveredEvent === event.id && buildEventAction()
        }
      </Box>
      <Typography sx={{ fontSize: 13 }}>
        {start} - {end}
      </Typography>
    </Box>
  );
};

export default CustomEventComponent;
