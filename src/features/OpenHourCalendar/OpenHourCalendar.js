import { Box } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback } from 'react';
import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useGetOpenHoursQuery } from '../../app/services/openHourApiSlice';
import SLOT_STATUS from '../../common/constants/slotStatus';
import { convertSlots, isOverlapped } from '../../common/util/slotUtil';
import CustomEventComponent from './CustomEventComponent';
import StyledCalendar from '../../components/StyledCalendar';
import AUTH_STATUS from '../../common/constants/authStatus';
import { enqueueSnackbar } from 'notistack';

const moment = extendMoment(Moment);
const localizer = momentLocalizer(Moment);

export default function OpenHourCalendar({
  planningOpenHours,
  setPlanningOpenHours,
  openHourCalendarView,
  openHourCalendarDate,
}) {
  const { user, status } = useSelector((state) => state.auth);
  const { data: publishedOpenHours } = useGetOpenHoursQuery(
    { coachId: user?.id },
    {
      selectFromResult: (result) => {
        result.data = convertSlots(result.data ?? []);
        return result;
      },
      skip: status != AUTH_STATUS.AUTHENTICATED || user == null,
    }
  );
  const onChangeOpenHourTime = useCallback(
    (start, end, id) => {
      if (moment(start).isBefore(moment.now())) {
        enqueueSnackbar('The start time must be set to a future time!', {
          variant: 'warning',
        });
        return;
      }

      if (
        isOverlapped(
          [...publishedOpenHours, ...planningOpenHours],
          start,
          end,
          id
        )
      ) {
        enqueueSnackbar("Slots can't be overlapped!", {
          variant: 'warning',
        });
        return;
      }

      if (moment(end).diff(moment(start), 'hours') < 1) {
        enqueueSnackbar('At least 1 hour long!', {
          variant: 'warning',
        });
        return;
      }

      setPlanningOpenHours((prev) => {
        let slot = prev.find((slot) => slot.id === id);
        slot.start = start;
        slot.end = end;
        return prev;
      });
    },
    [publishedOpenHours, planningOpenHours]
  );

  const onSelect = useCallback(
    (start, end) => {
      if (moment(start).isBefore(moment.now())) {
        enqueueSnackbar('The start time must be set to a future time!', {
          variant: 'warning',
        });
        return;
      }

      if (
        isOverlapped([...publishedOpenHours, ...planningOpenHours], start, end)
      ) {
        enqueueSnackbar("Slots can't be overlapped!", {
          variant: 'warning',
        });
        return;
      }

      if (moment(end).diff(moment(start), 'hours') < 1) {
        enqueueSnackbar('At least 1 hour long!', {
          variant: 'warning',
        });
        return;
      }

      setPlanningOpenHours((prev) => [
        ...prev,
        {
          id: uuidv4(),
          start: start,
          end: end,
          status: SLOT_STATUS.PLANNING_OPEN_HOUR,
          isDraggable: true,
        },
      ]);
    },
    [publishedOpenHours, planningOpenHours]
  );

  return (
    <Box style={{ height: '100%' }}>
      <StyledCalendar
        localizer={localizer}
        events={[...publishedOpenHours, ...planningOpenHours]}
        date={openHourCalendarDate}
        view={openHourCalendarView}
        onEventDrop={({ start, end, event }) => {
          if (start.getDay() === end.getDay()) {
            onChangeOpenHourTime(start, end, event.id);
          }
        }}
        onEventResize={({ start, end, event }) => {
          onChangeOpenHourTime(start, end, event.id);
        }}
        onSelectSlot={({ start, end }) => {
          onSelect(start, end);
        }}
        createCustomEventComponent={(props) => (
          <CustomEventComponent
            setPlanningOpenHours={setPlanningOpenHours}
            {...props}
          />
        )}
      />
    </Box>
  );
}
