## Manual de Commits para Proyectos de Microservicios
Este manual proporciona una guía detallada y específica para la creación de commits en proyectos de microservicios. Siguiendo estas pautas, se asegurará de que los commits sean coherentes, significativos y fáciles de entender.

# Estructura del Mensaje de Commit
Cada mensaje de commit debe seguir una estructura clara y consistente para facilitar la lectura y comprensión del historial de cambios. La estructura recomendada es la siguiente:

```markdown 
<tipo>(<ámbito>): <descripción>

[cuerpo del mensaje]

[pie del mensaje]
```
## Tipo
El tipo indica la categoría del cambio realizado. Los tipos comunes incluyen:

 - feat: Nueva funcionalidad.
 - fix: Corrección de un error.
 - docs: Cambios en la documentación.
 - style: Cambios que no afectan el significado del código (espacios en blanco, formato, etc.).
 - refactor: Cambio en el código que no corrige un error ni añade una funcionalidad.
 - test: Añadir o corregir pruebas.
 - chore: Cambios en la configuración o tareas de mantenimiento.

## Ámbito
El ámbito especifica el microservicio o componente afectado por el cambio. Esto ayuda a identificar rápidamente dónde se realizó el cambio. Ejemplos de ámbitos incluyen:

 - auth: Microservicio de autenticación.
 - user: Microservicio de gestión de usuarios.
 - api-gateway: API Gateway.
 - config: Configuración común.

## Descripción
La descripción es una breve explicación del cambio en tiempo presente. Debe ser clara y concisa.

## Cuerpo del Mensaje
El cuerpo del mensaje proporciona detalles adicionales sobre el cambio. Puede incluir razones para el cambio, diferencias con la implementación anterior, etc.

## Pie del Mensaje
El pie del mensaje incluye información adicional como referencias a issues, notas de despedida, etc.

# Ejemplos de Mensajes de Commit

## Nueva Funcionalidad

```markdown 
feat(auth): añadir autenticación de dos factores

Se ha implementado la autenticación de dos factores utilizando el servicio de autenticación de Google.

Closes #123
```

## Corrección de Error

```markdown 
fix(user): corregir error de validación de correo electrónico

Se ha corregido un error en la validación de correo electrónico que permitía correos inválidos.

Closes #124
```

## Cambios en la Documentación

```markdown 
docs(api-gateway): actualizar documentación de rutas

Se ha actualizado la documentación de las rutas del API Gateway para incluir las nuevas rutas de autenticación.
```

## Cambios de Estilo

```markdown 
style(auth): formatear código según estándares de estilo

Se ha formateado el código del microservicio de autenticación para cumplir con los estándares de estilo del proyecto.
```

## Refactorización

```markdown 
refactor(user): mejorar rendimiento de la consulta de usuarios

Se ha refactorizado la consulta de usuarios para mejorar el rendimiento y reducir el tiempo de respuesta.
```

## Añadir Pruebas

```markdown 
test(auth): añadir pruebas unitarias para autenticación de dos factores

Se han añadido pruebas unitarias para validar la funcionalidad de autenticación de dos factores.
```

## Cambios en la Configuración

```markdown 
chore(config): actualizar configuración de CI/CD

Se ha actualizado la configuración de CI/CD para incluir la ejecución de pruebas en el microservicio de autenticación.
```

# Buenas Prácticas para Commits

## Commits Atómicos
Cada commit debe ser atómico, es decir, debe contener un solo cambio lógico. Esto facilita la revisión y el rastreo de cambios.

## Commits Significativos
Asegúrate de que cada commit tenga un propósito claro y significativo. Evita commits que incluyan múltiples cambios no relacionados.

## Commits Consistentes
Mantén una consistencia en el formato y el estilo de los mensajes de commit. Esto facilita la lectura y comprensión del historial de cambios.

## Commits en Inglés
Escribir los mensajes de commit en inglés