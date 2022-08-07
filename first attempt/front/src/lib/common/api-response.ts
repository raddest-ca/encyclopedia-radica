import { ParameterizedMessage, ServerMessage } from "./server-i18n";

export type ApiResponse<T> = {
    value: T;
    success: true;
} | {
    success: false;
    errors: ParameterizedMessage[];
}