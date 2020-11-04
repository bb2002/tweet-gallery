import React from 'react';

const FullPageWrapper = ({children}) => {
    return (
        <div style={{
            width: "100%",
            height: `100vh`
        }}>
            {children}
        </div>
    );
};

export default FullPageWrapper;