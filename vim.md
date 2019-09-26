## Replace domain names from exported database that contains serialized data

Before you begin you must know the difference in size between the old domain and new domain name.

For instance **newdomain.com** has a length of 13, while **myolddomain.com** has a length of 15.

Difference in size in this case is: 13-15 = -2.

This means that the serialized string shrinks with 2 in length. Meaning a string that was 144 in size, will need to become 142.


#### 1) Always start at the top of the document and at the beginning of the line, then start recording a new macro
```
gg0
qq
```

#### 2) Search for domain name to find the first match, note that the below example matches http, https and no protocol but not any email addresses
```
/s:\d\+:\(\(:\d\+:\)\@!.\)\{-}\/\/myolddomain\.com
```

#### 3) To not corrupt the serialized string, we must update it's length accordingly
  - To shrink use: `ww<CTRL-a>`
  - To increase use: `ww<CTRL-x>`
  
#### 4) Visually select our last search pattern so we can opperate on it, this way we can substitute the domain name

```
gn
:s/\%Vmyolddomain\.com/newdomain\.com
```

#### 5) Stop recording and execute macro X amount of times until all domains have been replaced accordingly
```
q
999@q
```

#### 6) OPTIONAL: if a website was developed in a subdirectory and used relative URLs to link to pages you can check for any links that need to be updated (it's best to use /c to confirm each replacement)
```
gg0
qq
/s:\d\+:\(\(:\d\+:\)\@!.\)\{-}\/subdirectoryname\/
- To shrink use: `ww<CTRL-a>`
- To increase use: `ww<CTRL-x>`
gn
:s/\%V\/subdirectoryname\//\//c
q
999@q
```

#### 7) Finally confirm that everything was replaced accordingly :)

