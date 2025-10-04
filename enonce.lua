function Image(el)
    el.attributes.width = "285px"
    return el
end

function Div(el)
    for _, class in ipairs(el.classes) do
        if class == 'reponse' then
            if FORMAT:match 'latex' then
                -- Utiliser \setbox pour mesurer la hauteur et la profondeur
                table.insert(el.content, 1, pandoc.RawInline('latex', '\\setbox0=\\vbox{'))

                -- Ajouter la fin de \vbox
                table.insert(el.content, pandoc.RawInline('latex', '}'))

                -- Réserver l'espace avec \vspace
                table.insert(el.content, pandoc.RawBlock('latex', '\\vspace{\\dimexpr6\\ht0 + 6\\dp0\\relax}'))

                -- Ne pas vider el.content, car \setbox a besoin du contenu pour mesurer l'espace
            else
                -- Pour les autres formats, masquer le contenu
                el.content = {}
            end
            break
        elseif class == 'page-break' then
            return pandoc.RawBlock('openxml', '<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
        end
    end
    return el
end


