import React from 'react';

import './error.css';

function Error({ message }) {
  return <div className="error">{message}</div>;
}

export default Error;
