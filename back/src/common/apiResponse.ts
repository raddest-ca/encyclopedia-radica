import { ParameterizedMessage, ServerMessage } from "./i18n";

export type ApiResponse<T> = {
    value: T;
    success: true;
} | {
    success: false;
    errors: ParameterizedMessage[];
}