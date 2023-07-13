import React, { useState, useEffect } from 'react';
import { isMobileDevice } from './utils/functions';

const predefinedScreenSizes = [
  {
    width: 359,
    size: 'xxs',
  },
  {
    width: 575,
    size: 'xs',
  },
  {
    width: 767,
    size: 'sm',
  },
  {
    width: 991,
    size: 'md',
  },
  {
    width: 1199,
    size: 'lg',
  },
  {
    width: 1365,
    size: 'xl',
  },
];

const responsiveContext = React.createContext({});

export const ResponsiveProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenResolution, setScreenResolution] = useState({});
  const [screenSize, setScreenSize] = useState('sm');
  const [isSmScreen, setIsSmScreen] = useState(false);
  const [isLgScreen, setIsLgScreen] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(
        isMobileDevice.any() || window.innerWidth <= 767 ? true : false
      );
      setScreenResolution({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      let currentScreenSize = 'xl';
      for (let i in predefinedScreenSizes) {
        if (window.innerWidth <= predefinedScreenSizes[i].width) {
          currentScreenSize = predefinedScreenSizes[i].size;
          break;
        }
      }
      setScreenSize(currentScreenSize);
      setIsSmScreen(window.innerWidth <= 767);
      setIsLgScreen(window.innerWidth >= 992);
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <responsiveContext.Provider
      value={{
        isMobile,
        screenResolution,
        screenSize,
        isSmScreen,
        isLgScreen,
      }}>
      {children}
    </responsiveContext.Provider>
  );
};

export const useResponsive = () => {
  const { isMobile, screenResolution, screenSize, isSmScreen, isLgScreen } =
    React.useContext(responsiveContext);
  return { isMobile, screenResolution, screenSize, isSmScreen, isLgScreen };
};
