import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CourseDetail from './components/CourseDetail';
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import Header from './components/Header';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import ContextState from './context/ContextState';
import './global.css';

const App = () => {
  return (
    <ContextState>
      <BrowserRouter>
        <div>
          <Header />
          <Switch>
            <Route exact path='/' component={Courses} />
            <Route path='/signup' component={UserSignUp} />
            <Route path='/signin' component={UserSignIn} />
            <Route path='/courses/create' component={CreateCourse} />
            <Route path='/courses/:id' component={CourseDetail} />
          </Switch>
        </div>
      </BrowserRouter>
    </ContextState>
  );
};

export default App;
