import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';

const firebaseAdminProvider = {
  // Ahora inyectamos el servicio de configuración
  provide: 'FIREBASE_ADMIN',
  useFactory: (configService: ConfigService) => {
    // Obtener el contenido del JSON desde la variable de entorno
    const serviceAccountJson = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    console.log('serviceAccountJSON: ', serviceAccountJson);


    if (!serviceAccountJson) {
      throw new Error('La variable de entorno FIREBASE_SERVICE_ACCOUNT_JSON no está definida.');
    }

    // Parsear el JSON string a un objeto, el formato que espera Firebase Admin
    const serviceAccountConfig = JSON.parse(serviceAccountJson) as admin.ServiceAccount;

    // 1. Inicializa la aplicación de Firebase con las credenciales secretas
    admin.initializeApp({
      // Usamos el objeto de configuración del certificado
      credential: admin.credential.cert(serviceAccountConfig),
    });
    console.log('Firebase Admin SDK inicializado desde variables de entorno.');
    return admin;
  },
  inject: [ConfigService], // Asegurarse de inyectar el ConfigService
};

@Global()
@Module({
  // Importar ConfigModule aquí para que el servicio de configuración esté disponible
  imports: [ConfigModule],
  providers: [firebaseAdminProvider],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
