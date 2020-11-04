import React from 'react';
import styled from "styled-components"

const ProfileImageWrapper = styled.div`
    position: absolute;
    margin-top: -3.25rem;
    margin-left: 5%;

    #profile-image {
        width: 7.5rem;
        border: 5px solid #2980b9;
    }
`

const ProfileImage = ({gallery, owner}) => {
    if(!owner) {
        owner = {}
        owner.profileImage = "/static/images/default_image.png"
    }

    return (
        <ProfileImageWrapper>
            <img src={owner.profileImage} alt="profile" className="rounded-circle" id="profile-image"/>
        </ProfileImageWrapper>
    );
};

export default ProfileImage;