
setlocal enabledelayedexpansion

:: Activer l'encodage UTF-8 pour les caractères accentués
chcp 65001 >nul

:: Définir la couleur de fond et du texte (fond noir, texte vert clair)
color 0A



:: Vérifier qu'un fichier a été glissé-déposé
if "%~1"=="" (
    echo Glissez-déposez un fichier .md sur ce script pour le convertir.
    pause
    exit /b
)

:: Vérifier que le fichier est bien un .md
if not "%~x1"==".md" (
    echo Le fichier doit être un .md
    pause
    exit /b
)

:: Récupérer le chemin et le nom du fichier sans extension
set "fichier=%~1"
set "nom_fichier=%~n1"
set "chemin=%~dp1"

:: Créer un sous-dossier pour les fichiers générés
set "dossier_sortie=%chemin%\%nom_fichier%"
if not exist "%dossier_sortie%" (
    mkdir "%dossier_sortie%"
)

:: Copier le fichier .md dans le sous-dossier
copy "%fichier%" "%dossier_sortie%\" >nul

:: Changer de répertoire pour accéder au sous-dossier
cd /d "%dossier_sortie%"

:: Exécuter les commandes Pandoc et LaTeX
echo Conversion en cours pour "%nom_fichier%.md"...

:: Conversion en HTML
pandoc "%nom_fichier%.md" -o "%nom_fichier%.html" --toc --mathjax --template="../modele.html"

:: Conversion en DOCX (énoncé)
pandoc "%nom_fichier%.md" -o "%nom_fichier%_enonce.docx" --lua-filter="../enonce.lua" --reference-doc="../noncorrige.docx"

:: Conversion en DOCX (corrigé)
pandoc "%nom_fichier%.md" -o "%nom_fichier%_corrige.docx" --lua-filter="../corrige.lua" --reference-doc="../corrige.docx"

:: Conversion en TeX (corrigé)
pandoc  "%nom_fichier%.md" -o "%nom_fichier%_corrige.tex" --lua-filter="../corrige.lua" --extract-media="images" --template="../modele.tex"

:: Conversion en TeX (énoncé)
pandoc  "%nom_fichier%.md" -o "%nom_fichier%_enonce.tex" --lua-filter="../enonce.lua" --extract-media="images" --template="../modele.tex"

:: Compilation LaTeX (corrigé)
pdflatex "%nom_fichier%_corrige.tex" >nul
rem pdflatex "%nom_fichier%_corrige.tex" >nul

:: Compilation LaTeX (énoncé)
pdflatex "%nom_fichier%_enonce.tex" >nul
rem pdflatex "%nom_fichier%_enonce.tex" >nul

:: Nettoyer les fichiers temporaires LaTeX
del *.aux *.log *.out >nul 2>&1

:: Afficher un message de fin
echo Conversion terminée. Les fichiers sont dans le dossier "%nom_fichier%". POWERED BY ZEG.

start "" "%dossier_sortie%"


pause
