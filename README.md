# Getting started

## Installation

Clone the repository

    git clone http://gs.blingabc.com/sideproject/automated-test-service.git

Switch to the repo folder

    cd automated-test-service
    
Install dependencies
    
    npm install

    
Set postgres database settings in env/*.env

```
NODE_ENV=development
PORT=3000
ORM_LOADING_PATH=src

DATABASE_TYPE=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PWD=123456
DATABASE_DB=bling_automated
DATABASE_SYNCHRONIZE=false
DATABASE_DROPSCHEMA=true

```
    
## NPM scripts

- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
- `npm run test` - run Jest test runner 
- `npm run start:prod` - Build application

----------

## API

API.md

----------

## Start application

- `npm start`
- Test api with `http://localhost:3000/api/catalog` in your favourite browser
