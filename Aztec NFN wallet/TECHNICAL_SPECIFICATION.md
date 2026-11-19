# NFN Wallet — Technical Specification

**Version:** 1.0 (proposed)  
**Date:** 2026-11-19  
**Status:** Design specification; not yet implemented  
**Product:** NFN Wallet  
**Proposed SDK:** `@nfn/wallet-auth`  
**Network:** Aztec  
**Targets:** Chrome, Firefox, Android, iOS, Windows, macOS, Linux

## 1. Objectives and boundaries

NFN Wallet is a privacy-preserving, user-controlled wallet for Aztec accounts. NFN applications and third-party dApps will use a reusable JavaScript/TypeScript authentication SDK. Wallet custody, dApp authentication, and blockchain execution are independent trust boundaries. A connection approval is **not** a login: a verified, domain-bound authorization challenge is required before a backend session is issued.

The SDK must never expose seed phrases or private keys to websites or servers, silently enumerate accounts, or approve requests without explicit user consent.

## 2. Architecture

- **Wallet clients:** Chrome and Firefox WebExtensions, Android and iOS native clients, and a Tauri/Rust desktop application.
- **Reusable SDK:** TypeScript, compiled for JavaScript, React and Next.js; provider discovery, connection requests, permission negotiation, challenge-based login, session lookup, disconnect and revocation.
- **Aztec adapter:** version-pinned Aztec Wallet SDK integration, PXE, account-contract-specific authorization and proof generation. Confirm supported APIs against the exact target Aztec network version.
- **Authentication server:** Rust HTTP API, PostgreSQL for consumed nonces, account bindings, session metadata, permissions and minimal audit records.
- **Transports:** browser extension messaging and authenticated, origin-bound mobile/desktop pairing. Never expose an unauthenticated localhost signing endpoint.
- **Crypto/storage:** OS-protected key storage where supported, encrypted wallet vault, explicit recovery model, and authenticated channel encryption.

### Proposed monorepo

```text
nfn-wallet/
  apps/
    extension-chrome/
    extension-firefox/
    mobile/
    desktop/
    wallet-dashboard/
  packages/
    wallet-auth/
    wallet-core/
    wallet-provider/
    wallet-crypto/
    wallet-ui/
    wallet-transport/
    aztec-adapter/
  services/auth-server/
  circuits/identity-proof/
  tests/{integration,security,cross-browser}/
  scripts/{build-extension.sh,build-android.sh,build-desktop.sh,release.sh}
  .github/workflows/
```

## 3. Proposed public SDK interface

```typescript
export interface NFNWalletAuth {
  discover(): Promise<WalletProvider[]>;
  connect(options: {
    providerId?: string;
    permissions: string[];
  }): Promise<WalletConnection>;
  authenticate(options: { audience: string }): Promise<AuthSession>;
  getSession(): Promise<AuthSession | null>;
  disconnect(): Promise<void>;
}

export interface WalletConnection {
  walletId: string;
  networkId: string;
  accounts: string[];
  grantedPermissions: string[];
}

export interface AuthSession {
  authenticated: boolean;
  expiresAt: string;
}
```

These are NFN-owned interfaces, **not** claims about the exported methods of any upstream Aztec SDK. Publish `@nfn/wallet-auth` only after confirming package ownership and implementing compatibility tests.

## 4. Authentication protocol

1. dApp discovers compatible providers without learning account identities.
2. User selects NFN Wallet and explicitly approves origin-specific capabilities.
3. Rust server issues a cryptographically random nonce with short expiry, intended audience/origin, network and challenge ID.
4. Wallet displays the requesting origin and authorization scope, then obtains an account-contract-compatible authorization/proof. Do not assume Ethereum EOA-style arbitrary-message signing works for every Aztec account.
5. Server verifies proof/signature under the **specific account contract scheme**, domain, audience, chain, nonce, expiry and account binding. Reject replay and consume nonce atomically.
6. Server creates an expiring application session using Secure, HttpOnly, SameSite cookies and CSRF defenses.
7. User can disconnect, revoke permissions and terminate server sessions.

### Proposed backend endpoints

| Method | Path | Function |
|---|---|---|
| POST | `/auth/challenge` | Create expiring nonce |
| POST | `/auth/verify` | Verify account authorization and consume nonce |
| GET | `/auth/session` | Read authenticated session |
| POST | `/auth/logout` | Revoke session |
| GET | `/wallet/permissions` | Read granted permissions |
| POST | `/wallet/revoke` | Revoke origin permissions |

Use rate limits, challenge TTLs, transaction boundaries, audit logs without secrets, and no plaintext private-key storage.

## 5. Ethical and security requirements

