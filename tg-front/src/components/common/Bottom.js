import React from 'react';
import styled from "styled-components"

const BottomWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 38px;
    background-color: #111111;
    
    p {
        color: white;
        margin: 0px;
        padding: 0px;
        font-size: 0.8rem;
    }
`


const Bottom = () => {
    return (
        <BottomWrapper>
            <p>Copyright (c) 2015-2020 Saint software All rights reserved.</p>
        </BottomWrapper>
    );
};

export default Bottom;