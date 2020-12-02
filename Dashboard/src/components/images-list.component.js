import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

const token = localStorage.getItem("token")
axios.defaults.headers.common = {'Authorization' : `Bearer ${token}`}

const imageStyle = {
    width: 250,
    height: 200
};

const Image = props => (
    <tr>
        <td>{props.image._id}</td>
        <td>{props.image.classification}</td>
        <td><img style={imageStyle} src={props.image.imageURL} /></td>
        <td>
            <Link to={"/edit/"+props.image._id}>edit</Link> | <a href="#" onClick={() => {props.deleteImage(props.image._id) }}>delete</a>
        </td>
    </tr>
)

export default class ImageList extends Component {
    constructor(props) {
        super(props);
        this.deleteImage = this.deleteImage.bind(this);
        this.state = {images: []}
    }

    componentDidMount() {
        axios.get('http://localhost:5000/images/')
          .then(response => {
              this.setState({ images: response.data})
          })
          .catch((error) => {
              console.log(error);
          })
          console.log(localStorage.getItem("token"))
    }

    // Falta implementar un delete recursivo buscar con Mongoose
    deleteImage(id) {
        axios.delete('http://localhost:5000/images/'+id)
          .then(res => console.log(res.data));
        this.setState({
            images: this.state.images.filter(el => el._id !== id)
        })
    }

    imageList() {
        return this.state.images.map(currentimage => {
            return <Image image={currentimage} deleteImage={this.deleteImage} key={currentimage._id} />
        })
    }

    render() {
        return (
            <div>
              <h3>Lista de Imágenes en la Base de Datos</h3>
              <table className="table">
                  <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Clasificación</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                      { this.imageList() }
                  </tbody>
              </table>
            </div>
        )
    }
}