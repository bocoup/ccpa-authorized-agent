# Application Flow Diagrams
This document contains a series of flow diagrams to help you understand how messages travel between the end-user, the Authorized Agent system, and various third-party services

## Diagram conventions
The below Diagrams use the following conventions to describe the messages:
* [GET:content] - HTTP GET request containing data: "content"
* [RESP:content] - HTTP response containing data: "content"
* [POST:content] - HTTP POST request containing data: "content"
* [EMAIL:content] - e-mail containing data: "content"
* [PHONE:content] - SMS or telephone call containing data: "content"

## FLOW_1: Typical sign-up
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
|.------------|<--[PHONE:code1]--| Twilio  |<-[POST:code1]-|<----+
||            |                  '---------'               |     |
||            |                  .---------.               |     |
||      .-----|<--[EMAIL:code2]--| Mailgun |<-[POST:code2]-|<----'
|| click link |                  '---------'               |
||      |     |                                            | (see also: FLOW_2 &
||      |     |                                            | FLOW_3)
||      '---->|-------------------[GET:code2]------------->|-----.
||            |                                            | update row in User DB
||            |<----[RESP:page describing "next steps"]----|<----'
enter code1   |                                            |
 '----------->|------------------[POST:code1]------------->|-----.
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

FLOW_2: No e-mail response
User          |                                            | Consumer Reports
              |                                            |
              |                  .---------.               | (24 hours pass)
        .-----|<--[EMAIL:code2]--| Mailgun |<-[POST:code2]-|<----'
   click link |                  '---------'               |
        '---->|-------------------[GET:code2]------------->|-----.
              |                                            | (continue FLOW_1)
```


## FLOW_2: No e-mail response
```
User          |                                            | Authorized Agent
              |                                            |
              |                  .---------.               | (24 hours pass)
        .-----|<--[EMAIL:code2]--| Mailgun |<-[POST:code2]-|<----'
   click link |                  '---------'               |
        '---->|-------------------[GET:code2]------------->|-----.
              |                                            | (continue FLOW_1)
```
## FLOW_3: No phone response
```
User          |                                            | Authorized Agent
              |                                            |
              |                  .---------.               | (24 hours pass)
        .-----|<--[EMAIL:remind]-| Mailgun |<[POST:remind]-|<----'
   click link |                  '---------'               |
        '---->|------------[GET:sign-up form request]----->|-----.
              |                                            |     |
       .------|<----[RESP:page describing "next steps"]----|<----+
       |      |                  .---------.               |     |
       |.-----|<--[PHONE:code1]--| Twilio  |<-[POST:code1]-|<----'
enter code1   |                  '---------'               |
        '---->|------------------[POST:code1]------------->|-----.
              |                                            | (continue FLOW_1)
```

## FLOW_4: Revoke consent
```
User          |                                            | Authorized Agent
              |                                            |
              |----------------[GET:status page]---------->|-----.
        .-----|<--------------[RESP:status page]-----------|<----'
   click link |                                            |
        '---->|--------->[GET:revocation request]--------->|-----.
              |                                            | destroy row in User DB
              |<-------------[RESP:confirmation]-----------|<----+
              |                  .---------.               |     |
              |            .-----| Mailgun |<[POST:notify]-|<----'
              |            |     '---------'               |
              |            '----[EMAIL:notify]------------>| !PII_2!
```
## Personally-identifiable information
The interactions described above include two instances where personally-identifiable information is stored in a way that the system cannot automatically delete. They are designated with the labels !PII_1! and !PII_2!. The application's operators will need to take special care to manually delete this data when an end-user revokes their consent.
* `!PII_1!` - When the end-user signs a consent form via DocuSign, that service generates a PDF document which includes the personally-identifiable information.
* `!PII_2!` - When the end-user revokes their consent, the system sends an e-mail to Consumer Reports identifying that person.
