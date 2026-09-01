# ElectroDSL Conformance Suite

Files in `accepted` must parse successfully. Files in `rejected` must produce a syntax diagnostic. The fixtures cover language versions 0.1 through 1.0 and are discovered automatically, so adding a fixture extends the contract for every implementation.

Run the suite with `pnpm --filter @electrodsl/parser test -- --run`.
