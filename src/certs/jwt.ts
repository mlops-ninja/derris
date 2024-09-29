import * as jwt from 'jsonwebtoken';

import { ParsedToken } from '../common/jwt';


export function getTokenData(token: string):  ParsedToken | Error {
    try {
        let parsedToken = jwt.decode(token, { complete: true });
        if (!parsedToken) {
            return new Error('Token is not valid');
        }
        const header = parsedToken.header;
        const payload = parsedToken.payload as jwt.JwtPayload;
        return { header, payload };

    } catch (error) {
        return error as Error;
    }
}