pipeline {
    agent any

    environment {
        BACKEND_SERVER = "ubuntu@${app_server_ip}"
        FRONTEND_SERVER = "ubuntu@${web_server_ip}"
        SSH_KEY = credentials('jenkins-ec2-key')  // Add this credential in Jenkins
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/HariharanB11/three-tier-app.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'pip install -r requirements.txt'
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                sshagent(['jenkins-ec2-key']) {
                    sh """
                    scp -o StrictHostKeyChecking=no -r backend/* $BACKEND_SERVER:/home/ubuntu/backend
                    ssh -o StrictHostKeyChecking=no $BACKEND_SERVER '
                        cd /home/ubuntu/backend &&
                        nohup python3 app.py &
                    '
                    """
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sshagent(['jenkins-ec2-key']) {
                    sh """
                    scp -o StrictHostKeyChecking=no -r frontend/build/* $FRONTEND_SERVER:/var/www/html
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful ✅'
        }
        failure {
            echo 'Deployment Failed ❌'
        }
    }
}
