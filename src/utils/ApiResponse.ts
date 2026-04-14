export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}