# eCRNow-UI Deployment Guide

This document provides comprehensive instructions for running the eCRNow-UI application using either Docker or Tomcat deployment methods.

## Project Overview

**eCRNow-UI** is a React-based frontend application built with:
- **React 18.3.1** with TypeScript
- **Vite** as the build tool and development server
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API communication

The application communicates with the eCRNow backend service and can be deployed as either a containerized application using Docker or as a WAR file on Tomcat.

## Prerequisites

### Common Requirements
- **Node.js**: Version 16 or above
- **npm**: Latest version
- **Git**: For repository cloning

### For Docker Deployment
- **Docker**: Latest version
- **Docker Compose** (optional)

### For Tomcat Deployment
- **Apache Maven**: Version 3.6 or above
- **Apache Tomcat**: Version 9 or above
- **Java**: JDK 8 or above

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/drajer-health/eCRNow-UI.git
cd eCRNow-UI
```

### 2. Install Dependencies
```bash
npm install
```

## Configuration

### Environment Variables

The application uses environment variables for configuration. Key variables include:

- **VITE_ECR_BASE_URL**: Backend service URL (default: `http://localhost:8081`)
- **VITE_BYPASS_AUTH**: Authentication bypass flag (default: `false`)
- **VITE_REFRESH_TIME**: Auto-refresh interval in milliseconds (default: `60000`)

#### Development Configuration
Edit the `.env` file in the root directory:
```env
VITE_ECR_BASE_URL=http://localhost:8081
VITE_BYPASS_AUTH=false
VITE_REFRESH_TIME=60000
```

#### Production Configuration
For production builds, environment variables are configured in the `pom.xml` profiles.

## Deployment Methods

## Method 1: Docker Deployment

### Quick Start with Docker

#### Build and Run
```bash
# Build the Docker image
docker build -t ecrnow-ui .

# Run the container
docker run -p 80:80 ecrnow-ui
```

#### Access the Application
- **URL**: http://localhost
- **Port**: 80 (default nginx port)

### Docker Configuration Details

The Dockerfile uses a multi-stage build process:

1. **Build Stage**: Uses Node.js Alpine to build the React application
2. **Production Stage**: Uses Nginx Alpine to serve the built files

#### Custom Nginx Configuration
The application includes a custom `nginx.conf` that:
- Serves the React app from `/usr/share/nginx/html`
- Handles client-side routing with `try_files`
- Redirects 404 errors to `index.html` for SPA routing

### Docker Compose (Optional)
Create a `docker-compose.yml` file:
```yaml
version: '3.8'
services:
  ecrnow-ui:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_ECR_BASE_URL=http://your-backend-url:8081
```

Run with:
```bash
docker-compose up -d
```

## Method 2: Tomcat Deployment

### Build WAR File

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Build with Maven
```bash
# For local environment
mvn clean install

# For production environment
mvn clean install -P prod
```

This will:
1. Run `npm run build` to create the Vite build output in the `dist` directory
2. Package the built files into a WAR file using Maven
3. Generate `eCRNow-UI.war` in the `target` directory

### Deploy to Tomcat

#### Step 1: Copy WAR File
```bash
cp target/eCRNow-UI.war /path/to/tomcat/webapps/
```

#### Step 2: Start Tomcat
```bash
# Start Tomcat (Linux/Mac)
$CATALINA_HOME/bin/startup.sh

# Start Tomcat (Windows)
%CATALINA_HOME%\bin\startup.bat
```

#### Step 3: Access the Application
- **URL**: http://localhost:8080/eCRNow-UI
- **Port**: 8080 (default Tomcat port)

### Maven Configuration

#### Complete pom.xml Example

The project uses Maven for building WAR files. Here's the complete `pom.xml` configuration:

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
            
            <!-- Plugin to execute npm build during Maven compile phase -->
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

#### web.xml Configuration

The `web.xml` file is required for Tomcat deployment:

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

### Maven Profiles

The project includes two Maven profiles:

