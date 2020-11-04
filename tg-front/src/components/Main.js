import React from 'react';
import styled from "styled-components"
import Header from './common/Header';
import {MainWrapper, GalleryWrapper} from "../libs/styles/Wrappers"
import {HrByDiv} from "../libs/styles/Extra"
import Bottom from './common/Bottom';
import { Link, withRouter } from "react-router-dom"
import FullPageWrapper from "../components/common/FullPageWrapper"
import GalleryRankItem from './GalleryRankItem';

const GalleryContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`

const MoveToGallery = styled(Link)`
    width: 300px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 24px;
        margin-right: 4px;
    }
`

const Main = ({user, loading, galleryState, history}) => {
    return (
        <>
            <Header />
            <FullPageWrapper>
                <MainWrapper>
                    <h1>그쪽 취향 다 압니다.<br />갤러리로 만들어볼까요?</h1>
                    <br />
                    <blockquote className="blockquote">
                        <p className="mb-0">좋아요와 RT 를 기반으로 갤러리를 만들고 다른 사람들과 공유하세요.</p>
                    </blockquote>
                    <br />
                    
                    {
                        (function() {
                            if(!loading) {
                                // 로딩중이 아닌 경우.
                                if(user) {
                                    // 로그인이 완료된 경우.
                                    switch(galleryState) {
                                        case 1: 
                                            // 상태 1 => 내 갤러리가 이미 있음.
                                            return <MoveToGallery to={`/gallery/@${user.username}`} type="button" className="btn btn-info">
                                                        <img src="/static/svgs/image_icon.svg" alt=">>"/>
                                                        내 갤러리로 이동
                                                    </MoveToGallery>
                                        case 2:
                                            // 상태2 => 내 갤러리가 없음.
                                            return <MoveToGallery to="/create" type="button" className="btn btn-info">
                                                        <img src="/static/svgs/plus_icon.svg" alt="+"/>
                                                        갤러리 만들기
                                                    </MoveToGallery>
                                        case -1:
                                            // 상태-1 => 내부 서버 오류
                                            history.push("/err?code=500"); break;
                                        default: 
                                            return <img src="/static/svgs/loading_icon.svg" style={{width: "48px"}} alt="..."/>
                                    }
                                } else {
                                    // 로그인을 해야하는 경우
                                    return <a href="http://localhost:4000/api/auth/twitter">
                                            <img src="/static/images/twitter_button.png" alt="트위터 로그인" id="twitterLogin"/>
                                        </a>
                                }
                            }
                        })()
                    }
                    
                </MainWrapper>
            </FullPageWrapper>

            <GalleryWrapper>
                <HrByDiv />
                <h2>인기 갤러리</h2>
                <br />
                <GalleryContainer className="container">
                    <GalleryRankItem />
                    <GalleryRankItem />
                    <GalleryRankItem />
                    <GalleryRankItem />
                    <GalleryRankItem />
                    <GalleryRankItem />
                </GalleryContainer>

            </GalleryWrapper>
            <Bottom />
        </>
        
    );
};

export default withRouter(Main);