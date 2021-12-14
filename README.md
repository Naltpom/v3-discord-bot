# AdriverBotV3
| Type | Name | Description |
| ------ | ------ | ------ |
| Commande | Help | Permet d'afficher la liste de la plus part des commandes disponibles avec une description |
| Commande | Alternant | Permet aux alternants lors de l'execution de la commande de dire s'ils sont en cours ou en entreprise |
| Commande | Out | Permet de signaler, afficher, retirer des absences |
| Commande | Pr | Permet de signaler une PR |
| Commande | Summon | Permet d'invoquer un "mentionnable" |
| Commande | Update | Permet de signaler une pre-prod prod |
| Cron | Cr | Permet de rappeler et d'afficher un recap |
| Cron | Out | Permet de syncroniser le role OUT |
| Cron | Weekly | Permet de rappeler de remplir de weekly |
| Cron | Sync | Permet de syncroniser le discord et la DB |

## Commands
Les commandes s'utilisent desormais avec le prefix "/" suivi du nom de la commande.

### HELP
La commande help permet d'afficher la liste de la plus part des commandes disponibles avec une description
``` 
/help 
```

### ALTERNANT
La commande alternant permet aux alternants lors de l'execution de la commande de dire s'ils sont en cours ou en entreprise
``` 
/alternant 
```
Losque la commande est executé un board est créé ainsi que pour chaque alternant une question "oui" "non"


### OUT
La commande out dispose de 3 sous commande
- get : permet d'afficher les jours out
 ``` 
 /out get {when} ?{user} 
 ```
- post : permet de definir des jours out
 ``` 
 /out post {date_start} ?{date_end} ?{user}
 ```
- remove : permet  de retirer les jours out
 ``` 
 /out remove {when} {user} 
 ```

### PR
La commande PR permet de signifier sa PR
``` 
/pr {application} {type} {link} {description} 
```
Elle créé un nouveau channel _application type username_
Ce channel dispose de 5 options
- MERGE : 
Permet au lead dev de signaler qu'il a merge la PR
QUI ? Role "LEAD DEV"
- GOOD :
Permet de signifier que j'ai approuvé la pr
QUI ? Tous les tech
- NEED CHANGE :
Permet de signifier que j'ai fait des commantaires sur la pr et je demande des modifications
QUI ? Tous les tech
- FIXED :
Permet de signaler que tout les commentaires on été fixés
Qui ? "LEAD DEV" ou le createur de la PR
- ANNULE :
Permet de signaler que la pr a été annulée
Qui ? "LEAD DEV" ou le createur de la PR

### SUMMON
Permet de faire une demande d'invocation
```
/summon {channel} ?{mentionable}
```

### UPDATE
Permet de signaler une nouvelle preprod prod d'un site
```
/update {application} {type} ?{link}
```

## Cron
### CR
Le cron cr permet de rappeler de faire le cr tous les jours de la semaine
- Du lundi au vendredi à 18h00 => reminder
- Du lundi au vendredi à 21h45 => reminder
- Du lundi au vendredi à 22h00 => reminder et enregistrement des retardataires pour le leaderboard
- Le vendredi à 22h00 => leaderboard

Pour que le CR soit valide le message doit contenir les mots suivant (maj ou minuscule)
- "done"
- "in progress", "in-progress", "inprogress"
- "todo", "to do"

### OUT
- Tous les jours à 3h vérification du role OUT.
Assigne ou retire le role en fonction de la commande **OUT**

### Weekly
- Tous les vendredi à 16h - reminder pour faire le weekly

### Sync
- Du lundi au vendredi a 4h - syncronisation du discord (role, user, channel)
