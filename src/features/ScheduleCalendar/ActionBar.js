import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { blue, green, grey } from '@mui/material/colors';
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
  selectArrangingStudents,
  updateArrangingStudent,
} from './StudentList/studentSlice';
import {
  useCreateSlotsMutation,
  useGetSlotsQuery,
} from '../../app/services/slotApiSlice';
import SLOT_STATUS from '../../common/constants/slotStatus';
import { autoSchedule, convertSlots } from '../../common/util/slotUtil';
import AUTH_STATUS from '../../common/constants/authStatus';

const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';

export const ActionBar = ({ planningSlots, setPlanningSlots }) => {
  const { user, status } = useSelector((state) => state.auth);
  const students = useSelector(selectAllStudents);
  const arrangingStudents = useSelector(selectArrangingStudents);
  const { data: allSlots } = useGetSlotsQuery(
    { coachId: user?.id },
    {
      selectFromResult: (result) => {
        result.data = convertSlots(result.data ?? []);
        return result;
      },
      skip: status != AUTH_STATUS.AUTHENTICATED || user == null,
    }
  );
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
          classId: slot.classId,
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

  const autoScheduleAction = useCallback(() => {
    const scheduledClasses = autoSchedule(arrangingStudents, allSlots);
    const arrangingStudentsCopy = structuredClone(arrangingStudents);
    scheduledClasses.forEach((scheduledClass) => {
      const student = arrangingStudentsCopy.find(
        (student) => student.id == scheduledClass.studentId
      );

      if (student.numOfClassCanBeScheduled == 1) {
        const index = arrangingStudentsCopy.indexOf(student);
        arrangingStudentsCopy.splice(index, 1);
      } else {
        student.numOfClassCanBeScheduled -= 1;
      }
    });
    dispatch(updateArrangingStudent(arrangingStudentsCopy));
    setPlanningSlots(scheduledClasses);
  }, [arrangingStudents, allSlots]);

  return (
    <Stack>
      <Action
        color={blue[700]}
        icon={<AutoModeIcon />}
        tooltip={'Auto Schedule'}
        callback={autoScheduleAction}
      />
      <Action
        color={green[700]}
        icon={<CheckBoxIcon />}
        tooltip={'Submit Schedule'}
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
