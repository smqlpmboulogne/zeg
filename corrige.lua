function Image(el)
    -- Fixer la largeur des images à 285px
    el.attributes.width = "285px"
    return el
end

function Div(el)
    for _, class in ipairs(el.classes) do
        if class == 'reponse' then
            -- Créer un en-tête "Solution" en gras et bleu
            local solution_header
            if FORMAT:match 'latex' then
                -- En LaTeX, on utilise \color{blue} pour tout le contenu
                table.insert(el.content, 1, pandoc.RawInline('latex', '\\color{blue}'))
                table.insert(el.content, pandoc.RawInline('latex', '\\color{black}'))
                -- Ajouter "Solution" en gras et bleu
                solution_header = pandoc.RawInline('latex', '\\textbf{\\textcolor{blue}{Solution}}')
            else
                -- Pour les autres formats, on utilise un Span avec style CSS
                solution_header = pandoc.Span(
                    { pandoc.Strong({ pandoc.Str("Solution") }) },
                    { style = "color: blue;" }
                )
            end
            -- Insérer "Solution" au début du contenu
            table.insert(el.content, 1, solution_header)
            el.attributes['custom-style'] = 'Reponse'

            -- Pour DOCX, ajouter un saut de ligne après la div
            if FORMAT:match 'docx' then
                return {el, pandoc.RawBlock('openxml', '<w:p><w:r><w:br/></w:r></w:p>')}
            end
            break

        elseif class == 'page-break' then
            -- Pour les sauts de page : seulement le saut
            return pandoc.RawBlock('openxml', '<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

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
