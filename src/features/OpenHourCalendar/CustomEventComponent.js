import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import moment from 'moment-timezone';
import React, { useCallback, useState } from 'react';
import SLOT_STATUS from '../../common/constants/slotStatus';
import {
  convertStatusToText,
  getStatusColor,
} from '../../common/util/slotUtil';
import { useDeleteOpenHourByIdMutation } from '../../app/services/openHourApiSlice';

const CustomEventComponent = ({ event, setPlanningOpenHours }) => {
  const start = moment(event.start).format('hh:mm A');
  const end = moment(event.end).format('hh:mm A');
  const status = event.status;
  const [onHover, setOnHover] = useState(false);
  const backgroundColor = getStatusColor(status);
  const [deleteOpenHourById] = useDeleteOpenHourByIdMutation();

  const deleteOpenHour = useCallback(() => {
    switch (event.status) {
      case SLOT_STATUS.PLANNING_OPEN_HOUR:
        setPlanningOpenHours((prev) =>
          prev.filter((slot) => slot.id !== event.id)
        );
        break;
      case SLOT_STATUS.OPEN_HOUR:
        deleteOpenHourById(event.id);
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
            fontSize: 15,
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
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )
        }
      </Box>
      <Typography sx={{ fontSize: 15 }}>
        {start} - {end}
      </Typography>
    </Box>
  );
};

export default CustomEventComponent;
