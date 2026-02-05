pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'dannoruwaanush/bnpl_angular-app'  //dockerusername/image-name
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        // Stage 1: Clone source code
        stage('Checkout') {
            steps {
                // Clone the repository containing the Angular app
                git 'https://github.com/Dannoruwa-Anush/angular_frontend.git'
            }
        }

        // Stage 2: Build Docker image
        stage('Build Image') {
            steps {
                script {
                    bat """
                        docker build -t %DOCKER_IMAGE%:%IMAGE_TAG% .
                        docker tag %DOCKER_IMAGE%:%IMAGE_TAG% %DOCKER_IMAGE%:latest
                    """
                }
            }
        }

        // Stage 3: Push image to Docker Hub
        stage('Push Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dannoruwaanush-dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')
                ]) {
                    bat """
                        echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                        docker push %DOCKER_IMAGE%:%IMAGE_TAG%
                        docker push %DOCKER_IMAGE%:latest
                    """
                }
            }
        }
    }

    post {
        always {
            // Clean up unused Docker resources
            bat 'docker system prune -f'

            // Logout from Docker Hub
            bat 'docker logout'
        }
    }
}
