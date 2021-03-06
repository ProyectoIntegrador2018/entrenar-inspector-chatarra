import React, { Component } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const token = localStorage.getItem("token")
axios.defaults.headers.common = {'Authorization' : `Bearer ${token}`}

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.onChangeClassification = this.onChangeClassification.bind(this);
        this.onChangeURL = this.onChangeURL.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            classification: '',
            URL: 'URL de la imagen',
            URLArr : [],
            date: new Date(),
            types: []
        }
    }

    componentDidMount() {
      this.setState({
        types: ['Chatarra Nacional Primera', 
                'Chicharrón Nacional', 
                'Placa y Estructura Nacional', 
                'Rebaba de Acero', 
                'Regreso Industrial Galvanizado Nacional', 
                'Mixto Cizallado',
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
        this.setState({
          URLArr : this.state.URL.split(',')
        })
    }

    onSubmit(e) {
        e.preventDefault();
        // const config = {
        //   headers: { Authorization : `Bearer ${localStorage.getItem('token')}`}
        // }
        if (this.state.URLArr.length == 1) {
          const image = {            
              imageURL: this.state.URL,
              classification: this.state.classification,
          }
          console.log(image);
          axios.post('http://localhost:5000/images/add', image)
            .then(res => console.log(res.data));
          window.location = '/imagenes';
        } else {
          console.log("es un array")
          localStorage.setItem("array", this.state.URLArr)
          window.location = '/addMultiple/' + this.state.URL;
        }
    }

    render() {
        return (
        <div>
          <h3>Agregar Imagen Nueva</h3>
          <form onSubmit={this.onSubmit}>
            <div className="form-group"> 
              <label>Clasificación: </label>
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
              <label>URL: </label>
              <input type="text"
                  required
                  className="form-control"
                  value={this.state.URL}
                  onChange={this.onChangeURL}
                  />
            </div>
    
            <div className="form-group">
              <input type="submit" value="Agregar" className="btn btn-primary" />
            </div>
          </form>
          
        </div>
        )
      }
}