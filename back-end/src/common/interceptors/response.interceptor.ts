import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                // If data already has the correct shape, return it
                if (
                    data &&
                    typeof data === 'object' &&
                    'success' in data &&
                    'data' in data &&
                    'message' in data
                ) {
                    return data as ApiResponse<T>;
                }

                // If data has a message property, use it
                if (data && typeof data === 'object' && 'message' in data) {
                    const { message, ...rest } = data as any;
                    return {
                        success: true,
                        data: rest as T,
                        message: message || '',
                    };
                }

                // Default transformation
                return {
                    success: true,
                    data: data as T,
                    message: '',
                };
            }),
        );
    }
}
