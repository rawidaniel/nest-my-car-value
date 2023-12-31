import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run soemthing before a request is handled by the request handler
    // console.log('I am running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        // console.log('I am running before response is sent out', data);
        // console.log("data", data)
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true, // remove any extra properties that are not in the DTO
        });
      }),
    );
  }
}
