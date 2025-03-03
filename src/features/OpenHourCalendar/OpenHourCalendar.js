import { Box } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndProp from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  openHourApiSlice as openHourApi,
  useGetOpenHoursQuery,
} from '../../app/services/openHourApiSlice';
import SLOT_STATUS from '../../common/constants/slotStatus';
import { convertSlots, isOverlapped } from '../../common/util/slotUtil';
import CustomEventComponent from './CustomEventComponent';
import StyledCalendar from '../../components/StyledCalendar';
import AUTH_STATUS from '../../common/constants/authStatus';
import { enqueueSnackbar } from 'notistack';

const moment = extendMoment(Moment);
const localizer = momentLocalizer(Moment);
const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';
const DnDCalendar = withDragAndProp(Calendar);

export default function OpenHourCalendar({
  planningOpenHours,
  setPlanningOpenHours,
  openHourCalendarView,
  openHourCalendarDate,
}) {
  const { user, status } = useSelector((state) => state.auth);
  const {
    data: publishedOpenHours,
    isFetching,
    isSuccess,
  } = useGetOpenHoursQuery(
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
      if (
        isOverlapped([...publishedOpenHours, ...planningOpenHours], start, end)
      ) {
        enqueueSnackbar("Slots can't be overlapped!", {
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

  if (isFetching) {
    return <Box>Loading...</Box>;
  }

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
