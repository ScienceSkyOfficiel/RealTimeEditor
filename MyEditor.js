var editor;
class MyEditor {
    constructor(settings, container) {
        this.settings = settings;
        this.name = settings.name || false;
        this.name === false || this.name === null ? console.error("MyEditor(settings, container) : settings.name must be define") : 0;
        this.language = settings.language || "html";
        this.theme = settings.theme || "tomorrow";
        this.tabSize = settings.tabSize || 4;
        this.readOnly = settings.readOnly || false;
        this.fontSize = settings.fontSize || "13px";
        this.highlightActiveLine = settings.highlightActiveLine || true;
        this.wordWrap = settings.wordWrap || true;
        this.html = settings.html || false;
        this.defaultValue = settings.defaultValue || '';
        this.container = container;
        this.container === undefined || this.container === null ? console.error("MyEditor(settings, container) : container must be define") : 0;
        this.countDown = 1;
    }

    getMinimumHTMLStructure() {
        var structure = `<div id="editor"></div>
        <div id="result-editor">
            <div id="content-result-editor">
                <iframe id="iframe" sandbox="allow-scripts allow-modals"></iframe>
            </div>
        </div>`;
        return structure;
    }

    help() {
        console.log("https://devweb.sciencesky.com/MyEditor/Doc/ OR :");
        console.log("MyEditor(settings, container) : settings must be an object");
        console.log("MyEditor(settings, container) : settings.name must be define (name = the name of the variable that instantiates MyEditor)");
        console.log("MyEditor(settings, container) : settings : \n\t settings.theme = string (the name of one of the available themes, more informations at : .getAvailableThemes()) | Default Value : 'tomorrow' \n\t settings.language = string (the name of one of the available languages, more informations at : .getAvailableLanguages()) | Default Value : 'html' \n\t settings.fontSize = string (size of the text, in px) | Default Value : '13px' \n\t settings.tabSize = number (size of the tabulation) | Default Value : 4 \n\t settings.readOnly = bool (false to make the editor editable) | Default Value : false \n\t settings.highlightActiveLine = bool (true => when you click on a line, this line becomes highlithed) | Default Value : true \n\t settings.wordWrap = bool | Default Value : true \n\t settings.html = string (you can modify the basic html structure of the editor by adding more tags in order to customize your editor. /!\\ WARNING : the html structure must contain some specifics tags, more informations at : .getMinimumHTMLStructure()) | Default Value : .getMinimumHTMLStructure() \n\t settings.defaultValue = string (default content of the editor) | Default Value : \"\" ");
        console.log("MyEditor(settings, container) : container must be an available ID (the contents in \"container\" will be overwritten.)");
        console.log("MyEditor => methods : \n\t .create(container) : you can change the container of editor in create(container). The method creates the editor, based on settings.html or getMinimumHTMLStructure() \n\t .getAvailableThemes() : get the available themes that you can choose. By default, the theme is 'tomorrow'. \n\t .getAvailableLanguages() : get the available languages that you can choose. By default, the language is 'html'. \n\t .changeTheme() : change the theme of the editor. More informations at : .getAvailableThemes() \n\t .run() : converts the code into its result. By default, this method is called each time there is a change in the content of the editor. \n\t .setValue(value) : set the content of the editor. \n\t .hideResult() : /!\\ please, do not use this method yet. ");
    }

    create(container) {
        container = document.getElementById(container) || document.getElementById(this.container);
        container === null || container === undefined ? console.error("MyEditor(settings, container) : the id container doesn't exist") : 0;

        if (this.html === false) {
            container.innerHTML = `<div id="editor"></div>
            <div id="result-editor">
                <div id="content-result-editor">
                    <iframe id="iframe" sandbox="allow-scripts allow-modals"></iframe>
                </div>
            </div>
            `;
        } else {
            var error = false;
            if (this.html.indexOf('"editor"') === -1 && this.html.indexOf("'editor'") === -1) {
                error = true;
            } else if (this.html.indexOf('"result-editor"') === -1 && this.html.indexOf("'result-editor'") === -1) {
                error = true;
            } else if (this.html.indexOf('"content-result-editor"') === -1 && this.html.indexOf("'content-result-editor'") === -1) {
                error = true;
            } else if (this.html.indexOf('iframe') === -1) {
                error = true;
            } else if (this.html.indexOf('sandbox="allow-scripts allow-modals"') === -1 && this.html.indexOf("sandbox='allow-scripts allow-modals'") === -1) {
                error = true;
            }
            if (error) {
                console.error("You may not have entered the minimum html structure necessary for the editor to work properly. Please check with the method getMinimumHTMLStructure().");
            }
            container.innerHTML = this.html;
        }

        editor = ace.edit("editor");
        editor.setTheme("ace/theme/" + this.theme);
        editor.session.setMode("ace/mode/" + this.language);
        editor.session.setTabSize(this.tabSize);
        editor.session.setUseWrapMode(this.wordWrap);
        editor.setHighlightActiveLine(this.highlightActiveLine);
        editor.setReadOnly(this.readOnly);
        document.getElementById('editor').style.fontSize = this.fontSize;

        var code = localStorage.getItem("editor");
        if (code !== null && code !== undefined) {
            if (code.trim() !== "") {
                editor.setValue(code);
            } else {
                code = "";
                localStorage.setItem("editor", "");
                editor.setValue(this.defaultValue);
            }
        } else {
            code = "";
            localStorage.setItem("editor", "");
            editor.setValue(this.defaultValue);
        }
        editor.on('change', function () {
            localStorage.setItem("editor", editor.getValue());
        });
        editor.on('change', this.run);
        this.run();

    }

    setValue(value) {
        editor.setValue(value);
    }

    getAvailableThemes() {
        var themes = {
            "Bright": ["tomorrow", "xcode", "kuroir", "katzenmilch"],
            "Dark": ["twilight", "tomorrow_night_eighties", "tomorrow_night", "monokai", "ambiance", "dracula", "gruvbox", "idle_fingers", "merbivore_soft", "terminal"]
        };
        return themes;
    }

    getAvailableLanguages() {
        var languages = ["html", "css", "javascript"];
        return languages;
    }

    changeTheme(theme) {
        this.created === false ? console.error("myEditor : you must create the editor before runHTML() !") : 0;
        editor.setTheme("ace/theme/" + theme);
    }

    changeFontSize(fontsize) {
        document.getElementById('editor').style.fontSize = fontsize;
    }

    run() {
        var content_parsed = parse5.parse(editor.getValue());
        document.getElementById('iframe').src = "data:text/html;charset=utf8," + encodeURIComponent(parse5.serialize(content_parsed));
    }
}
