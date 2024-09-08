import * as vscode from 'vscode';
import * as forge from 'node-forge';
import { verify } from 'crypto';

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    // Convert Uint8Array to a binary string
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
  
    // Convert binary string to base64
    return btoa(binaryString);
  }

export function parseDerCertificate(derData: Uint8Array) {
    // Convert DER to PEM format (node-forge expects PEM)
    const base64 = uint8ArrayToBase64(derData);
    const pem = `-----BEGIN CERTIFICATE-----\n${base64.match(/.{0,64}/g)?.join('\n')}\n-----END CERTIFICATE-----`;

    return parsePemCertificate(pem);
}


export function parsePemCertificate(pemData: string): string {
    // Parse the certificate from PEM
    const cert = forge.pki.certificateFromPem(pemData);

    // Extract and format the relevant fields
    const certInfo = {
        version: cert.version,
        serialNumber: cert.serialNumber,
        signatureOid: cert.signatureOid,
        signature: cert.signature,
        subject: cert.subject.attributes.map(attr => ({
            name: attr.name,
            value: attr.value,
        })),
        issuer: cert.issuer.attributes.map(attr => ({
            name: attr.name,
            value: attr.value,
        })),
        privateKEy: cert.privateKey,
        validFrom: cert.validity.notBefore.toISOString(),
        validTo: cert.validity.notAfter.toISOString(),
        extensions: cert.extensions.map(ext => ({
            name: ext.name,
            value: ext.value,
        })),
    };

    // Convert the result to JSON
    return JSON.stringify(certInfo, null, 4);
}