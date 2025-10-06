function Blockquote(el)
  local content = pandoc.utils.stringify(el)
  
  -- Détecter les différents types de citations spéciales
  local lower_content = content:lower()
  
  -- Note
  if lower_content:match("^note:?") or lower_content:match("^remarque:?") then
    local clean_content = content:gsub("^[Nn]ote:?%s*", ""):gsub("^[Rr]emarque:?%s*", "")
    return pandoc.RawBlock('latex', 
      '\\begin{notebox}\n' .. 
      clean_content .. 
      '\n\\end{notebox}\n')
  
  -- Avertissement
  elseif lower_content:match("^warning:?") or lower_content:match("^avertissement:?") or lower_content:match("^attention:?") then
    local clean_content = content:gsub("^[Ww]arning:?%s*", ""):gsub("^[Aa]vertissement:?%s*", ""):gsub("^[Aa]ttention:?%s*", "")
    return pandoc.RawBlock('latex', 
      '\\begin{warningbox}\n' .. 
      clean_content .. 
      '\n\\end{warningbox}\n')
  
  -- Info (utilise le style note par défaut)
  elseif lower_content:match("^info:?") or lower_content:match("^information:?") then
    local clean_content = content:gsub("^[Ii]nfo:?%s*", ""):gsub("^[Ii]nformation:?%s*", "")
    return pandoc.RawBlock('latex', 
      '\\begin{notebox}\n' .. 
      clean_content .. 
      '\n\\end{notebox}\n')
  end
  
  -- Pour les citations normales, garder le comportement standard
  return el
end
