import { getToken } from "next-auth/jwt";
import {NextResponse} from "next/server";

export async function middleware(req){
    //token exists if user logged in
    const token = await getToken({req, secret:process.env.JWT_SECRET});
    const {pathname} = req.nextUrl;
    //allow if:
    //a. is a request for next auth session & provider fetching 
    //b. token exixsts
    if (pathname.includes("/api/auth") || token){
        return NextResponse.next();
    }

    //redirect to login if no token and requesting protected route
    if (!token && pathname!=='/login'){
        return NextResponse.redirect('/login');
    }
}