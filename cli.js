#!/usr/bin/env node

import minimist from 'minimist'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

var argv = minimist(process.argv.slice(2));

// Help message
if (argv.h !== undefined) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.`)
        process.exit(0)
}

// Construct url
const latitude = argv.n ? parseFloat(argv.n) : argv.s ? -1 * parseFloat(argv.s) : undefined
const longitude = argv.e ? parseFloat(argv.e) : argv.w ? -1 * parseFloat(argv.w) : undefined
if (latitude == undefined || longitude == undefined) {
    process.exit(-1)
}
const timezone = argv.z ? argv.z : moment.tz.guess()
const url = "https://api.open-meteo.com/v1/forecast?" + "latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone + "&daily=precipitation_hours"

// Make a request
const response = await fetch(url)

// Get the data from the request
const data = await response.json();

// Output JSON
if (argv.j !== undefined) {
    console.log(data)
    process.exit(0)
}

// Response text
const days = (argv.d !== undefined) ? argv.d : 1
let dayString = ""

if (days == 0) {
    dayString = "today."
  } else if (days > 1) {
    dayString = "in " + days + " days."
  } else {
    dayString = "tomorrow."
  }

if (data.daily.precipitation_hours[days] > 0) {
    console.log("You might need your galoshes " + dayString)
}
else {
    console.log("You probably won't need your galoshes " + dayString)
}