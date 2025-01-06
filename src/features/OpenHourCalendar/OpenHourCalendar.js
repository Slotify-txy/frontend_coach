import { Box } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndProp from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  openHourApiSlice as openHourApi,
  useGetOpenHoursQuery,
} from '../../app/services/openHourApiSlice';
import * as SlotStatusConstants from '../../common/constants/slotStatus';
import { convertSlots, isOverlapped } from '../../common/util/slotUtil';
import CustomEventComponent from './CustomEventComponent';

const moment = extendMoment(Moment);
const localizer = momentLocalizer(Moment);
const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';
const DnDCalendar = withDragAndProp(Calendar);

export default function OpenHourCalendar({
  height,
  availableOpenHours,
  setAvailableOpenHours,
}) {
  const {
    data: publishedOpenHours,
    isFetching,
    isSuccess,
  } = useGetOpenHoursQuery(
    { coachId: 10 },
    {
      selectFromResult: (result) => {
        result.data = convertSlots(result.data ?? []);
        return result;
      },
    }
  );
  const onChangeOpenHourTime = useCallback(
    (start, end, id) => {
      if (
        isOverlapped(
          [...publishedOpenHours, ...availableOpenHours],
          start,
          end,
          id
        )
      ) {
        // todo: notifications
        return;
      }

      setAvailableOpenHours((prev) => {
        let slot = prev.find((slot) => slot.id === id);
        slot.start = start;
        slot.end = end;
        return prev;
      });
    },
    [publishedOpenHours, availableOpenHours]
  );

  const onSelect = useCallback(
    (start, end) => {
      if (
        isOverlapped([...publishedOpenHours, ...availableOpenHours], start, end)
      ) {
        return;
      }
      setAvailableOpenHours((prev) => [
        ...prev,
        {
          id: uuidv4(),
          start: start,
          end: end,
          status: SlotStatusConstants.AVAILABLE,
          isDraggable: true,
        },
      ]);
    },
    [publishedOpenHours, availableOpenHours]
  );

  if (isFetching) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box style={{ height }}>
      <DnDCalendar
        localizer={localizer}
        events={[...publishedOpenHours, ...availableOpenHours]}
        // timeslots={30}
        // step={1}
        draggableAccessor={'isDraggable'}
        views={['month', 'week']}
        defaultView="week"
        // drilldownView="week"
        onEventDrop={({ start, end, event }) => {
          if (start.getDay() === end.getDay()) {
            onChangeOpenHourTime(start, end, event.id);
          }
        }}
        onEventResize={({ start, end, event }) => {
          onChangeOpenHourTime(start, end, event.id);
        }}
        selectable={'true'}
        onSelectSlot={({ start, end }) => {
          onSelect(start, end);
        }}
        // eventPropGetter={(event) => {
        //     const backgroundColor = 'yellow';
        //     return { style: { backgroundColor } }
        // }}
        // onRangeChange={(weekdays) => {
        //     setRangeYear(moment(weekdays[0]).year())
        //     setRangeWeek(moment(weekdays[0]).week())
        // }}
        components={{
          event: (props) => (
            <CustomEventComponent
              setAvailableOpenHours={setAvailableOpenHours}
              {...props}
            />
          ),
        }}
      />
    </Box>
  );
}
