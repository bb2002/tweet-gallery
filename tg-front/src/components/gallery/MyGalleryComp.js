import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import {MyGalleryWrapper} from "../../libs/styles/Wrappers"
import styled from "styled-components"
import BannerImage from '../common/BannerImage';
import ProfileImage from '../common/ProfileImage';
import Bottom from '../common/Bottom';
import { withRouter } from 'react-router-dom';
import GalleryViewComp from './GalleryViewComp';
import GalleryInfoComp from './GalleryInfoComp';
import GallerySettingContainer from '../../containers/gallery/GallerySettingContainer';

const TopNav = styled.nav`
    margin-top: 6rem;
    margin-bottom: 2rem;

    button {
        color: white;
        background-color: #00000000;
        border: 0;
        outline: 0;
    }

    #selected {
        border-top: 2px solid white;
    }

    #locked {
        cursor: not-allowed;
        color: #999999;
    }
`


const MyGallery = ({gallery, loading, error, updateCode, updateLoading, galleryOwner, onTapChanged, selectedTap, user, history}) => {
    let isOwnerGallery = false

    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight])

    // 윈도우 크기를 받아온다.
    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowSize([window.innerWidth, window.innerHeight])
        })
    }, [])

    // owner 갤러리인지 검토한다.
    if(galleryOwner !== null && user !== null) {
        isOwnerGallery = galleryOwner.twitterId === user.twitterId
    } else {
        isOwnerGallery = false
    }

    
    return (
        <>
            <Header />
            <MyGalleryWrapper>
                <div className={windowSize[0] > 576 ? ("container") : ("")}>
                    <BannerImage id="banner-image" gallery={gallery} owner={galleryOwner} updateError={(updateCode !== 200 && updateCode !== 0)} />
                    <ProfileImage id="profile-image" gallery={gallery} owner={galleryOwner} />

                    <TopNav className="nav">
                        <button className="nav-link" 
                            onClick={e => onTapChanged("gallery")}
                            id={selectedTap === "gallery" ? "selected" : ""}>갤러리</button>
                        <button className="nav-link" 
                            onClick={e => onTapChanged("info")} 
                            id={selectedTap === "info" ? "selected" : ""}>정보</button>
                        {
                            isOwnerGallery && (
                            <button className="nav-link" 
                                onClick={e => onTapChanged("setting")} 
                                id={selectedTap === "setting" ? "selected" : ""}>환경설정</button>
                            )
                        }
                        
                    </TopNav>

                    {
                        selectedTap === "gallery" && (
                        <GalleryViewComp 
                            gallery={gallery}
                            loading={loading}
                            error={error}
                            updateLoading={updateLoading}
                            history={history}
                            windowSize={windowSize}
                            isOwner={isOwnerGallery} />
                        )
                        
                    }

                    {
                        selectedTap === "info" && (
                            <GalleryInfoComp 
                                gallery={gallery}
                                owner={galleryOwner}
                                />
                            )
                    }

                    {
                        selectedTap === "setting" && (
                            <GallerySettingContainer
                                gallery={gallery} />
                        )
                    }
                    

                    
                    
                </div>
                <br />
            </MyGalleryWrapper>
            <Bottom />
        </>
    );
};

export default withRouter(MyGallery);