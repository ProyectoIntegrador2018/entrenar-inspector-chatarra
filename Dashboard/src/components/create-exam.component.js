import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const token = localStorage.getItem("token")
axios.defaults.headers.common = {'Authorization' : `Bearer ${token}`}

const imageStyle = {
  width: 250,
  height: 200
};

const Image = props => (
  <tr>
      <td><input type="radio" onChange={() => {props.addImage(props.image)}}></input></td>
      <td>{props.image.classification}</td>
      <td><img style={imageStyle} src={props.image.imageURL} /></td>
  </tr>
)

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this)
        this.onChangeQ = this.onChangeQ.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeDueDate = this.onChangeDueDate.bind(this);
        this.onSubmit= this.onSubmit.bind(this);
        this.addImage = this.addImage.bind(this);

        this.state = {
          nombre: "",
          description: "",
          images: [],
          exam: [],
          size: 10,
          attempts: 5,
          date: new Date(),
          Duedate: new Date(),
        }
    }

    componentDidMount() {
      axios.get('http://localhost:5000/images/')
      .then(response => {
          this.setState({images: response.data})
      })
      .catch((error) => {
          console.log(error);
      })
    }

    onChangeName(e) {
      this.setState({
        nombre: e.target.value
      });
    }

    onChangeDescription(e) {
      this.setState({
        description: e.target.value
      })
    }
    onChangeQ(e) {
        this.setState({
            size: e.target.value
        });
    }

    onChangeDate(date) {
        this.setState({
            date: date
        });
    }
    
    onChangeDueDate(date) {
      this.setState({
          Duedate: date
      });
  }

    addImage(image) {
      this.setState({
        exam: this.state.exam.concat(image)
      })
    }

    onSubmit(e) {
        e.preventDefault();
        const exam = {            
            examName: this.state.nombre,
            description: this.state.description,
            images: this.state.exam,
            size: this.state.size,
            attempts: this.state.attempts,
            date: this.state.date
        }
        console.log(exam);

        axios.post('http://localhost:5000/exams/add', exam)
          .then(res => console.log(res.data));
    }

    imageList() {
      return this.state.images.map(currentimage => {
          return <Image image={currentimage} addImage={this.addImage} key={currentimage._id} />
      })
  }
    render() {
        return (
        <div>
          <h3>Agregar Nuevo Examen</h3>
          <form onSubmit={this.onSubmit}>
          <div className="form-group"> 
              <label>Nombre del examen: </label>
              <input  type="text"
                  required
                  className="form-control"
                  value={this.state.nombre}
                  onChange={this.onChangeName}
                  />
            </div>
            <div className="form-group"> 
              <label>Descripción: </label>
              <input  type="text"
                  required
                  className="form-control"
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                  />
            </div>
            <div className="form-group"> 
              <label>Preguntas: </label>
              <input  type="text"
                  required
                  className="form-control"
                  value={this.state.size}
                  onChange={this.onChangeQ}
                  />
            </div>
            <div className="form-group">
              <label>Inicio : </label>
              <div>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.onChangeDate}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Fecha Final : </label>
              <div>
                <DatePicker
                  selected={this.state.Duedate}
                  onChange={this.onChangeDueDate}
                />
              </div>
            </div>
            <table className="table">
                  <thead className="thead-light">
                  <tr>
                    <th>Include</th>
                    <th>Clasificación</th>
                    <th>Imágen</th>
                  </tr>
                  </thead>
                  <tbody>
                      { this.imageList() }
                  </tbody>
              </table>
            <div className="form-group">
              <input type="submit" value="Agregar" className="btn btn-primary" />
            </div>
          </form>
        </div>
        )
      }
}