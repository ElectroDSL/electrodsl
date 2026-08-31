# ElectroDSL 0.3 Conformance Suite

Files in `accepted` must parse successfully. Files in `rejected` must produce a syntax diagnostic. The parser test suite discovers these files automatically, so adding a fixture extends the contract for every implementation.

Run the suite with `pnpm --filter @electrodsl/parser test -- --run`.
