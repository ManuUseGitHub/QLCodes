#!/usr/bin/env bash
chmod +x ./func.sh
. ./func.sh

GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

while IFS= read -r line; do
	# Strip timestamp: everything up to "] "
	msg="${line#*] }"

    if [[ "$msg" == OK_ALL* ]]; then
		print_box "${msg#OK_ALL}" 60

	elif [[ "$msg" == OK_* ]]; then
		printSuccess "SUCCESS: ${msg#OK_}"

	elif [[ "$msg" == KO_* ]]; then
		printFail "FAILURE: ${msg#KO_}"

	else
        if [[ "$msg" == *Error:* ]]; then
        printError "$msg"
		else
            echo "- Log: $msg"
        fi
	fi
done