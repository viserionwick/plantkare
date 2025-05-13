// Essentials
import errorReturner from "./errorReturner";

type NewError = (
    status: number,
    message: string,
    from?: string,
    key?: string
) => any;

const newError: NewError = (status, message, from, key) => {
    try {
        if(!status || !message) throw newError(400, "newError function requires the following parameters: 'status', 'message'.", "newError", "required");

        return {
            status,
            message,
            headers: {
                from,
                key
            }
        };
    } catch (error) {
        throw errorReturner(error);
    }
}

export default newError;