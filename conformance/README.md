# ElectroDSL Conformance Suite

Files in `accepted` must parse successfully. Files in `rejected` must produce a syntax diagnostic. The fixtures cover language versions through 0.4 and are discovered automatically, so adding a fixture extends the contract for every implementation.

Run the suite with `pnpm --filter @electrodsl/parser test -- --run`.
