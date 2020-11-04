import React from 'react';
import styled from "styled-components"
import {HrByDiv} from "../../libs/styles/Extra"

const Header = styled.h1`
    color: white;
    text-align: center;
`

const GalleryInfoComp = ({gallery, owner}) => {
    return (
        <div className="container">
            <Header>갤러리 정보</Header>
            <center><br /><HrByDiv /><br /></center>
            
            <ul className="list-group">
                <li className="list-group-item"><b>갤러리 제목: </b>{gallery.galleryName}</li>
                <li className="list-group-item"><b>갤러리 설명: </b>{gallery.galleryContent}</li>
                <li className="list-group-item"><b>작품 수: </b>{gallery.galleryItems.length}개</li>
                <li className="list-group-item"><b>마지막 업데이트: </b>{gallery.lastUpdate}</li>
                <li className="list-group-item"><b>생성 날짜: </b>{gallery.createdAt}</li>
                <li className="list-group-item"><b>비공개: </b>{gallery.galleryLocked ? "예" : "아니오"}</li>
            </ul>

            <br />
            <br />

            <Header>오너 정보</Header>
            <center><br /><HrByDiv /><br /></center>
            <ul className="list-group">
                <li className="list-group-item"><b>이름: </b>@{owner.username}</li>
                <li className="list-group-item"><b>닉네임: </b>{owner.displayName}</li>
            </ul>
        </div>
    );
};

export default GalleryInfoComp;