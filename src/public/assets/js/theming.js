async function getThemeIfAny(){
    fetch("account/theme/get")
        .then(response => response.json())
        .then(json => {
            parseTheme(json.Theme)
        })
}

function parseTheme(theme){
    setCSSVar("color-primary", theme.primaryColor)
    theme.darkMode === "true" ? document.body.classList.add("dark") : document.body.classList.remove("dark")
}

function resetThemeToDefault(){
    fetch("account/theme/reset")
        .then(response => response.json())
        .then(json => {
            if (json.Success){
                alert(`${json.Success}`)
                window.location.href = "/"
            }
            else if (json.Error){
                alert(`Error: ${json.Error}`)
            }
        })
}

function setCSSVar(varName, value) {
    document.body.style.setProperty(`--${varName}`, value);
}

function parseColor(cssVariable){
    const hexRegexCheck = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    const rgbRegexCheck = "^\\d{1,3},\\d{1,3},\\d{1,3}$"
    const otherRgbRegexCheck = "^\\d{1,3}, \\d{1,3}, \\d{1,3}$"

    let colorChosen = document.getElementById(`${cssVariable}ColorInput`).value
    // If HEX value was specified parse as such
    if (colorChosen.match(hexRegexCheck)){
        console.log("HEX Detected: "+colorChosen)
        if (cssVariable === "primary") cssVariable = "color-primary"
        setCSSVar(cssVariable, colorChosen)
        return colorChosen
    } else if (colorChosen.match(rgbRegexCheck) || colorChosen.match(otherRgbRegexCheck)){
        console.log("RGB Detected: "+colorChosen)
        if (cssVariable === "primary") cssVariable = "color-primary"
        setCSSVar(cssVariable, `rgb(${colorChosen})`)
        return `rgb(${colorChosen})`
    } else{ // If invalid color was specified
        alert(`Invalid color was specified in ${cssVariable}ColorInput.`);
    }
}

function previewThemeChanges(){
    parseColor('primary')
    let darkMode = document.getElementById("isDarkmode").checked
    darkMode ? document.body.classList.add("dark") : document.body.classList.remove("dark")
}