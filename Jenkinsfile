pipeline {
    agent any
    environment {
        NODE_ENV = 'development'
        SONARQUBE_SERVER = 'SonarQube'
    }
    parameters {
        booleanParam(
            name: 'ROLLBACK',
            defaultValue: false,
            description: 'Set to true to rollback the AKS deployment to the previous version'
        )
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
            when { expression { env.CHANGE_ID != null } } // PR build
            steps {
                sh 'npx eslint . || true'
            }
        }
        stage('Run Tests') {
            when { expression { env.CHANGE_ID != null } } // PR build
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
                script {
                    try {
                        withSonarQubeEnv('SonarQube') {
                            withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                                sh """
                                    npx sonar-scanner \
                                      -Dsonar.projectKey=todo-app \
                                      -Dsonar.sources=. \
                                      -Dsonar.host.url=http://131.145.61.115/:9000 \
                                      -Dsonar.login=\$SONAR_TOKEN
                                """
                            }
                        }
                        currentBuild.description = "STATIC_ANALYSIS_SUCCESS"
                    } catch (err) {
                        currentBuild.description = "STATIC_ANALYSIS_FAILED"
                        error("Static code analysis failed")
                    }
                }
            }
        }
        stage('Build Docker Image') {
            when { branch 'main' }
            steps {
                script {
                    env.IMAGE_NAME = "vibincholayil/todo-app:${env.BUILD_NUMBER}"
                    sh "docker build -t $IMAGE_NAME ./backend"
                    }
                }
            }
        stage('Push Docker Image') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials',
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

        stage('Approval') {
            when {
                expression {
                    env.GIT_BRANCH == 'origin/main'
                }
            }
            steps {
                input message: 'Approve deployment to AKS?', ok: 'Deploy'
            }
        } 
        stage('Deploy to AKS') {
            steps {
                script {
                    // Ensure namespace exists
                    sh """
                    if ! kubectl get namespace team-a > /dev/null 2>&1; then
                        echo "Creating namespace team-a..."
                        kubectl create namespace team-a
                    else
                        echo "Namespace team-a already exists."
                    fi
                    """

                    // Ensure PVC exists
                    sh """
                    if ! kubectl get pvc todo-pvc -n team-a; then
                        echo "Creating PVC..."
                        kubectl apply -f k8s/pvc.yaml -n team-a
                    else
                        echo "PVC already exists."
                    fi
                    """
            
                    // Deploy the app with updated image
                    sh """
                    sed 's|IMAGE_TAG|$IMAGE_NAME|' k8s/deployment.yaml | kubectl apply -f -
                    kubectl apply -f k8s/service.yaml
                    kubectl get deployments -n team-a
                    kubectl get pvc -n team-a
                    kubectl get pods -n team-a -o wide
                    kubectl get svc -n team-a -o wide
                    """
                }
            }
        }
            stage('Enable Pod Autoscaling') {
                steps {
                    script {
                        sh """
                        kubectl apply -f k8s/hpa.yaml -n team-a
                        kubectl get hpa -n team-a
                        """
                    }
                }
            }
        
            stage('Rollback Deployment') {
                when {
                    expression { params.ROLLBACK == true }
                }
                steps {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        script {
                            echo " Rolling back deployment to previous revision..."
                            try {
                                sh """
                                kubectl --kubeconfig=$KUBECONFIG rollout undo deployment/todo-app -n team-a
                                kubectl --kubeconfig=$KUBECONFIG rollout status deployment/todo-app -n team-a
                                """
                            } catch (err) {
                                echo "Rollback failed: ${err}"
                            }
                        }
                    }
                }
            }
        } // stages ends here
        post {
            always {
                echo 'Pipeline execution complete.'
            }
            failure {
                echo 'Pipeline failed! Rolling back deployment...'
                sh "kubectl rollout undo deployment todo-app -n team-a"
            }
        }
    } // end of pipeline

