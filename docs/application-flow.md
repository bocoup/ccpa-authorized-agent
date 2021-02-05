## Onboarding Flow 
This ascii diagram outlines the onbaording flow for the application.

```
User          |                                            | Authorized Agent
              |                                            |
              |------------[GET:sign-up form request]----->|-----.
              |                                            | generate sign-up form
        .-----|<--------------[RESP:sign-up form]----------|<----'
fill out form |                                            |
        '---->|----------------[POST:response]------------>|-----.
              |                                            | create row in User DB
.-------------|<----[RESP:page describing "next steps"]----|<----+
|             |                                            |     |
|             |                  .---------.               |     |
|.------------|<--[PHONE:OTP]--|  Twilio  |<-[start-verify]-|<----+
||            |                  '---------'               |     |
||            |                  .---------.               |     |
||      .-----|<--[EMAIL:code2]--| Mailgun |<-[POST:code2]-|<----'
|| click link |                  '---------'               |
||      |     |                                            | 
||      |     |                                            | 
||      '---->|-------------------[GET:code2]------------->|-----.
||            |                                            | update row in User DB
||            |<----[RESP:page describing "next steps"]----|<----'
enter OTP   |                                            |
 '----------->|------------------[POST:check-verify]------------->|-----.
              |                                            | update row in User DB
              |                                            | send e-signing link
              |                                            | 
        .-----|<----[RESP:page describing "next steps"]----|<----'
   click link |                  .----------.              |
        |     |                  | DocuSign |              |
        '---->|--[GET:form req]->|--.       |              |
        .-----|<---[RESP:form]---|--'       |              |
sign document |                  |          |              |
        '---->|----[POST:sig]--->| !PII_1!  |              | (everything that follows
              |                  |          |              | is a manual process for
              |                  '----------'              | CR)
```
