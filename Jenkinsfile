pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID="276422486208"
        AWS_DEFAULT_REGION="ap-south-1" 
        IMAGE_REPO_NAME="fhynix-api"
        IMAGE_TAG="latest"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    }
   
    stages {
        
         stage('Logging into AWS ECR') {
            steps {
                script {
                sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                }
                 
            }
        }
        
        stage('Cloning Git') {
            steps {
              checkout([$class: 'GitSCM', branches: [[name: '*/deployment']], extensions: [], userRemoteConfigs: [[credentialsId: 'alekhya_gopu', url: 'https://github.com/cawstudios/Fhynix.CoreAPIs.git']]])          }
        }
  
    // Building Docker images
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build "${IMAGE_REPO_NAME}:${IMAGE_TAG}"
        }
      }
    }
   
    // Uploading Docker images into AWS ECR
    stage('Pushing to ECR') {
    // some block

     steps{  
         script {
            withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'fhynix-aws', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                sh "aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}"
                sh "aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}"
                sh "aws configure set region ap-south-1"
                sh "aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 276422486208.dkr.ecr.ap-south-1.amazonaws.com"
                sh "docker tag ${IMAGE_REPO_NAME}:${IMAGE_TAG} ${REPOSITORY_URI}:$IMAGE_TAG"
                sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}"
                
                sh "aws ecs update-service --cluster fhynix-dev-cluster --service fhynix-api-dev --task-definition fhynix-dev-api:7 --desired-count 1 --force-new-deployment --region ap-south-1"
        }
         }
        }
      }
    }
}