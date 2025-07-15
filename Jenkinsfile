pipeline {
    agent any

    environment {
        BACKEND_SERVER = "ec2-user@10.0.2.71"
        FRONTEND_SERVER = "ec2-user@35.173.132.120"
        SSH_KEY = credentials('jenkins-ec2-key') // Make sure this SSH key is configured in Jenkins
        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out code from Git..."
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "🔧 Installing frontend dependencies..."
                        npm install

                        echo "📦 Checking for react-scripts..."
                        if ! npx react-scripts --version > /dev/null 2>&1; then
                            echo "⚠️ react-scripts missing. Installing it..."
                            npm install react-scripts
                        fi

                        echo "🚀 Building frontend..."
                        npm run build
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh '''
                        echo "🐍 Setting up Python virtual environment..."
                        python3 -m venv venv

                        echo "🔧 Activating virtual environment..."
                        . venv/bin/activate

                        echo "📦 Installing backend dependencies..."
                        pip install --upgrade pip
                        pip install -r requirements.txt

                        echo "✅ Backend dependencies installed successfully."
                    '''
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                sshagent(['jenkins-ec2-key']) {
                    sh '''
                        echo "🚀 Deploying backend to ${BACKEND_SERVER}..."
                        scp -r ${BACKEND_DIR}/* ${BACKEND_SERVER}:/home/ec2-user/backend/

                        ssh ${BACKEND_SERVER} '
                            cd /home/ec2-user/backend &&
                            python3 -m venv venv &&
                            source venv/bin/activate &&
                            pip install --upgrade pip &&
                            pip install -r requirements.txt &&
                            echo "🔄 Restarting backend service..." &&
                            sudo systemctl restart backend.service
                        '
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sshagent(['jenkins-ec2-key']) {
                    sh '''
                        echo "🚀 Deploying frontend to ${FRONTEND_SERVER}..."
                        scp -r ${FRONTEND_DIR}/build/* ${FRONTEND_SERVER}:/home/ec2-user/frontend/

                        ssh ${FRONTEND_SERVER} '
                            echo "🔄 Restarting frontend server (nginx)..."
                            sudo systemctl restart nginx
                        '
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Completed Successfully!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}

