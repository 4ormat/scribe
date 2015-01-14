# Remove build folder from previous build runs
rm -rf build/format
if [ "$?" != "0" ]; then
  echo "Couldn't delete the directory build/format"
  exit 1
fi

# Symlink to almond.js in node_modules
if [ -L src/almond.js ]; then
  echo "A symlink at src/almond.js already exists"
else
  cd src/
  ln -s ../node_modules/almond/almond.js almond.js
  if [ "$?" != "0" ]; then
    echo "Couldn't symlink to the almond.js file in node_modules"
    cd ../
    exit 1
  fi
  cd ../
fi

# Execute the Plumber build process
./node_modules/.bin/plumber format
if [ "$?" != "0" ]; then
  echo "Something failed during the Plumber build process"
  exit 1
fi

# Remove the symlink to almond.js in node_modules
rm ./src/almond.js

# Copy the built file to the local format repo, if possible
if [ -d ../format ]; then
  cp -v ./build/format/scribe.js ../format/app/assets/javascripts/application/shared/scribe.js
  if [ "$?" != "0" ]; then
    echo "Couldn't copy the scribe build to your local copy of the format repo."
    exit 1
  fi
fi

exit 0
