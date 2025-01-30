import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, IconButton, Tooltip } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import moment from 'moment';
import React, { useCallback } from 'react';
import {
  useCreateOpenHoursMutation,
  useDeleteOpenHoursByCoachIdMutation,
} from '../../app/services/openHourApiSlice';
import { useSelector } from 'react-redux';
import ActionButton from '../../components/ActionButton';

const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';

export const ActionBar = ({ availableOpenHours, setAvailableOpenHours }) => {
  const offset = [0, -14];
  const { user } = useSelector((state) => state.auth);

  const [createOpenHours, { isLoading: isCreatingOpenHours }] =
    useCreateOpenHoursMutation();

  const publishOpenHours = useCallback(async () => {
    try {
      await createOpenHours({
        coachId: user?.id,
        openHours: availableOpenHours
          .filter(({ start }) => start > Date.now())
          .map(({ start, end }) => ({
            startAt: moment(start).format(timeFormat),
            endAt: moment(end).format(timeFormat),
          })),
      }).unwrap();
      setAvailableOpenHours([]);
    } catch (err) {
      console.error('Failed to save the open hours: ', err);
    }
  }, [availableOpenHours]);

  const clearOpenHours = useCallback(() => {
    setAvailableOpenHours([]);
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      <ActionButton
        color={green[700]}
        icon={<CheckBoxIcon />}
        tooltip={'Publish Open Hours'}
        callback={publishOpenHours}
        offset={offset}
      />
      <ActionButton
        color={grey[700]}
        icon={<DeleteForeverIcon />}
        tooltip={'Clear'}
        callback={clearOpenHours}
        offset={offset}
      />
    </Box>
  );
};
