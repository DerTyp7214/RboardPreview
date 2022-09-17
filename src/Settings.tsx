import React, { ChangeEvent, Component, RefObject, useState } from 'react'
import { colorVars } from './variables'
import { Color, ColorPicker, useColor } from 'react-color-palette'
import ClickAwayListener from 'react-click-away-listener'
import 'react-color-palette/lib/css/styles.css'
import { Button, Snackbar, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { isMobile } from 'react-device-detect'
import { Share } from '@mui/icons-material';
import { copyToClipboard } from './utils';
import { Preset as KPreset } from './Icons'

export interface Preset {
    mainBg: string;
    keyBg: string;
    keyColor: string;
    secondKeyBg: string;
    accentBg: string;
    themeName: string;
    author: string;
    preset: string
}

export interface SettingsProps {
    ref?: RefObject<Settings>
    exportTheme?: () => any;
    uglify?: () => any;
    uploadPic?: () => any;
    getThemeName?: () => string;
    getAuthorName?: () => string;
    passPreset?: () => KPreset | undefined;
    preset?: Preset
}

class Settings extends Component<SettingsProps> {

    root: HTMLElement
    rootStyles: CSSStyleDeclaration

    state = {
        name: '',
        author: 'DerTyp7214',
        preset: 'default',
        share: {
            loading: false
        },
        snackbar: {
            open: false,
            text: ''
        }
    }

    constructor(props: Readonly<SettingsProps>) {
        super(props)
        this.root = document.documentElement
        this.rootStyles = getComputedStyle(this.root)

        this.parsePreset(props)
    }

    getThemeName() {
        return this.state.name.trim() === '' ? 'Pick a fucking name bro' : this.state.name
    }

    getAuthorName() {
        return this.state.author
    }

    private parsePreset(props: SettingsProps) {
        if (props.preset) {
            const {
                mainBg,
                keyBg,
                keyColor,
                secondKeyBg,
                accentBg,
                themeName,
                author,
                preset
            } = props.preset
            this.setState({
                ...this.state,
                name: themeName ? decodeURIComponent(themeName) : themeName,
                author: author ? decodeURIComponent(author) : author,
                preset: preset ?? 'default'
            })
            if (mainBg) this.root.style.setProperty('--main-bg', mainBg)
            if (keyBg) this.root.style.setProperty('--key-bg', keyBg)
            if (keyColor) this.root.style.setProperty('--key-color', keyColor)
            if (secondKeyBg) this.root.style.setProperty('--second-key-bg', secondKeyBg)
            if (accentBg) this.root.style.setProperty('--accent-bg', accentBg)
        }
    }

    private refreshColors(custom: (cssVar: string, element: HTMLInputElement, cssValue: any) => any) {
        colorVars.forEach(cssVar => {
            const cssValue = this.rootStyles.getPropertyValue(cssVar).trim()
            const element = document.getElementById(cssVar.substring(2))
            if (element) {
                (element as HTMLInputElement).value = cssValue
                custom(cssVar, element as HTMLInputElement, cssValue)
            }
        })
    }

    private getAttrColor(id: string) {
        const cssVar = `--${id.replace('--', '')}`
        return this.rootStyles.getPropertyValue(cssVar).trim()
    }

    componentDidMount() {
        this.refreshColors((cssVar, element) => {
            element.addEventListener('change', (ev: any) => {
                this.root.style.setProperty(cssVar, (ev as ChangeEvent<HTMLInputElement>).target.value)
            })
        })
    }

    componentDidUpdate(prevProps: Readonly<SettingsProps>) {
        if (prevProps !== this.props) {
            this.parsePreset(this.props)
            this.setState({
                ...this.state,
                author: this.props.preset?.author,
                name: this.props.preset?.themeName
            })
        }
    }

    render() {
        const Picker = (props: { colorVar: string, submitColor: (color: Color) => any }) => {
            const [picking, setPicking] = useState(false)
            const [color, setColor] = useColor('hex', this.getAttrColor(props.colorVar))

            return <>
                <div style={{
                    width: '2.6em', height: '2.6em',
                    borderRadius: '.5em', margin: '.5em',
                    border: '.08em solid white',
                    cursor: 'pointer', background: color.hex
                }} onClick={() => {
                    setPicking(true)
                }
                } />
                {picking && <div style={{
                    position: 'absolute',
                    zIndex: 100,
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}>
                    <ClickAwayListener onClickAway={() => {
                        props.submitColor(color)
                        setPicking(false)
                    }}>
                        <div onClick={(event) => event.persist()}>
                            <ColorPicker
                                width={300}
                                color={color}
                                onChange={setColor} dark
                                onChangeComplete={setColor} />
                        </div>
                    </ClickAwayListener>
                </div>}
            </>
        }

        const generatePickers = () => colorVars.map(colorVar => <Picker
            key={colorVar}
            colorVar={colorVar}
            submitColor={color => {
                this.root.style.setProperty(colorVar, color.hex)
            }} />
        )

        const share = async () => {
            this.setState({
                ...this.state,
                share: {
                    ...share,
                    loading: true
                }
            })
            const buildUrl = (path = '') => {
                let url = `${window.location.origin}/${path}`
                url += `?mainBg=${this.getAttrColor('--main-bg').substring(1)}`
                url += `&keyBg=${this.getAttrColor('--key-bg').substring(1)}`
                url += `&keyColor=${this.getAttrColor('--key-color').substring(1)}`
                url += `&secondKeyBg=${this.getAttrColor('--second-key-bg').substring(1)}`
                url += `&accentBg=${this.getAttrColor('--accent-bg').substring(1)}`
                url += `&themeName=${encodeURIComponent(this.state.name)}`
                url += `&author=${encodeURIComponent(this.state.author)}`
                url += `&preset=${this.props.passPreset?.()}`
                return url
            }
            if (navigator.share) {
                let shareData: ShareData = {
                    url: buildUrl()
                }
                /*const files: File[] = []
                await fetch(buildUrl('preview')).then(res => res.blob()).then(blob => {
                    files.push(new File([blob], `${this.state.name}.png`, {
                        lastModified: Date.now(),
                        type: blob.type
                    }))
                }).catch(() => {
                })
                const fileData: ShareData = {
                    title: `${this.state.name} by ${this.state.author}`,
                    files
                }
                if (navigator.canShare({ ...shareData, ...fileData }))
                    shareData = { ...shareData, ...fileData }*/
                await navigator.share(shareData).then(() => {
                }).catch(reason => {
                    this.setState({
                        ...this.state,
                        snackbar: {
                            open: true,
                            text: `Error while sharing: ${reason}`
                        }
                    })
                })
            } else copyToClipboard(buildUrl()).then(() => {
                this.setState({
                    ...this.state,
                    snackbar: {
                        open: true,
                        text: 'Copied to Clipboard!'
                    }
                })
            })
            this.setState({
                ...this.state,
                share: {
                    ...share,
                    loading: false
                }
            })
        }

        return <div className='settings' style={{
            position: 'relative'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                margin: 'auto'
            }}>
                {generatePickers()}
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: `calc(18em * ${isMobile ? '1.15' : '.78'})`,
                paddingTop: '.8em',
                margin: 'auto',
                transform: isMobile ? 'scale(.9)' : 'scale(1.3)'
            }}>
                <TextField
                    id='author'
                    label='Author'
                    variant='outlined'
                    fullWidth
                    sx={{
                        margin: '8px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '.08em',
                            borderRadius: '.5em'
                        }
                    }}
                    value={this.state.author}
                    defaultValue={this.state.author}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        this.setState({ ...this.state, author: event.target.value })
                    }} />
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: `calc(18em * ${isMobile ? '1.15' : '.78'})`,
                paddingTop: '.8em',
                margin: 'auto',
                transform: isMobile ? 'scale(.9)' : 'scale(1.3)'
            }}>
                <TextField
                    id='theme-name'
                    label='Theme Name'
                    variant='outlined'
                    fullWidth
                    sx={{
                        margin: '8px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '.08em',
                            borderRadius: '.5em'
                        }
                    }}
                    value={this.state.name}
                    defaultValue={this.state.name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        this.setState({ ...this.state, name: event.target.value })
                    }} />
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: `calc(18em * ${isMobile ? '1.15' : '.78'})`,
                paddingTop: '.8em',
                margin: 'auto',
                transform: isMobile ? 'scale(.9)' : 'scale(1.3)'
            }}>
                <Button
                    fullWidth
                    variant='outlined'
                    color='primary'
                    onClick={this.props.exportTheme}
                    sx={{
                        margin: '8px',
                        borderWidth: '.08em',
                        borderRadius: '.5em'
                    }}>
                    Export
                </Button>
                <LoadingButton
                    fullWidth
                    variant='outlined'
                    color='primary'
                    onClick={share}
                    loading={this.state.share.loading}
                    sx={{
                        margin: '8px',
                        borderWidth: '.08em',
                        borderRadius: '.5em'
                    }}>
                    <Share />
                </LoadingButton>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: `calc(18em * ${isMobile ? '1.15' : '.78'})`,
                paddingTop: '.8em',
                margin: 'auto',
                transform: isMobile ? 'scale(.9)' : 'scale(1.3)'
            }}>
                <Button
                    fullWidth
                    variant='outlined'
                    color='primary'
                    onClick={this.props.uglify}
                    sx={{
                        margin: '8px',
                        borderWidth: '.08em',
                        borderRadius: '.5em'
                    }}>
                    Uglify
                </Button>
                <Button
                    fullWidth
                    variant='outlined'
                    color='primary'
                    onClick={this.props.uploadPic}
                    sx={{
                        margin: '8px',
                        borderWidth: '.08em',
                        borderRadius: '.5em'
                    }}>
                    Choose Picture
                </Button>
            </div>
            <Snackbar
                open={this.state.snackbar.open}
                autoHideDuration={6000}
                onClose={() => this.setState({ ...this.state, snackbar: { open: false } })}
                message={this.state.snackbar.text} />
        </div>
    }
}

export default Settings