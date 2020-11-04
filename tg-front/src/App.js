import React, {useEffect} from 'react';
import { Route } from "react-router-dom"
import CreateGalleryPage from './pages/CreateGalleryPage';
import MainPage from './pages/MainPage';
import ErrorComp from "./components/ErrorComp"
import {useDispatch} from "react-redux"
import { twitterLogin } from './modules/MainRedux';
import MyGalleryPage from './pages/MyGalleryPage';

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(twitterLogin())
  }, [dispatch])

  return (
    <>
      <Route component={MainPage} path="/" exact={true} />
      <Route component={CreateGalleryPage} path="/create" />
      <Route component={ErrorComp} path="/err" exact={true} />
      <Route component={MyGalleryPage} path="/gallery/@:username" />
    </>
  );
}

export default App;
