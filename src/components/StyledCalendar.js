import React, { useCallback, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndProp from 'react-big-calendar/lib/addons/dragAndDrop';
import { Box, Typography } from '@mui/material';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndProp(Calendar);

export default function StyledCalendar({
  events,
  date,
  view,
  onEventDrop,
  onEventResize,
  resizable = true,
  selectable = true,
  onSelectSlot = () => {},
  slotPropGetter,
  dragFromOutsideItem = () => {},
  onDropFromOutside = () => {},
  onDragStart = () => {},
  createCustomEventComponent = () => {},
}) {
  const formats = useMemo(
    () => ({
      timeGutterFormat: (date, culture, localizer) =>
        localizer.format(date, 'h A', culture),
    }),
    []
  );

  const CustomWeekHeader = useCallback(({ date, label }) => {
    const dayOfWeek = moment(date).format('ddd');
    const dayOfMonth = moment(date).format('D');

    const DayOfMonth = useCallback(
      () => (
        <Typography
          style={{
            fontSize: '25px',
            fontWeight: 400,
            lineHeight: '46px',
          }}
        >
          {dayOfMonth}
        </Typography>
      ),
      [dayOfMonth]
    );

    return (
      <Box
        display="flex"
        sx={{
          width: '100%',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '20px',
            backgroundColor: 'black',
            marginLeft: '-1px',
            borderLeft: '1px solid #dde3ea',
          }}
        ></Box>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 500,
            color: moment().isSame(date, 'day') ? '#0B57D0' : '#444476',
            lineHeight: '32px',
            textTransform: 'uppercase',
          }}
        >
          {dayOfWeek}
        </Typography>

        {/* check if the date is today */}
        {moment().isSame(date, 'day') ? (
          <Box
            sx={{
              width: '46px',
              height: '46px',
              backgroundColor: '#0B57D0',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <DayOfMonth />
          </Box>
        ) : (
          <DayOfMonth />
        )}
      </Box>
    );
  }, []);

  return (
    <DnDCalendar
      localizer={localizer}
      events={events}
      date={date}
      draggableAccessor={'isDraggable'}
      views={['month', 'week']}
      view={view}
      onNavigate={() => {}} // to avoid warning
      onView={() => {}} // to avoid warning
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      resizable={resizable}
      selectable={selectable}
      onSelectSlot={onSelectSlot}
      formats={formats}
      toolbar={false}
      slotPropGetter={slotPropGetter}
      dragFromOutsideItem={dragFromOutsideItem}
      onDropFromOutside={onDropFromOutside}
      onDragStart={onDragStart}
      components={{
        event: createCustomEventComponent,
        header: CustomWeekHeader,
      }}
    />
  );
}
