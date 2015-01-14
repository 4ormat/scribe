cd src/
ln -s ../node_modules/almond/almond.js almond.js
cd ../
./node_modules/.bin/plumber format
rm ./src/almond.js
