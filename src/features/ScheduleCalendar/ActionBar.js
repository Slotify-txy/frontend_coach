import AutoModeIcon from '@mui/icons-material/AutoMode';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Stack } from '@mui/material';
import { blue, green, grey } from '@mui/material/colors';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCreateSlotsMutation,
  useGetSlotsQuery,
} from '../../app/services/slotApiSlice';
import AUTH_STATUS from '../../common/constants/authStatus';
import SLOT_STATUS from '../../common/constants/slotStatus';
import { autoSchedule, convertSlots } from '../../common/util/slotUtil';
import ActionButton from '../../components/ActionButton';
import {
  emptyPlanningSlots,
  selectTransformedPlanningSlots,
  setPlanningSlots,
} from '../common/slotSlice';
import {
  addToArrangingFromCalendar,
  selectAllStudents,
  selectArrangingStudents,
  updateArrangingStudent,
} from '../common/studentSlice';

const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';

export const ActionBar = ({ isAllSlotsFetching }) => {
  const { user, status } = useSelector((state) => state.auth);
  const planningSlots = useSelector(selectTransformedPlanningSlots);
  const students = useSelector(selectAllStudents);
  const arrangingStudents = useSelector(selectArrangingStudents);
  const [shouldTriggerAutoSchedule, setShouldTriggerAutoSchedule] =
    useState(false);
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

  const [createSlots, { isLoading: isCreatingSlots }] =
    useCreateSlotsMutation();

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
      enqueueSnackbar('Class invitations sent successfully!', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar('Failed to send class invitations: ' + err, {
        variant: 'error',
      });
    } finally {
      dispatch(emptyPlanningSlots());
    }
  }, [planningSlots, user]);

  const clearArrangingSlots = useCallback(() => {
    planningSlots.forEach((slot) => {
      dispatch(addToArrangingFromCalendar({ id: slot.studentId }));
    });
    dispatch(emptyPlanningSlots());
  }, [planningSlots, students]);

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
    dispatch(
      setPlanningSlots(
        scheduledClasses.map((slot) => ({
          ...slot,
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
        }))
      )
    );
    enqueueSnackbar(
      'Auto schedule complete! Please hit "Submit Schedule" button to confirm or manually adjust the schedule.',
      {
        variant: 'success',
      }
    );
  }, [arrangingStudents, allSlots]);

  // redux doesn't update arrangingStudents immediately after clearArrangingSlots, so we need to use a flag to trigger autoSchedule
  useEffect(() => {
    if (shouldTriggerAutoSchedule) {
      autoScheduleAction();
      setShouldTriggerAutoSchedule(false);
    }
  }, [shouldTriggerAutoSchedule]);

  return (
    <Stack>
      <ActionButton
        color={blue[700]}
        icon={<AutoModeIcon />}
        tooltip={'Auto Schedule'}
        callback={() => {
          clearArrangingSlots();
          setShouldTriggerAutoSchedule(true);
        }}
        disabled={arrangingStudents.length === 0 && planningSlots.length === 0}
      />
      <ActionButton
        color={green[700]}
        icon={<CheckBoxIcon />}
        tooltip={'Submit Schedule'}
        callback={schedule}
        isLoading={isAllSlotsFetching || isCreatingSlots}
        disabled={planningSlots.length === 0}
      />
      <ActionButton
        color={grey[700]}
        icon={<DeleteForeverIcon />}
        tooltip={'Clear Arranging Slots'}
        callback={() => {
          clearArrangingSlots();
          enqueueSnackbar('Planning classes cleared!', {
            variant: 'success',
          });
        }}
        disabled={planningSlots.length === 0}
      />
    </Stack>
  );
};
