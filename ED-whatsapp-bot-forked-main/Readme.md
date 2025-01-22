
# I. Set Up
## Messaging Service -

As for the sender on Twilio, we are utilizing the messaging service available at Twilio Messaging Service, with the number +12362333176 configured as the sender in the service.

## Incoming Messages handler - 

To facilitate the reception of messages through Twilio, We've developed a REST APIs in
src/whatsapp/twClient.ts file and configured it as the incoming message webhook on Twilio.

You can update the webhook url on this page -
https://console.twilio.com/us1/service/sms/MG34baca07a010672ee5c8e6190ea70965/sms-serv[…]FMG34baca07a010672ee5c8e6190ea70965%3Fx-target-region%3Dus1

## Twilio Setting
![Twilio Dashboard](./Twilio%20(1).png)
![Twilio Dashboard](./Twilio%20(2).png)

## Important files - 

1. Twilio Client - src/utils/twClient/index.ts
2. Initialization and Webhooks - src/whatsapp/twClient.ts
3. Message handling logic - src/whatsapp/twCommands.ts
4. .env file

# II. Run the bot
```
# Bash
## Package installation
npm i
## Run the bot
npm run start
```
