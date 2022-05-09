import { Component, createRef, RefObject } from 'react';
import { colorVars } from './variables';
import { Box } from '@mui/material';
import { getClassName, getIcon, Preset } from './Icons';

export interface KeyboardProps {
    ref?: RefObject<Keyboard>;
    preset?: Preset;
    exportTheme?: (themeName: string) => Promise<any>;
    getPreset?: () => Preset;
}

class Keyboard extends Component<KeyboardProps> {

    keyboardBody: RefObject<HTMLDivElement>
    scrollContainer: RefObject<HTMLDivElement>

    wrapperRefs: { [key: string]: RefObject<HTMLDivElement> } = {}

    state = {
        savingPicture: false,
        preset: 'default'
    }

    constructor(props: any) {
        super(props)
        this.state.preset = props.preset ?? 'default'

        this.keyboardBody = createRef<HTMLDivElement>()
        this.scrollContainer = createRef<HTMLDivElement>()
    }

    async exportTheme(name: string, author: string) {
        const root = document.documentElement
        const rootStyles = getComputedStyle(root)

        const colors: { [key: string]: any } = {}
        colorVars.forEach(cssVar => colors[cssVar] = rootStyles.getPropertyValue(cssVar).trim())

        const buildUrl = () => {
            let url = `${window.location.origin}/get`
            url += `?mainBg=${colors['--main-bg'].replace('#', '')}`
            url += `&keyBg=${colors['--key-bg'].replace('#', '')}`
            url += `&keyColor=${colors['--key-color'].replace('#', '')}`
            url += `&secondKeyBg=${colors['--second-key-bg'].replace('#', '')}`
            url += `&accentBg=${colors['--accent-bg'].replace('#', '')}`
            url += `&themeName=${encodeURIComponent(name)}`
            url += `&author=${encodeURIComponent(author)}`
            url += `&preset=${this.state.preset}`
            return url
        }

        window.open(buildUrl(), '_blank')
    }

    getPreset(): Preset {
        return this.state.preset as any
    }

    componentDidMount() {
        this.scrollTo(this.wrapperRefs[this.state.preset])
    }

    componentDidUpdate(prevProps: Readonly<KeyboardProps>) {
        if (this.props !== prevProps && this.props.preset !== prevProps.preset && this.props.preset) {
            this.setState({ ...this.state, preset: this.props.preset })
            this.scrollTo(this.wrapperRefs[this.props.preset])
        }
    }

    private scrollTo(ref: RefObject<HTMLDivElement>) {
        this.scrollContainer.current?.scrollTo({
            left: (ref.current?.offsetLeft ?? 0) - (this.scrollContainer.current?.offsetLeft ?? 0)
        })
    }

