import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

const token = localStorage.getItem("token")
axios.defaults.headers.common = {'Authorization' : `Bearer ${token}`}

const imageStyle = {
    width: 250,
    height: 200
};

const Reports = props => (
    <tr>
        <td>{props.report.imageID}</td>
        <td>{props.report.username}</td>
        <td><img style={imageStyle} src="https://lh3.googleusercontent.com/Dvu_OgKn5Bok3oqU7PRsx9vqiySjYaOenokVrd0xYHh1XRvqca-a_5Cv0yfwYuNe3zYHVQXGWrX29dROO6QdM6xs9icJeiYn3AWq5WuVfyV3JirF1WUi36fuZ48ra3RJ4lJnzaWjfw=w2400" /></td>
        <td>{props.report.report}</td>
        <td>
            <Link to={"/edit/"+props.report.imageID}>edit</Link> | <a href="#" onClick={() => {props.deleteReport(props.report._id) }}>delete</a>
        </td>
    </tr>
)

export default class ReportList extends Component {
    constructor(props) {
        super(props);
        this.deleteReport = this.deleteReport.bind(this);
        this.state = {reports: [], images: []}
    }

    componentDidMount() {
        axios.get('http://localhost:5000/reports/')
          .then(response => {
              this.setState({ reports: response.data})
          })
          .catch((error) => {
              console.log(error);
          })

          axios.get('http://localhost:5000/images/')
          .then(response => {
              this.setState({ images: response.data})
          })
          .catch((error) => {
              console.log(error);
          })
    }

    // Falta implementar un delete recursivo buscar con Mongoose
    deleteReport(id) {
        axios.delete('http://localhost:5000/reports/'+id)
          .then(res => console.log(res.data));
        this.setState({
            reports: this.state.reports.filter(el => el._id !== id)
        })
    }

    reportList() {
        return this.state.reports.map(currentReport => {
            return <Reports report={currentReport}  deleteReport={this.deleteReport} key={currentReport._id} />
        })
    }

    render() {
        return (
            <div>
              <h3>Lista de Reportes</h3>
              <table className="table">
                  <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Imagen</th>
                    <th>Comentarios</th>
                    <th>Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                      { this.reportList() }
                  </tbody>
              </table>
            </div>
        )
    }
}