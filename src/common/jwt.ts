import { parse } from "path";

const symAlgorithms = ["HS256", "HS384", "HS512"];

const asymAlgorithms = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "PS256", "PS384", "PS512"];

const algorithms = [...symAlgorithms, ...asymAlgorithms];

export interface ParsedToken {
    header: Record<string, any>;
    payload: Record<string, any>;
}

export class JWTEditorState {
    isInvalid: boolean;
    resultingToken: string;

    parsedToken: ParsedToken | null = null;

    algorithm: string;
    pubKey: string;
    privKey: string;

    isPrivKeyValid: boolean;
    isPubKeyValid: boolean;
    isPubKeyMatch: boolean;

    constructor();
    constructor(token: string, parsedToken: ParsedToken);

    constructor(token?: string, parsedToken?: ParsedToken) {
        if (token && !parsedToken) {
            this.resultingToken = token;
            this.parsedToken = null;
            this.algorithm = "HS256";
            this.isInvalid = true;
            this.pubKey = "";
            this.privKey = "";

            this.isPrivKeyValid = false;
            this.isPubKeyValid = false;
            this.isPubKeyMatch = false;
            return;
        }

        if (!token || !parsedToken) {
            this.resultingToken = "";
            this.algorithm = "HS256";
            this.pubKey = "";
            this.privKey = "";

            this.isPrivKeyValid = false;
            this.isPubKeyValid = false;
            this.isPubKeyMatch = false;
            this.isInvalid = true;
            return;
        }

        this.resultingToken = token;
        this.parsedToken = parsedToken;

        this.algorithm = parsedToken.header.alg;
        this.pubKey = "";
        this.privKey = "";
        this.isInvalid = false;

        this.isPrivKeyValid = false;
        this.isPubKeyValid = false;
        this.isPubKeyMatch = false;
    }

    // if key is set - we can edit the token
    public get isEditable(): boolean {
        return !(this.privKey == "" || !this.isPrivKeyValid);
    }

    public get isSymmetric(): boolean {
        return symAlgorithms.includes(this.algorithm);
    }

    public get isAsymmetric(): boolean {
        return asymAlgorithms.includes(this.algorithm);
    }

    public updateWithTokenAndParsedToken(token: string, parsedToken?: ParsedToken): void {
        this.resultingToken = token;
        this.isInvalid = false;
        if (parsedToken) {
            this.parsedToken = parsedToken;
            this.algorithm = parsedToken.header.alg;
            this.isInvalid = false;
        }
    }
}