import { Box, Tooltip, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import SLOT_STATUS from '../../common/constants/slotStatus';
import {
  convertStatusToText,
  getDisplayedTime,
  getStatusColor,
} from '../../common/util/slotUtil';
import { useDeleteOpenHourByIdMutation } from '../../app/services/openHourApiSlice';
import { enqueueSnackbar } from 'notistack';
import { deleteConfirmationAction } from '../../components/DeleteConfirmationAction';
import EventAction from '../../components/EventAction';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomEventComponent = ({ event, setPlanningOpenHours }) => {
  const { start, end, status } = event;
  const backgroundColor = getStatusColor(status);
  const [deleteOpenHourById, { isLoading: isDeletingOpenHours }] =
    useDeleteOpenHourByIdMutation();

  const deleteOpenHour = useCallback(() => {
    switch (event.status) {
      case SLOT_STATUS.PLANNING_OPEN_HOUR:
        setPlanningOpenHours((prev) =>
          prev.filter((slot) => slot.id !== event.id)
        );
        break;
      case SLOT_STATUS.OPEN_HOUR:
        enqueueSnackbar('Are you sure you want to delete the open hour?', {
          variant: 'info',
          autoHideDuration: null,
          key: event.id,
          action: deleteConfirmationAction(async () => {
            try {
              await deleteOpenHourById(event.id).unwrap();
              enqueueSnackbar('Open hour deleted successfully!', {
                variant: 'success',
              });
            } catch (err) {
              enqueueSnackbar('Failed to save the open hours: ' + err, {
                variant: 'error',
              });
            }
          }),
        });

        break;
    }
  }, [event, setPlanningOpenHours]);

  return (
    <Tooltip
      interactive
      arrow
      placement="top"
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: 'white',
          },
        },
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -5],
              },
            },
          ],
        },
      }}
      title={
        <EventAction
          key={'Delete'}
          title="Delete"
          onClick={deleteOpenHour}
          Icon={DeleteIcon}
          fontSize={20}
          isLoading={isDeletingOpenHours}
        />
      }
    >
      <Box
        sx={{
          height: '100%',
          paddingX: '0.3rem',
          overflow: 'hidden',
          backgroundColor: backgroundColor,
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {convertStatusToText(status)}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 12 }}>
          {getDisplayedTime(start, end)}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default CustomEventComponent;
