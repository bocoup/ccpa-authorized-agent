# Verification schemes

The application verifies members' identities in a number of contexts. This
directory defines one Node.js module for each context. These modules must
export the values defined below in order to correctly integrate with the
application.

```typescript
interface VerificationScheme {
  // uniquely identifies the verification scheme; should have some meaning for
  // an end-user (e.g. `email` or `phone`)
  name: string;

  // issue an identity challenge to a member
  challenge: (responseUrl: string, member: Member) => Promise<void>;

  // verify a response to an identity challenge
  verify: (value: string) => Promise<boolean>;

  // an asynchronous function which returns all members which should be
  // verified at a given time
  findUnverified: (now: DateTime) => Promise<Member[]>;
}
```
