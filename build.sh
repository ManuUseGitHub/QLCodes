#!/bin/bash
# Colors
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"
CHECK="${GREEN}✔${NC}"
CROSS="${RED}✖${NC}"

DIR="$( cd "$( dirname "$0" )" && pwd )"

start_time=$(date +%s)

# ---- BOX FUNCTION -----------------------------------------------------------

print_box () {
    local text="$1"
    local fixed_width="$2"

    # Strip ANSI colors for measuring
    local plain_text=$(echo -e "$text" | sed 's/\x1b\[[0-9;]*m//g')
    local content_len=${#plain_text}

    # Determine final width (content width if no fixed width)
    local box_width
    if [[ -n "$fixed_width" && "$fixed_width" -gt "$content_len" ]]; then
        box_width=$fixed_width
    else
        box_width=$content_len
    fi

    # Compute padding for centering
    local total_pad=$(( box_width - content_len ))
    local left_pad=$(( total_pad / 2 ))
    local right_pad=$(( total_pad - left_pad ))

    # Generate padding spaces
    local left_spaces=$(printf "%*s" "$left_pad" "")
    local right_spaces=$(printf "%*s" "$right_pad" "")

    # Build border
    local border=$(printf '%*s' "$box_width" '' | tr ' ' '_')
    local blank=$(printf '%*s' "$box_width" '' | tr ' ' ' ')
    echo -e "${GREEN}" 
    echo " _$border""_"
    echo "/ $blank"" \\" 
    echo "  ${left_spaces}${text}${right_spaces}"
    echo "\\_$border""_/" 
    echo -e "${NC}"
}

# ---- SCRIPT START -----------------------------------------------------------

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

SCRIPT_DIR="$( cd "$( dirname "$0" )" && pwd )"
echo -e "${BLUE}Creating codes from $SCRIPT_DIR/references/IBM_states.csv ${NC}"
cd src

node readFile.mjs ../references/IBM_states.csv |\
node fileTransformer/sanitize.mjs |\
node generate.cjs --flag "ibm" |\
node fileTransformer/stopNamedKeys.mjs> "$DIR/output1.txt"

echo -e "$CHECK done"

echo -e "${BLUE}Creating codes from $SCRIPT_DIR/references/PSQL_states.csv ${NC}"
node readFile.mjs ../references/PSQL_states.csv |\
node generate.cjs --flag "postgres" > "$DIR/output2.txt"

echo -e "$CHECK done"

echo -e "${BLUE}Creating codes from $SCRIPT_DIR/references/ORACLE_states.csv ${NC}"
node readFile.mjs ../references/ORACLE_states.csv |\
node fileTransformer/sanitize2.mjs |\
node generate.cjs --flag "oracle"> "$DIR/output3.txt"

echo -e "$CHECK done"

echo -e "${BLUE}Composition of the JSON file at $DIR/qlCodes.json${NC}"
node compose.mjs --file "$DIR/output1.txt"|\
node compose.mjs --file "$DIR/output2.txt" |\
node compose.mjs --file "$DIR/output3.txt" |\
node pretty.mjs --file "$DIR/qlCodes.json"

echo -e "$CHECK deleted"

if ! $DEBUG ;
then
  echo -e "${BLUE}removing processing files.${NC}"
  cd .. ; rm "$DIR/output1.txt" ; rm "$DIR/output1.txt.debug.json"
  cd .. ; rm "$DIR/output2.txt" ; rm "$DIR/output2.txt.debug.json"
  cd .. ; rm "$DIR/output3.txt" ; rm "$DIR/output3.txt.debug.json"
  echo -e "$CHECK removed"
fi

end_time=$(date +%s)
duration=$((end_time - start_time))
echo -ne "\nExecution complete in ${YELLOW}${duration}s${NC}$(tput el)\n"                                                                                           

print_box finish 64
