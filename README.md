## Requirements:

node 12.13.0
yarn 1.19.1
python 3.7
pip
pipenv

## Front

### `yarn add react-scripts`
before first start run

### `yarn start`
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`
Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.


## Backend

### `pipenv shell`
Enters virtual enviroment

### All below commands need to be used in virtual enviroment

### `pipenv install -r requirements.txt`
Installs required dependencies from requirements.txt for virtual enviroment
Run every time after `git pull`

### `pipenv install package_name`
Installs new package in virtual enviroment

### `pip freeze > requirements.txt`
Saves dependencies from virtual enviroment to requirements.txt
Run always after `pipenv install`

### `python manage.py runserver`
Starts backend
If some changes were made to frontend run `yarn build` before running this
