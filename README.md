# Node js school

## How to launch program

Postgres and npm should be installed.

1. Run command _npm install_
2. In main directory create two files: _.env.dev_, _.env.prod_

They should have entries as follows:

POSTGRES_USER=db_admin
POSTGRES_PASSWORD=password
POSTGRES_DB=szkolka_node_js
POSTGRES_PORT=5431
NODE_ENV=local-docker
PORT=4000
POSTGRES_CONNECTION_STRING=postgres://db_admin:password@postgres:5432/szkolka_node_js

Values can be custom.

3. Create locally postgres db with name as provided in env files.

# Launch locally

Run command: _npm run start-dev_ or if you want debug in VS Code - go to _Run and debug_ tab
and run _Debug locally_.

# Run docker locally

Docker should be installed.

Run command: _npm run docker-compose-dev-up_. It should create and launch docker image with postgres
and application started and connected. To debug docker locally in VS Code, use _Docker: attach to Node_ configuration
in _Run and debug_ tab.

## Scripts to launch on prod

Node js: _npm start_
With docker: _npm run docker-compose-up_
