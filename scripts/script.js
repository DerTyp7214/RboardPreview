const colorVars = ['--main-bg', '--key-bg', '--key-color', '--second-key-bg', '--accent-bg']

const root = document.documentElement
const rootStyles = getComputedStyle(root)

function refreshColors(custom = () => {
}) {
    colorVars.forEach(cssVar => {
        const cssValue = rootStyles.getPropertyValue(cssVar).trim()
        const element = document.getElementById(cssVar.substring(2))
        if (element) {
            element.value = cssValue
            custom(cssVar, element, cssValue)
        }
    })
}

refreshColors((cssVar, element) => {
    element.addEventListener('change', ev => {
        root.style.setProperty(cssVar, ev.target.value)
    })
})

function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}

async function exportTheme() {
    const colors = {}
    colorVars.forEach(cssVar => colors[cssVar] = rootStyles.getPropertyValue(cssVar).trim())

    colors['--accent-bg-pressed'] = shadeColor(colors['--accent-bg'], 5)
    colors['--second-key-bg-pressed'] = shadeColor(colors['--second-key-bg'], 5)

    let themeName = document.getElementById('theme-name').value.trim()
    if (!themeName.length) themeName = metadata.id
    const escapedThemeName = themeName.replace(new RegExp(' ', 'g'), '_')

    const keyboardBody = document.getElementsByClassName('keyboard_body')[0]
    const canvas = await html2canvas(keyboardBody)
    const png = canvas.toDataURL('image/png').replace('data:image/png;base64,', '')

    const themeZip = new JSZip()

    themeZip.file('metadata.json', JSON.stringify(metadata, null, 2))
    themeZip.file('style_sheet_md2.css', styleSheetMd)
    themeZip.file('style_sheet_md2_border.css', styleSheetMdBorder)
    themeZip.file('variables.css', `@def web_color_bg ${colors['--main-bg']};
 @def web_color_label ${colors['--key-color']};
 @def web_color_accent ${colors['--accent-bg']};
 @def web_color_accent_pressed ${colors['--accent-bg-pressed']};
 @def web_color_key_bg ${colors['--key-bg']};
 @def web_color_key_bg_pressed ${colors['--second-key-bg']};
 @def web_color_secondary_key_bg ${colors['--second-key-bg']};
 @def web_color_secondary_key_bg_pressed ${colors['--second-key-bg-pressed']};
    `)

    const packZip = new JSZip()

    packZip.file('pack.meta', `name=${themeName}
author=DerTyp7214`)
    packZip.file(`${escapedThemeName}.zip`, await themeZip.generateAsync({type: 'base64'}), {base64: true})
    packZip.file(escapedThemeName, png, {base64: true})

    downloadFile({
        content: await packZip.generateAsync({type: 'blob'}),
        name: `${themeName}.pack`
    })
}

function downloadFile(file) {
    if (navigator.msSaveBlob) {
        return navigator.msSaveBlob(file.content, file.name);
    } else {
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(file.content);
        link.download = file.name;
        document.body.appendChild(link);
        link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
        link.remove();
        window.URL.revokeObjectURL(link.href);
    }
}