import { Avatar, Badge, Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import moment from 'moment-timezone'
import React, { useCallback, useEffect, useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { openHourApiSlice as api, useGetOpenHoursQuery } from '../../api/openHourApiSlice'
import { blue, green, orange, teal } from '@mui/material/colors';
import * as SlotStatusConstants from "../../constants/slotStatus"
import { convertStatusToText } from '../../util/slotUtil';
import { useGetSlotsQuery } from '../../api/slotApiSlice';

const statusColor = {
    [SlotStatusConstants.AVAILABLE]: {
        backgroundColor: blue[400],
        color: blue[900],
    },
    [SlotStatusConstants.SCHEDULING]: {
        backgroundColor: orange[400],
        color: orange[900],
    },
    [SlotStatusConstants.UNPUBLISHED]: {
        backgroundColor: teal[400],
        color: teal[900],
    },
    [SlotStatusConstants.APPOINTMENT]: {
        backgroundColor: green[400],
        color: green[900],
    },
}


const CustomEventComponent = ({ event, selectedStudent, setSelectedStudent }) => {
    const { data, isSuccess } = useGetSlotsQuery({ coachId: 10 })
    const { id: eventId, studentId, name, email, start, end, status } = event.event
    const eventStart = moment(start).format('hh:mm A')
    const eventEnd = moment(end).format('hh:mm A')
    const dispatch = useDispatch()

    const deleteSlot = useCallback(() => {
        isSuccess &&
            dispatch(
                api.util.upsertQueryData('getSlots', { coachId: 10 }, data.filter(slot => slot.id !== eventId))
            )
    }, [data, isSuccess])

    return (
        <Box sx={{ height: '100%', paddingX: "0.3rem", overflow: 'hidden', backgroundColor: statusColor[status].backgroundColor, borderRadius: 2 }} onMouseEnter={() => {
            setSelectedStudent(studentId)
        }} onMouseLeave={() => {
            setSelectedStudent(null)
        }}>
            <Box sx={{ display: "flex", width: '100%', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, alignSelf: 'center', color: statusColor[status].color }} >{convertStatusToText(status)}</Typography>
                {
                    // todo: make ui better
                    selectedStudent == studentId &&
                    <Tooltip title="Delete">
                        <IconButton onClick={deleteSlot} sx={{ padding: 0, alignSelf: 'center' }} aria-label="delete">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                }

            </Box>
            <Chip
                avatar={<Avatar alt={name} src="/static/images/avatar/1.jpg" />}
                label={name}
                variant="outlined"
                size='medium'
                sx={{ alignSelf: 'center' }}
            />
            {/* <Typography sx={{ fontSize: 15, alignSelf: 'center' }}>{eventStart} - {eventEnd}</Typography> */}

        </Box>

    )
}

export default CustomEventComponent