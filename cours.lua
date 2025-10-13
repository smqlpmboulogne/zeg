function Para(el)
    -- Vérifie si le paragraphe commence par une balise spécifique
    if #el.content >= 1 and el.content[1].t == "Strong" then
        local first_word = pandoc.utils.stringify(el.content[1])
        local rest_of_text = {}

        -- Extrait le reste du texte après la balise forte
        for i = 2, #el.content do
            table.insert(rest_of_text, el.content[i])
        end

        local rest_text = pandoc.utils.stringify(rest_of_text)

        -- Détermine le type de balise et génère l'environnement LaTeX correspondant
        if first_word:match("^Propriété") then
            local property_num = first_word:match("Propriété%s*(%d+)")
            return {
                pandoc.RawBlock("latex", "\\begin{propriete}[" .. (property_num or "") .. "]\n" .. rest_text .. "\n\\end{propriete}"),
            }
        elseif first_word:match("^Définition") then
            local definition_num = first_word:match("Définition%s*(%d+)")
            return {
                pandoc.RawBlock("latex", "\\begin{definition}[" .. (definition_num or "") .. "]\n" .. rest_text .. "\n\\end{definition}"),
            }
        elseif first_word:match("^Remarque") then
            return {
                pandoc.RawBlock("latex", "\\begin{remarque}\n" .. rest_text .. "\n\\end{remarque}"),
            }
        elseif first_word:match("^Théorème") then
            local theorem_num = first_word:match("Théorème%s*(%d+)")
            return {
                pandoc.RawBlock("latex", "\\begin{theoreme}[" .. (theorem_num or "") .. "]\n" .. rest_text .. "\n\\end{theoreme}"),
            }
        end
    end
    -- Retourne le paragraphe inchangé si aucune balise n'est détectée
    return el
end
