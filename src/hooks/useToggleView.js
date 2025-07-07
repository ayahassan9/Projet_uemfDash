import { useState, useEffect } from 'react';

/**
 * Custom hook for toggling between different view modes
 * @param {Object} options - Hook options
 * @param {string} options.initialView - Initial view mode
 * @param {Array} options.availableViews - Available view modes
 * @param {string} options.storageKey - Key for storing preference in localStorage
 * @returns {Object} view, setView, toggleView functions
 */
const useToggleView = ({ 
  initialView = 'grid', 
  availableViews = ['grid', 'list', 'table'], 
  storageKey = 'preferredViewMode' 
}) => {
  // Get saved preference from localStorage or use initialView
  const getSavedView = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved && availableViews.includes(saved) ? saved : initialView;
    } catch (error) {
      return initialView;
    }
  };

  const [view, setView] = useState(getSavedView);

  // Save preference to localStorage when view changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, view);
    } catch (error) {
      console.error('Error saving view preference:', error);
    }
  }, [view, storageKey]);

  // Toggle to next view in the list
  const toggleView = () => {
    const currentIndex = availableViews.indexOf(view);
    const nextIndex = (currentIndex + 1) % availableViews.length;
    setView(availableViews[nextIndex]);
  };

  return {
    view,
    setView,
    toggleView,
    availableViews
  };
};

export default useToggleView;
