import React from 'react';
import styled from "styled-components"

const BannerWrapper = styled.div`
    #gallery-info {
        position: absolute;
        z-index: 1;
        margin: 24px;
    }
`

const BannerInfoWrapper = styled.div`
    color: white;
    p, h1 {
        margin: 0px;
        padding: 0px;
    }

    #gallery-header {
        width: 100%;
    }

    #gallery-content {
        width: 100%;
        font-size: 0.8rem;
    }

    #gallery-updated {
        img {
            width: 16px;
            margin-right: 4px;
        }

        font-size: 0.8rem;
        margin-top: 4px;
    }

    #gallery-error {
        font-size: 0.8rem;
        font-weight: bold;
        color: #e74c3c;
    }
`

const BannerImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 225px;
    width: 100%;
    padding: 0px;
    margin: 0px;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: -4px 4px 8px;

    img {
        width: 100%;
        height: 225px;
        object-fit: cover;
        filter: brightness(0.5);
    }

    @media (max-width: 576px) {
        border-radius: 0px;
        box-shadow: 0px 0px 0px;
    }

    
`

const BannerImage = ({gallery, owner, updateError}) => {
    if(!gallery) {
        // gallery 가 null 인 경우 임시 값 정의
        gallery = {}
        gallery.galleryName = "사용자를 찾을 수 없습니다."
        gallery.galleryContent = "사용자를 찾을 수 없습니다."
        gallery.lastUpdate = "없음"
    }

    if(!owner) {
        owner = {}
        owner.bannerImage = "/static/images/default_image.png"
    }

    return (
        <BannerWrapper>
            <BannerInfoWrapper id="gallery-info">
                <h2 id="gallery-header">{gallery.galleryName}</h2>
                <p id="gallery-content">{gallery.galleryContent}</p>
                <p id="gallery-updated"><img src="/static/svgs/repeat_icon.svg" alt="><"/>마지막 갱신: {gallery.lastUpdate}</p>
                {
                    updateError && (
                        <p id="gallery-error">갤러리 업데이트에 오류가 발생했습니다. 나중에 다시 시도해주세요.</p>
                    )
                }
            </BannerInfoWrapper>

            <BannerImageWrapper id="gallery-banner">
                <img src={owner.bannerImage} alt="banner" />
            </BannerImageWrapper>
        </BannerWrapper>
    );
};

export default BannerImage;