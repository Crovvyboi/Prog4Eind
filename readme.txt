Web link:
    https://opdreindprog4.herokuapp.com/


Welcome to the Share-a-meal API
Use the following url extensions to get the API's functionalities:

Authentification
- /api/auth/login
    - post
        + Logs the user in and grants access to the API's functions
        + Required parameters:
            * emailAdress : string
            * password : string

Users
- /api/users
    - get
        + Gets a list of users
        + Optional parameters:
            * id : integer
            * isActive : integer (1 or 0)
            * firstname : string
    - post
        + Inserts a new user into the database
        + Required parameters:
            * firstName : string 
            * lastName : string 
            * isActive : integer (1 or 0)
            * emailAdress : string 
            * password : string 
            * phoneNumber : string 
            * roles : string 
            * street : string 
            * city : string
    - put
        + Updates an existing user with new attributes
        + Required parameters:
            * emailAdress : string 
            * password : string 
    - remove
        + Deletes an existing user from the database
        + Required parameters:
            * emailAdress : string 
            * password : string 
- /api/users/profile
    - get
        + Gets the profile of the logged in user


Meals 
- /api/meals
    - get
        + Gets a list of meals
        + Required parameters:
            * id : integer
    - post
        + Inserts a new meal into the database
        + Required parameters:
            * isActive : string 
            * isVega : string 
            * isVegan : string 
            * isToTakeHome : string 
            * dateTime : string 
            * maxAmountOfParticipants : string 
            * price : string 
            * imageUrl : string 
            * createDate : string 
            * updateDate : string 
            * name : string 
            * description : string 
            * allergenes : string 
    - put
        + Updates an existing meal with new attributes
        + Required parameters:
            * maxAmountOfParticipants : string
            * price : string
            * name : string
        + Optional parameters:
            * isActive : string 
            * isVega : string 
            * isVegan : string 
            * isToTakeHome : string 
            * dateTime : string 
            * imageUrl : string 
            * createDate : string 
            * updateDate : string 
            * description : string 
            * allergenes : string 
    - remove
        + Deletes an existing meal from the database
        + Required parameters:
            * name : string

Note that functionalities won't work with the proper login or token
To login


