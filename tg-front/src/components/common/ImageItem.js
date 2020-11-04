import React from 'react';
import styled from "styled-components"

const ImageItemWrapper = styled.div`
    width: 200px;
    height: 200px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`

const ImageText = styled.p`
    color: white;
    margin-left: 8px;
    margin-top: 4px;
    margin-bottom: 6px;
    width: 200px;
    overflow: hidden;

    a {
        color: white;
    }
`

const ArtistProfileView = styled.div`
    display: flex;
    align-items: center;

    img {
        width: 28px;
        margin-left: 8px;
    }

    p {
        color: white;
        margin: 0px;
        padding: 0px;
        margin-left: 4px;
        color: #bdc3c7;
    }
`

const ImageSmallItemWrapper = styled.div`
    width: 49vw;
    height: 49vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5vw;
    flex-direction: column;
    margin-bottom: 16px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    p {
        color: white;
        font-size: 0.8rem;
    }
`

const textToDataUrl = (text) => {
    let data = "", url = ""
    if(text.startsWith("http")) {
        // URL 로 시작하는 경우, 텍스트 없음, URL 있음.
        url = text
        data = text
    } else {
        const splited = text.split("http")
        if(splited.length === 2) {
            // URL 과 텍스트가 같이 있는 경우
            data = splited[0]
            url = "http" + splited[1]
        } else {
            // 텍스트만 있는 경우
            data = text
        }
    }

    return [data, url]
}

export const ImageItem = ({media, item}) => {
    const [data, url] = textToDataUrl(item.text)

    return (
        <div className="image-item">
            <ImageItemWrapper>
                <img src={media} alt="갤러리 이미지"/>
            </ImageItemWrapper>
            <ImageText>
                {
                    url === "" ? (
                        <b>{data.substr(0, 12)}</b>
                    ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <b>{data.substr(0, 12)}</b>
                        </a>
                    )
                }
                
            </ImageText>
            <ArtistProfileView>
                <img src={item.owner.profileImage} alt="프로필 사진" className="rounded-circle" />
                <p>{item.owner.displayName.substr(0, 10)}</p>
            </ArtistProfileView>
        </div>
    );
};

export const ImageItemSmall = ({item, media}) => {
    const [data, url] = textToDataUrl(item.text)

    return (
        <ImageSmallItemWrapper>
            <img src={media} alt="loading..."/>
            <a href={url ? url : "#"} target="_blank" rel="noopener noreferrer">
                <p>{data.substr(0, 14)}</p>
            </a>
        </ImageSmallItemWrapper>
    );
};