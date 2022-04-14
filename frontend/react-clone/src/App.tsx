import React from "react";
import { Route, Routes } from "react-router-dom";
import ConfirmEmail from "./account/pages/Confirmation/ConfirmEmail";
import WaitConfirmEmail from "./account/pages/Confirmation/WaitConfirmEmail";
import Login from "./account/pages/Login";
import RequestResetPassword from "./account/pages/ResetPassword/RequestResetPassword";
import ResetPassword from "./account/pages/ResetPassword/ResetPassword";
import WaitResetPassword from "./account/pages/ResetPassword/WaitResetPassword";
import Signup from "./account/pages/Signup";
import Homepage from "./homepage/pages/Homepage";
import HeaderWrapper from "./navbar/wrappers/HeaderWrapper";
import Post from "./posts/pages/Post";
import Search from "./search/pages/Search";
import Subreddit from "./subreddit/pages/Subreddit";


function App() {
  return (
    <HeaderWrapper>
      <Routes>
        <Route path="/" element={<Homepage />}>
          <Route path={`/post/:postId`} element={<Post />} />
          <Route path={`/signup`} element={<Signup />} />
          <Route path={`/login`} element={<Login />} />
          {/* password reset */}
          <Route path={`/reset-password`} element={<RequestResetPassword />} />
          <Route
            path={`/wait-reset-password`}
            element={<WaitResetPassword />}
          />
          <Route
            path={`/reset-password-prompt`}
            element={<ResetPassword />}
          />
          {/* confirm email */}
          <Route path={`/wait-confirm-email`} element={<WaitConfirmEmail />} />
          <Route
            path={`/confirm-email/:passwordToken`}
            element={<ConfirmEmail />}
          />
        </Route>
        <Route path = "/search" element = {<Search />} />
        <Route path = "/sub/:subId" element = {<Subreddit />} />
      </Routes>
    </HeaderWrapper>
  );
}

export default App;
