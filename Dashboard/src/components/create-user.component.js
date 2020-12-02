
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const token = localStorage.getItem("token")
axios.defaults.headers.common = {'Authorization' : `Bearer ${token}`}

const Users = props => (
    <tr>
        <td>{props.user._id}</td>
        <td>{props.user.username}</td>
        <td>Accuracy %</td>
        <td>
            <Link to={"/edit/"+props.user._id}>edit</Link> | <a href="#" onClick={() => {props.deleteReport(props.user._id) }}>delete</a>
        </td>
    </tr>
)

export default class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.deleteReport = this.deleteReport.bind(this);

        this.state = {
            username: '',
            password: '',
            users: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/users/')
          .then(response => {
              this.setState({ users: response.data})
          })
          .catch((error) => {
              console.log(error);
          })
    }

    deleteReport(id) {
        axios.delete('http://localhost:5000/users/'+id)
          .then(res => console.log(res.data));
        this.setState({
            users: this.state.users.filter(el => el._id !== id)
        })
    }

    userList() {
        return this.state.users.map(currentUser => {
            return <Users user={currentUser} deleteReport={this.deleteReport} key={currentUser._id} />
        })
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            password: this.state.password
        }
        console.log(user);
        axios.post('http://localhost:5000/users/add', user)
          .then(res => console.log(res.data));

        this.setState({
            username: '',
            password: ''
        })
    }

    render() {
        return (
            <div>
              <h3>Crear Nuevo Usuario</h3>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label>Username:</label>
                  <input type="text"
                    required
                    className="form-control"
                    value={this.state.username}
                    onChange={this.onChangeUsername} />
                </div>
                <div className="form-group">
                  <label>Contraseña:</label>
                  <input type="text"
                    required
                    className="form-control"
                    value={this.state.password}
                    onChange={this.onChangePassword} />
                </div>
                <div className="form-group">
                  <input type="submit" value="Create user" className="btn btn-primary" />
                </div>
              </form>
              <h3>Lista de Usuarios</h3>
              <table className="table">
                  <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Accuracy</th>
                    <th>Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                      { this.userList() }
                  </tbody>
              </table>
            </div>
        )
    }
}