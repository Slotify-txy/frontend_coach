import React, { useEffect, useCallback, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndProp from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import { v4 as uuidv4 } from 'uuid';
import { openHourApiSlice as openHourApi } from '../../api/openHourApiSlice'
import { useDispatch } from 'react-redux'
import { Box } from '@mui/material'
import { convertSlots } from '../../util/slotUtil'
import CustomEventComponent from '../Calendar/CustomEventComponent'
import * as SlotStatusConstants from "../../constants/slotStatus"

const moment = extendMoment(Moment)
const localizer = momentLocalizer(Moment)
const timeFormat = "YYYY-MM-DD[T]HH:mm:ss"
const DnDCalendar = withDragAndProp(Calendar)

export default function OpenHourCalendar({ height, data, isFetching }) {

    const dispatch = useDispatch()
    const onChangeOpenHourTime = useCallback(
        (start, end, id) => {
            if (isOverlapped(start, end, id)) {
                return
            }
            dispatch(
                openHourApi.util.upsertQueryData('getOpenHours', { coachId: 10 },
                    data.map(openHour =>
                        openHour.id === id ?
                            { ...openHour, start: moment(start).format(timeFormat), end: moment(end).format(timeFormat) }
                            : openHour
                    )
                )
            )
        },
        [data]
    )

    const onSelect = useCallback(
        (start, end) => {
            if (isOverlapped(start, end)) {
                return
            }
            dispatch(
                openHourApi.util.upsertQueryData('getOpenHours', { coachId: 10 },
                    [...data, {
                        id: uuidv4(),
                        start: moment(start).format(timeFormat),
                        end: moment(end).format(timeFormat),
                        isDraggable: true,
                        status: SlotStatusConstants.AVAILABLE
                    }]
                ),
            )
        },
        [data]
    )

    // check if the open hour will overlaps with existing open hours
    const isOverlapped = useCallback(
        (start, end, id = undefined) => {
            return !data.every(openHour => {
                if (id && openHour.id === id) {
                    return true;
                }
                const range1 = moment.range(start, end);
                const range2 = moment.range(moment(openHour.start), moment(openHour.end));
                const result = range1.overlaps(range2)
                if (result) {
                    // todo: send notification
                    return false
                }
                return true
            })
        }, [data])

    if (isFetching) {
        return <Box>Loading...</Box>
    }

    return (
        <Box style={{ height }}>
            <DnDCalendar
                localizer={localizer}
                events={convertSlots(data)}
                // timeslots={30}
                // step={1}
                draggableAccessor={"isDraggable"}
                views={['month', 'week']}
                defaultView='week'
                // drilldownView="week"
                onEventDrop={({ start, end, event }) => {
                    if (start.getDay() === end.getDay()) {
                        onChangeOpenHourTime(start, end, event.id)
                    }
                }}
                onEventResize={({ start, end, event }) => {
                    onChangeOpenHourTime(start, end, event.id)
                }}
                selectable={'true'}
                onSelectSlot={({ start, end }) => {
                    onSelect(start, end)
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
    )
}

