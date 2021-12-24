const colorVars = [
    '--main-bg',
    '--key-bg',
    '--key-color',
    '--second-key-bg',
    '--accent-bg',
    '--accent-fg'
]

const root = document.documentElement
const rootStyles = getComputedStyle(root)

function refreshColors(custom = () => { }) {
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