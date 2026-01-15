rm -rf ./ressources
mkdir ./ressources ; cd ./ressources
mkdir HTML CSV Debug
unzip -q ../archive.zip -d HTML
cd ..
npm run fetch