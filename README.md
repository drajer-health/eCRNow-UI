## Pre-Requisites

The following technologies should have been installed on your machine where you will build, test and deploy your applications.

* NodeJS 12.4.1 or above
* git tool

## Steps to Build and Run the App: ##

### Clone the repository

```git clone https://github.com/drajer-health/eCRNow-UI.git```

### Build and Run the Application

To run the eCRNow-UI application, from the project directory, run the below commands:

```npm install```

This command will download all the required dependencies.Run the below command once the above command is successfully executed.

```npm start```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### Configuration Changes: 

File: .env

Change the REACT_APP_ECR_BASE_URL value to use the eCRNow backend service base URL. 

### Additional Configuration Changes:

To build and deploy the application in Production environment or to any Tomcat web server. The detailed instructions are documented and present in this repository. File Name: Steps to Run eCRNow-UI.docx

## Setup and Usage full docker mode

### Build the Docker Image
Run the following command to build the Docker image:

```sh
docker build --build-arg REACT_APP_ECR_BASE_URL=http://localhost:8081 \
             --build-arg REACT_APP_BYPASS_AUTH=true \
             -t ecrnow-ui:latest \
             -f docker/Dockerfile .
```

### Run the Container
Use this command to start the container:

```sh
docker run -d -p 3000:80 --name ecrnow-ui ecrnow-ui:latest
```

### Access the Application
Once the container is running, open your browser and go to:
```
http://localhost:3000
```

### Stop and Remove the Container
```sh
docker stop ecrnow-ui && docker rm ecrnow-ui
```

## Notes
- Ensure that the `nginx.conf` file is correctly set up inside the `docker` directory.
- If using `docker-compose`, update the paths accordingly.
