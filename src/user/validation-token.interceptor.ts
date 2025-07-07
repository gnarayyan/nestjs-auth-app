import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ValidationTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const validationToken = request.headers['validationtoken'];

    if (!validationToken) {
      throw new BadRequestException('Validation token is required');
    }

    return next.handle();
  }
}
