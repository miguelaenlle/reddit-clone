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
import AllPosts from "./posts/pages/AllPosts";
import Post from "./posts/pages/Post";
import Search from "./search/pages/Search";
import AllSubreddits from "./subreddit/pages/AllSubreddits";
import Subreddit from "./subreddit/pages/Subreddit";
import AllUsers from "./user/pages/AllUsers";
import User from "./user/pages/UserPage";

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
          <Route path={`/reset-password-prompt`} element={<ResetPassword />} />
          {/* confirm email */}
          <Route path={`/wait-confirm-email`} element={<WaitConfirmEmail />} />
          <Route
            path={`/confirm-email/:passwordToken`}
            element={<ConfirmEmail />}
          />
        </Route>
        <Route path="/search" element={<Search />} />
        <Route path="/sub/:subId" element={<Subreddit />} />
        <Route path="/user/:userId" element={<User />} />

        <Route path="/all/subs" element={<AllSubreddits />} />
        <Route path="/all/users" element={<AllUsers />} />
        <Route path="/all/posts" element={<AllPosts />} />
      </Routes>
    </HeaderWrapper>
  );
}

export default App;
