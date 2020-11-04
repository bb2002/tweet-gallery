import React from 'react';
import Header from '../common/Header';
import {FormWrapper} from "../../libs/styles/Wrappers"
import {HrByDiv} from "../../libs/styles/Extra"
import styled from 'styled-components';
import Bottom from '../common/Bottom';

const GalleryFormWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 70%;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    button {
        width: 300px;
        margin-top: 32px;
    }
`

const GalleryForm = styled.form`
    width: 80%;
`

const CreateGalleryComp = ({form, onFormUpdated, loading, onGalleryCreate, error}) => {
    const onLockCheckedChange = (e) => {
        // Checkbox Hooks.
        onFormUpdated({
            target: {
                name: e.target.name,
                value: e.target.checked
            }
        })
    }

    return (
        <>
            <Header />
            <FormWrapper>
                <div className="container">
                    <br />
                    {
                        error && (
                            <div className="alert alert-danger" role="alert">
                            {error}
                             </div>
                        )
                    }

                    <div className="alert alert-success" role="alert">
                        처음오셨습니다! 갤러리 환경설정을 진행합니다. 언제든 바꿀 수 있습니다.
                    </div>
                    

                    <GalleryFormWrapper>
                        <center>
                            <h1>갤러리 설정</h1>
                            <HrByDiv />
                        </center>
                        

                        <GalleryForm>
                            <div className="form-group">
                                <label htmlFor="galleryName">갤러리 이름</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="gallery_name" 
                                    placeholder="갤러리 이름을 입력하세요." 
                                    value={form.name} 
                                    onChange={onFormUpdated}
                                    maxLength="15"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="galleryContent">갤러리 설명</label>
                                <textarea 
                                    className="form-control" 
                                    name="gallery_content" 
                                    rows="3" 
                                    onChange={onFormUpdated} 
                                    defaultValue={form.content}
                                    maxLength="100"></textarea>
                            </div>
                            <div className="form-check">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    name="gallery_locked" 
                                    checked={form.locked} 
                                    onChange={onLockCheckedChange}/>

                                <label className="form-check-label" htmlFor="galleryLock">
                                    갤러리를 비공개로 설정합니다.
                                </label>
                            </div>
                        </GalleryForm>

                        <center>
                            <HrByDiv />
                        </center>
                        {
                            loading ? (
                                <button type="button" className="btn btn-success" disabled>생성중...</button>
                            ) : (
                                <button type="button" className="btn btn-success" onClick={onGalleryCreate}>만들기</button>
                            )
                        }
                    </GalleryFormWrapper>
                </div>
            </FormWrapper>
            <Bottom />
        </>
    );
};

export default CreateGalleryComp;