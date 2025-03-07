import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import CALENDAR_VIEW from '../../common/constants/calendarView';
import Tab from '../../common/constants/tab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../common/util/stringUtil';

const iconColor = '#353736';
const textColor = '#181818';
const buttonHeight = '40px';

const CalendarControl = ({
  calendarView,
  setCalendarView,
  calendarRange,
  setCalendarDate,
  tab,
  setTab,
}) => {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
        }}
        gap={2}
      >
        <Today setCalendarDate={setCalendarDate} />
        <CalendarNavigator
          setCalendarDate={setCalendarDate}
          calendarView={calendarView}
        />
        <Range calendarView={calendarView} calendarRange={calendarRange} />
      </Stack>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
        }}
        gap={3}
      >
        <ViewSelection
          calendarView={calendarView}
          setCalendarView={setCalendarView}
        />
        <TabSelection tab={tab} setTab={setTab} />
      </Stack>
    </Stack>
  );
};

export default CalendarControl;

const Today = ({ setCalendarDate }) => {
  const date = moment().format('dddd, D MMMM');

  const onClick = useCallback(() => {
    setCalendarDate(new Date());
  }, [setCalendarDate]);

  const button = () => (
    <Button
      variant="outlined"
      onClick={onClick}
      size="medium"
      sx={{
        height: buttonHeight,
        px: 3,
        borderRadius: 8,
        borderWidth: 1,
        color: '#202224',
        borderColor: '#747678',
        '&:hover': {
          backgroundColor: '#e7e8ec',
          borderColor: '#747678',
          boxShadow: 'none',
        },
        textTransform: 'none',
      }}
    >
      <Typography sx={{ fontSize: 15, color: textColor, fontWeight: 500 }}>
        Today
      </Typography>
    </Button>
  );

  return <ControlBtn tooltipTitle={date} Button={button} />;
};

const CalendarNavigator = ({ setCalendarDate, calendarView }) => {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
      }}
    >
      <Previous setCalendarDate={setCalendarDate} calendarView={calendarView} />
      <Next setCalendarDate={setCalendarDate} calendarView={calendarView} />
    </Stack>
  );
};

const Previous = ({ setCalendarDate, calendarView }) => {
  const tooltipTitle = `Previous ${calendarView === CALENDAR_VIEW.WEEK ? 'week' : 'month'} `;

  const onClick = useCallback(() => {
    setCalendarDate((prev) => moment(prev).subtract(1, calendarView).toDate());
  }, [setCalendarDate, calendarView]);

  const button = () => (
    <IconButton variant="outlined" onClick={onClick} sx={{ color: iconColor }}>
      <ChevronLeftIcon />
    </IconButton>
  );
  return <ControlBtn tooltipTitle={tooltipTitle} Button={button} />;
};

const Next = ({ setCalendarDate, calendarView }) => {
  const tooltipTitle = `Next ${calendarView === CALENDAR_VIEW.WEEK ? 'week' : 'month'} `;

  const onClick = useCallback(() => {
    setCalendarDate((prev) => moment(prev).add(1, calendarView).toDate());
  }, [setCalendarDate, calendarView]);

  const button = () => (
    <IconButton variant="outlined" onClick={onClick} sx={{ color: iconColor }}>
      <ChevronRightIcon />
    </IconButton>
  );

  return <ControlBtn tooltipTitle={tooltipTitle} Button={button} />;
};

const Range = ({ calendarView, calendarRange }) => {
  const [shortenedRange, setShortenedRange] = useState();
  useEffect(() => {
    const startDate = calendarRange.start;
    const endDate = calendarRange.end;
    const startMonth = startDate.month();
    const startYear = startDate.year();
    const endMonth = endDate.month();
    const endYear = endDate.year();
    switch (calendarView) {
      case CALENDAR_VIEW.WEEK:
        if (startYear === endYear) {
          if (startMonth === endMonth) {
            setShortenedRange(`${startDate.format('MMMM')} ${startYear}`);
          } else {
            setShortenedRange(
              `${startDate.format('MMM')} - ${endDate.format('MMM')} ${startYear}`
            );
          }
        } else {
          setShortenedRange(
            `${startDate.format('MMM')} ${startYear} - ${endDate.format('MMM')} ${endYear}`
          );
        }
        break;
      case CALENDAR_VIEW.MONTH:
        setShortenedRange(`${startDate.format('MMM')} ${startYear}`);
        break;
      default:
        break;
    }
  }, [calendarView, calendarRange]);

  return (
    <Typography
      variant="h5"
      size="medium"
      sx={{ fontWeight: 300, text: textColor }}
    >
      {shortenedRange}
    </Typography>
  );
};

const ViewSelection = ({ calendarView, setCalendarView }) => {
  const views = [CALENDAR_VIEW.WEEK, CALENDAR_VIEW.MONTH];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          height: buttonHeight,
          borderRadius: 8,
          borderWidth: 1,
          color: '#202224',
          borderColor: '#747678',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#e7e8ec',
            borderColor: '#747678',
            boxShadow: 'none',
          },
        }}
      >
        <Typography sx={{ fontSize: 15, color: textColor, fontWeight: 500 }}>
          {capitalizeFirstLetter(calendarView)}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {views.map((view, index) => (
          <MenuItem
            key={view}
            onClick={() => {
              setCalendarView(view);
              handleClose();
            }}
            selected={view === calendarView}
          >
            {capitalizeFirstLetter(view)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const TabSelection = ({ tab, setTab }) => {
  const navigate = useNavigate();
  const handleChange = useCallback(
    (event, newTab) => {
      if (newTab != null) {
        setTab(newTab);
        navigate(`/${newTab}`);
      }
    },
    [setTab]
  );

  return (
    <ToggleButtonGroup
      value={tab}
      exclusive
      onChange={handleChange}
      size="medium"
      sx={{
        '& .MuiToggleButton-root': {
          '&.Mui-selected': {
            backgroundColor: '#b6e1fe',
            '&:hover': {
              backgroundColor: '#a5ceea', // Hover background color
            },
          },
        },
      }}
    >
      <ControlBtn
        tooltipTitle={'Switch to Open Hour'}
        Button={() => (
          <ToggleButton
            value={Tab.OPEN_HOUR}
            sx={{
              borderTopLeftRadius: 30,
              borderBottomLeftRadius: 30,
              width: '53px',
              height: buttonHeight,
            }}
          >
            <CalendarMonthIcon fontSize="small" />
          </ToggleButton>
        )}
      />

      <ControlBtn
        tooltipTitle={'Switch to Schedule'}
        Button={() => (
          <ToggleButton
            value={Tab.SCHEDULE}
            sx={{
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
              color: iconColor,
              width: '53px',
              height: buttonHeight,
            }}
          >
            <TaskAltIcon fontSize="small" />
          </ToggleButton>
        )}
      />

      <ControlBtn
        tooltipTitle={'Switch to Student List'}
        Button={() => (
          <ToggleButton
            value={Tab.STUDENT}
            sx={{
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
              color: iconColor,
              width: '53px',
              height: buttonHeight,
            }}
          >
            <PeopleIcon fontSize="small" />
          </ToggleButton>
        )}
      />
    </ToggleButtonGroup>
  );
};

const ControlBtn = ({ tooltipTitle, Button }) => {
  return (
    <Tooltip
      title={tooltipTitle}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
    >
      <span>
        <Button />
      </span>
    </Tooltip>
  );
};
