function Image(el)
    el.attributes.width = "285px"
    return el
end


function Div(el)
    for _, class in ipairs(el.classes) do
        if class == 'reponse' then
            -- Créer un Span avec le texte "Solution" en gras
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
            break
        elseif class == 'page-break' then
            -- Pour les sauts de page : seulement le saut
            return pandoc.RawBlock('openxml', '<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
        end
    end
    return el
end
