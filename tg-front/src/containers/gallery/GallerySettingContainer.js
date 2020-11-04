import React, { useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux"
import { withRouter } from 'react-router-dom';
import GallerySettingComp from '../../components/gallery/GallerySettingComp';
import { resetCode, resetForms, settingSave, updateForms } from '../../modules/GallerySettingRedux';
import { loadGallery } from '../../modules/MyGalleryRedux';

const GallerySettingContainer = ({gallery, match}) => {
    const dispatch = useDispatch()
    const { form, loading, statusCode, twitterUser } = useSelector(({main, gallerySetting}) => ({
        form: gallerySetting.form,
        loading: gallerySetting.loading,
        statusCode: gallerySetting.statusCode,
        twitterUser: main.twitter_user
    }))

    useEffect(() => {
        dispatch(resetForms({
            galleryName: gallery.galleryName,
            galleryContent: gallery.galleryContent,
            galleryLocked: gallery.galleryLocked,
        }))
    }, [gallery, dispatch])

    useEffect(() => {
        dispatch(resetCode())
    }, [dispatch])

    const onFormChanged = (e) => {
        dispatch(updateForms({
            name: e.target.name,
            value: e.target.value
        }))
    }
    
    const onSettingSave = (e) => {
        e.preventDefault()

        // 설정을 저장하고
        dispatch(settingSave({
            username: twitterUser.username,
            galleryName: form.galleryName,
            galleryContent: form.galleryContent,
            galleryLocked: form.galleryLocked
        }))

        // 저장 결과를 서버에서 다시 불러와 업데이트 한다.
        dispatch(loadGallery(match.params.username))
    }

    return (
        <GallerySettingComp 
            form={form}
            loading={loading}
            statusCode={statusCode}
            onFormChanged={onFormChanged}
            onSettingSave={onSettingSave} />
    );
};

export default withRouter(GallerySettingContainer);