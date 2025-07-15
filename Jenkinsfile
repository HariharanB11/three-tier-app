pipeline {
    agent any

    environment {
        HOME = '/var/lib/jenkins'                   // Ensure Jenkins uses the right .ssh directory
        BASTION_HOST = "ec2-user@35.173.132.120"    // Bastion host (public IP)
        BACKEND_SERVER = "ec2-user@10.0.2.71"       // Backend server (private IP)
        FRONTEND_SERVER = "ec2-user@35.173.132.120" // Frontend server (public IP)
        SSH_KEY = credentials('jenkins-ec2-key')    // SSH private key stored in Jenkins credentials
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
                        npm install
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
                        scp -o ProxyJump=$BASTION_HOST \
                            -o UserKnownHostsFile=$HOME/.ssh/known_hosts \
                            -r backend/app.py backend/requirements.txt backend/venv \
                            $BACKEND_SERVER:/home/ec2-user/backend/

                        # SSH into backend server via bastion and start backend app
                        ssh -o ProxyJump=$BASTION_HOST \
                            -o UserKnownHostsFile=$HOME/.ssh/known_hosts \
                            $BACKEND_SERVER << 'ENDSSH'
                            cd /home/ec2-user/backend
                            source venv/bin/activate
                            nohup python3 app.py > app.log 2>&1 &
                            deactivate
                        ENDSSH

                        echo "✅ Backend deployed successfully."
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sshagent (credentials: ['jenkins-ec2-key']) {
                    sh '''
                        echo "🚀 Deploying frontend to $FRONTEND_SERVER..."
                        scp -o UserKnownHostsFile=$HOME/.ssh/known_hosts \
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

