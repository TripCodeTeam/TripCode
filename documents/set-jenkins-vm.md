# Manual de Conexión SSH a Instancia de Google Cloud y Configuración de Jenkins y Docker
Este manual proporciona una guía detallada para conectarse a una instancia de Google Cloud mediante SSH utilizando gcloud, instalar Jenkins y Docker, y luego desplegar Jenkins.

# Conexión SSH a la Instancia de Google Cloud
Para conectarte a tu instancia de Google Cloud mediante SSH, sigue estos pasos:

## Instalar gcloud CLI
Si aún no tienes gcloud instalado, puedes instalarlo siguiendo las instrucciones en la documentación oficial de Google Cloud.

## Autenticar con Google Cloud
Autentica tu cuenta de Google Cloud:

```bash
gcloud auth login
```

## Configurar el Proyecto
Configura el proyecto de Google Cloud en el que está tu instancia:

```bash
gcloud config set project nombre-del-proyecto
```
## Conectar a la Instancia por SSH
Usa el siguiente comando para conectarte a tu instancia:

```bash
gcloud compute ssh instance-20241207-051742 --zone=us-central1-c
```

# Instalación de Jenkins
Una vez conectado a la instancia, sigue estos pasos para instalar Jenkins:

## Instalar Java
Jenkins requiere Java para ejecutarse, así que primero instala Java:

```bash
sudo apt-get update
sudo apt-get install -y openjdk-11-jdk
```

## Añadir el Repositorio de Jenkins
Añade la clave GPG de Jenkins y el repositorio:

```bash
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
```

## Instalar Jenkins
Actualiza los paquetes e instala Jenkins:

```bash
sudo apt-get update
sudo apt-get install -y jenkins
```

2.4. Iniciar Jenkins
Inicia el servicio de Jenkins:

```bash
sudo systemctl start jenkins
```

## Habilitar Jenkins al Inicio
Habilita Jenkins para que se inicie automáticamente al arrancar el sistema:

```bash
sudo systemctl enable jenkins
```

## Acceder a Jenkins
Abre un navegador web y accede a Jenkins en http://<IP_de_tu_instancia>:8080. Sigue las instrucciones en pantalla para completar la configuración inicial.

# Instalación de Docker
Para instalar Docker en tu instancia de Google Cloud, sigue estos pasos:

## Instalar Dependencias
Instala las dependencias necesarias:

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

## Añadir la Clave GPG de Docker
Añade la clave GPG oficial de Docker:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

## Añadir el Repositorio de Docker
Añade el repositorio de Docker:

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

## Instalar Docker
Actualiza los paquetes e instala Docker:

```bash
sudo apt-get update
sudo apt-get install -y docker-ce
```

## Iniciar Docker
Inicia el servicio de Docker:

```bash
sudo systemctl start docker
```

## Habilitar Docker al Inicio
Habilita Docker para que se inicie automáticamente al arrancar el sistema:

```bash
sudo systemctl enable docker
```

## Agregar Usuario al Grupo Docker
Para evitar tener que usar sudo cada vez que uses Docker, agrega tu usuario al grupo docker:

```bash
sudo usermod -aG docker $USER
```

Cierra la sesión y vuelve a iniciarla para que los cambios surtan efecto.

# Desplegar Jenkins con Docker
Si prefieres desplegar Jenkins utilizando Docker, sigue estos pasos:

## Crear un Volumen para Jenkins
Crea un volumen para persistir los datos de Jenkins:

```bash
docker volume create jenkins_home
```

## Ejecutar Jenkins en un Contenedor Docker
Ejecuta Jenkins en un contenedor Docker:

```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```

## Acceder a Jenkins
Abre un navegador web y accede a Jenkins en http://<IP_de_tu_instancia>:8080. Sigue las instrucciones en pantalla para completar la configuración inicial.

# Verificar la Instalación
Para verificar que Jenkins y Docker están instalados y funcionando correctamente, puedes ejecutar los siguientes comandos:

```bash
sudo systemctl status jenkins
sudo systemctl status docker
```

También puedes verificar que Jenkins está funcionando correctamente accediendo a http://<IP_de_tu_instancia>:8080 en un navegador web.