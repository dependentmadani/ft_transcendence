import React, { useEffect, useState } from 'react';

const OrientationCheck = () => {
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setOrientation('Portrait');
      } else {
        setOrientation('Landscape');
      }
    };

    handleOrientationChange(); // Initial check

    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return (
    <div>
      <p>Device Orientation: {orientation}</p>
    </div>
  );
};

export default OrientationCheck;


// export default Test