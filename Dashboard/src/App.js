import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/navbar.component';
import ImageList from './components/images-list.component';
import EditImage from './components/edit-image.component';
import AddImage from './components/add-image.component';
import CreateUser from './components/create-user.component';

// HOW TO OPTIMIZE TO MAKE RESPONSIVE

function App() {
  return (
    <Router>
      <div className="container">
      <Navbar />
      <br />
      <Route path="/" exact component={ImageList} />
      <Route path="/edit/:id" component={EditImage} />
      <Route path="/create" component={AddImage} />
      <Route path="/user" component={CreateUser} />
      </div>
    </Router>
  );
}

export default App;
