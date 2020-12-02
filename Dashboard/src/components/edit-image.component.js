import React, { Component } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const token = localStorage.getItem("token")
axios.defaults.headers.common = {'Authorization' : `Bearer ${token}`}

const imageStyle = {
  width: 250,
  height: 200
};

export default class EditExercise extends Component {
    constructor(props) {
        super(props);
        this.onChangeClassification = this.onChangeClassification.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            imgID : '',
            imageURL: '',
            classification: '',
            currentClassification: '',
            report: 'text',
            reports: [],
            types: []
        }
    }

    componentDidMount() {
      axios.get('http://localhost:5000/images/'+this.props.match.params.id)
        .then(response =>{
            this.setState({
                imageURL: response.data.imageURL,
                currentClassification: response.data.classification,
            })
        })
      
      axios.get('http://localhost:5000/reports/')
        .then(response => {
          this.setState({
            reports: response.data
          })
        })

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

    onSubmit(e) {
        e.preventDefault();
        const image = {
            imageURL: this.state.imageURL,
            classification: this.state.classification,
        }
        console.log(image);

        axios.post('http://localhost:5000/images/update/'+this.props.match.params.id, image)
          .then(res => console.log(res.data));

        window.location = '/imagenes';
    }

    render() {
        return (
        <div>
          <h3>Edit Image</h3>
          <form onSubmit={this.onSubmit}>
            <div>
              <img style={imageStyle} src={this.state.imageURL} />
            </div>
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
              <label>Actual: {this.state.currentClassification}</label>
            </div>
    
            <div className="form-group">
              <input type="submit" value="Edit Image" className="btn btn-primary" />
            </div>
          </form>
        </div>
        )
      }
}