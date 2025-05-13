// Essentials
import { NextRequest, NextResponse } from "next/server";

export type Middleware = (
    req: NextRequest
) => Promise<NextResponse | void>

export type ExecuteMiddlewares = (
    req: NextRequest,
    allMiddlewares: Middleware[]
) => Promise<NextResponse | undefined>