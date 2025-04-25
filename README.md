## Description

nestjs template

## Package List

| Feature                                 | Package                                                                                                                                |
|:----------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------|
| Authentication                          | @nestjs/passport @nestjs/jwt passport passport-jwt passport-local bcrypt <br/> @types/passport-local @types/passport-jwt @types/bcrypt |
| Configuration Management and Validation | @nestjs/config joi                                                                                                                     |
| Database Integration                    | @prisma/client pg <br/> prisma                                                                                                         |
| Email                                   | @nestjs-modules/mailer nodemailer                                                                                                      |
| Error Tracking                          | @sentry/nestjs @sentry/profiling-node                                                                                                  |
| Logging                                 | nest-winston winston <br/> @types/winston                                                                                              |
| Rate Limiting                           | @nestjs/throttler                                                                                                                      |
| Validation                              | class-validator class-transformer                                                                                                      |

## Project setup

```bash
git clone https://github.com/GOOMBANGEE/nestjs-template.git

cd nestjs-template
cp sample.env .env

npm install
```

## Compile and run the project

```bash
# development
npm run start

# watch mode
npm run start:dev

```
