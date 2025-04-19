import { Box, Popper, Typography } from '@mui/material';
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
import EventAction from '../../components/EventAction';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomEventComponent = ({ event, setPlanningOpenHours }) => {
  const { start, end, status } = event;
  const [onHover, setOnHover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
    <Box
      sx={{
        height: '100%',
        paddingX: '0.3rem',
        overflow: 'hidden',
        backgroundColor: backgroundColor,
        borderRadius: '8px',
      }}
      onMouseEnter={(event) => {
        setOnHover(true);
        setAnchorEl(event.currentTarget);
      }}
      onMouseLeave={() => {
        setOnHover(false);
        setAnchorEl(null);
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
      <Popper
        open={onHover}
        anchorEl={anchorEl}
        placement="top-end"
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: false,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
        ]}
      >
        <EventAction
          key={'Delete'}
          title="Delete"
          onClick={deleteOpenHour}
          Icon={DeleteIcon}
          fontSize={20}
          isLoading={isDeletingOpenHours}
        />
      </Popper>
    </Box>
  );
};

export default CustomEventComponent;
