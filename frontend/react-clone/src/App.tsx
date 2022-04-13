import React from "react";
import Homepage from "./homepage/pages/Homepage";
import Post from "./posts/pages/Post";
import HeaderWrapper from "./navbar/wrappers/HeaderWrapper";

import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <HeaderWrapper>
      <Routes>
        <Route path="/" element={<Homepage />}>
          <Route path={`/post/:postId`} element={<Post />} />
        </Route>
      </Routes>
    </HeaderWrapper>
  );
}

export default App;
