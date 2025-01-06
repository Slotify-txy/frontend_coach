import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { blue, orange } from '@mui/material/colors';
import moment from 'moment-timezone';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  openHourApiSlice as api,
  useGetOpenHoursQuery,
} from '../../app/services/openHourApiSlice';
import * as SlotStatusConstants from '../../common/constants/slotStatus';
import {
  convertStatusToText,
  getStatusColor,
} from '../../common/util/slotUtil';

const statusColor = {
  [SlotStatusConstants.AVAILABLE]: {
    backgroundColor: blue[400],
    color: blue[900],
  },
  [SlotStatusConstants.PUBLISHED]: {
    backgroundColor: orange[400],
    color: orange[900],
  },
};

const CustomEventComponent = ({ event, setAvailableOpenHours }) => {
  const start = moment(event.start).format('hh:mm A');
  const end = moment(event.end).format('hh:mm A');
  const status = event.status;
  const [onHover, setOnHover] = useState(false);
  const { backgroundColor, color } = getStatusColor(status);
  const deleteOpenHour = useCallback(() => {
    if (event.status !== SlotStatusConstants.AVAILABLE) {
      return;
    }
    setAvailableOpenHours((prev) =>
      prev.filter((slot) => slot.id !== event.id)
    );
  }, [event]);

  return (
    <Box
      sx={{
        height: '100%',
        paddingX: '0.3rem',
        overflow: 'hidden',
        backgroundColor: backgroundColor,
        borderRadius: 2,
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
            alignSelf: 'center',
            color: color,
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
                sx={{ padding: 0, alignSelf: 'center' }}
                aria-label="delete"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
        }
      </Box>
      <Typography sx={{ fontSize: 15, alignSelf: 'center' }}>
        {start} - {end}
      </Typography>
    </Box>
  );
};

export default CustomEventComponent;
