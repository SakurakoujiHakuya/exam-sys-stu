import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/index';
import Login from './views/login/index';
import Register from './views/register/index';
import Dashboard from './views/dashboard/index';
import PaperIndex from './views/paper/index';
import RecordIndex from './views/record/index';
import QuestionErrorIndex from './views/question-error/index';
import UserInfo from './views/user-info/index';
import UserMessage from './views/user-info/message';
import ExamPaperDo from './views/exam/paper/do';
import ExamPaperEdit from './views/exam/paper/edit';
import ExamPaperRead from './views/exam/paper/read';
import Error401 from './views/error-page/401';
import Error404 from './views/error-page/404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="index" element={<Dashboard />} />
          <Route path="paper/index" element={<PaperIndex />} />
          <Route path="record/index" element={<RecordIndex />} />
          <Route path="question/index" element={<QuestionErrorIndex />} />
          <Route path="user/index" element={<UserInfo />} />
          <Route path="user/message" element={<UserMessage />} />
        </Route>
        <Route path="/do" element={<ExamPaperDo />} />
        <Route path="/edit" element={<ExamPaperEdit />} />
        <Route path="/read" element={<ExamPaperRead />} />
        <Route path="/401" element={<Error401 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
