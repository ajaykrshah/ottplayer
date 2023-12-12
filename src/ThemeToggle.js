// ThemeToggle.js

import React from 'react';
import './ThemeToggle.css'; // Import the CSS for toggle styles

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className={`toggle-container ${isDarkMode ? 'dark' : 'light'}`}>
      <input
        type="checkbox"
        className="toggle-checkbox"
        id="toggle"
        checked={isDarkMode}
        onChange={toggleTheme}
      />
      <label className="toggle-label" htmlFor="toggle">
        <span className="toggle-ball"></span>
      </label>
      <p>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
    </div>
  );
};

export default ThemeToggle;
