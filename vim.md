## Replace domain names from exported database that contains sanitized data

Before you begin you must know the difference in size between the old domain and new domain name.

For instance **newdomain.com** has a length of 13, while **myolddomain.com** has a length of 15.

Difference in size in this case is: 13-15 = -2.

This means that the sanitized string shrinks with 2 in length. Meaning a string that was 144 in size, will need to become 142.


#### 1) Record new macro
`qq`

#### 2) Always start at the top of the document and at the beginning of the line
`gg0`

#### 3) Search for string with following regex and hit enter to find the first match
`/:[\d]+:\\"[^"]*https:\/\/myolddomain\.com`

#### 4) Now we must go to the number part to shrink/increase it accordingly
  - To shrink use: `w<CTRL-a>`
  - To increase use: `w<CTRL-x>`
  
#### 5) After shrinking/increasing we need to substitute the domain name for the first occurence only (this is very important). Don't forget to escape any dots (.) and slashes (/) like so `\.` and `\/`. Finally hit Enter.
`:%s/myolddomain\.com/newdomain\.com/gc` <CR>

#### 6) Now from the prompt we choose [l]=Last; make this change and then quit.
`l`

#### 7) Stop recording
`q`

#### 8) Execute macro X amount of times
`99999@q`

#### 9) After the macro finished executing, execute the macro again until all the domains have been replaced accordingly.

_This is a step that is required because a sanitized string might contain multiple domain names, and the macro only replaces 1 on each execution._

`99999@q`
`99999@q`
`99999@q`
