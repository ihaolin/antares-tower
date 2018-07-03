# atool-build
npm run build

PUBLIC_HOME=~/Github/antares/antares-tower/src/main/resources/public

rm -f $PUBLIC_HOME/*.js
rm -f $PUBLIC_HOME/*.css

cp dist/*.* $PUBLIC_HOME
