import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

const Reports = props => (
    <tr>
        <td>{props.pos}</td>
        <td>{props.report.username}</td>
        <td>{props.report.examName}</td>
        {/* <td><img style={imageStyle} src={props.report.imageURL} /></td> */}
        <td>{props.report.score}</td>
        <td>
            <Link to={"/edit/"+props.report._id}>edit</Link> | <a href="#" onClick={() => {props.deleteReport(props.report._id) }}>delete</a>
        </td>
    </tr>
)

export default class ReportList extends Component {
    constructor(props) {
        super(props);
        this.deleteReport = this.deleteReport.bind(this);
        this.state = {reports: []}
    }

    componentDidMount() {
        axios.get('http://localhost:5000/attempts/scores')
          .then(response => {
              this.setState({ reports: response.data})
          })
          .catch((error) => {
              console.log(error);
          })
    }

    // Falta implementar un delete recursivo buscar con Mongoose
    deleteReport(id) {
        axios.delete('http://localhost:5000/attempts/scores'+id)
          .then(res => console.log(res.data));
        this.setState({
            reports: this.state.reports.filter(el => el._id !== id)
        })
    }

    reportList() {
        return this.state.reports.map(currentReport => {
            return <Reports report={currentReport} deleteReport={this.deleteReport} key={currentReport._id} />
        })
    }

    render() {
        return (
            <div>
              <h3>Leaderboards</h3>
              <table className="table">
                  <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Exam</th>
                    <th>Score</th>
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