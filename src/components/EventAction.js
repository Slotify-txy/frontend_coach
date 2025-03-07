import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

const EventAction = ({
  title,
  onClick,
  Icon,
  fontSize = 14,
  disabled = false,
  isLoading = false,
}) => {
  return (
    <Tooltip title={title} placement="top">
      <span>
        <IconButton
          onClick={onClick}
          onMouseDown={(e) => e.stopPropagation()} // otherwise, it triggers with onDragStart
          sx={{ padding: 0.2 }}
          aria-label={title}
          disabled={disabled || isLoading}
          loading={isLoading}
        >
          <Icon sx={{ fontSize }} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default EventAction;
