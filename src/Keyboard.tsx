import { Component, createRef, RefObject } from 'react';
import { colorVars, metadata, styleSheetMd, styleSheetMdBorder } from './variables';
import { cropCanvas, shadeColor } from './utils';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Box } from "@mui/material";

export interface KeyboardProps {
    ref?: RefObject<Keyboard>;
    exportTheme?: (themeName: string) => Promise<any>;
}

class Keyboard extends Component<KeyboardProps> {

    keyboardBody: RefObject<HTMLDivElement>

    state = {
        savingPicture: false
    }

    constructor(props: any) {
        super(props)
        this.keyboardBody = createRef<HTMLDivElement>()
    }

    async exportTheme(name: string) {
        const root = document.documentElement
        const rootStyles = getComputedStyle(root)

        const colors: { [key: string]: any } = {}
        colorVars.forEach(cssVar => colors[cssVar] = rootStyles.getPropertyValue(cssVar).trim())

        colors['--accent-bg-pressed'] = shadeColor(colors['--accent-bg'], 5)
        colors['--second-key-bg-pressed'] = shadeColor(colors['--second-key-bg'], 5)

        const keyboardRef = this.keyboardBody.current
        if (!keyboardRef) return

        let themeName = name.trim()
        if (!themeName?.length) themeName = metadata.id
        const escapedThemeName = themeName.replace(new RegExp(' ', 'g'), '_')

        this.setState({ savingPicture: true })
        await new Promise(res => setTimeout(res, 10))
        const canvas = await html2canvas(keyboardRef)
        const png = cropCanvas(canvas, 0, 0, canvas.width - 1, canvas.height - 1)
            .toDataURL('image/png').replace('data:image/png;base64,', '')
        this.setState({ savingPicture: false })

        const themeZip = new JSZip()

        const variables = [
            `@def web_color_bg ${colors['--main-bg']};`,
            `@def web_color_label ${colors['--key-color']};`,
            `@def web_color_accent ${colors['--accent-bg']};`,
            `@def web_color_accent_pressed ${colors['--accent-bg-pressed']};`,
            `@def web_color_key_bg ${colors['--key-bg']};`,
            `@def web_color_key_bg_pressed ${colors['--second-key-bg']};`,
            `@def web_color_secondary_key_bg ${colors['--second-key-bg']};`,
            `@def web_color_secondary_key_bg_pressed ${colors['--second-key-bg-pressed']};`
        ]

        themeZip.file('metadata.json', JSON.stringify(metadata, null, 2))
        themeZip.file('style_sheet_md2.css', styleSheetMd)
        themeZip.file('style_sheet_md2_border.css', styleSheetMdBorder)
        themeZip.file('variables.css', variables.join('\n'))

        const packZip = new JSZip()

        packZip.file('pack.meta', `name=${themeName}\nauthor=DerTyp7214`)
        packZip.file(`${escapedThemeName}.zip`, await themeZip.generateAsync({ type: 'base64' }), { base64: true })
        packZip.file(escapedThemeName, png, { base64: true })

        saveAs(await packZip.generateAsync({ type: 'blob' }), `${themeName}.pack`)
    }