    render() {
        const KeyboardBody = (props: { preset: Preset }) => {
            const keyboardWrapper = createRef<HTMLDivElement>()
            this.wrapperRefs[props.preset] = keyboardWrapper
            return <Box className='keyboard_wrapper' ref={keyboardWrapper}>
                <Box
                    className='keyboard_body'
                    ref={this.keyboardBody}
                    onClick={() => {
                        this.setState({ ...this.state, preset: props.preset })
                        this.scrollTo(keyboardWrapper)
                    }}
                    sx={[{ marginTop: '.5em' }, this.state.savingPicture ? {
                        borderRadius: 0,
                        border: '.06em solid var(--main-bg)'
                    } : {
                        borderRadius: '.5em',
                        border: '.06em solid white'
                    }]}>
                    <div className='key_box'>
                        <div className='top_bar'>
                            <div className='top_bar_key'>
                                <div
                                    className={`${getClassName('topAction', props.preset)} top_bar_element top_action`}>{getIcon('topAction', props.preset)}</div>
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
                            <div className={`${getClassName('shift', props.preset)} custom_key simple_key`}>
                                <div className='shift'>{getIcon('shift', props.preset)}</div>
                            </div>
                            <div className='simple_key'><span className='letter'>y</span></div>
                            <div className='simple_key'><span className='letter'>x</span></div>
                            <div className='simple_key'><span className='letter'>c</span></div>
                            <div className='simple_key'><span className='letter'>v</span></div>
                            <div className='simple_key'><span className='letter'>b</span></div>
                            <div className='simple_key'><span className='letter'>n</span></div>
                            <div className='simple_key'><span className='letter'>m</span></div>
                            <div className={`${getClassName('backspace', props.preset)} custom_key simple_key`}>
                                <div className='backspace'>{getIcon('backspace', props.preset)}</div>
                            </div>
                        </div>
                        <div className='keys'>
                            <div className='second_color custom_key simple_key'><span
                                className='letter l123'>?123</span>
                            </div>
                            <div className='second_color simple_key'>
                                <span className='letter'>,</span>
                                <div className='emoji'>
                                    <svg style={{ width: '.5em', height: '.5em' }} viewBox='0 0 24 24' fill='none'
                                         xmlns='http://www.w3.org/2000/svg'>
                                        <path
                                            d='M8.53125 14.0156C9.3125 15.3281 10.4688 15.9844 12 15.9844C13.5312 15.9844 14.6875 15.3281 15.4688 14.0156H17.1094C16.7031 15.0469 16.0312 15.8906 15.0938 16.5469C14.1875 17.1719 13.1562 17.4844 12 17.4844C10.8438 17.4844 9.79688 17.1719 8.85938 16.5469C7.95312 15.8906 7.29688 15.0469 6.89062 14.0156H8.53125ZM6.32812 17.6719C7.92188 19.2344 9.8125 20.0156 12 20.0156C14.1875 20.0156 16.0625 19.2344 17.625 17.6719C19.2188 16.0781 20.0156 14.1875 20.0156 12C20.0156 9.8125 19.2188 7.9375 17.625 6.375C16.0625 4.78125 14.1875 3.98438 12 3.98438C9.8125 3.98438 7.92188 4.78125 6.32812 6.375C4.76562 7.9375 3.98438 9.8125 3.98438 12C3.98438 14.1875 4.76562 16.0781 6.32812 17.6719ZM4.92188 4.96875C6.89062 3 9.25 2.01562 12 2.01562C14.75 2.01562 17.0938 3 19.0312 4.96875C21 6.90625 21.9844 9.25 21.9844 12C21.9844 14.75 21 17.1094 19.0312 19.0781C17.0938 21.0156 14.75 21.9844 12 21.9844C9.25 21.9844 6.89062 21.0156 4.92188 19.0781C2.98438 17.1094 2.01562 14.75 2.01562 12C2.01562 9.25 2.98438 6.90625 4.92188 4.96875ZM7.40625 10.5938C7.125 10.2812 6.98438 9.92188 6.98438 9.51562C6.98438 9.10938 7.125 8.76562 7.40625 8.48438C7.71875 8.17188 8.07812 8.01562 8.48438 8.01562C8.89062 8.01562 9.23438 8.17188 9.51562 8.48438C9.82812 8.76562 9.98438 9.10938 9.98438 9.51562C9.98438 9.92188 9.82812 10.2812 9.51562 10.5938C9.23438 10.875 8.89062 11.0156 8.48438 11.0156C8.07812 11.0156 7.71875 10.875 7.40625 10.5938ZM14.4375 10.5938C14.1562 10.2812 14.0156 9.92188 14.0156 9.51562C14.0156 9.10938 14.1562 8.76562 14.4375 8.48438C14.75 8.17188 15.1094 8.01562 15.5156 8.01562C15.9219 8.01562 16.2656 8.17188 16.5469 8.48438C16.8594 8.76562 17.0156 9.10938 17.0156 9.51562C17.0156 9.92188 16.8594 10.2812 16.5469 10.5938C16.2656 10.875 15.9219 11.0156 15.5156 11.0156C15.1094 11.0156 14.75 10.875 14.4375 10.5938Z'
                                            fill='currentColor'/>
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
                            <div
                                className={`${getClassName('return', props.preset)} custom_key simple_key`}>
                                <div className='return'>{getIcon('return', props.preset)}</div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Box>
        }
        return <Box className={'scrollContainer'} ref={this.scrollContainer}>
            <KeyboardBody preset={'default'}/>
            <KeyboardBody preset={'regularAlt'}/>
        </Box>
    }
}

export default Keyboard