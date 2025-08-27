pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
        SONARQUBE_SERVER = 'SonarQube'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/vibincholayil/todo-app-devops.git'
            }
        }

        stage('Setup NodeJS') {
            steps {
                nodejs('Node18') {
                    sh 'node -v'
                    sh 'npm -v'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    nodejs('Node18') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Lint Code') {
            steps {
                sh 'npx eslint . || true'
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    nodejs('Node18') {
                        sh 'npm test || true'
                    }
                }
            }
        }
       
        stage('Static Code Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        sh """
                            npx sonar-scanner \
                              -Dsonar.projectKey=todo-app \
                              -Dsonar.sources=. \
                              -Dsonar.host.url=http://192.168.152.136:9000 \
                              -Dsonar.login=\$SONAR_TOKEN
                        """
                    }
                }
            }
        }
        

        stage('Build Docker Image') {
            steps {
                script {
                    env.IMAGE_NAME = "vibincholayil/todo-app:${env.BUILD_NUMBER}"
                    sh "docker build -t $IMAGE_NAME ./backend"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-cred',
                                                 usernameVariable: 'DOCKER_USERNAME',
                                                 passwordVariable: 'DOCKER_PASSWORD')]) {
                    script {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                        sh "docker push $IMAGE_NAME"
                    }
                }
            }
        }

        stage('Login to Azure') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'AZURE_CREDENTIALS',
                                                 usernameVariable: 'AZURE_CLIENT_ID',
                                                 passwordVariable: 'AZURE_CLIENT_SECRET')]) {
                    script {
                        sh """
                        echo "Logging in to Azure..."
                        az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant 2b32b1fa-7899-482e-a6de-be99c0ff5516
                        az account show
                        az aks get-credentials --resource-group rg-uk-dev-app --name aks-uk-dev-app --overwrite-existing
                        """
                    }
                }
            }
        }

        stage('Deploy to AKS') {
            steps {
                script {
                    sh """
                        if ! kubectl get pvc todo-pvc -n team-a; then
                            echo "Creating PVC..."
                            kubectl apply -f k8s/pvc.yaml
                        else
                            echo "PVC already exists."
                        fi
                        """
            
                        // Deploy the app with updated image
                        sh """
                        sed 's|IMAGE_TAG|$IMAGE_NAME|' k8s/deployment.yaml | kubectl apply -f -
                        kubectl apply -f k8s/service.yaml
                        kubectl get pvc -n team-a
                        kubectl get pods -n team-a -o wide
                        kubectl get svc -n team-a -o wide
                        """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}




// pipeline {
//     agent any

//     environment {
//         // Set Node environment if needed
//         NODE_ENV = 'development'
//         // Replace with your actual SonarQube server name (as configured in Jenkins)
//         SONARQUBE_SERVER = 'SonarQube'
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 checkout scm
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 sh 'npm install'
//             }
//         }

//         stage('Lint Code') {
//             steps {
//                 sh 'npx eslint . || true'
//             }
//         }

//         stage('Run Tests') {
//             steps {
//                 // Add tests later; placeholder for now
//                 echo 'Running unit tests... (placeholder)'
//                 // sh 'npm test || true'
//             }
//         }

//         stage('Static Code Analysis') {
//             steps {
//                 withSonarQubeEnv("${env.SONARQUBE_SERVER}") {
//                     sh 'npx sonar-scanner \
//                         -Dsonar.projectKey=todo-app \
//                         -Dsonar.sources=. \
//                         -Dsonar.host.url=$SONAR_HOST_URL \
//                         -Dsonar.login=$SONAR_AUTH_TOKEN'
//                 }
//             }
//         }

//         stage('Build & Push Docker Image') {
//             when {
//                 branch 'main'
//             }
//             steps {
//                 script {
//                     def imageName = "princeshawtz/todo-app:${env.BUILD_NUMBER}"
//                     sh "docker build -t $imageName ."
//                     sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
//                     sh "docker push $imageName"
//                 }
//             }
//         }

//         stage('Approval & Deploy to AKS') {
//             when {
//                 branch 'main'
//             }
//             steps {
//                 input message: 'Approve deployment to AKS?'
//                 script {
//                     def imageName = "princeshawtz/todo-app:${env.BUILD_NUMBER}"

//                     sh """
//                     kubectl config use-context mlops_kc
//                     kubectl create namespace teamA --dry-run=client -o yaml | kubectl apply -f -
//                     kubectl apply -f k8s/pvc.yaml
//                     kubectl apply -f k8s/service.yaml

//                     # Inject dynamic image tag into deployment
//                     sed 's|IMAGE_TAG|$imageName|' k8s/deployment.yaml | kubectl apply -f -
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             echo 'Pipeline execution complete.'
//         }
//     }
// }
