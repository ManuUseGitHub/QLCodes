#!/bin/bash
. ./shell/func.sh

OUT_FILE="qlCodes.json"

start_time=$(date +%s)

DEBUG=false
MAKE_KEYS=false

for arg in "$@"; do
  case $arg in
    --debug)
      DEBUG=true
      ;;
    --make-keys)
      MAKE_KEYS=true
      ;;
  esac
done

export DEBUG && export MAKE_KEYS

clear
print_box "$(basename "$0") execution" 64

echo -e "MODES"
echo -e "${YELLOW} $@ ${NC}"
echo -e "reference files read from\n${YELLOW}$DIR/ressources/CSV${NC}\n"


printStep "Composing the resulting JSON file at\n${YELLOW}$DIR${NC}\n"
printStep "Composing ${YELLOW}(...)/$OUT_FILE${NC}"

node ./src/composeCsv.mjs "$DIR/ressources/CSV/POSTGRES_states2.csv"  --flags 'pgsql' |\
node ./src/composeCsv.mjs "$DIR/ressources/CSV/IBM_states2.csv"  --flags 'ibm' |\
node ./src/composeCsv.mjs "$DIR/ressources/CSV/oracle_states.csv"  --flags 'oracle' |\
node ./src/composeCsv.mjs "$DIR/ressources/CSV/MARIA_DB_codes2.csv"  --flags 'maria' |\
node ./src/composeCsv.mjs "$DIR/ressources/CSV/sap_hana_states.csv"  --flags 'sap_hana' |\
node ./src/composeCsv.mjs "$DIR/ressources/CSV/gSpanner_states.csv"  --flags 'google_spanner' |\
node ./src/pretty.mjs --file "$DIR/$OUT_FILE"
printSuccess composed

print_box cleanup 64

if ! $DEBUG ;
then
  printStep "removing processing files."
  rm -v $DIR/ressources/Debug/*.* | ./shell/display.sh
  printSuccess removed
fi

end_time=$(date +%s)
duration=$((end_time - start_time))
echo -ne "\nExecution complete in ${YELLOW}${duration}s${NC}$(tput el)\n"

print_box finish 64
