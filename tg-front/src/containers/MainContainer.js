import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux"
import Main from '../components/Main';
import * as GalleryAPI from "../libs/apis/GalleryAPI"

const MainContainer = () => {
    const dispatch = useDispatch()
    const [galleryState, setGalleryState] = useState(0)

    const {user, error, loading} = useSelector(({main}) => ({
        user: main.twitter_user,
        error: main.twitter_error,
        loading: main.twitter_loading
    }))

    useEffect(() => {
        GalleryAPI.checkGallery()
            .then((response) => {
                if(response.status === 200) {
                    setGalleryState(1);   // 갤러리가 있음.
                }
            })
            .catch((ex) => {
                const code = ex.response.status

                if(code === 404) {
                    setGalleryState(2)    // 갤러리가 없음.
                } else if(code === 401) {
                    setGalleryState(0)    // 로그인 안됨.
                } else {
                    setGalleryState(-1)   // 내부 서버 오류
                }
                
            })
    }, [user, dispatch])

    return (
        <Main 
            user={user}
            error={error}
            loading={loading}
            galleryState={galleryState}
        />
    );
};

export default MainContainer;