import React, { Component } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';

const token = localStorage.getItem("token")
axios.defaults.headers.common = {'Authorization' : `Bearer ${token}`}

const imageStyle = {
    width: 250,
    height: 200
};

// const Image = props => (
//     <tr>
//         <td>{props.image._id}</td>
//         <td>{props.image.classification}</td>
//         <td><img style={imageStyle} src={props.image.imageURL} /></td>
//         <td>
//             <Link to={"/edit/"+props.image._id}>edit</Link> | <a href="#" onClick={() => {props.deleteImage(props.image._id) }}>delete</a>
//         </td>
//     </tr>
// )

export default class AddImage extends Component {
    constructor(props) {
        super(props);
        this.onChangeClassification = this.onChangeClassification.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            URLString : '',
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
      this.setState({
          URLString: localStorage.getItem('array')
      })
      this.setState({
        URLArr : this.state.URLString.split(',')
      })
      console.log(localStorage.getItem('array'))
      console.log(this.state.URLString)
    }

    onChangeClassification(e) {
        this.setState({
            classification: e.target.value
        });
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
          window.location = '/imagenes';
        }
    }

    render() {
        return (
        <div>
          <h3>Multiples imágenes</h3>
          <form onSubmit={this.onSubmit}>
            <table className="table">
                  <thead className="thead-light">
                  <tr>
                    <th>Clasificación</th>
                    <th>Imagen</th>
                  </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td><select ref="userInput"
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
              </select></td>
                          <td><img style={imageStyle} src={localStorage.getItem("array").split(',')[0]}/></td>
                      </tr>
                      <tr>
                          <td><select ref="userInput"
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
              </select></td>
                          <td><img style={imageStyle} src={localStorage.getItem("array").split(',')[1]}/></td>
                      </tr>
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