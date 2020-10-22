# chatarrApp
Complemento al clasificador de chatarra desarrollado el año pasado para Ternium. La applicación sirve como una herramienta para auxiliar en el entrenamiento de los inspectores de chatarra.


## Table of contents

* [Client Details](#client-details)
* [Environment URLS](#environment-urls)
* [Da Team](#team)
* [Technology Stack](#technology-stack)
* [Management Tools](#management-resources)
* [Setup the project](#setup-the-project)
* [Frontend setup](#frontend-setup)
* [Backend setup](#backend-setup)
* [Restoring the database](#restoring-the-database)
* [Debugging](#debugging)
* [Running specs](#running-specs)
* [Checking code for potential issues](#checking-code-for-potential-issues)


### Client Details

| Name               | Email             | Role |
| ------------------ | ----------------- | ---- |
| Marco Del Valle | MDELVALC@ternium.com.mx | Lider IT  |


### Environment URLS

* **Production** - [TBD](TBD)
* **Development** - [TBD](TBD)

### Da team

| Name           | Email             | Role        |
| -------------- | ----------------- | ----------- |
| Juan Carlos González Alvarez | A00813022@itesm.mx | Administrador del Proyecto |
| Iván Navarrete Barraza | A01240485@itesm.mx | Administrador de la Configuracion |
| Jesús Alfredo Mejía Gil | A00816657@itesm.mx | SCRUM Master |
| Jaime Alberto González Martínez | A01193591@itesm.mx | Project Owner Proxy |

### Technology Stack
| Technology    | Version      |
| ------------- | -------------|
| Docker        | 2.3.0.4     |
| Ionic         | 5.3.2    |
| Angular       | 10.0.8 |
| MongoDB       | 4.0.8 |
| Heroku       | X.X.X |


### Management tools

You should ask for access to this tools if you don't have it already:

* [Github repo](https://github.com/ProyectoIntegrador2018/entrenar-inspector-chatarra)
* [Backlog](https://trello.com/b/yrQtGTkU/e103-wall-e-soft)
* [Heroku]()
* [Documentation](https://drive.com)

## Development

### Setup the project

Before you start, you need to make sure both node and npm are installed in your machine.

``` bash
$ npm -v
$ node -v
```

After installing please you can follow this simple steps:

1. Clone this repository into your local machine

```bash
$ git clone https://github.com/ProyectoIntegrador2018/entrenar-inspector-chatarra
```
### Frontend Setup

1. Fire up a terminal and run:

```bash
$ cd Client/chatarrApp
```

2. Start the frontend using:

```bash
$ Ionic serve
```

### Backend Setup

1. Fire up a terminal and run: 

```bash
$ cd backend
```

2. Install dependencies:

```bash
$ npm install
```

3. Start the server using nodemon:

```bash
$ nodemon server
```

### Restoring the database

You probably won't be working with a blank database, so once you are able to run crowdfront you can restore the database, to do it, first stop all services:

```
% plis stop
```

Then just lift up the `db` service:

```
% plis start db
```

The next step is to login to the database container:

```
% docker exec -ti crowdfront_db_1 bash
```

This will open up a bash session in to the database container.

Up to this point we just need to download a database dump and copy under `crowdfront/backups/`, this directory is mounted on the container, so you will be able to restore it with:

```
root@a3f695b39869:/# bin/restoredb crowdfront_dev db/backups/<databaseDump>
```

If you want to see how this script works, you can find it under `bin/restoredb`

Once the script finishes its execution you can just exit the session from the container and lift the other services:

```
% plis start
```

### Debugging

We know you love to use `debugger`, and who doesn't, and with Docker is a bit tricky, but don't worry, we have you covered.

Just run this line at the terminal and you can start debugging like a pro:

```
% plis attach web
```

This will display the logs from the rails app, as well as give you access to stop the execution on the debugging point as you would expect.

**Take note that if you kill this process you will kill the web service, and you will probably need to lift it up again.**

### Running specs

To run specs, you can do:

```
$ plis run test rspec
```

Or for a specific file:

```
$ plis run test rspec spec/models/user_spec.rb
```

### Checking code for potential issues

To run specs, you can do:

```
$ plis run web reek
```

```
$ plis run web rubocop
```

```
$ plis run web scss_lint
```

Or any other linter you have.
