# Password Hashing (Task 04, Step 4)

All figures were measured on this development machine on 2026-11-03 (13th Gen Intel Core i5-1345U, 12 logical cores, 15.7 GiB RAM, Windows, Node v24.19.0). Raw output: [`07-hash-twice-different.txt`](../evidence/07-hash-twice-different.txt) and [`08-timing-argon-vs-sha.txt`](../evidence/08-timing-argon-vs-sha.txt). Script output is reproduced, not estimated.

## Selected algorithm

**Argon2id** via the `argon2` Node package, using the parameters required by `RULES.md`:

| Parameter | Value |
|---|---|
| Variant | `argon2id` |
| Memory cost | 19456 KiB (19 MiB) |
| Time cost | 2 |
| Parallelism | 1 |

Implemented in [`src/lib/password.ts`](../../src/lib/password.ts) (`hashPassword`, `verifyPassword`). Hashing and verification run only on the server. Only the encoded hash string is stored (`User.passwordHash`).

## 1–3. Same password hashed twice

```
Hash 1: $argon2id$v=19$m=19456,t=2,p=1$+QyRxDnSMj4AYUz225hiCQ$1qQ9W6SS962oZY4WIYLubZmI5RlxwiwXR/jducpwzRk
Hash 2: $argon2id$v=19$m=19456,t=2,p=1$axwnMiTQW1XeE+FeaHv0Pw$xYi1FeNTpO6wpa/igBfsMG3Rf7AQRy60MAVhbPjNdDg
```

The outputs differ because each call generates a new random salt (`+QyRx…` vs `axwnM…`) that is mixed into the hash. Both hashes still verify the same password (`verify` returned `true` for both, `false` for a wrong password).

## 4–5. Measured time

| Algorithm | Measurement | Result |
|---|---|---|
| Argon2id (above parameters) | 30 runs after warm-up | mean **23.25 ms** (min 20.91, max 26.33) |
| SHA-256 (Node `crypto`) | 2,000,000 sequential hashes | **1,137 ns** (0.001137 ms) per hash |

## 6–7. Guesses per second (one core) and arithmetic

- Argon2id: 1000 ms ÷ 23.25 ms ≈ **43 guesses/second**
- SHA-256: 1000 ms ÷ 0.001137 ms ≈ **879,825 guesses/second**
- Ratio: 879,825 ÷ 43.0 ≈ **20,000×** (script, unrounded: 20,459×) more guesses per second against SHA-256.

Worked example, 6 characters of lowercase letters and digits (36⁶ = 2,176,782,336 candidates), one core:

- SHA-256: 2,176,782,336 ÷ 879,825 ≈ 2,474 s (about 41 minutes)
- Argon2id: 2,176,782,336 ÷ 43 ≈ 50.6 million s (about 586 days)

**Limits of this evidence:** it is one core, CPU only, and Node's implementations. Attackers can use many cores or GPUs; Argon2id's 19 MiB per guess limits how many guesses run in parallel, but these numbers are not a guarantee of attacker cost. The 23 ms cost is also paid on every login and registration, so rate limiting (Step 7) matters. `RULES.md` also asks to benchmark in the deployment environment; this measurement is from the development machine only, and the deployment benchmark is still to do.

## 8. Salts

A salt is a unique random value added to each password before hashing. It means identical passwords produce different hashes and stops precomputed tables. **The `argon2` library generates a 16-byte cryptographically random salt per hash and stores it inside the encoded string**, so there is no salt column and no custom salting code (as `RULES.md` requires).

SHA-256, SHA-512 and MD5 are never used for password storage. SHA-256 appears only in this benchmark as the fast-hash comparison.

