import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar.component';
import Login from './components/login.component';
import ImageList from './components/images-list.component';
import Reportes from './components/reports.component';
import Leaderboards from './components/leaderboards.component';
import Examenes from './components/exam-list.component';
import CreateUser from './components/create-user.component';
import AddImage from './components/add-image.component';
import CreateExam from './components/create-exam.component';
import EditImage from './components/edit-image.component';
import MultipleImages from './components/multiple-images.component.js';

function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
      <br />
      <Route path="/" exact component={Login} />
      <Route path="/imagenes" component={ImageList} />
      <Route path="/reportes" component={Reportes} />
      <Route path="/leaderboards" component={Leaderboards} />
      <Route path="/examenes" component={Examenes} />
      <Route path="/usuarios" component={CreateUser} />
      <Route path="/imagen" component={AddImage} />
      <Route path="/examen" exact component={CreateExam} />
      
      <Route path="/edit/:id" component={EditImage} />
      <Route path="/addMultiple/:array" component={MultipleImages} />
      
      </div>
    </Router>
  );
}

export default App;
