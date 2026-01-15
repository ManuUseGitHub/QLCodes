clear;
chmod +x display.sh

rm -rf ./references/CSV/oracle_states.csv
rm -rf ./references/CSV/IBM_states.csv
rm -rf ./references/CSV/MARIA_DB_codes2.csv
rm -rf ./references/CSV/IBM_states2.csv
rm -rf ./references/CSV/sap_hana_states.csv
rm -rf ./references/CSV/gSpanner_states.csv

node ./src/fetch2.mjs | ./display.sh