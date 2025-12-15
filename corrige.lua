function Image(el)
    -- Fixer la largeur des images à 285px
    el.attributes.width = "285px"
    return el
end

function Div(el)
    for _, class in ipairs(el.classes) do
        if class == 'reponse' then
            -- Garder uniquement le contenu, sans header
            el.attributes['custom-style'] = 'Reponse'

            -- Pour DOCX, ajouter un saut de ligne après la div si besoin
            if FORMAT:match 'docx' then
                return {el, pandoc.RawBlock('openxml', '<w:p><w:r><w:br/></w:r></w:p>')}
            end
            return el

        elseif class == 'page-break' then
            return pandoc.RawBlock('openxml', '<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

        elseif class == 'cadre' then
            if FORMAT:match 'latex' then
                local content = pandoc.write(pandoc.Pandoc({pandoc.Div(el.content)}), "latex")
                return {
                    pandoc.RawBlock("latex", "\\begin{cadre}\n" .. content .. "\n\\end{cadre}")
                }
            elseif FORMAT:match 'docx' then
                el.attributes['custom-style'] = 'Cadre'
                return el
            else
                return el
            end
        end
    end
    return el
end
