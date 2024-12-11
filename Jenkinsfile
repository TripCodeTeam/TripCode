pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    def services = ["microservice1", "microservice2"]
                    for (service in services) {
                        dir(service) {
                            sh "docker build -t ${service}:latest ."
                        }
                    }

                    def clients = ["client1", "client2"]
                    for (client in clients) {
                        dir("client-projects/${client}") {
                            def projects = listProjects()
                            for (project in projects) {
                                dir(project) {
                                    def apps = listApps()
                                    for (app in apps) {
                                        dir(app) {
                                            sh "docker build -t ${app}:latest ."
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    def services = ["microservice1", "microservice2"]
                    for (service in services) {
                        dir(service) {
                            sh "npm test"
                        }
                    }

                    def clients = ["client1", "client2"]
                    for (client in clients) {
                        dir("client-projects/${client}") {
                            def projects = listProjects()
                            for (project in projects) {
                                dir(project) {
                                    def apps = listApps()
                                    for (app in apps) {
                                        dir(app) {
                                            sh "npm test"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to Development') {
            steps {
                script {
                    def services = ["microservice1", "microservice2"]
                    for (service in services) {
                        dir(service) {
                            sh "docker tag ${service}:latest gcr.io/${PROJECT_ID}/${service}:dev"
                            sh "docker push gcr.io/${PROJECT_ID}/${service}:dev"
                        }
                    }

                    def clients = ["client1", "client2"]
                    for (client in clients) {
                        dir("client-projects/${client}") {
                            def projects = listProjects()
                            for (project in projects) {
                                dir(project) {
                                    def apps = listApps()
                                    for (app in apps) {
                                        dir(app) {
                                            sh "docker tag ${app}:latest gcr.io/${PROJECT_ID}/${app}:dev"
                                            sh "docker push gcr.io/${PROJECT_ID}/${app}:dev"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                script {
                    def services = ["microservice1", "microservice2"]
                    for (service in services) {
                        dir(service) {
                            sh "docker tag ${service}:latest gcr.io/${PROJECT_ID}/${service}:staging"
                            sh "docker push gcr.io/${PROJECT_ID}/${service}:staging"
                        }
                    }

                    def clients = ["client1", "client2"]
                    for (client in clients) {
                        dir("client-projects/${client}") {
                            def projects = listProjects()
                            for (project in projects) {
                                dir(project) {
                                    def apps = listApps()
                                    for (app in apps) {
                                        dir(app) {
                                            sh "docker tag ${app}:latest gcr.io/${PROJECT_ID}/${app}:staging"
                                            sh "docker push gcr.io/${PROJECT_ID}/${app}:staging"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    def services = ["microservice1", "microservice2"]
                    for (service in services) {
                        dir(service) {
                            sh "docker tag ${service}:latest gcr.io/${PROJECT_ID}/${service}:prod"
                            sh "docker push gcr.io/${PROJECT_ID}/${service}:prod"
                        }
                    }

                    def clients = ["client1", "client2"]
                    for (client in clients) {
                        dir("client-projects/${client}") {
                            def projects = listProjects()
                            for (project in projects) {
                                dir(project) {
                                    def apps = listApps()
                                    for (app in apps) {
                                        dir(app) {
                                            sh "docker tag ${app}:latest gcr.io/${PROJECT_ID}/${app}:prod"
                                            sh "docker push gcr.io/${PROJECT_ID}/${app}:prod"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Register in Blockchain') {
            steps {
                script {
                    def services = ["microservice1", "microservice2"]
                    for (service in services) {
                        dir(service) {
                            sh "node blockchain/fabric-network/scripts/registerDeployment.js ${service}"
                        }
                    }

                    def clients = ["client1", "client2"]
                    for (client in clients) {
                        dir("client-projects/${client}") {
                            def projects = listProjects()
                            for (project in projects) {
                                dir(project) {
                                    def apps = listApps()
                                    for (app in apps) {
                                        dir(app) {
                                            sh "node blockchain/fabric-network/scripts/registerDeployment.js ${app}"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

def listProjects() {
    return new File("${env.WORKSPACE}/client-projects/${env.CLIENT_NAME}").list()
}

def listApps() {
    return new File("${env.WORKSPACE}/client-projects/${env.CLIENT_NAME}/${env.PROJECT_NAME}").list()
}