#### Local Profile (Default)
- **VITE_PUBLIC_URL**: `http://localhost:8080/eCRNow-UI`
- **VITE_ROUTER_BASE**: `/eCRNow-UI`
- **VITE_ECR_BASE_URL**: `http://localhost:8081`

#### Production Profile
- **VITE_PUBLIC_URL**: `http://ecr.drajer.com/eCRNow-UI`
- **VITE_ROUTER_BASE**: `/eCRNow-UI`
- **VITE_ECR_BASE_URL**: `http://localhost:8081`

To use the production profile:
```bash
mvn clean install -P prod
```

#### Customizing Maven Configuration

To customize the Maven build for your environment:

1. **Change the output directory**: Modify `npm.output.directory` property
2. **Update environment variables**: Edit the values in the profile sections
3. **Change artifact details**: Update `groupId`, `artifactId`, or `version`
4. **Add custom build steps**: Add additional executions to the exec-maven-plugin

Example customization:
```xml
<properties>
    <npm.output.directory>build</npm.output.directory> <!-- If using 'build' instead of 'dist' -->
</properties>
```

## Development Mode

For development and testing:

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run coverage

# Run tests in watch mode
npm run test:watch
```

### Development Server
- **URL**: http://localhost:5173 (Vite default port)
- **API Proxy**: Requests to `/api` are proxied to `http://localhost:8081`

## Troubleshooting

### Common Issues

#### 1. Port Conflicts
- **Docker**: Change the host port in the docker run command: `docker run -p 8080:80 ecrnow-ui`
- **Tomcat**: Ensure Tomcat is running on the expected port (usually 8080)

#### 2. Backend Connection Issues
- Verify the `VITE_ECR_BASE_URL` environment variable points to the correct backend service
- Ensure the backend service is running and accessible
- Check firewall settings and network connectivity

#### 3. Build Failures
- Ensure Node.js and npm versions meet requirements
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

#### 4. Docker Build Issues
- Ensure Docker has enough memory allocated
- Check Docker daemon is running
- Verify Dockerfile syntax

#### 5. Maven Build Issues
- Ensure Maven and Java versions are compatible
- Check that npm is available in PATH during Maven build
- Verify `package.json` exists and is valid

### Logs and Debugging

#### Docker Logs
```bash
# View container logs
docker logs <container-id>

# Follow logs in real-time
docker logs -f <container-id>
```

#### Tomcat Logs
Check Tomcat logs in `$CATALINA_HOME/logs/`:
- `catalina.out`: Main Tomcat log
- `localhost.log`: Application-specific logs

## Performance Considerations

### Production Optimizations

1. **Nginx Configuration**: The included `nginx.conf` is optimized for serving static files
2. **Gzip Compression**: Consider enabling gzip compression in Nginx
3. **Caching Headers**: Add appropriate cache headers for static assets
4. **CDN**: Consider using a CDN for static asset delivery

### Security Considerations

1. **HTTPS**: Use HTTPS in production environments
2. **Environment Variables**: Never expose sensitive data in client-side environment variables
3. **CORS**: Configure proper CORS settings on the backend
4. **Content Security Policy**: Implement CSP headers

## Monitoring and Health Checks

### Docker Health Check
Add to Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

### Application Health
The application includes error boundaries and proper error handling for a robust user experience.

## Support and Maintenance

### Updates
- **Dependencies**: Regularly update npm dependencies for security patches
- **Base Images**: Keep Docker base images updated
- **Java/Maven**: Ensure compatibility with latest versions

### Backup and Recovery
- **Source Code**: Maintain proper version control with Git
- **Configuration**: Backup custom configuration files
- **Database**: Ensure proper backup procedures for any associated databases

## Additional Resources

- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/
- **Docker Documentation**: https://docs.docker.com/
- **Apache Tomcat Documentation**: https://tomcat.apache.org/
- **Maven Documentation**: https://maven.apache.org/

---

For questions or issues, please refer to the project repository or contact the development team.