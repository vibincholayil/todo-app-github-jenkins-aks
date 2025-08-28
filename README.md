# Todo App DevOps Project

## Project Overview
This project demonstrates a complete DevOps workflow for a Node.js Todo application, from source code management in GitHub to CI/CD with Jenkins, and deployment on Azure Kubernetes Service (AKS). The goal is to implement a modern DevOps pipeline that includes static code analysis, automated Docker builds, approval-based deployment, pod autoscaling, persistent storage, and rollback mechanisms.  

## Architecture Diagram
![DevOps Pipeline Architecture](https://github.com/vibincholayil/todo-app-devops/blob/main/images/ach01.png)

## Key Features / Deliverables

### 1) Branching and PR Validation
- Branching:
  - `main`: production-ready
- PR validation:
  - Linting and unit tests must pass
  - Code review before merge

### 2) Conditional Pipeline Stages
- Stages run based on environment:
  - **Static code analysis** blocks the pipeline if code quality fails.
  - **Approval stage** before deploying to AKS.
  - Fail-fast logic halts downstream stages on error

### 3) Static Code Analysis
- SonarQube integrated for quality gates
- Pipeline **fails** if critical vulnerabilities, bugs, or coverage thresholds are not met

### 4) Approval-Based Deployments
- Manual approval (Jenkins `input`) required before Deploy

### 5) Pod Autoscaling
- Horizontal Pod Autoscaler (HPA) configured
- Scales replicas based on CPU utilization targets  50%
- HPA manifest stored in `k8s/hpa.yaml`

### 6) Storage Persistence
- PersistentVolumeClaim (PVC) for stateful components
- Ensures data durability across pod restarts
- PVC manifest stored in `k8s/pvc.yaml`

### 7) Deployment Rollbacks
- Safe rollback to the previous ReplicaSet if deployment fails:
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
![Jenkins Pipeline ](https://github.com/vibincholayil/todo-app-devops/blob/main/images/SS-pipeline.png)


## Technologies Used
- Node.js – Backend API
- Docker – Containerization
- Jenkins – CI/CD Pipeline
- SonarQube – Static Code Analysis
- Azure Kubernetes Service (AKS) – Deployment and scaling
- Persistent Volume Claims (PVC) – Data storage
- Horizontal Pod Autoscaler (HPA) – Dynamic scaling

## Conclusion

This project demonstrates a full end-to-end DevOps workflow for a Node.js Todo application, combining best practices in source code management, CI/CD automation, containerization, and cloud-native deployment on Azure Kubernetes Service (AKS).  By implementing branching strategies, PR validation, conditional pipeline stages, static code analysis, approval-based deployments, pod autoscaling, persistent storage, and deployment rollbacks, this project ensures: High code quality and maintainability, Automated, repeatable, and reliable deployments, Scalable and resilient application infrastructure, Controlled production releases with safety mechanisms  

Overall, this project highlights how modern DevOps practices can streamline development, improve collaboration, and deliver robust cloud-native applications efficiently with Azure and Jenkins.

Thank you,
Vibin Cholayil

