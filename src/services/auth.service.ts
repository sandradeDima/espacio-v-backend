import * as UserRepo from '../repositories/user.repo';
import * as RefreshTokensRepo from '../repositories/refreshTokens.repo';
import { compare, hash } from '../utils/password';
import { signAccess, signRefresh, verifyToken } from '../utils/tokens';
import { MensajeApi } from '../types/MensajeApi';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { logger } from '../config/logger';


export async function registerUser(email: string, password: string, name: string): Promise<MensajeApi> {
    try{
        let mensaje: MensajeApi = new MensajeApi();
        //search for user by email
        let user = await UserRepo.findByEmail(email);
        if(user) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = 'El usuario ya existe';
            return mensaje;
        }
        //hash password
        const passwordHash = await hash(password);
        //create user
        user = await UserRepo.createUser(email, passwordHash, name, 1);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Usuario registrado correctamente';
        mensaje.data = user;
        
        return mensaje;

    } catch (error) {
        let mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al registrar el usuario';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function loginUser(email: string, password: string): Promise<MensajeApi> {
    try{
        let mensaje: MensajeApi = new MensajeApi();
        //search for user by email
        let user = await UserRepo.findByEmail(email);
        if(!user) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Credenciales incorrectas';
            return mensaje;
        }
        logger.info('Usuario encontrado');
        logger.info(user);
        logger.info('Contraseña: ' + password);
        logger.info('Contraseña hash: ' + user.passwordHash);
        //compare password
        const validPassword = await compare(password, user.passwordHash);
        logger.info('Contraseña válida: ' + validPassword);
        if(!validPassword) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = 'Credenciales incorrectas';
            return mensaje;
        }
        logger.info('Usuario encontrado y contraseña correcta');
        const accessToken = signAccess({sub: user.id, role: user.role});
        const refreshToken = signRefresh({sub: user.id, role: user.role});

        logger.info('Tokens generados');
        const decodedRefreshToken = jwt.decode(accessToken) as JwtPayload;
        const exp = decodedRefreshToken?.exp ? new Date(decodedRefreshToken.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);
        logger.info('Expiración del token de acceso: ' + exp);
        await RefreshTokensRepo.storeRefreshToken(user.id, refreshToken, exp);
        logger.info('Token de refresco almacenado');

        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Inicio de sesión exitoso';
        mensaje.data = { accessToken, refreshToken, user: userData };
        return mensaje;
        } catch (error) {
            let mensaje = new MensajeApi();
            mensaje.code = 500;
            mensaje.error = true;
            mensaje.message = 'Error al iniciar sesión';
            mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
            return mensaje;
        }
}

export async function refresh(oldRefreshToken: string, userId: number): Promise<MensajeApi> {
    try{
        let mensaje: MensajeApi = new MensajeApi();
        //consume refresh token
        const used = await RefreshTokensRepo.consumeRefreshToken(userId,oldRefreshToken);
        if(!used || used.expiresAt < new Date()) {
            mensaje.code = 401;
            mensaje.error = true;
            mensaje.message = 'Token de refresco invalido';
            return mensaje;
        }
        //get user by id
        const user = await UserRepo.findById(userId);
        if(!user) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = 'Usuario no encontrado';
            return mensaje;
        }
        
        // Generate new tokens
        const accessToken = signAccess({sub: userId, role: user.role});
        const refreshToken = signRefresh({sub: userId, role: user.role});
        
        // Store the new refresh token
        const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
        const exp = decodedRefreshToken?.exp ? new Date(decodedRefreshToken.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);
        await RefreshTokensRepo.storeRefreshToken(userId, refreshToken, exp);
        
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Token de refresco exitoso';
        mensaje.data = { accessToken, refreshToken };
        return mensaje;
    } catch (error) {
        let mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al refrescar el token';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function logoutUser(refreshToken: string, userId: number): Promise<MensajeApi> {
    try {
        let mensaje: MensajeApi = new MensajeApi();
        
        // Verify the refresh token is valid before revoking
        try {
            const payload = verifyToken(refreshToken) as JwtPayload;
            if (Number(payload.sub) !== userId) {
                mensaje.code = 401;
                mensaje.error = true;
                mensaje.message = 'Token no válido para este usuario';
                return mensaje;
            }
        } catch (error) {
            mensaje.code = 401;
            mensaje.error = true;
            mensaje.message = 'Token de refresco inválido';
            return mensaje;
        }
        
        // Revoke the specific refresh token
        const revoked = await RefreshTokensRepo.revokeRefreshToken(userId, refreshToken);
        
        if (!revoked) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Token de refresco no encontrado';
            return mensaje;
        }
        
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Sesión cerrada exitosamente';
        return mensaje;
        
    } catch (error) {
        let mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al cerrar sesión';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}

export async function logoutAllSessions(userId: number): Promise<MensajeApi> {
    try {
        let mensaje: MensajeApi = new MensajeApi();
        
        // Revoke all refresh tokens for the user
        await RefreshTokensRepo.revokeAllRefreshTokens(userId);
        
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Todas las sesiones han sido cerradas exitosamente';
        return mensaje;
        
    } catch (error) {
        let mensaje = new MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al cerrar todas las sesiones';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
