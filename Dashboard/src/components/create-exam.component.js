import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.onChangeClassification = this.onChangeClassification.bind(this);
        this.onChangeURL = this.onChangeURL.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            classification: '',
            URL: 'Numero de preguntas',
            date: new Date(),
            types: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/images/')
        .then(res => console.log(res.data));

      this.setState({
        types: ['Chatarra Nacional', 
                'Chicharrón Nacional', 
                'Placa y Estructura Nacional', 
                'Rebaba de Acero', 
                'Regreso Industrial Galvanizado', 
                'Mixto Cizzallado',
                'Mixto Para Procesar']
      })
    }

    onChangeClassification(e) {
        this.setState({
            classification: e.target.value
        });
    }

    onChangeURL(e) {
        this.setState({
            URL: e.target.value
        });
    }

    onChangeDate(date) {
        this.setState({
            date: date
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const image = {            
            imageURL: this.state.URL,
            classification: this.state.classification
            // date: this.state.date
        }
        console.log(image);

        axios.post('http://localhost:5000/images/add', image)
          .then(res => console.log(res.data));

        window.location = '/';
    }

    render() {
        return (
        <div>
          <h3>Agregar Nuevo Examen</h3>
          <form onSubmit={this.onSubmit}>
            <div className="form-group"> 
              <label>Imagen: </label>
              <select ref="userInput"
                  required
                  className="form-control"
                  value={this.state.classification}
                  onChange={this.onChangeClassification}>
                  {
                    this.state.types.map(function(classification) {
                      return <option 
                        key={classification}
                        value={classification}>{classification}
                        </option>;
                    })
                  }
              </select>
            </div>
            <div className="form-group"> 
              <label>Preguntas: </label>
              <input  type="text"
                  required
                  className="form-control"
                  value={this.state.URL}
                  onChange={this.onChangeURL}
                  />
            </div>
            <div className="form-group">
              <label>Fecha: </label>
              <div>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.onChangeDate}
                />
              </div>
            </div>
            <div className="form-group">
              <input type="submit" value="Agregar" className="btn btn-primary" />
            </div>
          </form>
        </div>
        )
      }
}