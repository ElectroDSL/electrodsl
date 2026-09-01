import { describe, expect, it } from "vitest";
import { ElectroDSLLanguageServer } from "../src/index.js";

describe("ElectroDSL LSP server", () => {
    it("advertises editor capabilities", () => {
        const [reply] = new ElectroDSLLanguageServer().handle({ jsonrpc: "2.0", id: 1, method: "initialize" });
        expect((reply.result as any).capabilities).toMatchObject({ hoverProvider: true, documentFormattingProvider: true });
    });

    it("publishes diagnostics and serves completion, hover, and formatting", () => {
        const server = new ElectroDSLLanguageServer(); const uri = "file:///panel.edsl";
        const [diagnostics] = server.handle({ jsonrpc: "2.0", method: "textDocument/didOpen", params: {
            textDocument: { uri, text: 'EDSL 0.5\nPROJECT "P" { @ }' }
        }});
        expect((diagnostics.params as any).diagnostics[0].code).toBe("E1000");
        server.handle({ jsonrpc: "2.0", method: "textDocument/didChange", params: {
            textDocument: { uri }, contentChanges: [{ text: 'EDSL 0.5\nPROJECT "P" { CIRCUIT "C" { COND } }' }]
        }});
        const [completion] = server.handle({ jsonrpc: "2.0", id: 2, method: "textDocument/completion", params: {
            textDocument: { uri }, position: { line: 1, character: 32 }
        }});
        expect((completion.result as any[]).some(item => item.label === "CONDUCTOR")).toBe(true);
    });
});
