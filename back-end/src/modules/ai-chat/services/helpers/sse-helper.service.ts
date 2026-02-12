import { Injectable } from '@nestjs/common';
import { Response } from 'express';

/**
 * SSE (Server-Sent Events) Helper Service
 * Handles streaming responses to clients
 */
@Injectable()
export class SseHelperService {
    /**
     * Write SSE event to response stream
     */
    writeSse(res: Response, payload: Record<string, unknown>): void {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
        if (typeof (res as any).flush === 'function') {
            (res as any).flush();
        }
    }

    /**
     * Initialize SSE headers for streaming response
     */
    initializeSseHeaders(res: Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
    }

    /**
     * Send completion signal and close stream
     */
    endSseStream(res: Response): void {
        res.write('data: [DONE]\n\n');
        res.end();
    }

    /**
     * Send error through SSE stream
     */
    sendSseError(res: Response, error: Error | string): void {
        const errorMessage = typeof error === 'string' ? error : error.message;
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
    }
}
