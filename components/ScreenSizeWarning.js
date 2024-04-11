import React, { useState, useEffect } from 'react';

const ScreenSizeWarning = () => {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setShowWarning(window.innerWidth < 1024); // Consider changing to 1024px for typical laptop screens
        };

        // Check on mount
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (!showWarning) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.75)', // Increased fade effect
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px', // Larger text size
            fontWeight: 'bold', // Make text more prominent
            textAlign: 'center',
            padding: '20px', // Ensure text doesn't overflow on small screens
            zIndex: 1000, // Ensure it's above other content
        }}>
            Please access this page from a laptop or desktop
        </div>
    );
};

export default ScreenSizeWarning;
