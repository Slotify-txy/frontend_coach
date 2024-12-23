import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { blue, orange } from '@mui/material/colors';
import moment from 'moment-timezone';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  openHourApiSlice as api,
  useGetOpenHoursQuery,
} from '../../api/openHourApiSlice';
import * as SlotStatusConstants from '../../constants/slotStatus';
import { convertStatusToText } from '../../util/slotUtil';

const statusColor = {
  [SlotStatusConstants.AVAILABLE]: {
    backgroundColor: blue[400],
    color: blue[900],
  },
  [SlotStatusConstants.SCHEDULING]: {
    backgroundColor: orange[400],
    color: orange[900],
  },
};

const CustomEventComponent = ({ event }) => {
  const { data, isSuccess } = useGetOpenHoursQuery({ coachId: 10 });
  const start = moment(event.start).format('hh:mm A');
  const end = moment(event.end).format('hh:mm A');
  const status = event.status;
  const [onHover, setOnHover] = useState(false);
  const dispatch = useDispatch();

  const deleteOpenHour = useCallback(() => {
    isSuccess &&
      dispatch(
        api.util.upsertQueryData(
          'getOpenHours',
          { coachId: 10 },
          data.filter((slot) => slot.id !== event.id)
        )
      );
  }, [data, isSuccess]);

  return (
    <Box
      sx={{
        height: '100%',
        paddingX: '0.3rem',
        overflow: 'hidden',
        backgroundColor: statusColor[status].backgroundColor,
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
            color: statusColor[status].color,
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
