const Transloadit = require('transloadit');

// Crear una instancia del cliente de Transloadit
const transloadit = new Transloadit({
  authKey: 'YOUR_TRANSLOADIT_KEY', //crear cuenta en transloadit y obtener estos
  authSecret: 'YOUR_TRANSLOADIT_SECRET'
});

// Crear una función para subir y procesar un archivo
async function uploadFile(filePath) {
  try {
    const assemblyOptions = {
      steps: {
        ':original': {
          robot: '/upload/handle'
        },
        'resize': {
          robot: '/image/resize',
          use: ':original',
          width: 500,
          height: 500
        },
        'export': {
          robot: '/s3/store',
          use: 'resize',
          key: 'YOUR_S3_KEY', //crear cuenta en aws y obtener estos
          secret: 'YOUR_S3_SECRET',
          bucket: 'YOUR_S3_BUCKET'
        }
      }
    };

    const result = await transloadit.createAssembly(assemblyOptions, {
      files: { file: filePath }
    });

    console.log('Assembly result:', result);
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

module.exports = {
  uploadFile
};
