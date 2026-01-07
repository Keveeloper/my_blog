import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';

const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: (configService: ConfigService) => {
    const serviceAccountConfig = {
      type: "service_account",
      project_id: "gen-lang-client-0016482258",
      private_key_id: "55d2206275f872ed5e146071d4c2f9ee522b2cf7",      
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5PAYbyzYW9QQP\n45JV9ekkP83gc7hgviMmVn2FDoCTaJVd6fjqMjyZjmvdBnC0LP4wLXvMHgY/fO/X\nvu8s50gONXwbW1ysqw7QIhgpt44aUWn6hsDHdU9DDke4qLePMk3AQn2usLJFKSO4\nvGornqtL0T434WaIGMu9YXmlOSHpJb5y83Le4tLkrGn4/L9ysT1c3uBGiR84QoOv\nQtd+TuF4LeiEHSzz1M+VY5XQvCmOaRXCzW1KsiIA/MlYaRAnkH4aq4Hq+kuNIz+l\nAei9/SXs+CNHzMkp0UYK5t5wxeKVD4hPSyRc5sd7AOQLqViwIdT4bSSNjlvyuJYi\n4bwy6wBrAgMBAAECggEAW4K83dRJ15OaOyNJczA2ytK+qglhaGHmyZTnE+nzOV/s\nkuX5M/I3oAENZrc8zLaBqVl/FHssyQa3EtXgIUXtgh+IPZeoNCGaAtclKs7k5Dme\nasdRy/g3fUA7zI2FibfnU3lF0By5JZPKcwSaSwxrQdyQqViwp8HgPaI/T5HnH9/P\nT69zvXZ80IGfYZV6F6tzRaaQjCnObExU6+ruW19ONZ/DEaiVbxh2uzsqKal++bXY\n6O4aF8xec+Af5dl1Ifc7DeN4fpZkmsi4hvVSObLhjz6ykWXOvj58XYdzYTEQ+QN7\njfRS/do0cIFned9A8ONCNtpuHxC7KFg/FRX8ii3ZuQKBgQDkBThu01CXcx0vsc5+\nU6ODgmWFulcDPG3lA4oqyZsz1l4OU2T7poqYKkKcxHFVZ3OTBniE2kurh7KQpidJ\nZftoXgsjmF+tKuXJ+nhfd1jB+HIGewhLGbZoKtjSYOr1T5XqqgyYlv8pdhgpCu+Y\njGePVHd5Esj2jjWRtavzmTyRZQKBgQDP9sYdGEKJcdc2ZOdVH90depjOOhqjHGST\n+o/NTauf3ed49NwImZmGBdnO38+ijw3X0rEwSA5MqRMIkUpdBcCYnCoodfTVlH5R\nKawyymq1PI+mTp5laLEDTl1gkrnNwxBW7FXzYAYCRbsNgjPNV8bd6N7h7BXUpjbp\nFwps5z6VjwKBgBD6kokuEwI0AChdBRNDBxnzy7t5dKE5DrXO3arx+CyT+cz3SL20\nWP2bp/okZowFeAWqpa6+0oOjRxieRq6geWf8GLg90GIEn7e6ftwc9u76oQL6hlOR\nRpPbHOoNbXF2y6L9ppJ2K+nacVIdDlo9mjiCAaNyUqSJUlPXQ0aQUoJBAoGAHQAJ\noncGmEoSu9gYVkuKNxkog+GgY0yLTgNr2DJTk4iLRdfHcz+QJBtewzV8q+uM/6K2\n6MezjscpC1HPb+dkcyOb0WaZjMsXTlQkWjTV6o4WbheaiQOvY4mjBduQI3xnI+fz\nGGw0ik6VBg45ERKDfeCCbDjS1oOTNq/q2ULp/EsCgYAPBO5pTTJHIGFRBYL+xD5R\nO+iXXDI2ocr5BZhYIh7S9uCQHhBYvNo4tgpQvA/1nnnGe3dTEl3+56VSZoxNsfxi\nTqgmeq0bZ/rVzUQB8JPxyid6Rld3YBq4HcrWog2XcLmTMZT3K0cGZLQ+vFWxWa29\n4J/zx3RJJG7adufs0AuE7A==\n-----END PRIVATE KEY-----\n", 
      client_email: "firebase-adminsdk-fbsvc@gen-lang-client-0016482258.iam.gserviceaccount.com",
      client_id: "108183320164975982652",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40gen-lang-client-0016482258.iam.gserviceaccount.com",
      universe_domain: "googleapis.com"      
    }; 
    const serviceAccountJson = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    if (!serviceAccountJson) {
      throw new Error('La variable de entorno FIREBASE_SERVICE_ACCOUNT_JSON no está definida.');
    }
    // const serviceAccountConfig = JSON.parse(serviceAccountJson)  as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountConfig as admin.ServiceAccount),
    });
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
