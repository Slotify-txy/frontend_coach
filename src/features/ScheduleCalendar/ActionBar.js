import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { green, grey } from '@mui/material/colors';
import moment from 'moment';
import React from 'react';
import {
  useCreateOpenHoursMutation,
  useDeleteOpenHoursByCoachIdMutation,
} from '../../app/services/openHourApiSlice';
import { useSelector } from 'react-redux';

const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';

export const ActionBar = ({ data, isFetching }) => {
  const { user } = useSelector((state) => state.auth);

  const [createOpenHours, { isLoading: isCreatingOpenHours }] =
    useCreateOpenHoursMutation();
  const [
    deleteOpenHoursByCoachId,
    { isLoading: isDeletingOpenHoursByCoachId },
  ] = useDeleteOpenHoursByCoachIdMutation();

  const publishOpenHours = async () => {
    try {
      await createOpenHours({
        coachId: user?.id,
        openHours: data.map(({ start, end }) => {
          return {
            startAt: moment(start).format(timeFormat),
            endAt: moment(end).format(timeFormat),
          };
        }),
      });
    } catch (err) {
      console.error('Failed to save the open hours: ', err);
    }
  };

  const clearOpenHours = async () => {
    try {
      await deleteOpenHoursByCoachId({ coachId: user?.id });
    } catch (err) {
      console.error('Failed to clear open hours: ', err);
    }
  };

  return (
    <Stack direction={'row'} sx={{ height: '100%' }}>
      <Action
        color={green[700]}
        icon={<CheckBoxIcon />}
        tooltip={'Publish Open Hours'}
        callback={publishOpenHours}
        disabled={isFetching}
      />
      <Action
        color={grey[700]}
        icon={<DeleteForeverIcon />}
        tooltip={'Clear'}
        callback={clearOpenHours}
        disabled={isFetching}
      />
    </Stack>
  );
};

const Action = ({ color, icon, tooltip, callback, disabled }) => {
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
