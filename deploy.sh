atool-build

PUBLIC_HOME=~/Github/antares/antares-tower/src/main/resources/public

rm -f $PUBLIC_HOME/*.js
rm -f $PUBLIC_HOME/*.css

cp dist/*.css dist/*.js $PUBLIC_HOME