Explicit opt-in; least-privilege permissions; no silent account enumeration or tracking; visible and verified origin; user-owned keys; minimal personally identifying data; revocation; replay resistance; phishing defenses; recovery procedures; secure updates; dependency scanning; security audit before real funds. Test account changes, locked wallets, concurrent requests, malicious origins, cross-origin replay, expired sessions, extension restart and proof-generation interruption.

## 6. Chrome extension

**Platform:** Manifest V3. Implement extension popup/approval UI, content-script/provider bridge, background service worker, encrypted vault, Aztec adapter and a supported long-running execution context for PXE/WASM where required. Do not rely on service workers remaining alive indefinitely.

Minimal illustrative `manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "NFN Wallet",
  "version": "0.1.0",
  "description": "Privacy-first Aztec wallet",
  "action": { "default_popup": "popup.html" },
  "background": { "service_worker": "background.js", "type": "module" },
  "permissions": ["storage", "offscreen"],
  "host_permissions": []
}
```

Production must add reviewed content scripts, icons and appropriate permissions. For local testing, build `dist/chrome`, open `chrome://extensions`, enable Developer mode, click **Load unpacked**, and select the build directory. For publishing, package a ZIP with manifest at its root, register a developer account, upload to the Chrome Web Store Developer Dashboard, provide privacy disclosures, screenshots and support details, and submit for review.

References: https://developer.chrome.com/docs/webstore/publish/ and https://chrome.google.com/webstore/devconsole

## 7. Firefox extension

Reuse wallet-core and provider logic, but produce a separately tested Firefox WebExtensions build. Adapt Chrome-specific offscreen and service-worker assumptions to Firefox's supported extension APIs. Test permissions, background lifecycle, messaging, encrypted storage and wallet recovery. Submit the signed extension through https://addons.mozilla.org/developers/ .

## 8. Android distribution

Recommended React Native UI plus native Android modules for hardware-backed storage, biometrics and Aztec execution. Produce **signed APK** for direct HTTPS distribution and **signed AAB** for Google Play. Verify release signatures, publish SHA-256 checksums and signed metadata, and do not bypass installation warnings. For Play, enroll in Play Console, complete privacy and data-safety declarations, upload AAB, perform testing and submit for review. Proposed application ID: `com.nfn.wallet` (verify ownership/availability).

https://play.google.com/console/

## 9. iOS distribution

React Native with iOS-native Keychain, compatible Secure Enclave operations, Face ID/Touch ID and deep-link/pairing transport. Enroll in Apple Developer Program, configure signing in Xcode, archive, upload to App Store Connect, test via TestFlight and submit for review. An Android APK does not run on iOS; alternative iOS distribution is subject to region and Apple eligibility requirements.

https://appstoreconnect.apple.com/

## 10. Desktop distribution

Recommended **Tauri + Rust** clients for Windows (`.msi`/`.exe`), macOS (`.dmg`/`.pkg`) and Linux (`.AppImage`/`.deb`). Integrate native secure storage, authenticated wallet-to-browser pairing, explicit per-origin approvals and signed updates. Code-sign Windows builds; sign/notarize macOS builds. No unrestricted localhost RPC.

## 11. CI/CD and release governance

GitHub Actions should separately run formatting, lint, typecheck, unit tests, integration tests, cross-browser tests, Android/iOS device tests, security scanning, reproducible build checks and SBOM generation. Release jobs must be approval-gated with narrowly scoped credentials, pinned dependencies/actions, signed artifacts, checksums, staged rollout and rollback procedures. Never place user wallet keys in CI.

Illustrative baseline:

```yaml
name: NFN Wallet CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
permissions:
  contents: read
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm audit --audit-level=high
```

Pin GitHub Actions to reviewed commit SHAs in production. This example is not a ready-to-run workflow until scripts and lockfiles exist.

## 12. Delivery stages and acceptance

1. SDK + Rust auth server + Aztec authorization prototype.
2. Chrome extension test wallet and user-approved login.
3. Firefox compatibility.
4. Android APK, Play testing and release.
5. iOS TestFlight and App Store release.
6. Tauri desktop clients.
7. Independent security audit and staged production rollout.

**MVP acceptance:** create/import test account, encrypt and unlock vault, approve origin-specific connection, authorize a fresh login challenge, verify server-side, create secure session, disconnect and revoke, recover from extension restarts and interrupted proofs. Prove no private keys leave the wallet and no replay/cross-origin authentication is possible.

**Open validation:** Aztec network version, wallet SDK exports, PXE execution model on each platform, account-contract-specific login authorization, proof verifier, and legal/store requirements must be checked before production implementation.

## 13. Primary references

- Aztec documentation: https://docs.aztec.network/
- Chrome Web Store publishing: https://developer.chrome.com/docs/webstore/publish/
- Mozilla Add-ons: https://addons.mozilla.org/developers/
- Google Play Console: https://play.google.com/console/
- Apple App Store Connect: https://appstoreconnect.apple.com/
