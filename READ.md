# Subscription as a Service

The Subscription as a Service will help a subscription startup company to maintain its users subscriptions. REST service will define the subscriptions plans to which the users of the platform can subscribe.

Dependencies used:
`Express`
`Mongoose`

## Models:
There is 1 model in this Schema.
- `User Model`

## Controllers:
There is 1 controller in this project as below.
- `User Controller`

## User routes

### PUT : creates a user as per given username in the database

`http://localhost:3000/user/:username`


### GET : This will return the details of the user inputted.

`http://localhost:3000/user/:username`


## Subscription routes

### POST : This will register a new subscription for an existing user, with a specified plan and start date.

`http://localhost:3000/subscription`

- Input body
```
{ 
    "user_name": "bharath",
    "plan_id": "LITE_1M",  
    "start_date": "2020-03-01" 
}
```

### GET : This will return the subscription details of the inputted user, please be informed the date is a optional params. If passsed with data it will return the maching subscription as per the start data provided, without date it will return all the subscriptions of the user in an array. Sample as below.

`http://localhost:3000/subscription/:username/:date?`

- Sample output with data
```
{ 
    "plan_id": "PRO_1M",
    "days_left": 3 
}
```

- Sample output without data (only username)
```
[
    {
        "plan_id": "TRIAL",
        "start_date": "2020-02-22",
        "valid_till": "2020-02-28"
    },
    {
        "plan_id": "PRO_1M",
        "start_date": "2020-02-29",
        "valid_till": "2020-03-30"
    }
]
```

