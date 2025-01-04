import { Box } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndProp from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { openHourApiSlice as openHourApi } from '../../app/services/openHourApiSlice';
import * as SlotStatusConstants from '../../common/constants/slotStatus';
import { convertSlots, isOverlapped } from '../../common/util/slotUtil';
import CustomEventComponent from './CustomEventComponent';

const moment = extendMoment(Moment);
const localizer = momentLocalizer(Moment);
const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';
const DnDCalendar = withDragAndProp(Calendar);

export default function OpenHourCalendar({ height, data, isFetching }) {
  const dispatch = useDispatch();
  const onChangeOpenHourTime = useCallback(
    (start, end, id) => {
      if (isOverlapped(data, start, end, id)) {
        return;
      }
      dispatch(
        openHourApi.util.upsertQueryData(
          'getOpenHours',
          { coachId: 10 },
          data.map((openHour) =>
            openHour.id === id
              ? {
                  ...openHour,
                  start: moment(start).format(timeFormat),
                  end: moment(end).format(timeFormat),
                }
              : openHour
          )
        )
      );
    },
    [data]
  );

  const onSelect = useCallback(
    (start, end) => {
      if (isOverlapped(data, start, end)) {
        return;
      }
      dispatch(
        openHourApi.util.upsertQueryData('getOpenHours', { coachId: 10 }, [
          ...data,
          {
            id: uuidv4(),
            start: moment(start).format(timeFormat),
            end: moment(end).format(timeFormat),
            isDraggable: true,
            status: SlotStatusConstants.AVAILABLE,
          },
        ])
      );
    },
    [data]
  );

  if (isFetching) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box style={{ height }}>
      <DnDCalendar
        localizer={localizer}
        events={convertSlots(data)}
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
          event: CustomEventComponent,
        }}
      />
    </Box>
  );
}
