pipeline {
    agent any


    environment {
        DISCORD_WEBHOOK_CREDENTIALS_ID = 'discord-webhook'
    }    

        stage('Docker Compose up') {
            steps {
                sh 'docker compose up -d --build'
            }
        }
    


    post {
        always{
            withCredentials([string(
                credentialsId: DISCORD_WEBHOOK_CREDENTIALS_ID,
                variable: 'DISCORD_WEBHOOK_URL'
            )]) {
                discordSend description: """
                제목 : ${env.JOB_NAME}:${currentBuild.displayName} 빌드
                결과 : ${currentBuild.result}
                실행 시간 : ${currentBuild.duration / 1000}s
                """,
                result: currentBuild.currentResult,
                title: "${env.JOB_NAME}", 
                webhookURL: "${DISCORD_WEBHOOK_URL}"
            }            
        }
    }
}