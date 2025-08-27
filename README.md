# Todo App DevOps Project

## Project Overview
This project demonstrates a complete DevOps workflow for a Node.js Todo application, from source code management in GitHub to CI/CD with Jenkins, and deployment on Azure Kubernetes Service (AKS). The goal is to implement a modern DevOps pipeline that includes static code analysis, automated Docker builds, approval-based deployment, pod autoscaling, persistent storage, and rollback mechanisms.  

## Architecture Diagram


## Key Features / Deliverables

### 1. Source Code Management
- Node.js backend code is stored in a **GitHub repository**.
- Branching strategy:
  - `main` branch for production.
  - Feature branches for development.

### 2. CI/CD Pipeline with Jenkins
- Automatic triggers on SCM changes via **GitHub webhooks**.
- Conditional pipeline stages:
  - **Static code analysis** blocks the pipeline if code quality fails.
  - **Approval stage** before deploying to AKS.
- **Reusable pipeline** structure using scripts and environment variables.

### 3. Static Code Analysis
- **SonarQube** integration for code quality checks.
- Pipeline stops if critical issues are detected.

### 4. Build & Push Docker Images
- Docker image built from the Node.js app.
- Image automatically pushed to **Docker Hub** after a successful build.

### 5. Deployment on AKS
- Deploys the Todo app to **Azure Kubernetes Service (AKS)**.
- Ensures namespace and persistent storage (PVC) exist.
- Deployments updated dynamically using the latest Docker image tag.

### 6. Approval-Based Deployment
- Manual approval required before production deployment.
- **Jenkins input step** ensures controlled release.

### 7. Pod Autoscaling
- **Horizontal Pod Autoscaler (HPA)** applied for dynamic scaling based on CPU utilization.
- Ensures optimal resource usage and application performance.

### 8. Deployment Rollbacks
- Automatic rollback on failure using:

```bash
kubectl rollout undo deployment todo-app -n team-a
```

## File Structure
todo-app-devops  
├── backend              # Node.js backend code  
├── k8s                  # Kubernetes manifests (deployment.yaml, service.yaml, pvc.yaml, hpa.yaml)  
├── Jenkinsfile          # CI/CD pipeline configuration  
├── README.md            # Project documentation  
└── package.json  

## How I work in this

**Clone the repository**
```
git clone https://github.com/vibincholayil/todo-app-devops.git
```

## Configure Jenkins Pipeline
- Add credentials: Docker Hub, Azure, SonarQube.
- Add webhook in GitHub for automatic builds.
- Deploy
- Push changes to main branch.
- Approve deployment in Jenkins.
- Access Todo app in AKS via exposed service.

## Technologies Used
- Node.js – Backend API
- Docker – Containerization
- Jenkins – CI/CD Pipeline
- SonarQube – Static Code Analysis
- Azure Kubernetes Service (AKS) – Deployment and scaling
- Persistent Volume Claims (PVC) – Data storage
- Horizontal Pod Autoscaler (HPA) – Dynamic scaling
