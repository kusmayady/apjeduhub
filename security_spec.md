# Firestore Security Specification for APJ Website

This document specifies the security posture and validation assertions for the Akademi Pariwisata Jakarta (APJ) website database.

## 1. Data Invariants

1. **Website Settings**: Readable by any member of the public to render institutional contacts across the web layout. Write access must be restricted to authenticated administrators, or unauthenticated clients only during initial container boot/seeding (when no document exists).
2. **Announcements (Academic Highlights)**: Publicly readable so visitors are informed. Creation and management are restricted to authenticated admins, or during setup/seeding.
3. **PMB Applications**: Anyone can submit an online registration. Only authenticated administrators are allowed to view, status-verify, or delete application forms.
4. **Contact Messages**: Anyone can leave an inquiry through the form. Message logs and replies are restricted to administrators.

## 2. The "Dirty Dozen" Vulnerability Payloads

The rules are designed to strictly reject and block the following malicious requests (PERMISSION_DENIED):

1. **Anonymous PII Harvesting**: An unauthenticated attacker attempts to download or query all PMB candidates' registration records.
2. **Contact Message Scraping**: Retrieving list of customer messages left at the helpdesk without auth.
3. **Setting Tampering**: An unauthenticated user attempts to update institutional contacts, changing the official office address.
4. **Fake Admin Post**: An unauthenticated user attempts to inject arbitrary HTML or phishing announcements.
5. **Form Spoofing (Owner Escalation)**: Creating a PMB registration stating the status has already been "Lulus Seleksi" (bypass admissions).
6. **Applicant Status Shortcutting**: Modifying the state of an existing PMB applicant straight from "Pending" to "Lulus Seleksi" without any administrative authorization.
7. **Junk ID Poisoning**: Trying to write a contact message to a document ID with non-compliant long strings.
8. **Setting Deletion**: Attempting to delete the corporate footer settings.
9. **No-Size String Injection**: Attempting to insert extremely large text strings into PMB school/name properties to consume space.
10. **Shadow Key Mutation**: Adding arbitrary fields to the announcement schema to inject payload triggers.
11. **Timestamp Spoofing**: Providing arbitrary client dates instead of real timestamp patterns (e.g. status tracking).
12. **Admin Email Hijacking**: Forcing administrative operations with spoofed client token payloads.

## 3. Recommended Tests (firestore.rules.test.ts)

Developers should use the following verification pattern using the `@firebase/rules-unit-testing` suite to validate rules:

```typescript
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "bustling-sweep-b6vd8",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "localhost",
      port: 8080
    }
  });
});

test("deny public read on contact messages", async () => {
  const context = testEnv.unauthenticatedContext();
  const db = context.firestore();
  await expect(db.collection("contact_messages").get()).rejects.toThrow();
});
```
