import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import moment from 'moment';
import React, { useCallback } from 'react';
import { useCreateOpenHoursMutation } from '../../app/services/openHourApiSlice';
import { useSelector } from 'react-redux';
import ActionButton from '../../components/ActionButton';
import { enqueueSnackbar } from 'notistack';

const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';

export const ActionBar = ({ planningOpenHours, setPlanningOpenHours }) => {
  const offset = [0, -14];
  const { user } = useSelector((state) => state.auth);

  const [createOpenHours, { isLoading: isCreatingOpenHours }] =
    useCreateOpenHoursMutation();

  const publishOpenHours = useCallback(async () => {
    try {
      await createOpenHours({
        coachId: user?.id,
        openHours: planningOpenHours
          .filter(({ start }) => start > Date.now())
          .map(({ start, end }) => ({
            startAt: moment(start).format(timeFormat),
            endAt: moment(end).format(timeFormat),
          })),
      }).unwrap();
      enqueueSnackbar('Open hours published successfully!', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar('Failed to save the open hours: ' + err, {
        variant: 'error',
      });
    } finally {
      setPlanningOpenHours([]);
    }
  }, [planningOpenHours, setPlanningOpenHours]);

  const clearOpenHours = useCallback(() => {
    setPlanningOpenHours([]);
    enqueueSnackbar('Planning open hours cleared!', {
      variant: 'success',
    });
  }, [setPlanningOpenHours]);

  return (
    <Box sx={{ pt: 2 }}>
      <ActionButton
        color={green[700]}
        icon={<CheckBoxIcon />}
        tooltip={'Publish Open Hours'}
        callback={publishOpenHours}
        offset={offset}
        disabled={planningOpenHours.length === 0}
        loading={isCreatingOpenHours}
      />
      <ActionButton
        color={grey[700]}
        icon={<DeleteForeverIcon />}
        tooltip={'Clear Planning Open Hours'}
        callback={clearOpenHours}
        disabled={planningOpenHours.length === 0}
        offset={offset}
      />
    </Box>
  );
};
