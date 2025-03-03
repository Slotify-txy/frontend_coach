import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import moment from 'moment-timezone';
import React, { useCallback, useState } from 'react';
import SLOT_STATUS from '../../common/constants/slotStatus';
import {
  convertStatusToText,
  getDisplayedTime,
  getStatusColor,
} from '../../common/util/slotUtil';
import { useDeleteOpenHourByIdMutation } from '../../app/services/openHourApiSlice';
import { enqueueSnackbar } from 'notistack';
import { deleteConfirmationAction } from '../../components/DeleteConfirmationAction';

const CustomEventComponent = ({ event, setPlanningOpenHours }) => {
  const { start, end, status } = event;
  const [onHover, setOnHover] = useState(false);
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
    <Box
      sx={{
        height: '100%',
        paddingX: '0.3rem',
        overflow: 'hidden',
        backgroundColor: backgroundColor,
        borderRadius: '8px',
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
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
        {
          // todo: make ui better
          onHover && (
            <Tooltip title="Delete">
              <IconButton
                onClick={deleteOpenHour}
                onMouseDown={(e) => e.stopPropagation()} // otherwise, it triggers with onDragStart
                sx={{ padding: 0.2 }}
                aria-label="delete"
                loading={isDeletingOpenHours}
              >
                <DeleteIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )
        }
      </Box>
      <Typography sx={{ fontSize: 12 }}>
        {getDisplayedTime(start, end)}
      </Typography>
    </Box>
  );
};

export default CustomEventComponent;
