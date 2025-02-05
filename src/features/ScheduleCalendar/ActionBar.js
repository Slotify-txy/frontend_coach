import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import moment from 'moment';
import React, { useCallback } from 'react';
import {
  useCreateOpenHoursMutation,
  useDeleteOpenHoursByCoachIdMutation,
} from '../../app/services/openHourApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAvailableStudent,
  selectAllStudents,
} from './StudentList/studentSlice';
import { useCreateSlotsMutation } from '../../app/services/slotApiSlice';
import SLOT_STATUS from '../../common/constants/slotStatus';

const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';

export const ActionBar = ({ planningSlots, setPlanningSlots }) => {
  const { user } = useSelector((state) => state.auth);
  const students = useSelector(selectAllStudents);
  const dispatch = useDispatch();

  const [createSlots] = useCreateSlotsMutation();
  const schedule = useCallback(async () => {
    try {
      await createSlots({
        slots: planningSlots.map((slot) => ({
          studentId: slot.studentId,
          coachId: user.id,
          startAt: moment(slot.start).format(timeFormat),
          endAt: moment(slot.end).format(timeFormat),
          status: SLOT_STATUS.PENDING,
        })),
      }).unwrap();
      setPlanningSlots([]);
    } catch (err) {
      console.error('Failed to save the open hours: ', err);
    }
  }, [planningSlots, user]);

  const clearArrangingSlots = useCallback(() => {
    planningSlots.forEach((slot) => {
      const student = students.find((student) => student.id === slot.studentId);
      if (student) {
        dispatch(addAvailableStudent(student));
      }
    });
    setPlanningSlots([]);
  }, [planningSlots, setPlanningSlots, students]);

  return (
    <Stack>
      <Action
        color={green[700]}
        icon={<CheckBoxIcon />}
        tooltip={'Schedule'}
        callback={schedule}
      />
      <Action
        color={grey[700]}
        icon={<DeleteForeverIcon />}
        tooltip={'Clear arranging slots'}
        callback={clearArrangingSlots}
      />
    </Stack>
  );
};

const Action = ({ color, icon, tooltip, callback, disabled = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Tooltip
        title={tooltip}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -14],
                },
              },
            ],
          },
        }}
      >
        <span>
          <IconButton sx={{ color }} onClick={callback} disabled={disabled}>
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
