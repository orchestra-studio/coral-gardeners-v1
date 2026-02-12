import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { I18nService } from '../../i18n/i18n.service';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
    namespace: 'auth',
    transports: ['websocket', 'polling'],
})
export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(AuthGateway.name);
    private connectedAdmins = new Map<number, Set<string>>(); // adminId -> Set of socketIds

    constructor(
        private jwtService: JwtService,
        private i18nService: I18nService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');

            if (!token) {
                this.logger.warn(`Client ${client.id} connection rejected: No token provided`);
                client.disconnect();
                return;
            }

            const payload = await this.jwtService.verifyAsync(token);
            const adminId = payload.sub;

            // Store the connection
            if (!this.connectedAdmins.has(adminId)) {
                this.connectedAdmins.set(adminId, new Set());
            }
            this.connectedAdmins.get(adminId).add(client.id);

            // Store admin ID in socket data for later use
            client.data.adminId = adminId;

            this.logger.log(`Admin ${adminId} connected via socket ${client.id}`);
        } catch (error) {
            this.logger.error(`Authentication failed for socket ${client.id}:`, error.message);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const adminId = client.data.adminId;

        if (adminId && this.connectedAdmins.has(adminId)) {
            const sockets = this.connectedAdmins.get(adminId);
            sockets.delete(client.id);

            if (sockets.size === 0) {
                this.connectedAdmins.delete(adminId);
            }

            this.logger.log(`Admin ${adminId} disconnected from socket ${client.id}`);
        }
    }

    /**
     * Emit permission update event to specific admin
     */
    emitPermissionUpdate(adminId: number) {
        const sockets = this.connectedAdmins.get(adminId);

        if (sockets && sockets.size > 0) {
            // Get translations in both languages
            const messageEn = this.i18nService.t('permissions_updated', 'common', 'en');
            const messageAr = this.i18nService.t('permissions_updated', 'common', 'ar');

            sockets.forEach((socketId) => {
                this.server.to(socketId).emit('permissions-updated', {
                    message: {
                        en: messageEn,
                        ar: messageAr,
                    },
                    timestamp: new Date().toISOString(),
                });
            });

            this.logger.log(`Emitted permission update to admin ${adminId} (${sockets.size} connections)`);
        } else {
            this.logger.debug(`No active connections for admin ${adminId}`);
        }
    }

    /**
     * Emit permission update to multiple admins
     */
    emitPermissionUpdateToAdmins(adminIds: number[]) {
        adminIds.forEach((adminId) => this.emitPermissionUpdate(adminId));
    }
}
