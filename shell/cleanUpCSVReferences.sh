clear;
chmod +x ./shell/display.sh

rm -rf ../ressources/CSV/oracle_states.csv
rm -rf ../ressources/CSV/IBM_states.csv
rm -rf ../ressources/CSV/MARIA_DB_codes2.csv
rm -rf ../ressources/CSV/IBM_states2.csv
rm -rf ../ressources/CSV/sap_hana_states.csv
rm -rf ../ressources/CSV/gSpanner_states.csv

node ./src/fetch.mjs | ./shell/display.sh