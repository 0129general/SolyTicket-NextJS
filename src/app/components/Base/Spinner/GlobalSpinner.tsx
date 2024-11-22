// components/Base/Spinner.tsx

import React from 'react';

const Spinner = () => (
  <div className="flex justify-center items-center mt-4">
    <div className="spinner"></div>
    <style jsx>{`
      .spinner {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.3); /* Light grey color */
        border-radius: 50%;
        border-top-color: #4E43F1; /* White color for the animated part */
        animation: spin 1s ease infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

export default Spinner;
