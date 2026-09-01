#!/usr/bin/env node
import { ElectroDSLLanguageService } from "@electrodsl/language-service";

interface RpcMessage { jsonrpc: "2.0"; id?: number | string; method?: string; params?: any; result?: unknown; error?: unknown }

export class ElectroDSLLanguageServer {
    private readonly documents = new Map<string, string>();
    constructor(private readonly service = new ElectroDSLLanguageService()) {}

    handle(message: RpcMessage): RpcMessage[] {
        const response = (result: unknown): RpcMessage[] => message.id === undefined ? [] : [{ jsonrpc: "2.0", id: message.id, result }];
        switch (message.method) {
            case "initialize": return response({
                serverInfo: { name: "ElectroDSL Language Server", version: "0.5.0" },
                capabilities: {
                    textDocumentSync: 1,
                    completionProvider: { triggerCharacters: ["."] },
                    hoverProvider: true,
                    documentFormattingProvider: true
                }
            });
            case "shutdown": return response(null);
            case "textDocument/didOpen": {
                const document = message.params.textDocument;
                this.documents.set(document.uri, document.text);
                return [this.diagnostics(document.uri)];
            }
            case "textDocument/didChange": {
                const uri = message.params.textDocument.uri;
                const text = message.params.contentChanges.at(-1)?.text ?? "";
                this.documents.set(uri, text);
                return [this.diagnostics(uri)];
            }
            case "textDocument/didClose": {
                const uri = message.params.textDocument.uri;
                this.documents.delete(uri);
                return [{ jsonrpc: "2.0", method: "textDocument/publishDiagnostics", params: { uri, diagnostics: [] } }];
            }
            case "textDocument/completion": {
                const { uri } = message.params.textDocument;
                const prefix = this.wordAt(uri, message.params.position, true);
                return response(this.service.complete(prefix).map(item => ({ ...item, kind: 14 })));
            }
            case "textDocument/hover": {
                const { uri } = message.params.textDocument;
                const info = this.service.hover(this.wordAt(uri, message.params.position));
                return response(info ? { contents: { kind: "markdown", value: `**${info.title}**\n\n${info.documentation}` } } : null);
            }
            case "textDocument/formatting": {
                const source = this.documents.get(message.params.textDocument.uri);
                if (source === undefined) return response([]);
                const lines = source.split(/\r?\n/);
                return response([{ range: { start: { line: 0, character: 0 }, end: { line: lines.length, character: 0 } }, newText: this.service.format(source) }]);
            }
            default: return response(null);
        }
    }

    private diagnostics(uri: string): RpcMessage {
        const diagnostics = this.service.diagnose(this.documents.get(uri) ?? "").map(item => ({
            ...item,
            range: item.range ?? { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } },
            severity: item.severity === "error" ? 1 : 2,
            source: "electrodsl"
        }));
        return { jsonrpc: "2.0", method: "textDocument/publishDiagnostics", params: { uri, diagnostics } };
    }

    private wordAt(uri: string, position: { line: number; character: number }, prefixOnly = false): string {
        const line = (this.documents.get(uri) ?? "").split(/\r?\n/)[position.line] ?? "";
        const before = line.slice(0, position.character).match(/[A-Za-z_][A-Za-z0-9_-]*$/)?.[0] ?? "";
        if (prefixOnly) return before;
        const after = line.slice(position.character).match(/^[A-Za-z0-9_-]*/)?.[0] ?? "";
        return before + after;
    }
}

export function startLanguageServer(input = process.stdin, output = process.stdout): void {
    const server = new ElectroDSLLanguageServer();
    let buffer = Buffer.alloc(0);
    input.on("data", chunk => {
        buffer = Buffer.concat([buffer, Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)]);
        while (true) {
            const separator = buffer.indexOf("\r\n\r\n");
            if (separator < 0) break;
            const header = buffer.subarray(0, separator).toString("ascii");
            const length = Number(/Content-Length:\s*(\d+)/i.exec(header)?.[1]);
            if (!Number.isFinite(length) || buffer.length < separator + 4 + length) break;
            const bodyStart = separator + 4;
            const message = JSON.parse(buffer.subarray(bodyStart, bodyStart + length).toString("utf8"));
            buffer = buffer.subarray(bodyStart + length);
            for (const reply of server.handle(message)) {
                const body = JSON.stringify(reply);
                output.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
            }
        }
    });
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/language-server/dist/index.js")) startLanguageServer();
