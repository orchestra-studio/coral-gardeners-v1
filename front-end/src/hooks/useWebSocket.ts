"use client";

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/lib/auth';

interface PermissionUpdateData {
    message?: {
        en: string;
        ar: string;
    };
    timestamp?: string;
}

interface UseWebSocketOptions {
    onPermissionsUpdated?: (data?: PermissionUpdateData) => void;
    enabled?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
    const { onPermissionsUpdated, enabled = true } = options;
    const { session } = useAuth();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!enabled || !session?.accessToken) {
            return;
        }

        // Create WebSocket connection
        const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_BASE_URL || 'http://localhost:3001'}/auth`, {
            auth: {
                token: session.accessToken,
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        // Connection event handlers
        socket.on('connect', () => {
            console.log('[WebSocket] Connected to auth namespace');
        });

        socket.on('disconnect', (reason) => {
            console.log('[WebSocket] Disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('[WebSocket] Connection error:', error.message);
        });

        // Listen for permission updates
        socket.on('permissions-updated', (data) => {
            console.log('[WebSocket] Permissions updated:', data);

            if (onPermissionsUpdated) {
                onPermissionsUpdated(data);
            }
        });

        // Cleanup on unmount or when token changes
        return () => {
            console.log('[WebSocket] Cleaning up connection');
            socket.disconnect();
            socketRef.current = null;
        };
    }, [session?.accessToken, enabled, onPermissionsUpdated]);

    return {
        socket: socketRef.current,
        isConnected: socketRef.current?.connected ?? false,
    };
}
