#!/bin/bash
rm *.out.txt

npm run offline:sls  > sls.out.txt 2>&1 &

# Check serverless is running
start=$(date +%s)
while true; do

	elapsed=$(($(date +%s) - ${start}))
    echo "${elapsed}"
	if [[ ${elapsed} -gt 120 ]]; then
		echo "Timeout sls" >> start.out.txt 2>&1
		exit 1
	fi

    PID=$(lsof -ti :3000)

    if [ -n "$PID" ]; then
        echo "$PID" >> sls_pid.out.txt 2>&1
        echo "Sls is running on port 3000 with PID $PID" >> start.out.txt 2>&1
        break
    else
        echo "No process is running on port 3000." >> start.out.txt 2>&1
        sleep 5
    fi

done