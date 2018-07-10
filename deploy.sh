npm run build

PUBLIC_HOME=~/Github/antares/antares-tower/src/main/resources/public

rm -f $PUBLIC_HOME/*

cp dist/*.* $PUBLIC_HOME
