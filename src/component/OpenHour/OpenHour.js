import React from 'react'
import ScheduleCalendar from './OpenHourCalendar'
import Grid from '@mui/material/Unstable_Grid2'
import { ActionBar } from './ActionBar'
import { Box, Divider } from '@mui/material'
import { useGetOpenHoursQuery } from '../../api/openHourApiSlice'

const OpenHour = ({ navBarHeight }) => {

    const { data, isFetching, isSuccess } = useGetOpenHoursQuery({ coachId: 10 })


    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', height: `calc(100% - ${navBarHeight}px)` }}>
            <Box sx={{ flex: 1 }}>
                <ScheduleCalendar height={"100%"} data={data} isFetching={isFetching} />
            </Box>
            <Divider orientation="vertical" sx={{ ml: 1 }} />
            <Box sx={{ height: "100%", width: 70 }}>
                <ActionBar data={data} isFetching={isFetching} />
            </Box>
        </Box>

    )
}

export default OpenHour