    render() {
        return <Box
            className='keyboard_body'
            ref={this.keyboardBody}
            sx={[{ margin: 'auto' }, this.state.savingPicture ? {
                borderRadius: 0,
                border: '0px solid'
            } : {
                borderRadius: '.5em',
                border: '.06em solid white'
            }]}>
            <div className='key_box'>
                <div className='top_bar'>
                    <div className='top_bar_key'>
                        <div className='top_bar_element accent_color top_action'>
                            <svg style={{ width: '1.23em', height: '1.23em' }} viewBox='0 0 24 24'>
                                <path fill='currentColor'
                                      d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'/>
                            </svg>
                        </div>
                    </div>
                    <div className='rec-bar'>
                        <span className='rec-text'>Rboard</span>
                        <span className='rec-spacer'>|</span>
                        <span className='rec-text'>Creator</span>
                    </div>
                    <div className='top_bar_key'>
                        <div className='top_bar_element top_action action'>
                            <svg style={{ width: '1.23em', height: '1.23em' }} viewBox='0 0 24 24'>
                                <path fill='currentColor'
                                      d='M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z'/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className='keys'>
                    <div className='simple_key'><span className='letter'>q</span><span
                        className='secondary_letter'>1</span>
                    </div>
                    <div className='simple_key'><span className='letter'>w</span><span
                        className='secondary_letter'>2</span>
                    </div>
                    <div className='simple_key'><span className='letter'>e</span><span
                        className='secondary_letter'>3</span>
                    </div>
                    <div className='simple_key'><span className='letter'>r</span><span
                        className='secondary_letter'>4</span>
                    </div>
                    <div className='simple_key'><span className='letter'>t</span><span
                        className='secondary_letter'>5</span>
                    </div>
                    <div className='simple_key'><span className='letter'>z</span><span
                        className='secondary_letter'>6</span>
                    </div>
                    <div className='simple_key'><span className='letter'>u</span><span
                        className='secondary_letter'>7</span>
                    </div>
                    <div className='simple_key'><span className='letter'>i</span><span
                        className='secondary_letter'>8</span>
                    </div>
                    <div className='simple_key'><span className='letter'>o</span><span
                        className='secondary_letter'>9</span>
                    </div>
                    <div className='simple_key'><span className='letter'>p</span><span
                        className='secondary_letter'>0</span>
                    </div>
                </div>
                <div className='keys'>
                    <div className='simple_key'><span className='letter'>a</span></div>
                    <div className='simple_key'><span className='letter'>s</span></div>
                    <div className='simple_key'><span className='letter'>d</span></div>
                    <div className='simple_key'><span className='letter'>f</span></div>
                    <div className='simple_key'><span className='letter'>g</span></div>
                    <div className='simple_key'><span className='letter'>h</span></div>
                    <div className='simple_key'><span className='letter'>j</span></div>
                    <div className='simple_key'><span className='letter'>k</span></div>
                    <div className='simple_key'><span className='letter'>l</span></div>
                </div>
                <div className='keys'>
                    <div className='second_color custom_key simple_key'>
                        <div className='shift'>
                            <svg style={{ width: '1em', height: '.916em' }} viewBox='0 0 24 21' fill='none'
                                 xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M18.0556 13H17.0556V14V19C17.0556 19.5523 16.6079 20 16.0556 20H8.00004C7.44776 20 7.00004 19.5523 7.00004 19V14V13H6.00004H2.70699C1.82482 13 1.37481 11.9409 1.98715 11.3059L11.5253 1.41444L21.7438 11.2806C22.3909 11.9053 21.9486 13 21.0492 13H18.0556Z'
                                    stroke='white' strokeWidth='2' strokeLinecap='round'/>
                            </svg>
                        </div>
                    </div>
                    <div className='simple_key'><span className='letter'>y</span></div>
                    <div className='simple_key'><span className='letter'>x</span></div>
                    <div className='simple_key'><span className='letter'>c</span></div>
                    <div className='simple_key'><span className='letter'>v</span></div>
                    <div className='simple_key'><span className='letter'>b</span></div>
                    <div className='simple_key'><span className='letter'>n</span></div>
                    <div className='simple_key'><span className='letter'>m</span></div>
                    <div className='second_color custom_key simple_key'>
                        <div className='backspace'>
                            <svg style={{ width: '1.08em', height: '.916em' }} viewBox='0 0 25 20' fill='none'
                                 xmlns='http://www.w3.org/2000/svg'>
                                <path fillRule='evenodd' clipRule='evenodd'
                                      d='M10.7071 6.2928C11.0976 5.90228 11.7308 5.90228 12.1213 6.2928L18.7071 12.8786C19.0976 13.2691 19.0976 13.9023 18.7071 14.2928C18.3166 14.6833 17.6834 14.6833 17.2929 14.2928L10.7071 7.70701C10.3166 7.31649 10.3166 6.68332 10.7071 6.2928Z'
                                      fill='white'/>
                                <path fillRule='evenodd' clipRule='evenodd'
                                      d='M18.2929 6.2928C17.9024 5.90228 17.2692 5.90228 16.8787 6.2928L10.2929 12.8786C9.9024 13.2691 9.9024 13.9023 10.2929 14.2928C10.6834 14.6833 11.3166 14.6833 11.7071 14.2928L18.2929 7.70701C18.6834 7.31649 18.6834 6.68332 18.2929 6.2928Z'
                                      fill='white'/>
                                <path fillRule='evenodd' clipRule='evenodd'
                                      d='M7.58537 2L2.38537 10L7.58537 18H22C22.5523 18 23 17.5523 23 17V3C23 2.44772 22.5523 2 22 2H7.58537ZM6.5 20L0 10L6.5 0H22C23.6569 0 25 1.34315 25 3V17C25 18.6569 23.6569 20 22 20H6.5Z'
                                      fill='white'/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className='keys'>
                    <div className='second_color custom_key simple_key'><span className='letter l123'>?123</span></div>
                    <div className='second_color simple_key'>
                        <span className='letter'>,</span>
                        <div className='emoji'>
                            <svg style={{ width: '.5em', height: '.5em' }} viewBox='0 0 24 24' fill='none'
                                 xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M8.53125 14.0156C9.3125 15.3281 10.4688 15.9844 12 15.9844C13.5312 15.9844 14.6875 15.3281 15.4688 14.0156H17.1094C16.7031 15.0469 16.0312 15.8906 15.0938 16.5469C14.1875 17.1719 13.1562 17.4844 12 17.4844C10.8438 17.4844 9.79688 17.1719 8.85938 16.5469C7.95312 15.8906 7.29688 15.0469 6.89062 14.0156H8.53125ZM6.32812 17.6719C7.92188 19.2344 9.8125 20.0156 12 20.0156C14.1875 20.0156 16.0625 19.2344 17.625 17.6719C19.2188 16.0781 20.0156 14.1875 20.0156 12C20.0156 9.8125 19.2188 7.9375 17.625 6.375C16.0625 4.78125 14.1875 3.98438 12 3.98438C9.8125 3.98438 7.92188 4.78125 6.32812 6.375C4.76562 7.9375 3.98438 9.8125 3.98438 12C3.98438 14.1875 4.76562 16.0781 6.32812 17.6719ZM4.92188 4.96875C6.89062 3 9.25 2.01562 12 2.01562C14.75 2.01562 17.0938 3 19.0312 4.96875C21 6.90625 21.9844 9.25 21.9844 12C21.9844 14.75 21 17.1094 19.0312 19.0781C17.0938 21.0156 14.75 21.9844 12 21.9844C9.25 21.9844 6.89062 21.0156 4.92188 19.0781C2.98438 17.1094 2.01562 14.75 2.01562 12C2.01562 9.25 2.98438 6.90625 4.92188 4.96875ZM7.40625 10.5938C7.125 10.2812 6.98438 9.92188 6.98438 9.51562C6.98438 9.10938 7.125 8.76562 7.40625 8.48438C7.71875 8.17188 8.07812 8.01562 8.48438 8.01562C8.89062 8.01562 9.23438 8.17188 9.51562 8.48438C9.82812 8.76562 9.98438 9.10938 9.98438 9.51562C9.98438 9.92188 9.82812 10.2812 9.51562 10.5938C9.23438 10.875 8.89062 11.0156 8.48438 11.0156C8.07812 11.0156 7.71875 10.875 7.40625 10.5938ZM14.4375 10.5938C14.1562 10.2812 14.0156 9.92188 14.0156 9.51562C14.0156 9.10938 14.1562 8.76562 14.4375 8.48438C14.75 8.17188 15.1094 8.01562 15.5156 8.01562C15.9219 8.01562 16.2656 8.17188 16.5469 8.48438C16.8594 8.76562 17.0156 9.10938 17.0156 9.51562C17.0156 9.92188 16.8594 10.2812 16.5469 10.5938C16.2656 10.875 15.9219 11.0156 15.5156 11.0156C15.1094 11.0156 14.75 10.875 14.4375 10.5938Z'
                                    fill='black'/>
                            </svg>
                        </div>
                    </div>
                    <div className='simple_key'>
                        <div className='locale'>
                            <svg style={{ width: '.916em', height: '.916em' }} viewBox='0 0 24 24'>
                                <path fill='currentColor'
                                      d='M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'/>
                            </svg>
                        </div>
                    </div>
                    <div className='space simple_key'><span className='letter lspace'>Rboard</span></div>
                    <div className='second_color simple_key'><span className='letter'>.</span></div>
                    <div className='accent_color custom_key simple_key'>
                        <div className='return'>
                            <svg style={{ width: '1.66em', height: '1.66em' }} viewBox='0 0 34 34' fill='none'
                                 xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M23.9844 11.9844H26V17.9844H10.8125L14.4219 21.5938L13.0156 23L7.01562 17L13.0156 11L14.4219 12.4062L10.8125 16.0156H23.9844V11.9844Z'
                                    fill='black'/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Box>;
    }
}

export default Keyboard