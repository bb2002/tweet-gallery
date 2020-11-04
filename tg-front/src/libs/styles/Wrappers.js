import styled from "styled-components"

export const MainWrapper = styled.div`
    width: 100%;
    height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #0984e3;

    h1 {
        text-align: center;
        font-weight: 800;
        color: white;
        line-height: 5rem;
        font-size: 4rem;

        @media (max-width: 768px) {
            line-height: 4rem;
            font-size: 3rem;
        }

        @media (max-width: 576px) {
            line-height: 3rem;
            font-size: 2rem;
        }

        font-family: "Jalnan";
    }

    p {
        color: white;
    }

    #twitterLogin {
        width: 300px;
    }
`

export const GalleryWrapper = styled.div`
    width: 100%;
    min-height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #0984e3;

    h2 {
        color: white;
    }
`

export const FormWrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    background-color: #0984e3;

    .container {
        margin-top: 88px;
        color: white;

        h1 {
            text-align: center;
        }
    }
`

export const MyGalleryWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: left;
    align-items: left;
    flex-direction: column;
    background-color: #0984e3;
    padding-top: 94px;
`