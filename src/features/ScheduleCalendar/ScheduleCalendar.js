import { Box } from '@mui/material';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { useCallback, useEffect, useMemo } from 'react';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { v4 as uuidv4 } from 'uuid';
import SLOT_STATUS from '../../common/constants/slotStatus';
import {
  computeStudentAvailableSlots,
  convertSlots,
  getPendingAndAppointmentSlots,
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
import { selectAllStudents } from '../common/studentSlice';
import { useGetSlotsQuery } from '../../app/services/slotApiSlice';
import AUTH_STATUS from '../../common/constants/authStatus';
import {
  addSlotToPlanningSlots,
  selectTransformedPlanningSlots,
  updateSlotInPlanningSlots,
} from '../common/slotSlice';
import { enqueueSnackbar } from 'notistack';

const moment = extendMoment(Moment);

export default function ScheduleCalendar({
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
  const planningSlots = useSelector(selectTransformedPlanningSlots);
  const dispatch = useDispatch();

  const {
    data: allSlots,
    isSuccess: isAllSlotsSuccess,
    refetch: refetchAllSlots,
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

  const pendingAndAppointmentSlots = useMemo(
    () => getPendingAndAppointmentSlots(allSlots),
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
      const backgroundStyle = `1px solid #${ret.classId.slice(-6)}`;

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
        )
      ) {
        enqueueSnackbar(
          "Not in the student's available hours or double booking!",
          {
            variant: 'warning',
          }
        );
        return;
      }
      if (
        isOverlapped(
          [...pendingAndAppointmentSlots, ...planningSlots],
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

      const availableSlot = studentAvailableSlots[draggedStudent.id].find(
        (slot) =>
          moment(slot.start).isSameOrBefore(start) &&
          moment(slot.end).isSameOrAfter(end)
      );

      dispatch(
        updateSlotInPlanningSlots({
          id,
          start: start.toISOString(),
          end: end.toISOString(),
          classId: availableSlot.classId,
        })
      );
    },
    [
      draggedStudent,
      pendingAndAppointmentSlots,
      planningSlots,
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
        )
      ) {
        enqueueSnackbar(
          "Not in the student's available hours or double booking!",
          {
            variant: 'warning',
          }
        );
        return;
      }
      if (
        isOverlapped(
          [...pendingAndAppointmentSlots, ...planningSlots],
          start,
          end
        )
      ) {
        enqueueSnackbar("Slots can't be overlapped!", {
          variant: 'warning',
        });
      }

      setDroppedStudent(draggedStudent.id);

      const slot = studentAvailableSlots[draggedStudent.id].find(
        (slot) =>
          moment(slot.start).isSameOrBefore(start) &&
          moment(slot.end).isSameOrAfter(end)
      );

      dispatch(
        addSlotToPlanningSlots({
          id: uuidv4(),
          studentId: draggedStudent.id,
          start: start.format(),
          end: end.format(),
          status: SLOT_STATUS.PLANNING_SCHEDULE,
          classId: slot.classId,
          isDraggable: true,
        })
      );
    },
    [
      studentAvailableSlots,
      draggedStudent,
      pendingAndAppointmentSlots,
      planningSlots,
      setDroppedStudent,
      scheduledClasses,
    ]
  );

  const dragFromOutsideItem = useCallback(() => null, [draggedStudent]);

  const [, drop] = useDrop({
    accept: [DND_TYPE.ARRANGING_STUDENT],
  });

  useEffect(() => {
    refetchAllSlots();
  }, []);
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
