import { Box } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndProp from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useDispatch } from 'react-redux';
import { slotApiSlice as slotApi } from '../../app/services/slotApiSlice';
import * as SlotStatusConstants from '../../constants/slotStatus';
import CustomEventComponent from '../../features/OpenHour/CustomEventComponent';
import {
  IsCalendarSlotWithinAvailableTimes,
  convertSlots,
} from '../../util/slotUtil';
const moment = extendMoment(Moment);
const localizer = momentLocalizer(Moment);
const timeFormat = 'YYYY-MM-DD[T]HH:mm:ss';
const DnDCalendar = withDragAndProp(Calendar);

export default function ScheduleCalendar({
  height,
  allSlots,
  draggedStudent,
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
}) {
  const pendingSlots = useMemo(
    () =>
      convertSlots(allSlots).filter(
        (slot) => slot.status !== SlotStatusConstants.SCHEDULING
      ),
    [allSlots]
  );

  const availableSlots = useMemo(() => {
    const ret = {};
    allSlots.forEach((slot) => {
      if (slot.status !== SlotStatusConstants.SCHEDULING) return;
      if (slot.studentId in ret) {
        ret[slot.studentId].push(slot);
      } else {
        ret[slot.studentId] = [slot];
      }
    });

    for (const studentId in ret) {
      ret[studentId].sort((a, b) => moment(a.start) - moment(b.start));
      const ranges = ret[studentId].map((slot) =>
        moment.range(moment(slot.start), moment(slot.end))
      );
      const joinedRanges = [];
      for (let i = 0; i < ranges.length; i++) {
        let range = ranges[i];
        while (i + 1 < ranges.length && range.adjacent(ranges[i + 1])) {
          range = range.add(ranges[i + 1], { adjacent: true });
          i += 1;
        }
        joinedRanges.push(range);
      }
      ret[studentId] = joinedRanges;
    }

    return ret;
  }, [allSlots]);

  const dispatch = useDispatch();

  const slotPropGetter = useCallback(
    (date) => {
      const style = {
        borderLeft: '2px solid green',
        borderRight: '2px solid green',
      };

      if (selectedStudent == null) {
        return;
      }

      const ret = IsCalendarSlotWithinAvailableTimes(
        availableSlots[selectedStudent],
        moment(date)
      );

      if (!ret.isAvailable) {
        return;
      }
      // todo: dynamically set color

      if (ret.isStart) {
        style.borderTop = '2px solid green';
        style.borderRadius = '5px 5px 0 0';
      }
      if (ret.isEnd) {
        style.borderBottom = '2px solid green';
        style.borderRadius = '0 0 5px 5px';
      }
      return { style };
    },
    [selectedStudent]
  );

  const onChangeSlotTime = useCallback((start, end, id) => {
    // if (
    //   isOverlapped(pendingSlots, start, end, id) ||
    //   !isAppointmentWithinAvailableTimes(availableSlots[10], start, end)
    // ) {
    //   // todo: notifications
    //   return;
    // }
    dispatch(
      slotApi.util.updateQueryData('getSlots', { coachId: 10 }, (slots) => {
        let slot = slots.find((slot) => slot.id === id);
        if (slot) {
          slot.start = moment(start).format(timeFormat);
          slot.end = moment(end).format(timeFormat);
        }
      })
    );
  }, []);

  const onDropFromOutside = useCallback(
    ({ start, end }) => {
      dispatch(
        slotApi.util.updateQueryData('getSlots', { coachId: 10 }, (slots) => {
          slots.push({
            id: draggedStudent.id,
            start: moment(start).format(timeFormat),
            end: moment(end).format(timeFormat),
            status: SlotStatusConstants.AVAILABLE,
            isDraggable: true,
          });
        })
      );
    },
    [draggedStudent]
  );

  const dragFromOutsideItem = useCallback(
    () => draggedStudent,
    [draggedStudent]
  );

  useEffect(() => {
    console.log(pendingSlots);
  }, [pendingSlots]);

  return (
    <Box style={{ height }}>
      <DnDCalendar
        localizer={localizer}
        events={pendingSlots}
        // timeslots={30}
        // step={1}
        // draggableAccessor="isDraggable"
        dragFromOutsideItem={dragFromOutsideItem}
        views={['month', 'week']}
        defaultView="week"
        // drilldownView="week"
        onEventDrop={({ start, end, event }) => {
          if (start.getDay() === end.getDay()) {
            onChangeSlotTime(start, end, event.id);
          }
        }}
        // onEventResize={({ start, end, event }) => {
        //     onChangeSlotTime(start, end, event.id)
        // }}
        resizable={false}
        selectable={false}
        // onSelectSlot={({ start, end }) => {
        //     onSelect(start, end)
        // }}
        // eventPropGetter={(event) => {
        //     const backgroundColor = 'yellow';
        //     return { style: { backgroundColor } }
        // }}
        // onRangeChange={(weekdays) => {
        //     setRangeYear(moment(weekdays[0]).year())
        //     setRangeWeek(moment(weekdays[0]).week())
        // }}
        onDropFromOutside={onDropFromOutside}
        // onDragOver={(e) => {
        //   console.log(e.title);
        //   // console.log(e.end);
        // }}
        slotPropGetter={slotPropGetter}
        components={{
          event: CustomEventComponent,
        }}
      />
    </Box>
  );
}
