
export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Ecommerce",
            description: "Aplicación de ecommerce, desarrollada para el curso de programador Backend, cursado en Coderhouse. La misma intenta simular una plataforma de ecommerce, del estilo de amazon o mercado libre. Existirían niveles de usuarios, cada uno con sus facultades diferenciadas. Productos, referenciados y que pueden ser generados por distintos niveles de usuarios. Carritos que serán propios de cada usuario (salvo excpeciones) y que generarán un ticket. Otras opciones que se irán agregando.",
            contact: {
                name: 'Ricardo Graña',
                email: 'ricardogb.812@gmail.com',
                url: 'https://github.com/r1k4rd0g',
            },
            version: "1.00.0",
        },
        servers: [ //puede estar la del servidor que está desplegado en la nube también.
            {
                url: "http://localhost:8088",
            },
        ],
    },
    apis: ['./src/docs/*/*yml'], //en esta parte, swagger va a buscar en cada carpeta, cada archivo yml para utilizarlo
    tags: [
        {
            name: 'Products',
            description: 'Endpoint relacionado a los productos',
        },
        {
            name: 'Carts',
            description: 'Endpoint relacionado a los carritos y las opciones configuradas',
        },
        {
            name: 'Users',
            description: 'Endpoint relacionado al usuario y sus configuraciones',
        }
    ]
};

//en el reqbody.entidad.yml se establecen las solicitudes de información particulares para cada endpoint
//en el response.entidad.yml se  establecen las respuestas posibles para cada uno de los endpoints
//en el path.entidad.yml, se compilan las rutas, las respuestas y los reqbody