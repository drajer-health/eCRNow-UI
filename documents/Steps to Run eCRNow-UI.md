# Steps to Run eCRNow-UI

eCRNow-UI is a modern React-based application built with TypeScript and Vite. This guide provides comprehensive instructions for setting up, running, and deploying the application.

## Pre-Requisites

Before getting started, ensure the following technologies are installed on your machine:

- **Node.js:** 18.0.0 or above (recommended: LTS version)
- **npm:** 9.0.0 or above
- **git:** Latest stable version

## Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/drajer-health/eCRNow-UI.git
cd eCRNow-UI
```

### 2. Install Dependencies

Download all required packages specified in package.json:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root by copying the example file:

```bash
cp .env.example .env
```

Configure the following environment variables in your `.env` file:

```env
VITE_ECR_BASE_URL=http://localhost:8081
VITE_BYPASS_AUTH=false
VITE_REFRESH_TIME=60000
```

**Environment Variables Explained:**
- `VITE_ECR_BASE_URL`: Backend API URL for the eCRNow service
- `VITE_BYPASS_AUTH`: Skip authentication for development (set to `true` only in dev)
- `VITE_REFRESH_TIME`: JWT token refresh interval in milliseconds (default: 60000ms = 1 minute)

**Note:** Vite exposes environment variables on the `import.meta.env` object. Only variables prefixed with `VITE_` are exposed to your client-side code.

Example of accessing an environment variable in the code:
```javascript
const baseUrl = import.meta.env.VITE_ECR_BASE_URL;
```

### 4. Start Development Server

Run the application in development mode:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

**Development Server Features:**
- Hot Module Replacement (HMR) for instant updates
- API proxy configured to forward `/api` requests to `http://localhost:8081`
- TypeScript type checking
- Fast refresh for React components

## Available Commands

### Development

```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory. This command:
- Compiles TypeScript to JavaScript
- Bundles and optimizes all assets
- Performs tree-shaking to remove unused code
- Generates production-ready files

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally to test before deployment.

### Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode (re-runs tests on file changes):
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run coverage
```

Coverage reports will be generated in:
- Console output (text format)
- HTML report in `coverage/` directory

## Backend Integration

The application communicates with the eCRNow backend service (default: `http://localhost:8081`).

**Important:** Ensure the backend service is running before starting the frontend application.

## Deployment

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The production-ready files will be in the `dist/` directory.

3. Deploy the contents of the `dist/` directory to your web server (Apache, Nginx, etc.).

### Deploying to Tomcat (Legacy)

If you need to deploy to Tomcat as a WAR file, you can use the Maven configuration provided in the legacy setup (see below).

## Technology Stack

- **Frontend Framework:** React 18.3.1 with TypeScript 5.8.3
- **Build Tool:** Vite 7.0.5
- **UI Libraries:** React Bootstrap, Material-UI (MUI), Emotion
- **Routing:** React Router DOM 7.1.1
- **HTTP Client:** Axios 1.7.9
- **Testing:** Vitest 3.2.4 with React Testing Library
- **Styling:** Bootstrap 5.3.3, CSS-in-JS (Emotion)

## Key Features

- **Authentication & Authorization:** JWT-based authentication with automatic token refresh
- **Client Details Management:** Configure EHR client integrations
- **Healthcare Settings:** FHIR configuration, transport settings, application settings
- **Knowledge Artifact Repositories:** Search and register FHIR-based KAR repositories
- **Public Health Authority Management:** Configure PHA endpoints for case reporting

## Browser Support

Modern browsers with ES6+ support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Port already in use:** If port 5173 is already in use, Vite will automatically use the next available port.

2. **Backend connection errors:** Ensure the `VITE_ECR_BASE_URL` in your `.env` file points to the correct backend URL and that the backend service is running.

3. **Module not found errors:** Run `npm install` to ensure all dependencies are installed.

## Support

