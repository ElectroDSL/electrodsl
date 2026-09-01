export interface ElectroDSLPackageManifest {
    schema: "electrodsl-package/0.5";
    name: string;
    version: string;
    language: string;
    description?: string;
    license: string;
    components?: string[];
    modules?: string[];
    dependencies?: Record<string, string>;
}

export interface PackageDiagnostic { code: string; message: string }
export interface PackageLockfile {
    schema: "electrodsl-lock/0.5";
    packages: Record<string, {
        version: string;
        integrity: string;
        dependencies: Record<string, string>;
    }>;
}
const namePattern = /^(?:@[a-z0-9-]+\/)?[a-z0-9-]+$/;
const versionPattern = /^(\d+)\.(\d+)\.(\d+)$/;

export function validateManifest(manifest: ElectroDSLPackageManifest): PackageDiagnostic[] {
    const diagnostics: PackageDiagnostic[] = [];
    if (manifest.schema !== "electrodsl-package/0.5") diagnostics.push({ code: "P1000", message: "Unsupported package manifest schema" });
    if (!namePattern.test(manifest.name)) diagnostics.push({ code: "P1001", message: `Invalid package name '${manifest.name}'` });
    if (!versionPattern.test(manifest.version)) diagnostics.push({ code: "P1002", message: `Invalid semantic version '${manifest.version}'` });
    if (!manifest.license.trim()) diagnostics.push({ code: "P1003", message: "Package license is required" });
    return diagnostics;
}

function compatible(version: string, range: string): boolean {
    if (range === "*" || range === version) return true;
    if (!range.startsWith("^")) return false;
    const actual = versionPattern.exec(version);
    const wanted = versionPattern.exec(range.slice(1));
    return !!actual && !!wanted && actual[1] === wanted[1] && compare(version, range.slice(1)) >= 0;
}

const compare = (a: string, b: string) => {
    const av = a.split(".").map(Number); const bv = b.split(".").map(Number);
    return av[0] - bv[0] || av[1] - bv[1] || av[2] - bv[2];
};

export class PackageRegistry {
    private readonly packages = new Map<string, ElectroDSLPackageManifest[]>();

    add(manifest: ElectroDSLPackageManifest): void {
        const errors = validateManifest(manifest);
        if (errors.length) throw new Error(errors.map(error => `${error.code}: ${error.message}`).join("\n"));
        const versions = this.packages.get(manifest.name) ?? [];
        if (versions.some(item => item.version === manifest.version)) throw new Error(`Package '${manifest.name}@${manifest.version}' already exists`);
        versions.push(structuredClone(manifest));
        versions.sort((a, b) => compare(b.version, a.version));
        this.packages.set(manifest.name, versions);
    }

    resolve(name: string, range = "*"): ElectroDSLPackageManifest | undefined {
        const found = this.packages.get(name)?.find(item => compatible(item.version, range));
        return found ? structuredClone(found) : undefined;
    }

    createLockfile(dependencies: Record<string, string>): PackageLockfile {
        const locked: PackageLockfile["packages"] = {};
        const resolving = new Set<string>();
        const visit = (name: string, range: string): void => {
            if (resolving.has(name)) throw new Error(`Dependency cycle detected at '${name}'`);
            const existing = locked[name];
            if (existing) {
                if (!compatible(existing.version, range)) throw new Error(`Version conflict for '${name}': ${existing.version} does not satisfy ${range}`);
                return;
            }
            const manifest = this.resolve(name, range);
            if (!manifest) throw new Error(`Unable to resolve package '${name}' with range '${range}'`);
            resolving.add(name);
            const childDependencies = manifest.dependencies ?? {};
            locked[name] = {
                version: manifest.version,
                integrity: manifestIntegrity(manifest),
                dependencies: Object.fromEntries(Object.entries(childDependencies).sort(([a], [b]) => a.localeCompare(b)))
            };
            for (const [child, childRange] of Object.entries(childDependencies).sort(([a], [b]) => a.localeCompare(b))) visit(child, childRange);
            resolving.delete(name);
        };
        for (const [name, range] of Object.entries(dependencies).sort(([a], [b]) => a.localeCompare(b))) visit(name, range);
        return { schema: "electrodsl-lock/0.5", packages: Object.fromEntries(Object.entries(locked).sort(([a], [b]) => a.localeCompare(b))) };
    }

    verifyLockfile(lockfile: PackageLockfile): PackageDiagnostic[] {
        const diagnostics: PackageDiagnostic[] = [];
        for (const [name, entry] of Object.entries(lockfile.packages)) {
            const manifest = this.resolve(name, entry.version);
            if (!manifest) diagnostics.push({ code: "P2001", message: `Locked package '${name}@${entry.version}' is unavailable` });
            else if (manifestIntegrity(manifest) !== entry.integrity) diagnostics.push({ code: "P2002", message: `Integrity mismatch for '${name}@${entry.version}'` });
        }
        return diagnostics;
    }
}

function stable(value: unknown): string {
    if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
    if (value && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(",")}}`;
    return JSON.stringify(value);
}

export function manifestIntegrity(manifest: ElectroDSLPackageManifest): string {
    return `sha256-${createHash("sha256").update(stable(manifest)).digest("base64")}`;
}
import { createHash } from "node:crypto";
