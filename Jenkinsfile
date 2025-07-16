pipeline {
    agent any

    environment {
        HOME = '/var/lib/jenkins'
        BASTION_HOST = "ec2-user@54.85.229.98"
        BACKEND_SERVER = "ec2-user@10.0.2.71"
        FRONTEND_SERVER = "ec2-user@184.72.94.212"
        BACKEND_KEY = "/home/ec2-user/jenkins.pem"
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
                sshagent (credentials: ['bastion-ec2-key']) {
                    sh '''
                        echo "🚀 Copying backend to Bastion $BASTION_HOST..."
                        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
                            -r backend $BASTION_HOST:/home/ec2-user/

                        echo "📦 SSH into Bastion and deploy to Backend..."
                        ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
                            $BASTION_HOST << 'ENDSSH'

                            echo "🔑 Setting permissions for backend key..."
                            chmod 400 /home/ec2-user/jenkins.pem

                            echo "📦 Copying backend code to Backend EC2..."
                            scp -i /home/ec2-user/jenkins.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
                                -r /home/ec2-user/backend ec2-user@10.0.2.71:/home/ec2-user/

                            echo "🚀 SSH into Backend EC2 and start app..."
                            ssh -i /home/ec2-user/jenkins.pem -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
                                ec2-user@10.0.2.71 << 'INNERSSH'
                                cd /home/ec2-user/backend
                                python3 -m venv venv
                                source venv/bin/activate
                                nohup python3 app.py > app.log 2>&1 &
                                deactivate
                                echo "✅ Backend app started successfully."
INNERSSH
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
                        scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
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