For issues and questions, please refer to the project documentation or contact the development team.

---

## Legacy Maven Build Setup (Optional)

For organizations that require WAR file deployment to Tomcat, a Maven-based build configuration can be set up. This section is optional and only needed for specific deployment scenarios.

### Web.xml

Create a `web.xml` file under the root directory:

```xml
<web-app xmlns="http://java.sun.com/xml/ns/j2ee"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee
        http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd"
        version="2.4">
  <display-name>eCRNow-UI</display-name>
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>
</web-app>
```

### Pom.xml

Create a `pom.xml` under the root directory:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.drajer</groupId>
    <artifactId>eCRNow-UI</artifactId>
    <version>1.0</version>
    <packaging>war</packaging>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <npm.output.directory>dist</npm.output.directory>
    </properties>
    <build>
        <finalName>${project.artifactId}</finalName>
        <plugins>
            <!-- Standard plugin to generate WAR -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>2.1.1</version>
                <configuration>
                    <webResources>
                        <resource>
                            <directory>${npm.output.directory}</directory>
                        </resource>
                    </webResources>
                    <webXml>${basedir}/web.xml</webXml>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>1.3.2</version>
                <executions>
                    <execution>
                        <id>npm run build (compile)</id>
                        <goals>
                            <goal>exec</goal>
                        </goals>
                        <phase>compile</phase>
                        <configuration>
                            <executable>npm</executable>
                            <arguments>
                                <argument>run</argument>
                                <argument>build</argument>
                            </arguments>
                        </configuration>
                    </execution>
                </executions>
                <configuration>
                    <environmentVariables>
                        <CI>false</CI>
                        <NPM_CONFIG_PREFIX>${basedir}/npm</NPM_CONFIG_PREFIX>
                        <NPM_CONFIG_CACHE>${NPM_CONFIG_PREFIX}/cache</NPM_CONFIG_CACHE>
                        <NPM_CONFIG_TMP>${project.build.directory}/npmtmp</NPM_CONFIG_TMP>
                    </environmentVariables>
                </configuration>
            </plugin>
        </plugins>
    </build>
    <profiles>
        <profile>
            <id>local</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.codehaus.mojo</groupId>
                        <artifactId>exec-maven-plugin</artifactId>
                        <configuration>
                            <environmentVariables>
                                <VITE_PUBLIC_URL>http://localhost:8080/${project.artifactId}</VITE_PUBLIC_URL>
                                <VITE_ROUTER_BASE>/${project.artifactId}</VITE_ROUTER_BASE>
                                <VITE_ECR_BASE_URL>http://localhost:8081</VITE_ECR_BASE_URL>
                            </environmentVariables>
                        </configuration>
                    </plugin>
                </plugins>
            </build>
        </profile>
        <profile>
            <id>prod</id>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.codehaus.mojo</groupId>
                        <artifactId>exec-maven-plugin</artifactId>
                        <configuration>
                            <environmentVariables>
                                <VITE_PUBLIC_URL>http://ecr.drajer.com/${project.artifactId}</VITE_PUBLIC_URL>
                                <VITE_ROUTER_BASE>/${project.artifactId}</VITE_ROUTER_BASE>
                                <VITE_ECR_BASE_URL>http://localhost:8081</VITE_ECR_BASE_URL>
                            </environmentVariables>
                        </configuration>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
```

**Note:** Change the `VITE_PUBLIC_URL`, `VITE_ROUTER_BASE`, and `VITE_ECR_BASE_URL` values in `pom.xml` as per your environment.

### Maven Build and Deployment Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the WAR file:
   ```bash
   mvn clean install
   ```
   or
   ```bash
   mvn package
   ```

3. After a successful build, a WAR file will be generated in the `target` folder.

4. Copy the WAR file to the Tomcat `webapps` folder and start the Tomcat server.

5. Once Tomcat is running, access the application at:
   ```
   http://localhost:8080/eCRNow-UI
   ```
