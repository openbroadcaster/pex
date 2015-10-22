#!/bin/bash

if [ $# -gt 2 ]; then
output=$1
shift
first_part=$1

cat "$@" | mp3cat - - > tmp.mp3
id3cp $first_part tmp.mp3
vbrfix --XingFrameCrcProtectIfCan tmp.mp3 $output && rm tmp.mp3
else
echo "You need to enter 3 files as arguments."
echo "The first argument is the output file."
echo "The rest of the arguments are the files to be merged."
echo "E.g."
echo -e "\tmp3merge final_output.mp3 part1.mp3 part2.mp3 part3.mp3"
fi
