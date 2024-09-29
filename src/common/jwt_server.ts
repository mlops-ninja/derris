import { getTokenData } from "../certs/jwt";
import { JWTEditorState } from "./jwt";

export function  jwtEditorStatefromToken(token: string): JWTEditorState {
    const parsedToken = getTokenData(token);
    if (parsedToken instanceof Error) {
        return new JWTEditorState();
    }

    return new JWTEditorState(token, parsedToken);
}