import { Box } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { v4 as uuidv4 } from 'uuid';
import SLOT_STATUS from '../../common/constants/slotStatus';
import {
  computeStudentAvailableSlots,
  convertSlots,
  getUnschedulingSlots,
  IsCalendarSlotWithinAvailableTimes,
  isOverlapped,
  isWithinAvailableTimes,
} from '../../common/util/slotUtil';
import CustomEventComponent from './CustomEventComponent';
import StyledCalendar from '../../components/StyledCalendar';
import DND_TYPE from '../../common/constants/dnd';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllStudents } from './StudentList/studentSlice';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import AUTH_STATUS from '../../common/constants/authStatus';
import { all } from 'axios';

const moment = extendMoment(Moment);

export default function ScheduleCalendar({
  planningSlots,
  setPlanningSlots,
  draggedStudent,
  setDraggedStudent,
  selectedStudent,
  setSelectedStudent,
  hoveredEvent,
  setHoveredEvent,
  scheduleCalendarView,
  scheduleCalendarDate,
  setDroppedStudent,
}) {
  const { user, status } = useSelector((state) => state.auth);

  const {
    data: allSlots,
    isFetching: isFetchingAllSlots,
    isSuccess: isAllSlotsSuccess,
  } = useGetSlotsQuery(
    { coachId: user?.id },
    {
      selectFromResult: (result) => {
        result.data = convertSlots(result.data ?? []);
        return result;
      },
      skip: status != AUTH_STATUS.AUTHENTICATED || user == null,
    }
  );

  const allStudents = useSelector(selectAllStudents);
  const studentAvailableSlots = useMemo(
    () => computeStudentAvailableSlots(allSlots),
    [allSlots]
  );

  const unschedulingSlots = useMemo(
    () => getUnschedulingSlots(allSlots),
    [allSlots]
  );

  const slotPropGetter = useCallback(
    (date) => {
      const style = {
        borderLeft: '2px solid green',
        borderRight: '2px solid green',
      };
      const student = draggedStudent == null ? selectedStudent : draggedStudent;
      if (student == null) {
        return;
      }

      const ret = IsCalendarSlotWithinAvailableTimes(
        studentAvailableSlots[student.id] ?? [],
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
    [selectedStudent, draggedStudent, studentAvailableSlots]
  );

  const onChangeSlotTime = useCallback(
    (start, end, id) => {
      if (
        !isWithinAvailableTimes(
          studentAvailableSlots[draggedStudent.id] ?? [],
          start,
          end
        ) ||
        isOverlapped([...unschedulingSlots, ...planningSlots], start, end, id)
      ) {
        // todo: notifications
        return;
      }
      setPlanningSlots((prev) => {
        let slot = prev.find((slot) => slot.id === id);
        slot.start = start;
        slot.end = end;
        return prev;
      });
    },
    [draggedStudent, unschedulingSlots, planningSlots, setPlanningSlots]
  );

  const onDropFromOutside = useCallback(
    ({ start, end }) => {
      // By default, each class's duration is 1 hour
      end = moment(end).add(0.5, 'hours');
      if (
        !isWithinAvailableTimes(
          studentAvailableSlots[draggedStudent.id] ?? [],
          start,
          end
        ) ||
        isOverlapped([...unschedulingSlots, ...planningSlots], start, end)
      ) {
        return;
      }
      setDroppedStudent(draggedStudent.id);
      setPlanningSlots((prev) => [
        ...prev,
        {
          id: uuidv4(),
          studentId: draggedStudent.id,
          start: moment(start).toDate(),
          end: end.toDate(),
          status: SLOT_STATUS.PLANNING_SCHEDULE,
          isDraggable: true,
        },
      ]);
    },
    [
      studentAvailableSlots,
      draggedStudent,
      unschedulingSlots,
      planningSlots,
      setPlanningSlots,
      setDroppedStudent,
    ]
  );

  const dragFromOutsideItem = useCallback(() => null, [draggedStudent]);

  // useEffect(() => {
  //   console.log(planningSlots);
  // }, [planningSlots]);

  // useEffect(() => {
  //   console.log('selectedStudent', selectedStudent);
  // }, [selectedStudent]);

  // useEffect(() => {
  //   console.log('draggedStudent', draggedStudent);
  // }, [draggedStudent]);

  const [{ handlerId }, drop] = useDrop({
    accept: [DND_TYPE.ARRANGING_STUDENT, DND_TYPE.SCHEDULING_STUDENT],
  });
  /**
   * Need to figure out
   * 1. how to diplay preview that takes more than 1 slot
   */
  return (
    <Box style={{ height: '100%' }} ref={drop}>
      <StyledCalendar
        events={[...unschedulingSlots, ...planningSlots]}
        date={scheduleCalendarDate}
        view={scheduleCalendarView}
        onEventDrop={({ start, end, event }) => {
          const { id, status } = event;
          if (status === SLOT_STATUS.PLANNING_SCHEDULE) {
            setDraggedStudent(null);
          }
          if (start.getDay() === end.getDay()) {
            onChangeSlotTime(start, end, id);
          }
        }}
        onEventResize={({ start, end, event }) => {
          onChangeSlotTime(start, end, event.id);
        }}
        resizable={false}
        selectable={false}
        slotPropGetter={slotPropGetter}
        dragFromOutsideItem={dragFromOutsideItem}
        onDropFromOutside={onDropFromOutside}
        onDragStart={(e) => {
          const { studentId, status } = e.event;
          if (status === SLOT_STATUS.PLANNING_SCHEDULE) {
            setDraggedStudent(
              allStudents.find((student) => student.id === studentId)
            );
          }
        }}
        createCustomEventComponent={(props) => (
          <CustomEventComponent
            selectedStudent={selectedStudent}
            setPlanningSlots={setPlanningSlots}
            setSelectedStudent={setSelectedStudent}
            hoveredEvent={hoveredEvent}
            setHoveredEvent={setHoveredEvent}
            {...props}
          />
        )}
      />
    </Box>
  );
}
