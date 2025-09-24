# Todo App DevOps CICD

## Use case Overview
This usecase demonstrates a complete DevOps workflow for a Node.js Todo application, from source code management in GitHub to CI/CD with Jenkins, and deployment on Azure Kubernetes Service (AKS). The goal is to implement a modern DevOps pipeline that includes static code analysis, automated Docker builds, approval-based deployment, pod autoscaling, persistent storage, and rollback mechanisms.  

## Architecture Diagram
![DevOps Pipeline Architecture](https://github.com/vibincholayil/todo-app-devops/blob/main/images/ach01.png)

## Key Features / Deliverables

### install jenkins in my Ubuntu VM
```
helm repo add jenkins https://charts.jenkins.io  
helm repo update  
helm install jenkins jenkins/jenkins --namespace jenkins --create-namespace  
```
checking jenkins 
```
helm repo list
```
Check pods  
```
k get pods
k get svc
```

### Jenkins Setup
install plugins: nodeJS, 

### setup pipeline Team-a


### install Azure CLI
```
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash  
az version
```
### Install kubectl
```
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
kubectl version --client
```
### Login to Azure Using Service Principal
```
az login --service-principal --username <APP_ID> --password <PASSWORD> --tenant <TENANT_ID>  
az account show
```
### Connect to AKS Cluster
```
az aks get-credentials --resource-group rg-uk-dev-app --name aks-uk-dev-app --overwrite-existing
kubectl get nodes
```
![k8_1](https://github.com/vibincholayil/todo-app-devops/blob/main/images/k8_1.png)
### Static Code Analysis (SonarQube)
Install Helm (if not installed)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

Add SonarQube Helm Repository
helm repo add sonarqube https://SonarSource.github.io/helm-chart-sonarqube
helm repo update

Download and Extract the Helm Chart
helm pull sonarqube/sonarqube --untar

Update Chart Values (values.yaml)

service.type → LoadBalancer

ingress.enabled → false

postgresql.postgresqlPassword → set a secure password

Optional: persistence.enabled → false (if persistence not needed)

Deploy SonarQube on AKS
helm install sonarqube ./sonarqube


Verify Deployment:

kubectl get pods
kubectl get svc


#### Login to Azure

```bash
az login
```


### Get AKS Cluster Credentials

To connect to your hosted AKS cluster, use the following command:

```bash
az aks get-credentials --resource-group rg-uk-dev-app --name aks-uk-dev-app --overwrite-existing
```


### Verify `kubectl` Connection

```bash
kubectl get nodes
```




### Helm is required to deploy SonarQube in Kubernetes.

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm repo add sonarqube https://SonarSource.github.io/helm-chart-sonarqube
helm repo update
helm pull sonarqube/sonarqube --untar
```
This creates a folder with the default SonarQube chart.

#### Update Chart Values
Edit the `values.yaml` file to customize your deployment:
* Set `service.type` to `LoadBalancer` (because AKS requires LB for external access).
* Disable Ingress: `ingress.enabled: false`
* Set `postgresql.postgresqlPassword` (enable a secure passcode).
* Optional: Set `persistence.enabled: false` if persistent storage is not required.

#### Deploy SonarQube on AKS
```bash
helm install sonarqube ./sonarqube
```
This will deploy SonarQube in your AKS cluster.

#### Verify SonarQube Deployment
```bash
kubectl get pods
kubectl get svc
```
#### Check that the SonarQube pod is running and the service is exposed via a LoadBalancer.


### Azure Portal Verification

1. Login to [Azure Portal](https://portal.azure.com/).
2. Navigate to your AKS cluster: **Resource Group → AKS Cluster**.
3. Check:
   * Nodes are healthy
   * Services are running (including SonarQube)
   * External IP assigned for LoadBalancer (if applicable)


* Connect your **CI/CD pipeline** (e.g., Jenkins) with SonarQube for **Static Code Analysis** and **Quality Gate checks**.
* Ensure SonarQube token and project keys are properly configured in your pipeline.





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

## Code to POST in the Todo List
```
curl -X POST -H "Content-Type: application/json" \
-d '{"id":1,"title":"Morning fitness training","completed":false}' \
http://172.187.119.172/api/todos

curl -X POST -H "Content-Type: application/json" \
-d '{"id":2,"title":"Net practice: batting","completed":false}' \
http://172.187.119.172/api/todos

curl -X POST -H "Content-Type: application/json" \
-d '{"id":3,"title":"Net practice: bowling","completed":false}' \
http://172.187.119.172/api/todos

curl -X POST -H "Content-Type: application/json" \
-d '{"id":4,"title":"Net practice: batting","completed":false}' \
http://172.187.119.172/api/todos
```

## Conclusion

This project demonstrates a full end-to-end DevOps workflow for a Node.js Todo application, combining best practices in source code management, CI/CD automation, containerization, and cloud-native deployment on Azure Kubernetes Service (AKS).  By implementing branching strategies, PR validation, conditional pipeline stages, static code analysis, approval-based deployments, pod autoscaling, persistent storage, and deployment rollbacks, this project ensures: High code quality and maintainability, Automated, repeatable, and reliable deployments, Scalable and resilient application infrastructure, Controlled production releases with safety mechanisms  

Overall, this project highlights how modern DevOps practices can streamline development, improve collaboration, and deliver robust cloud-native applications efficiently with Azure and Jenkins.

Thank you,
Vibin Cholayil

