import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import CreateGalleryComp from '../../components/gallery/CreateGalleryComp';
import { createGalleryError, createGalleryFormReset, createGalleryFormUpdate, createGalleryLoading } from '../../modules/CreateGalleryRedux';
import {createGallery} from "../../libs/apis/GalleryAPI"
import {withRouter} from "react-router-dom"

const CreateGalleryContainer = ({history}) => {
    const dispatch = useDispatch()

    const { galleryName, galleryContent, galleryLocked, createLoading, error } = useSelector(({createGallery}) => ({
        galleryName: createGallery.gallery_name,
        galleryContent: createGallery.gallery_content,
        galleryLocked: createGallery.gallery_locked,
        createLoading: createGallery.create_loading,
        error: createGallery.create_error
    }))

    const {twitterUser} = useSelector(({main}) => ({
        twitterUser: main.twitter_user
    }))

    useEffect(() => {
        // 입력값을 초기화 한다.
        if(twitterUser) {
            dispatch(createGalleryFormReset({
                name: `${twitterUser.displayName}님 갤러리`,
                content: `@${twitterUser.username} 님 갤러리 입니다. 무엇이 있을까 궁금한데요?`
            }))
        }
        

        return () => {
            dispatch(createGalleryFormReset({}))
        }

    }, [dispatch, history, twitterUser])

    const onGalleryCreateClicked = async (e) => {
        e.preventDefault()

        if(!galleryName || !galleryContent) {
            // 입력값이 비어있는 경우
            dispatch(createGalleryError("빈 칸이 있습니다. 값을 모두 채워주세요."))
            return
        }

        if(twitterUser == null) {
            // 사용자 인증이 안된 경우
            history.push("/err?code=401")
            return
        }

        dispatch(createGalleryLoading(true))
        const response = await createGallery({
            galleryName,
            galleryContent,
            galleryLocked
        })

        if(response.status === 200) {
            // 갤러리 생성이 완료되었다.
            history.push(`/gallery/@${twitterUser.username}`)
        }

        dispatch(createGalleryLoading(false))
    }

    const onFormUpdated = (e) => {
        dispatch(createGalleryFormUpdate({
            key: e.target.name,
            value: e.target.value
        }))
    }

    return (
        <CreateGalleryComp 
            form={{
                name: galleryName,
                content: galleryContent,
                locked: galleryLocked
            }}
            onFormUpdated={onFormUpdated}
            onGalleryCreate={onGalleryCreateClicked}
            loading={createLoading}
            error={error}/>
    );
};

export default withRouter(CreateGalleryContainer);