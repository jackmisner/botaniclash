# How to reseed the Database

You can reseed the database using a command line argument. When you do, it will drop existing tables, recreate them, and populate them with fresh data. Here's how to do it!

## WARNING

Running this command will drop all tables in the database! Do not use it if you have data you want to keep! 

## Instructions

1. Make sure you're in the "api" directory in your terminal
2. Run `go build`
3. Run `./api seed`

Alternatively, you can use:
```
go run main.go seed
```

You should then be able to see a list of confirmation messages in your terminal as each plant is created, for example:

`Created plant: Bog blueberry`

If you enter the wrong command, nothing happens to the database. There will be an error message in the terminal output that says:

`INCORRECT COMMAND LINE ARGUMENT, did you mean 'seed'?`

## I'm a curious cookie, how does this actually work?

*What is "go build"*

- `go build` is a command similar to `go run`. It compiles everything and gets it ready but stops just short of actually running anything. That's why we can then enter our command line argument and give it an extra instruction before it runs.

*Do I need to run go build everytime I want to give the ./api seed argument?*

- No, though it doesn't make a difference if you do. You only need to run `go build` at the start to get everything set up. The exception is that you will need to re-run go build if you update some code. Then you'll need to recompile everything to include the changes.

*Why do I need to specify "./api"? Why can't I just type "seed"?*

- We probably could update this so you could just write seed. However, for now you need to specify `./api` so that Go can actually find all the stuff you compiled when you ran `go build`.

## What Gets Seeded

Currently, the seeding process populates the following tables:

- `plants`: Populated with plant records from the Trefle.io API, including details like common name, scientific name, image URLs, and plant characteristics

## Notes

- The seeding process can take some time as it makes multiple API calls. 