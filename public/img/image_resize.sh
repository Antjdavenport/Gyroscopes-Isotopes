#!/bin/bash

convert original/*.jpg -set filename:orig "%t" -format jpg -resize 360\> '%[filename:orig]@2x.jpg'
convert original/*.jpg -set filename:orig "%t" -format jpg -resize 360\> -resize 50% '%[filename:orig].jpg'
convert original/*.png -set filename:orig "%t" -format png '%[filename:orig]@2x.png'
convert original/*.png -set filename:orig "%t" -format png -resize 50% '%[filename:orig].png'