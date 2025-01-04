import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { blue, green, orange, purple, teal } from '@mui/material/colors';
import moment from 'moment-timezone';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import * as SlotStatusConstants from '../../common/constants/slotStatus';
import { convertStatusToText } from '../../common/util/slotUtil';

const statusColor = {
  [SlotStatusConstants.AVAILABLE]: {
    backgroundColor: blue[400],
    color: blue[900],
  },
  [SlotStatusConstants.SCHEDULING]: {
    backgroundColor: orange[400],
    color: orange[900],
  },
  [SlotStatusConstants.PLANNING]: {
    backgroundColor: purple[400],
    color: purple[900],
  },
  [SlotStatusConstants.UNPUBLISHED]: {
    backgroundColor: teal[400],
    color: teal[900],
  },
  [SlotStatusConstants.APPOINTMENT]: {
    backgroundColor: green[400],
    color: green[900],
  },
};

const CustomEventComponent = ({
  event,
  setPlanningSlots,
  setSelectedStudent,
}) => {
  const { data, isSuccess } = useGetSlotsQuery({ coachId: 10 });
  const start = moment(event.start).format('hh:mm A');
  const end = moment(event.end).format('hh:mm A');
  const status = event.status;
  const [onHover, setOnHover] = useState(false);
  const dispatch = useDispatch();
  const deleteSlot = useCallback(() => {
    setPlanningSlots((prev) => prev.filter((slot) => slot.id !== event.id));
    // dispatch(
    //   slotApi.util.updateQueryData('getSlots', { coachId: 10 }, (slots) => {
    //     const index = slots.findIndex((slot) => slot.id === event.id);
    //     if (index !== -1) {
    //       slots.splice(index, 1);
    //     }
    //   })
    // );
  }, [setPlanningSlots]);

  return (
    <Box
      sx={{
        height: '100%',
        paddingX: '0.3rem',
        overflow: 'hidden',
        backgroundColor: statusColor[status].backgroundColor,
        borderRadius: 2,
      }}
      onMouseEnter={() => {
        setOnHover(true);
        setSelectedStudent(event.studentId);
      }}
      onMouseLeave={() => {
        setOnHover(false);
        setSelectedStudent(null);
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
                onClick={deleteSlot}
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
