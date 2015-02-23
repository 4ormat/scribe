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
function copy_to_local_repo () {
  local_repo=/app/assets/javascripts/application/shared/scribe\.js
  read -p "Path to your local format repo (DEFAULT: ../format):" formatPath
  if [ -z $formatPath ]; then
    formatPath=\.\./format
  fi
  filePath=$formatPath/app/assets/javascripts/application/shared/scribe\.js
  echo Copying build to $filePath
  # for f in ../**/.git/config; do
  #   grep --silent 4ormat/4ormat.git $f && DIR=$f && break;
  # done
  if [ -f $filePath ]; then
    cp -v ./build/format/scribe.js $filePath
    if [ "$?" != "0" ]; then
      echo "Couldn't copy the scribe build to your local copy of the format repo."
      exit 1
    fi
  else
    echo Couldn\'t find the build target: $filePath
    exit 1
  fi
}

echo "Do you want to copy the build to your local format repo?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) copy_to_local_repo; break;;
        No ) exit 0;;
    esac
done

exit 0
