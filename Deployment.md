# Deployment de CarteleraI API

Este documento fue creado con la finalidad de facilitar el proceso de deployment para el proyecto de CarteleraI API. A continuación se muestran los pasos a seguir para lograrlo.

### Requisitos

* React
* Ionic
* MongoDB
* BD en Atlas
* Git
* Cuenta en Heroku
* Heroku CLI

La Aplicacion esta desarrollada en inoic y angular para el front-end y react para el back end

Para descargar el proyecto, es necesario descargar el repositorio al directorio que prefiera mas en su computadora. En terminal, descarga el repositorio
```bash
$ git clone git@github.com:ProyectoIntegrador2018/entrenar-inspector-chatarra
```
### Front-End

Despues de haberlo descargado, asegurese de entrar al directorio.
```bash
$ cd Client/chatarrApp
```

Ya dentro del directorio, se instalan todas las dependencias necesarias para el proyecto con:
```bash
$ npm install
```

### Back-End

Despues de haberlo descargado, asegurese de entrar al directorio.
```bash
$ cd Backend
```

Ya dentro del directorio, se instalan todas las dependencias necesarias para el proyecto con:
```bash
$ npm install
```
### Dashboard

Despues de haberlo descargado, asegurese de entrar al directorio.
```bash
$ cd Backend/dashboard
```

Ya dentro del directorio, se instalan todas las dependencias necesarias para el proyecto con:
```bash
$ npm install
```


El proceso toma un tiempo para terminar de instalar y/o actualizar.


### Heroku CLI

El proyecto esta hosteado en el sitio Heroku, por lo que si se desea hacer un deploy en el mismo sitio, es necesario seguir los siguientes pasos

Para poder conectar nuestro proyecto con Heroku, es necesario descargar [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) y hacer login con nuestras credenciales
```bash
$ heroku login
```


Ya teniendo configurado Heroku, podemos proceder a crear nuestro sitio web.

### Subir a Heroku

**Hacer los suguientes pasos en caso de necesitar hostear la aplicacion en un nuevo dominio**

Dentro del directorio del proyecto, se crea un sitio con Heroku de la siguiente manera:
```bash
$ heroku create
Creating app... done, secret-reef-24871
https://secret-reef-24871.herokuapp.com/ | https://git.heroku.com/secret-reef-24871.git
```

El comando anterior crea dos URLs, el primero con el sitio en donde la aplicación es hosteada, y el segundo que es el repositorio en Heroku.

Una vez creado el sitio, es hora de subir nuestra aplicación. Se utiliza el siguiente comando:
```bash
$ git push heroku master
```

Este comando tambien tomara un tiempo, pero despues de que termine de ejecutarse, puedes revisar la aplicacion funciona con:
```bash
$ heroku open
```
