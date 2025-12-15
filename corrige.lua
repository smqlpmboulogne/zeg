function Image(el)
    -- Fixer la largeur des images à 285px
    el.attributes.width = "285px"
    return el
end

function Div(el)
    for _, class in ipairs(el.classes) do
        if class == 'reponse' then
            -- Créer un en-tête "Solution" en gras et bleu (LaTeX uniquement)
            local solution_header
            if FORMAT:match 'latex' then
                -- En LaTeX, on utilise \color{blue} pour tout le contenu
                table.insert(el.content, 1, pandoc.RawInline('latex', '\\par\\medskip\\hrule\\par\\medskip\\color{blue}'))
                table.insert(el.content, pandoc.RawInline('latex', '\\color{black}\\par\\medskip\\hrule\\par\\medskip'))
                -- Ajouter "Solution" en gras et bleu
                -- solution_header = pandoc.RawInline('latex', '\\textbf{\\textcolor{blue}{Réponse}}')
            end

            -- Insérer "Réponse" (LaTeX) au début du contenu si défini
            if solution_header then
                table.insert(el.content, 1, solution_header)
            end

            -- Conserver le style personnalisé
            el.attributes['custom-style'] = 'Reponse'

            -- Pour DOCX, ajouter un saut de ligne après la div
            if FORMAT:match 'docx' then
                return {el, pandoc.RawBlock('openxml', '<w:p><w:r><w:br/></w:r></w:p>')}
            end

            return el

        elseif class == 'page-break' then
            -- Pour les sauts de page
            if FORMAT:match 'docx' then
                return pandoc.RawBlock('openxml', '<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
            elseif FORMAT:match 'latex' then
                return pandoc.RawBlock('latex', '\\clearpage')
            else
                return el
            end

        elseif class == 'cadre' then
            -- Gestion des cadres
            if FORMAT:match 'latex' then
                -- Pour LaTeX, utiliser l'environnement "cadre"
                local content = pandoc.write(pandoc.Pandoc({pandoc.Div(el.content)}), "latex")
                return {
                    pandoc.RawBlock("latex", "\\begin{cadre}\n" .. content .. "\n\\end{cadre}")
                }
            elseif FORMAT:match 'docx' then
                -- Pour DOCX, appliquer le style "Cadre"
                el.attributes['custom-style'] = 'Cadre'
                return el
            else
                -- Pour les autres formats, retourner le contenu tel quel
                return el
            end
        end
    end
    return el
end
