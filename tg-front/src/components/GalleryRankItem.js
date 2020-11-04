import React from 'react';
import styled from 'styled-components';

const GalleryItemWrapper = styled.div`
    width: 250px;
    height: 250px;

`

const BannerImage = styled.div`
    width: 100%;
    height: 100%;
    background-image: url("https://pbs.twimg.com/profile_banners/960340787782299648/1590362525/1500x500");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    display: flex;
    justify-content: center;
    align-items: center;

    h1 {
        color: white;
        z-index: 10;
    }
`

const Brightness = styled.div`
    width: 250px;
    height: 250px;
    background-color: #00000099;
    position: absolute;
`

const GalleryRankItem = () => {
    return (
        <GalleryItemWrapper>
            <BannerImage>
                <h1>HELLO</h1>
                <Brightness />
            </BannerImage>
        </GalleryItemWrapper>
    );
};

export default GalleryRankItem;