pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'make install'
            }
        }

        stage('Test') {
            steps {
                sh 'make test'
            }
        }

        stage('Build') {
            steps {
                sh 'make build'
            }
        }

        stage('Hygiene') {
            steps {
                sh 'bash scripts/hygiene.sh'
            }
        }
    }
}
