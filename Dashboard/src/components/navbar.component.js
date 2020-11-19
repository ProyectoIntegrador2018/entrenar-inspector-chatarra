  
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">chatarrApp</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/imagenes" className="nav-link">Imágenes</Link>
          </li>
          <li className="navbar-item">
          <Link to="/reportes" className="nav-link">Reportes</Link>
          </li>
          <li className="navbar-item">
          <Link to="/leaderboards" className="nav-link">Leaderboards</Link>
          </li>
          <li className="navbar-item">
          <Link to="/examenes" className="nav-link">Exámenes</Link>
          </li>
          <li className="navbar-item">
          <Link to="/usuarios" className="nav-link">Usuarios</Link>
          </li>
          <li className="navbar-item">
          <Link to="/imagen" className="nav-link">Agregar Imagen</Link>
          </li>
          <li className="navbar-item">
          <Link to="/examen" className="nav-link">Generar Examen</Link>
          </li>
          <li className="navbar-item">
          <Link to="/" className="nav-link">Logout</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}