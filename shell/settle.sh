rm -rf ./resources
mkdir ./resources ; cd ./resources
mkdir HTML CSV Debug
unzip -q ../archive.zip -d HTML
cd ..
npm run fetch