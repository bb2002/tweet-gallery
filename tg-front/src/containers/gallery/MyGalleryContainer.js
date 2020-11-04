import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux"
import { withRouter } from 'react-router-dom';
import MyGallery from '../../components/gallery/MyGalleryComp';
import { loadGallery, tapChange, updateGallery } from '../../modules/MyGalleryRedux';
import {getTweetGalleryUser} from '../../libs/apis/TwitterAuthAPI'

const MyGalleryContainer = ({match}) => {
    const dispatch = useDispatch()
    const {username} = match.params

    const {gallery, galleryLoading, error, updateCode, updateLoading, selectedTap} = useSelector(({myGallery}) => ({
        gallery: myGallery.gallery,
        galleryLoading: myGallery.galleryLoading,
        error: myGallery.error,
        updateCode: myGallery.galleryUpdateCode,
        updateLoading: myGallery.galleryUpdateLoading,
        selectedTap: myGallery.selectedTap
    }))

    const [galleryOwner, setGalleryOwner] = useState(null)

    const {user} = useSelector(({main}) => ({
        user: main.twitter_user
    }))


    useEffect(() => {
        dispatch(loadGallery(username))
    }, [username, dispatch, updateCode])

    useEffect(() => {
        if(gallery && gallery.ownerTwitterId) {
            // owner 정보를 설정한다.
            getTweetGalleryUser(gallery.ownerTwitterId)
                .then((value) => {
                    setGalleryOwner(value.data)
                })

            // 갤러리 데이터를 업데이트 한다.
            dispatch(updateGallery(gallery.ownerTwitterId))
        }
    }, [gallery, dispatch])

    const onTapChanged = (newtap) => {
        dispatch(tapChange(newtap))
    }

    return (
        <MyGallery 
            gallery={gallery}
            loading={galleryLoading}
            error={error}
            updateCode={updateCode}
            updateLoading={updateLoading}
            galleryOwner={galleryOwner}
            user={user}
            onTapChanged={onTapChanged}
            selectedTap={selectedTap} />
    );
};

export default withRouter(MyGalleryContainer);