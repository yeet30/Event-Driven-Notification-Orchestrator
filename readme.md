To run in development mode, you can use the following command:

```bash
npm run dev
```

This will start the development server, watch for changes in your code and automatically reload the application.

To build the project for production, you can use the following command:

```bash
npm run build
```

This will create an optimized build of your application in the `.build` directory.

To start the production server, you can use the following command:

```bash
npm run start
```

This will start the server using the optimized build created in the previous step.

Remember to install the necessary dependencies before running these commands. You can do this by running:

```bash
npm i
```

To make the formatting better, prettierrc has been used.

To run prettierrc, the following command can be used:

```bash
npm run format
```

After the server has been started, use any API testing tools (such as Postman) to create a user, get the preferences of a user or send a notification. Request can only be sent in the form that has been stated in the task information pdf. Such as:

To create a user with specific Id send a post request to:

http://localhost:{PORT}/preferences/:userId

And the formating should be as:

{
    "dnd": {
        "start": "HH:MM",
        "end": "HH:MM" 
        //HH.MM format is also accepted
    },
    "eventSettings": {
        "item_shipped": {
            "enabled": boolean
        },
        "invoice_generated": {
            "enabled": boolean
        }
    }
}

This adds the user to a users MAP, that is accessible through a module.

And to get the preferences of such user, send a get request to the same URL.


To send a notification, send a post request to:

http://localhost:{PORT}/events

With the format:

{
 "eventId": string,
 "userId": string,
 "eventType": "item_shipped" or "invoice_generated", //No other forms are accepted since these were the only ones that were requested in the task
 "timestamp": date
}

Depending on the user's preferences, the API will send the response.

To access the request logs, send a get request to:

 http://localhost:{PORT}/logs
