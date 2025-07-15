pipeline {
    agent any

    environment {
        BACKEND_SERVER = "ec2-user@10.0.2.71"
        FRONTEND_SERVER = "ec2-user@35.173.132.120"
        SSH_KEY = credentials('jenkins-ec2-key') // Jenkins SSH private key
        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/HariharanB11/three-tier-app.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        echo "🔧 Installing frontend dependencies..."
                        npm install

                        echo "⚡ Fixing audit issues (if any)..."
                        npm audit fix --force || true

                        echo "📦 Building frontend..."
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

                        echo "🔥 Activating virtualenv..."
                        source venv/bin/activate

                        echo "⬆️ Upgrading pip..."
                        pip install --upgrade pip

                        echo "📦 Installing backend dependencies..."
                        pip install -r requirements.txt

                        echo "🚫 Deactivating virtualenv..."
                        deactivate
                    '''
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                sshagent(['jenkins-ec2-key']) {
                    sh '''
                        echo "🚀 Deploying backend to ${BACKEND_SERVER}..."

                        # Copy backend files
                        rsync -avz -e "ssh -o StrictHostKeyChecking=no" ${BACKEND_DIR}/ ${BACKEND_SERVER}:/home/ec2-user/backend/

                        # Run backend setup remotely
                        ssh -o StrictHostKeyChecking=no ${BACKEND_SERVER} << EOF
                            cd /home/ec2-user/backend
                            python3 -m venv venv
                            source venv/bin/activate
                            pip install --upgrade pip
                            pip install -r requirements.txt
                            pkill -f app.py || true
                            nohup python3 app.py > backend.log 2>&1 &
                        EOF
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                sshagent(['jenkins-ec2-key']) {
                    sh '''
                        echo "🚀 Deploying frontend to ${FRONTEND_SERVER}..."

                        # Copy frontend build folder
                        rsync -avz -e "ssh -o StrictHostKeyChecking=no" ${FRONTEND_DIR}/build/ ${FRONTEND_SERVER}:/home/ec2-user/frontend/

                        # Serve frontend using nginx or serve
                        ssh -o StrictHostKeyChecking=no ${FRONTEND_SERVER} << EOF
                            sudo mkdir -p /var/www/html
                            sudo cp -r /home/ec2-user/frontend/* /var/www/html/
                            sudo systemctl restart nginx || echo "Nginx not installed"
                        EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed!'
        }
    }
}

