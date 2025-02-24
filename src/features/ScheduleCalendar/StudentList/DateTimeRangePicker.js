import { Box, Divider, Stack, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import React, { useState } from 'react';

const DateTimeRangePicker = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Stack direction={'row'} gap={0.5} mt={1} alignItems={'center'}>
        <DatePicker
          fullWidth
          slotProps={{
            textField: { size: 'small' },
            openPickerIcon: { fontSize: 'small' },
          }}
          disablePast
          maxDate={end}
          label="Start"
          value={start}
          onChange={(newValue) => setStart(newValue)}
        />
        <Typography sx={{ fontWeight: 100 }}>-</Typography>
        <DatePicker
          fullWidth
          slotProps={{
            textField: { size: 'small' },
            openPickerIcon: { fontSize: 'small' },
          }}
          disablePast
          minDate={start}
          label="End"
          value={end}
          onChange={(newValue) => setEnd(newValue)}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default DateTimeRangePicker;
