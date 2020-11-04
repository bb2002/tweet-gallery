import React from 'react';
import styled from "styled-components"
import {HrByDiv} from "../../libs/styles/Extra"

const Header = styled.h1`
    color: white;
    text-align: center;
`

const Label = styled.label`
    font-weight: bold;
`

const Button = styled.button`
    width: 200px;
    margin-top: 32px;
`

const GallerySettingComp = ({form, loading, statusCode, onFormChanged, onSettingSave}) => {
    const onLockedChanged = (e) => {
        const obj = {
            target: {
                name: e.target.name,
                value: e.target.checked
            }
        }

        onFormChanged(obj)
    }

    return (
        <div className="container">
            <Header>갤러리 설정</Header>
            <center><br /><HrByDiv /><br /></center>

            {
                statusCode === 200 && (
                    <div className="alert alert-success" role="alert">
                        설정이 저장되었습니다.
                    </div>
                )
            }

            {
                statusCode === 400 && (
                    <div className="alert alert-warning" role="alert">
                        요청이 잘못되었습니다.
                    </div>
                )
            }

            {
                statusCode === 401 && (
                    <div className="alert alert-warning" role="alert">
                        사용자 인증을 할 수 없습니다.
                    </div>
                )
            }

            {
                statusCode === 500 && (
                    <div className="alert alert-danger" role="alert">
                        내부 서버 오류가 발생했습니다. 나중에 다시 시도하세요.
                    </div>
                )
            }
            
            <ul className="list-group">
                <li className="list-group-item">
                    <div className="form-group">
                        <Label htmlFor="gallery_name">갤러리 이름</Label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="galleryName" 
                            placeholder="갤러리 이름을 입력하세요." 
                            maxLength="15"
                            onChange={onFormChanged}
                            value={form.galleryName}/>
                    </div>

                </li>
                <li className="list-group-item">
                    <div className="form-group">
                        <Label htmlFor="gallery_name">갤러리 설명</Label>
                        <textarea 
                            className="form-control" 
                            name="galleryContent" 
                            rows="3"
                            maxLength="100"
                            placeholder="갤러리 설명을 입력하세요."
                            onChange={onFormChanged}
                            value={form.galleryContent}></textarea>
                    </div>
                </li>
                <li className="list-group-item">
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            name="galleryLocked"
                            checked={form.galleryLocked}
                            onChange={onLockedChanged} />

                        <label className="form-check-label" htmlFor="gallery_locked">
                            갤러리를 비공개로 설정합니다.
                        </label>
                    </div>
                </li>
            </ul>

            <Button type="button" className="btn btn-success" onClick={onSettingSave} disabled={loading}>
                <img src="/static/svgs/check_icon.svg" alt="v"/>
                {
                    loading ? "처리 중..." : "설정 저장"
                }
            </Button>
        </div>
    );
};

export default GallerySettingComp;