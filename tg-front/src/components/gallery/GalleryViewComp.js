import React from 'react';
import styled from "styled-components"
import {ImageItem, ImageItemSmall} from '../common/ImageItem';


const ImageItemWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    
    .image-item {
        margin-left: 4px;
        margin-right: 4px;
        margin-bottom: 16px;
    }
`

const ContentWrapper = styled.div`
    width: 100%;
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    h2 {
        color: white;
    }
`

const LoadingIcon = styled.img`
    width: 50px;
    margin-bottom: 32px;
`

const GalleryViewComp = ({ loading, updateLoading, gallery, error, windowSize, isOwner, history}) => {
    
    
    return (
        <>
            {
                // 로딩중인경우, 로딩 아이콘을 표시한다.
                (loading || updateLoading) && (
                    <ContentWrapper>
                        <LoadingIcon src="/static/svgs/loading_icon.svg" />
                    </ContentWrapper>
                )
            }

            {
                // 로딩이 완료된 경우, 컨텐츠를 표시한다.
                (!loading && !updateLoading && (error === 200) && gallery.galleryName) && (
                    <ImageItemWrapper>
                    {
                        gallery.galleryItems.map(item => (
                            item.media.map(media => (
                                (windowSize[0] > 576) ? (
                                    <ImageItem media={media} item={item} key={media}/>
                                ) : (
                                    <ImageItemSmall media={media} item={item} key={media}/>
                                )
                                
                            ))
                        ))
                    }
                    </ImageItemWrapper>
                )
            }

            {
                // 오류가 없고, 갤러리가 잠긴 경우 "비공개 표시"
                (error === 200 && gallery.galleryLocked && !isOwner) && (
                    <ContentWrapper>
                        <LoadingIcon src="/static/svgs/lock_icon.svg" />
                        <h2>비공개 갤러리 입니다.</h2>
                    </ContentWrapper>
                )
            }

            {
                (error === 500) && (
                    // 내부 서버 오류의 경우 리다이렉트
                    history.push("/err?code=500")
                )
            }

            {
                (error === 404) && (
                    // 404 잘못된 사용자의 경우
                    <ContentWrapper>
                        <LoadingIcon src="/static/svgs/question_icon.svg" />
                        <h2>갤러리가 존재하지 않습니다.</h2>
                    </ContentWrapper>
                )
            }
        </>
    );
};

export default GalleryViewComp;