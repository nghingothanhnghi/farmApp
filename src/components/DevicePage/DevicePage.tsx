/* components/pages/DevicePage.tsx*/
import React, { useState } from 'react';
import DeviceListDemoPage from './DeviceListDemoPage';
import DeviceListNormalPage from './DeviceListNormalPage';
import Button from '../common/Button';


function DevicePage() {
    const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

    const toggleMode = () => {
        setIsDemoMode(!isDemoMode);
    };

    return (
        <React.Fragment>
            <div className="mb-4 flex justify-end">
                <Button
                    label={isDemoMode ? "Switch to Normal Mode" : "Switch to Demo Mode"}
                    onClick={toggleMode}
                    variant="secondary"
                />
            </div>
            {isDemoMode ? <DeviceListDemoPage /> : <DeviceListNormalPage />}
        </React.Fragment>
    );
}

export default DevicePage;