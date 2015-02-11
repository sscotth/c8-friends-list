#!/bin/sh

# Clean and create empty public directories
rm -rf public
mkdir public
mkdir public/css
mkdir public/js

# Copy html and css files in the app folder into the public directory and preserve directories
# Add additional file extensions if needed i.e. images, fonts, etc..
cd app
find . -type f \( -name "*.html" -o -name "*.css" \) | cpio -pdvm ../public
cd ..

###############################
# Jade (npm intalled locally) #
###############################

# Render Jade
./node_modules/jade/bin/jade.js app -o public -w &

###############################
# Sass (npm intalled locally) #
###############################

# Render main.scss
./node_modules/nodemon/bin/nodemon.js -e scss --watch app/styles \
  --exec "./node_modules/node-sass/bin/node-sass \
    --output-style compressed \
    --include-path styles \
    --include-path bower_components \
    --source-map-embed \
    app/styles/main.scss public/css/main.css" &

#####################################
# Browserify (npm intalled locally) #
#####################################

# Bundle 3rd-party depenedencies
./node_modules/watchify/bin/cmd.js app/js/common.js -d -o public/js/common.js &

# Bundle main dependencies
./node_modules/watchify/bin/cmd.js app/js/main.js -d -o public/js/main.js &
