#!/bin/bash
chmod +x ./shell/func.sh
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
echo -e "reference files read from\n${YELLOW}$DIR/references${NC}\n"

SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
echo -e "${BLUE}Creating codes from ${YELLOW}(...)/references/IBM_states.csv ${NC}"
cd src

node readFile.mjs ../references/IBM_states2.csv |\
node fileTransformer/sanitize.mjs |\
node generate.cjs --flag "ibm" |\
node fileTransformer/stopNamedKeys.mjs> "$DIR/output1.txt"

printSuccess done

echo -e "${BLUE}Creating codes from ${YELLOW}(...)/references/PSQL_states.csv ${NC}"
node readFile.mjs ../references/PSQL_states.csv |\
node generate.cjs --flag "postgres" > "$DIR/output2.txt"

printSuccess done

echo -e "${BLUE}Creating codes from ${YELLOW}(...)/references/ORACLE_states.csv ${NC}"
node readFile.mjs ../references/ORACLE_states.csv |\
node fileTransformer/sanitize2.mjs |\
node generate.cjs --flag "oracle"> "$DIR/output3.txt"

printSuccess done

echo -e "${BLUE}Composing the resulting JSON file at\n${YELLOW}$DIR${NC}\n"
echo -e "${BLUE}Composing ${YELLOW}(...)/$OUT_FILE${NC}"
node compose.mjs --file "$DIR/output1.txt"|\
node compose.mjs --file "$DIR/output2.txt" |\
node compose.mjs --file "$DIR/output3.txt" |\
node pretty.mjs --file "$DIR/$OUT_FILE"
printSuccess composed

if ! $DEBUG ;
then
  echo -e "${BLUE}removing processing files.${NC}"
  cd .. ; rm "$DIR/output1.txt" ; rm "$DIR/output1.txt.debug.json"
  cd .. ; rm "$DIR/output2.txt" ; rm "$DIR/output2.txt.debug.json"
  cd .. ; rm "$DIR/output3.txt" ; rm "$DIR/output3.txt.debug.json"
  printSuccess removed
fi

end_time=$(date +%s)
duration=$((end_time - start_time))
echo -ne "\nExecution complete in ${YELLOW}${duration}s${NC}$(tput el)\n"

print_box finish 64
