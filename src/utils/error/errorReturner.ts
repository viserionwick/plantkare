// Essentials
import { NextResponse } from "next/server";

// Models
import ErrorReturn from "../../models/ErrorReturn";

const errorReturner = (error: any): ErrorReturn => {
    if (error.response) {
        return {
            status: error.response.status,
            message: error.response.data.message || error.response.data.error,
            headers: error.response.data.headers
        };
    } else {
        return {
            status: error.status,
            message: error.message,
            headers: error.headers,
        };
    }
}

export const nextErrorReturner = (error: any, customStatus?: number): NextResponse => {
    if (error.response) {
        return NextResponse.json({
            error: error.response.data.message || error.response.data.error,
            headers: error.response.data.headers
        }, { status: error.response.status || customStatus || 400 })
    } else {
        return NextResponse.json({
            error: error.message,
            headers: error.headers
        }, { status: error.status || customStatus || 400 })
    }
}

export default errorReturner;