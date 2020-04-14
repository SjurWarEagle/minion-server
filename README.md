## Examples
# Render random dna:
`curl https://<SERVER>:3000/renderRandom` or `curl  https://<SERVER>:3000/render` 

# Render specific size
`curl https://<SERVER>:3000/render?width=300&height=300` 

# Render specific dna
```shell script
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Dylan Powell","gloves":false,"shoes":true,"mood":-44,"skinColor":16,"hairType":3,"pocket":true,"cloths":2,"leftHandItem":0,"rightHandItem":0,"twoEyes":true,"eyeLeft":{"pupilShift":1.642,"irisRadius":2.7854,"color":2066798,"eyeRadius":15.7652},"eyeRight":{"pupilShift":-1.642,"irisRadius":2.7854,"color":2066798,"eyeRadius":15.7652},"eye":{"pupilShift":1.642,"irisRadius":2.7854,"color":2066798,"eyeRadius":15.7652}}' \
  https://<SERVER>:3000/renderDna --output minion.png
```
