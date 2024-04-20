# Minute Notes

This is a note taking application developed in the following technologies: React, Tailwind, Laravel + Fortify + Sanctum + Inertia.

The app was originally developed as an experiment to catch up with the latest technologies in the industry, to showcase as a part of my resume. I also wanted to implement a simple note taking app with a folder like, hirerarchial organisation feature to organise my notes.

Another notable feature of this application is its usernameless/Passwordless authentication system, with a fallback for email/password method for older system.

## Dev Install / Setup

### Clone repo

`git clone git@github.com:tkiafar/minute.git`

### Add php dependecies

`composer install`

### Add node dependencies

`npm install`

### Create/setup enviroment config

Create .env file in the root.

### Setup DB

create a database and add settings to .env file. The app is originally developed by SQLite, so MySQL is compatible.

### Migrate and seed

`php artisan migrate --seed`

### Generateb app key

`php artisan key:generate`

### Set WEBAUTHN environment variables

WEBAUTHN_RP_ID should be the domain you are using, or the authenticators will reject the request.

`WEBAUTHN_RP_NAME=`
`WEBAUTHN_RP_ID=`

### Build

`npm run dev`
