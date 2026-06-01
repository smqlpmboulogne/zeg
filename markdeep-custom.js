// markdeep-custom.js
(function() {
    if (window.alreadyProcessedMarkdeep) return;
    window.alreadyProcessedMarkdeep = true;
    
    function init() {
        let originalHtml = document.body.innerHTML;
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHtml;
        
        let scripts = tempDiv.querySelectorAll('script');
        scripts.forEach(s => s.remove());
        
        let htmlContent = tempDiv.innerHTML;
        htmlContent = htmlContent.replace(/<!--\s*Markdeep:[\s\S]*?-->/, '');
        
        let markdownContent = htmlContent;
        markdownContent = markdownContent.replace(/&lt;/g, '<');
        markdownContent = markdownContent.replace(/&gt;/g, '>');
        markdownContent = markdownContent.replace(/&amp;/g, '&');
        markdownContent = markdownContent.trim();
		
        let matiere = ""
        let titre = "";
        let sousTitre = "";
        let auteur = "";
        let classe = "";
        let afficherNom = false;
        let simulationFile = "simulation.html";
        let corrigeFile = "corrige.md.html";
        
        let content = markdownContent;
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const frontmatterMatch = markdownContent.match(frontmatterRegex);
        
        if (frontmatterMatch) {
    const fm = frontmatterMatch[1];
    const titreMatch = fm.match(/title:\s*"?([^"\n]+)"?/);
    const sousTitreMatch = fm.match(/subtitle:\s*"?([^"\n]+)"?/);
    const auteurMatch = fm.match(/author:\s*"?([^"\n]+)"?/);
    const classeMatch = fm.match(/classe:\s*"?([^"\n]+)"?/);
    const matiereMatch = fm.match(/matiere:\s*"?([^"\n]+)"?/);   // ← AJOUT
    const nomMatch = fm.match(/nom:\s*"?([^"\n]+)"?/);
    const simuMatch = fm.match(/simulation:\s*"?([^"\n]+)"?/);
    const corrigeMatch = fm.match(/corrige:\s*"?([^"\n]+)"?/);

    if (titreMatch) titre = titreMatch[1].trim();
    if (sousTitreMatch) sousTitre = sousTitreMatch[1].trim();
    if (auteurMatch) auteur = auteurMatch[1].trim();
    if (classeMatch) classe = classeMatch[1].trim();
    if (matiereMatch) matiere = matiereMatch[1].trim();          // ← AJOUT
    if (nomMatch) afficherNom = nomMatch[1].trim().toLowerCase() === 'true';
    if (simuMatch) simulationFile = simuMatch[1].trim();
    if (corrigeMatch) corrigeFile = corrigeMatch[1].trim();

    content = markdownContent.replace(frontmatterRegex, '');
}

        
        const styles = document.querySelector('link[href="template.css"]');
        if (!styles) {
            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = 'template.css';
            document.head.appendChild(styleLink);
        }
        
        const googleFonts = document.createElement('link');
        googleFonts.rel = 'stylesheet';
        googleFonts.href = 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Source+Code+Pro:wght@400;500&display=swap';
        document.head.appendChild(googleFonts);
        
        const markedScript = document.createElement('script');
        markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        markedScript.onload = function() {
            const mathJax = document.createElement('script');
            mathJax.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
            mathJax.async = true;
            mathJax.onload = function() {
                genererPage();
            };
            document.head.appendChild(mathJax);
        };
        document.head.appendChild(markedScript);
        
        function genererPage() {
            marked.setOptions({ breaks: true, gfm: true });
            
            let html = marked.parse(content);
            
            // Remplacer les cases à cocher
            html = html.replace(/\[ \]/g, '<input type="checkbox">');
            html = html.replace(/\[x\]/gi, '<input type="checkbox" checked>');
            html = html.replace(/\{\{editable\}\}/g, '<div class="editable-grid" contenteditable="true"></div>');
            html = html.replace(/\{\{editable-lg\}\}/g, '<div class="editable-grid editable-grid-lg" contenteditable="true"></div>');
            
            document.body.innerHTML = '';
            document.body.className = 'font-serif theme-classic';
            
            const topBar = document.createElement('div');
            topBar.className = 'top-bar';
            topBar.innerHTML = `
                <div class="top-bar-left">
                    <button class="top-btn" onclick="window.print()">📄 Imprimer</button>
                    <button class="top-btn simu" onclick="window.open('${simulationFile}','fenetresimulation',
        'fullscreen=yes')">▶ Simulation</button>
                    <button class="top-btn primary" onclick="window.open('${corrigeFile}','fenetrecorrige',
        'fullscreen=yes')">📖 Corrigé</button>
                </div>
                <div class="top-bar-right">
                    <select id="themeSelect" class="theme-selector">
                        <option value="classic">📜 Classique</option>
                        <option value="white">⚪ Blanc épuré</option>
                        <option value="contrast">⬛ Contraste élevé</option>
                    </select>
                    <span class="sep"></span>
                    <select id="fontSelect" class="font-selector">
                        <option value="serif">🖋️ Garamond</option>
                        <option value="sans">🔤 Sans sérif</option>
                        <option value="dyslexic">📖 Dyslexique</option>
                    </select>
                </div>
            `;
            document.body.appendChild(topBar);
            
            const page = document.createElement('div');
            page.className = 'page';
            
            let pageHtml = '';
            


            
            // Bloc nom/prénom si activé
            if (afficherNom) {
                pageHtml += `
                    <div class="nom-block">
                        <label>Nom prénom et classe:</label>
                        <div class="nom-field" contenteditable="true"></div>
                    </div>
                `;
            }
            
            // Titre principal
            pageHtml += `
                <div class="title-block">
				<div class="subsubtitle">📚${matiere} - ${classe} | ✍️${auteur}</div>
                    <h1>${titre}</h1>
                    <div class="subtitle">${sousTitre}</div>
                </div>
            `;
            
            // Contenu HTML généré
            pageHtml += html;
            
            // Footer
            pageHtml += `<div class="doc-footer">${matiere} — ${classe} — ${titre} | ✍️${auteur}</div>`;
            
            page.innerHTML = pageHtml;
            document.body.appendChild(page);
            
            const lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.className = 'lightbox';
            lightbox.onclick = function() { this.classList.remove('show'); };
            lightbox.innerHTML = '<img id="lightbox-img" src="">';
            document.body.appendChild(lightbox);
            
            window.ouvrirLightbox = function(src) {
                document.getElementById('lightbox-img').src = src;
                document.getElementById('lightbox').classList.add('show');
            };
            
 

            
            function setTheme(theme) {
                document.body.classList.remove('theme-classic', 'theme-white', 'theme-contrast');
                document.body.classList.add(`theme-${theme}`);
                localStorage.setItem('tp_theme', theme);
            }
            
            function setFont(font) {
                document.body.classList.remove('font-serif', 'font-sans', 'font-dyslexic');
                document.body.classList.add(`font-${font}`);
                localStorage.setItem('tp_font', font);
            }
            
            const savedTheme = localStorage.getItem('tp_theme');
            const savedFont = localStorage.getItem('tp_font');
            if (savedTheme) setTheme(savedTheme);
            if (savedFont) setFont(savedFont);
            
            document.getElementById('themeSelect').onchange = e => setTheme(e.target.value);
            document.getElementById('fontSelect').onchange = e => setFont(e.target.value);
            
            document.querySelectorAll('img').forEach(img => {
                if (img.src) img.onclick = () => window.ouvrirLightbox(img.src);
            });
            
            if (window.MathJax) MathJax.typesetPromise();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
	
})();