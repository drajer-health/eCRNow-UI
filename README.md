## Pre-Requisites

The following technologies should have been installed on your machine where you will build, test and deploy your applications.

* NodeJS 12.4.1 or above
* git tool

## Steps to Build and Run the App: ##

1. Clone the repository

```git clone https://github.com/drajer-health/eCRNow-UI.git```

2. To run the eCRNow-UI application, from the project directory, run the below commands:

### `npm install`

This command will download all the required dependencies.Run the below command once the above command is successfully executed.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

3. Configuration Changes: 

File: .env

Change the REACT_APP_ECR_BASE_URL value to use the eCRNow backend service base URL. 

4. Additional Configuration Changes:

To build and deploy the application in Production environment or to any Tomcat web server. The detailed instructions are documented and present in this repository. File Name: Steps to Run eCRNow-UI.docx