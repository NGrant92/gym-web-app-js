# Gym Web App
Node and Javascript based
<https://github.com/NGrant92/gym-web-app-js>

##Description:

This project is a revised and improved version of the previous [Play/Java project](https://github.com/NGrant92/ca-gym-web-app).
It has all the features of the original project along with some major additions that make it more robust and useful to a member's fitness.

New Features:

    * Improved Goals:
        * Trainers can add assessment measurements for the member to work towards.
        * These goals will have an 'Achieve by' date and the member's newest assessment will be used to check if they reached the goal or not.
        * When the 'Achieve by' date has arrived there isn't a new assessment done in the last 3 days then it'll prompt them to add an assessment or book an appointment with a trainer

    * Bookings:
        * A member can book an appointment with a trainer with a specified date & time.
        * A trainer can book with a member also.

    * Classes:
        * A list of classes are now available to the members.
        * Members can enroll/unenroll in all or a specific class, provided the class isn't full.
        * Trainers can create, edit or delete classes, but they can't enroll.

## Preloaded Accounts:
The project is preloaded with member and trainer information.

### Member Test Login Info:

    Email: homer@simpson.com
    Password: secret

    Email: marge@simpson.com
    Password: secret

    Email: bart@simpson.com
    Password: secret

### Trainer Test Login Info:

    Email: t1000@tmail.com
    Password: secret

    Email: t2000@tmail.com
    Password: secret

## Software Used

- [Node.js](https://nodejs.org/en/)
- [Lowdb](https://github.com/typicode/lowdb)
- [WebStorm](https://www.jetbrains.com/webstorm/)
- [Semantic-UI-Calendar](https://github.com/mdehoog/Semantic-UI-Calendar)
- [Dateformat-NPM-Plugin](https://www.npmjs.com/package/dateformat)

## Author

Niall Grant ([NGrant92](https://github.com/NGrant92))