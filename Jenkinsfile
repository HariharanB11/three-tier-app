pipeline {
    agent any

    environment {
        HOME = '/var/lib/jenkins'                   // Jenkins home directory for .ssh
        BASTION_HOST = "ec2-user@35.173.132.120"    // Bastion host (Elastic IP)
        BACKEND_SERVER = "ec2-user@10.0.2.71"       // Backend server (private IP)
        FRONTEND_SERVER = "ec2-user@184.72.94.212"  // Frontend server (public IP)
        SSH_KEY = credentials('jenkins-ec2-key')    // SSH key stored in Jenkins credentials
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "🔧 Installing frontend dependencies..."
                        npm ci
                        echo "📦 Building frontend..."
                        npm run build
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        echo "🐍 Setting up Python virtual environment..."
                        python3 -m venv venv
                        . venv/bin/activate
                        echo "📦 Installing backend dependencies..."
                        pip install --upgrade pip
                        pip install -r requirements.txt
                        deactivate
                    '''
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                sshagent (credentials: ['jenkins-ec2-key']) {
                    sh '''
                        echo "🚀 Deploying backend to $BACKEND_SERVER via bastion $BASTION_HOST..."

                        # Copy backend files to backend server via bastion host
                        scp -i $SSH_KEY \
                            -o ProxyJump=$BASTION_HOST \
                            -o StrictHostKeyChecking=no \
                            -o UserKnownHostsFile=/dev/null \
                            -r backend/* $BACKEND_SERVER:/home/ec2-user/backend/

                        # SSH into backend server via bastion host and start backend app
                        ssh -i $SSH_KEY \
                            -o ProxyJump=$BASTION_HOST \
                            -o StrictHostKeyChecking=no \
                            -o UserKnownHostsFile=/dev/null \
                            $BACKEND_SERVER << 'ENDSSH'
                            cd /home/ec2-user/backend
                            python3 -m venv venv
                            source venv/bin/activate
                            nohup python3 app.py > app.log 2>&1 &
                            deactivate
                            echo "✅ Backend app started successfully."
                        ENDSSH
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sshagent (credentials: ['jenkins-ec2-key']) {
                    sh '''
                        echo "🚀 Deploying frontend to $FRONTEND_SERVER..."
                        scp -i $SSH_KEY \
                            -o StrictHostKeyChecking=no \
                            -o UserKnownHostsFile=/dev/null \
                            -r frontend/build/* $FRONTEND_SERVER:/var/www/html/
                        echo "✅ Frontend deployed successfully."
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}

