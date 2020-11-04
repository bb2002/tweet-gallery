import React from 'react';
import styled from 'styled-components';
import FullPageWrapper from "../components/common/FullPageWrapper"
import Header from './common/Header';
import queryString from "query-string"
import {Link} from "react-router-dom"
import { MainWrapper } from '../libs/styles/Wrappers';

const BugIcon = styled.img`
    width: 150px !important;
`

const HomeIcon = styled.img`
    width: 24px !important;
    margin-right: 4px;
    margin-bottom: 2px;
`

const ErrorHeader = styled.h2`
    color: white;
    font-family: "Jalnan";
`

const GotoHome = {
    width: "300px",
    marginTop: "32px"
}

const ErrorComp = ({location}) => {
    const query = queryString.parse(location.search)
    const code = parseInt(query.code)
    
    let sol = ""
    if(isNaN(code)) {
        sol = "오류코드 조작하지 말아주세요..."
    }
    if(code === 401) {
        sol = "트위터 로그인을 다시 해주세요."
    }
    if(code === 500) {
        sol = "내부 서버 오류가 발생했습니다."
    }

    let message = "힝 뭔가 잘못된듯..."
    const random = Math.floor(Math.random() * (4 - 0) + 0);
    if(random === 0) {
        message = "힝 뭔가 잘못된듯..."
    }
    if(random === 1) {
        message = "버그다! 버그가 나타났다!"
    }
    if(random === 2) {
        message = "잠깐 오류가 발생했습니다!"
    }
    if(random === 3) {
        message = "대신 귀여운 버그를 드리겠습니다."
    }

    return (
        <>
            <Header />
            <FullPageWrapper>
                <MainWrapper>
                    <BugIcon src="/static/svgs/bug_icon.svg" />
                    <br />
                    <ErrorHeader>
                        {message}
                    </ErrorHeader>
                    <br />
                    <blockquote className="blockquote">
                        <p className="mb-0">
                            <b>{sol}</b>
                        </p>
                        <Link to="/" className="btn btn-success" style={GotoHome}>
                            <HomeIcon src="/static/svgs/home_icon.svg" />
                            홈으로 이동
                        </Link>
                    </blockquote>
                    <br />
                </MainWrapper>
                
            </FullPageWrapper>
        </>
    );
};

export default ErrorComp;