function Div(el)
    -- Vérifie si la classe du div est "cadre"
    if el.classes:includes("cadre") then
        -- Convertit le contenu du div en LaTeX
        local content = pandoc.write(pandoc.Pandoc({pandoc.Div(el.content)}), "latex")
        -- Retourne l'environnement LaTeX "cadre"
        return {
            pandoc.RawBlock("latex", "\\begin{cadre}\n" .. content .. "\n\\end{cadre}")
        }
    end
    -- Retourne le div inchangé si la classe n'est pas "cadre"
    return el
end
