// "use client"

import React from 'react';

const Button = ({ imageSrc, onClick }) => {
  return (
    <button
      className="border px-4 py-2 font-bold"
      onClick={onClick}
    >
      <img src={imageSrc} alt="Feature" />
    </button>
  );
};

export default Button;