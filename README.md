# Nugget Builder #

[![RedNugget Logo](https://rednugget.fr/wp-content/uploads/2017/10/Logo_final5.png)](https://rednugget.fr/)


## Présentation du projet RedNugget##
RedNugget est un blog qui partage les pépites de YouTube, c’est-à-dire les chaînes YouTube qui sont sous-exposées mais qualitatives. Nous rédigeons des articles qui présentent et analysent ces pépites. Ces articles sont rangés dans 3 catégories : se détendre, se marrer, et se cultiver. Dans ce projet, nous créons une dataviz (réalisée en d3) sous un format de radar-chart pour donner forme à nos pépites YouTube.


#### Trouve ta pépite parmi notre mine et compare-la avec les autres pépites. Peut-être que tu trouveras d’autres pépites qui te ressemblent ?! ####

Représentée sous forme de radar-charts, cette visualisation permet de dessiner les pépites déjà minées. On a en effet pensé intéressant d’avoir un double intérêt pour cette visualisation : à la fois une vue globale de la pépite, mais aussi une représentation visuelle de la pépite. Nos pépites prennent forme !
Nous placerons donc cette visualisation dans une page à part entière, dédiée uniquement à ce “labo de pépites”. Les pépites seront toutes présentes sur cette page, sous forme de liste, avec une taille réduite de toutes les pépites, sauf celle qui est sélectionnée 

## L’objectif de cette Dataviz ##
Cette dataviz est là pour que les visiteurs de RedNugget puissent “créer” eux-même leur pépite. Ils sont donc en quelque sorte acteur de la découverte de pépites, bien que celles-ci soient déjà découvertes par nous, RedNugget.
Ces pépites sont représentées par différents critères de notation, à savoir : humour, durée moyenne, abonnés, fréquence de mise en ligne des vidéos, réflexion, originalité. Ces critères balayent donc la pépite dans son ensemble et permettent de donner une première vue de celle-ci.

## Le fonctionnement  ##
Chaque critère est accompagné d’un curseur que l’utilisateur peut régler : sur une échelle de 0 à 1, l’utilisateur donne ses attentes de la pépite. Après avoir paramétré ces critères, la pépite qui se rapproche le plus des paramètres de l’utilisateur s’affiche.
La pépite sera accompagnée par une petite description de la chaîne ainsi qu’un lien vers l’article. Les pépites similaires seront également affichées à proximité de la pépite sélectionnée.
