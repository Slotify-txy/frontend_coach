import { Box, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { green, grey } from '@mui/material/colors';
import { useCreateOpenHoursMutation, useDeleteOpenHoursByCoachIdMutation } from '../../api/openHourApiSlice';
import moment from 'moment'

const timeFormat = "YYYY-MM-DD[T]HH:mm:ss"



export const ActionBar = ({ data, isFetching }) => {
    const [createOpenHours, { isLoading: isCreatingOpenHours }] = useCreateOpenHoursMutation()
    const [deleteOpenHoursByCoachId, { isLoading: isDeletingOpenHoursByCoachId }] = useDeleteOpenHoursByCoachIdMutation()

    const publishOpenHours = async () => {
        try {
            await createOpenHours({
                coachId: 10, openHours: data.map(({ start, end }) => {
                    return {
                        startAt: moment(start).format(timeFormat),
                        endAt: moment(end).format(timeFormat),
                    }
                })
            })
        } catch (err) {
            console.error('Failed to save the open hours: ', err)
        }
    }

    const clearOpenHours = async () => {
        try {
            await deleteOpenHoursByCoachId({ coachId: 10 })

        } catch (err) {
            console.error('Failed to clear open hours: ', err)
        }
    }

    return (
        <Box sx={{ pt: 2 }}>
            <Action color={green[700]} icon={<CheckBoxIcon />} tooltip={'Publish Open Hours'} callback={publishOpenHours} disabled={isFetching} />
            <Action color={grey[700]} icon={<DeleteForeverIcon />} tooltip={'Clear'} callback={clearOpenHours} disabled={isFetching} />
        </Box>
    )
}

const Action = ({ color, icon, tooltip, callback, disabled }) => {
    return (
        <Box sx={{ display: 'flex', mb: 2, flexDirection: 'row', justifyContent: 'center' }}>
            <Tooltip title={tooltip} slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -14],
                            },
                        },
                    ],
                },
            }}>
                <span>
                    <IconButton sx={{ color }} onClick={callback} disabled={disabled}>
                        {icon}
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    )
}
