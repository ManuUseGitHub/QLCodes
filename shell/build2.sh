#!/bin/bash
chmod +x ./func.sh
. ./func.sh

OUT_FILE="qlCodes2.json"

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
echo -e "${BLUE}Creating codes from $SCRIPT_DIR/references/IBM_states.csv ${NC}"
cd src

node readFile.mjs ../references/MARIA_DB_codes.csv |\
node fileTransformer/trimHeader.mjs |\
node generate.cjs --flag "maria" |\
node fileTransformer/stopNamedKeys.mjs> "$DIR/output4.txt"

printSuccess done

echo -e "${BLUE}Composing the resulting JSON file at\n${YELLOW}$DIR${NC}\n"
echo -e "${BLUE}Composing ${YELLOW}(...)/$OUT_FILE${NC}"
node compose.mjs --file "$DIR/output4.txt"|\
node pretty.mjs --file "$DIR/$OUT_FILE"
printSuccess composed

if ! $DEBUG ;
then
  echo -e "${BLUE}removing processing files.${NC}"
  cd .. ; rm "$DIR/output4.txt" ; rm "$DIR/output4.txt.debug.json"
  printSuccess removed
fi

end_time=$(date +%s)
duration=$((end_time - start_time))
echo -ne "\nExecution complete in ${YELLOW}${duration}s${NC}$(tput el)\n"

print_box finish 64
