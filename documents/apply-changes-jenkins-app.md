Cuando quieras aplicar cambios a Jenkins sin que se borren las configuraciones, puedes seguir estos pasos para asegurarte de que los datos se conserven y los cambios se apliquen de manera segura.

Pasos para Aplicar Cambios a Jenkins

## Detener el Contenedor de Jenkins
Primero, detén el contenedor de Jenkins:

```bash 
docker stop jenkins
```

## Realizar los Cambios Necesarios
Realiza los cambios necesarios en Jenkins. Esto podría incluir actualizar plugins, cambiar configuraciones, etc.

## Volver a Crear el Contenedor de Jenkins con el Volumen
Una vez que hayas realizado los cambios, vuelve a crear el contenedor de Jenkins montando el volumen que has creado previamente y el socket de Docker:

```bash 
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts
```

## Verificar el Contenedor
Verifica que el contenedor esté en ejecución:

```bash
docker ps
```

Deberías ver una salida similar a:

```bash 
CONTAINER ID   IMAGE                 COMMAND                  CREATED        STATUS        PORTS                                                                                      NAMES
ef76d127fc53   jenkins/jenkins:lts   "/usr/bin/tini -- /u…"   12 hours ago   Up 11 hours   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp, 0.0.0.0:50000->50000/tcp, :::50000->50000/tcp   jenkins
```
## Acceder a Jenkins
Abre un navegador web y accede a Jenkins en http://<IP_de_tu_instancia>:8080.