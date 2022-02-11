import React from 'react';

export default function WebDateTimePicker({ value, onChange }) {
    return React.createElement('input', {
      type: 'time',
      value: value,
      onInput: onChange,
    })
  }