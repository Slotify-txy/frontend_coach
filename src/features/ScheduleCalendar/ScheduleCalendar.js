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
import {
  decreaseStudentNumOfClassCanBeScheduled,
  selectAllStudents,
} from './StudentList/studentSlice';
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
  const dispatch = useDispatch();

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

  const scheduledClasses = useMemo(() => {
    if (!isAllSlotsSuccess) return new Set();

    return new Set([
      ...allSlots
        .filter(
          (slot) =>
            slot.status === SLOT_STATUS.PENDING ||
            slot.status === SLOT_STATUS.APPOINTMENT
        )
        .map((slot) => slot.classId),
      ...planningSlots.map((slot) => slot.classId),
    ]);
  }, [isAllSlotsSuccess, allSlots, planningSlots]);

  const slotPropGetter = useCallback(
    (date) => {
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
      const backgroundStyle = `2px solid #${ret.classId.slice(-6)}`;

      const style = {
        borderLeft: backgroundStyle,
        borderRight: backgroundStyle,
      };
      if (ret.isStart) {
        style.borderTop = backgroundStyle;
        style.borderRadius = '5px 5px 0 0';
      }
      if (ret.isEnd) {
        style.borderBottom = backgroundStyle;
        style.borderRadius = '0 0 5px 5px';
      }
      return { style };
    },
    [selectedStudent, draggedStudent, studentAvailableSlots]
  );

  const onChangeSlotTime = useCallback(
    (start, end, id, classId = undefined) => {
      if (
        !isWithinAvailableTimes(
          studentAvailableSlots[draggedStudent.id] ?? [],
          scheduledClasses,
          start,
          end,
          classId
        ) ||
        isOverlapped([...unschedulingSlots, ...planningSlots], start, end, id)
      ) {
        // todo: notifications
        return;
      }

      const availableSlot = studentAvailableSlots[draggedStudent.id].find(
        (slot) =>
          moment(slot.start).isSameOrBefore(start) &&
          moment(slot.end).isSameOrAfter(end)
      );
      console.log(availableSlot);

      setPlanningSlots((prev) => {
        let slot = prev.find((slot) => slot.id === id);
        slot.start = start;
        slot.end = end;
        slot.classId = availableSlot.classId;
        return prev;
      });
    },
    [
      draggedStudent,
      unschedulingSlots,
      planningSlots,
      setPlanningSlots,
      scheduledClasses,
    ]
  );

  const onDropFromOutside = useCallback(
    ({ start, end }) => {
      // By default, each class's duration is 1 hour
      start = moment(start);
      end = moment(end).add(0.5, 'hours');
      if (
        !isWithinAvailableTimes(
          studentAvailableSlots[draggedStudent.id] ?? [],
          scheduledClasses,
          start,
          end
        ) ||
        isOverlapped([...unschedulingSlots, ...planningSlots], start, end)
      ) {
        return;
      }
      setDroppedStudent(draggedStudent.id);

      const slot = studentAvailableSlots[draggedStudent.id].find(
        (slot) =>
          moment(slot.start).isSameOrBefore(start) &&
          moment(slot.end).isSameOrAfter(end)
      );

      setPlanningSlots((prev) => [
        ...prev,
        {
          id: uuidv4(),
          studentId: draggedStudent.id,
          start: start.toDate(),
          end: end.toDate(),
          status: SLOT_STATUS.PLANNING_SCHEDULE,
          classId: slot.classId,
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
      scheduledClasses,
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
    accept: [DND_TYPE.ARRANGING_STUDENT],
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
          const { id, status, classId } = event;
          if (status === SLOT_STATUS.PLANNING_SCHEDULE) {
            setDraggedStudent(null);
          }
          if (start.getDay() === end.getDay()) {
            onChangeSlotTime(start, end, id, classId);
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
