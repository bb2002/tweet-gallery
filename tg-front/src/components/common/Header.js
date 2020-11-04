import React from 'react';
import styled from "styled-components"
import {Link} from "react-router-dom"

const HeaderWrapper = styled.div`
    position: absolute;
    height: 80px;
    width: 100%;
    top: 0;
    left: 0;
    border-bottom: 1px solid #74b9ff;
    background-color: #0984e3;

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }
`

const Logo = styled.img`
    width: 220px;
`

const Header = () => {
    return (
        <HeaderWrapper>
            <div className="container">
                <Link to="/">
                    <Logo src="/static/images/logo.png" alt="트위터 갤러리" />
                </Link>
            </div>
        </HeaderWrapper>
    );
};

export default Header;