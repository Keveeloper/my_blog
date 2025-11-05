import { Controller, Post, Headers, UseInterceptors, ClassSerializerInterceptor, UnauthorizedException, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dtos/user-response.dto';
import { User } from '../users/entities/user.entity';

@Controller('auth')
// Aplicamos el interceptor para transformar la respuesta al DTO de usuario
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  // 1. Inyectamos el servicio de usuarios y el SDK Admin de Firebase
  constructor(
    private readonly usersService: UsersService,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  /**
   * Endpoint para manejar el inicio de sesión con Google/Firebase.
   * Recibe el Token de ID de Firebase en el encabezado Authorization.
   * * NOTA: Este controlador verifica el token de Firebase,
   * encuentra/crea el usuario en Postgres, y devolvería un JWT propio de NestJS.
   */
  @Post('google/login')
  async googleLogin(
    @Headers('authorization') authHeader: string,
  ): Promise<{ user: UserResponseDto, nestJsToken: string }> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autorización no proporcionado o formato inválido.');
    }

    const firebaseIdToken = authHeader.split(' ')[1];

    try {
      // 2. Verificar el Token de ID de Firebase
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(firebaseIdToken);

      // Datos extraídos del token (son la fuente de verdad)
      const { uid, email, name, picture } = decodedToken;
      const [firstName, lastName] = name ? name.split(' ') : ['Usuario', 'Google'];

      const firebaseUserData = {
          uid: uid,
          email: email,
          firstName: firstName,
          lastName: lastName || '', // Si no hay apellido, se deja vacío
          avatar: picture || null,
      };

      console.log('FirebaseUserData: ', firebaseUserData);


      // 3. Encontrar o crear el usuario en la base de datos PostgreSQL
      // El UsersService se encarga de la lógica de persistencia.
      // const user = await this.usersService.findOrCreateUser(firebaseUserData);

      const user = new User();
      user.id = '1'; // Mock ID
      user.email = 'kevind171918@gmail.com';
      user.password = 'hashed_password';

      // 4. Generar y devolver tu propio JWT (NestJS Token)
      // ********* PENDIENTE DE IMPLEMENTAR EL MÓDULO JWT EN NESTJS *********
      // Por ahora, devolvemos un token mock.
      const nestJsToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJm...';

      // 5. Devolver el usuario (transformado por el interceptor) y el token de NestJS
      return {
        user: user as unknown as UserResponseDto,
        nestJsToken,
      };

    } catch (error) {
      // Los errores de token inválido o expirado se capturan aquí
      const errorMessage = error.code === 'auth/argument-error' ?
        'Token de Firebase mal formado o ausente.' :
        'Token de Firebase inválido o expirado.';

      console.error('Error durante el inicio de sesión con Google:', error.message);
      throw new UnauthorizedException(errorMessage);
    }
  }
}
