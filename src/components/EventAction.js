import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

const EventAction = ({ title, onClick, Icon }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        onClick={onClick}
        onMouseDown={(e) => e.stopPropagation()} // otherwise, it triggers with onDragStart
        sx={{ padding: 0.2 }}
        aria-label={title}
      >
        <Icon sx={{ fontSize: 15 }} />
      </IconButton>
    </Tooltip>
  );
};

export default EventAction;
