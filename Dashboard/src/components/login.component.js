import React, { Component } from 'react';
import axios from 'axios';

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            contrasena: ''
        }
    }

    onChangeName(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            contrasena: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const user = {            
            username: this.state.username,
            password: this.state.contrasena
        }
        console.log(user);

        axios.post('http://localhost:5000/users/login', user)
          .then(res => console.log(res.data));

        window.location = '/reportes';
    }

    render() {
        return (
        <div>
          <h3>Bienvenido</h3>
          <form onSubmit={this.onSubmit}>
            <div className="form-group"> 
              <label>Username:</label>
              <input  type="text"
                  required
                  className="form-control"
                  value={this.state.username}
                  onChange={this.onChangeName}
                  />
            </div>
            <div className="form-group"> 
              <label>Contraseña:</label>
              <input  type="password"
                  required
                  className="form-control"
                  value={this.state.contrasena}
                  onChange={this.onChangePassword}
                  />
            </div>    
            <div className="form-group">
              <input type="submit" value="Login" className="btn btn-primary" />
            </div>
          </form>
        </div>
        )
      }
}