clear;
chmod +x ./shell/display.sh

rm -rf ../resources/CSV/oracle_states.csv
rm -rf ../resources/CSV/IBM_states.csv
rm -rf ../resources/CSV/MARIA_DB_codes2.csv
rm -rf ../resources/CSV/IBM_states2.csv
rm -rf ../resources/CSV/sap_hana_states.csv
rm -rf ../resources/CSV/gSpanner_states.csv

node ./src/fetch.mjs | ./shell/display.sh