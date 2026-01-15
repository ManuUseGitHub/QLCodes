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
OUT_FILE="qlCodes.json"

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

printSuccess(){
  local text="$1"
  echo -e "$CHECK $text"
}

printFail(){
  local text="$1"
  echo -e "$CROSS $text"
}

printError(){
  local text="$1"
  echo -e "$RED $text $NC"
}
