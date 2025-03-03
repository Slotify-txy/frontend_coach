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
import { getDisplayedTime, getStatusColor } from '../../common/util/slotUtil';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllStudents,
  addToArrangingFromCalendar,
} from './StudentList/studentSlice';
import {
  useDeleteSlotByIdMutation,
  useUpdateSlotStatusByIdMutation,
} from '../../app/services/slotApiSlice';
import EventAction from '../../components/EventAction';
import CancelIcon from '@mui/icons-material/Cancel';
import { enqueueSnackbar } from 'notistack';
import { deleteConfirmationAction } from '../../components/DeleteConfirmationAction';
import { deleteSlotFromPlanningSlots } from '../common/slotSlice';

const CustomEventComponent = ({
  event,
  setSelectedStudent,
  hoveredEvent,
  setHoveredEvent,
}) => {
  const { start, end, status } = event;
  const backgroundColor = getStatusColor(status);
  const dispatch = useDispatch();
  const allStudents = useSelector(selectAllStudents);
  const student = useMemo(
    () => allStudents.find((student) => student.id == event.studentId),
    [allStudents, event]
  );
  const [deleteSlotById, { isLoading: isDeletingSlot }] =
    useDeleteSlotByIdMutation();
  const [updateSlotStatusById, { isLoading: isUpdatingSlot }] =
    useUpdateSlotStatusByIdMutation();

  const deleteSlot = useCallback(() => {
    if (event.status !== SLOT_STATUS.PLANNING_SCHEDULE) {
      const isCancel = new Set([
        SLOT_STATUS.PENDING,
        SLOT_STATUS.APPOINTMENT,
      ]).has(event.status);

      enqueueSnackbar(
        `Are you sure you want to ${isCancel ? 'cancel' : 'delete'} the class?`,
        {
          variant: 'info',
          autoHideDuration: null,
          action: deleteConfirmationAction(async () => {
            try {
              await deleteSlotById(event.id).unwrap();
              enqueueSnackbar(
                `${isCancel ? 'Cancelled' : 'Deleted'} successfully!`,
                {
                  variant: 'success',
                }
              );
            } catch (err) {
              let prompt = `Failed to ${isCancel ? 'cancel' : 'delete'}: `;
              if (err.status === 409) {
                prompt +=
                  "The class' status is not up to date. Latest status fetched. ";
              } else {
                prompt += JSON.parse(err.data).message; // weird thing is err.data from cancel is an object
              }
              enqueueSnackbar(prompt, {
                variant: 'error',
              });
            }
          }),
        }
      );
      return;
    }
    dispatch(deleteSlotFromPlanningSlots(event.id));
    dispatch(addToArrangingFromCalendar({ id: event.studentId }));
    setSelectedStudent(null);
  }, [event, setSelectedStudent]);

  const cancel = useCallback(() => {
    enqueueSnackbar('Are you sure you want to cancel the class?', {
      variant: 'info',
      autoHideDuration: null,
      action: deleteConfirmationAction(async () => {
        try {
          await updateSlotStatusById({
            id: event.id,
            status: SLOT_STATUS.CANCELLED,
          }).unwrap();
          enqueueSnackbar('Cancelled successfully!', {
            variant: 'success',
          });
        } catch (err) {
          let prompt = 'Failed to cancel: ';
          if (err.status === 409) {
            prompt +=
              "The class' status is not up to date. Latest status fetched. ";
          } else {
            prompt += err.data.message;
          }
          enqueueSnackbar(prompt, {
            variant: 'error',
          });
        }
      }),
    });
  }, [event]);

  const buildEventAction = useCallback(() => {
    switch (status) {
      case SLOT_STATUS.PLANNING_SCHEDULE:
      case SLOT_STATUS.REJECTED:
      case SLOT_STATUS.CANCELLED:
        return (
          <EventAction
            title="Delete"
            onClick={deleteSlot}
            Icon={DeleteIcon}
            isLoading={isDeletingSlot}
          />
        );
      case SLOT_STATUS.PENDING:
        return (
          <EventAction
            title="Cancel"
            onClick={deleteSlot}
            Icon={CancelIcon}
            isLoading={isDeletingSlot}
          />
        );
      case SLOT_STATUS.APPOINTMENT:
        return (
          <EventAction
            title="Cancel"
            onClick={cancel}
            Icon={CancelIcon}
            isLoading={isUpdatingSlot}
          />
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
              fontSize: 12,
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
      <Typography sx={{ fontSize: 12 }}>
        {getDisplayedTime(start, end)}
      </Typography>
    </Box>
  );
};

export default CustomEventComponent;
