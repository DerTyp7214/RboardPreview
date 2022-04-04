import React, { ChangeEvent, Component, RefObject, useState } from 'react'
import { colorVars } from './variables'
import { Color, ColorPicker, useColor } from 'react-color-palette'
import ClickAwayListener from 'react-click-away-listener'
import 'react-color-palette/lib/css/styles.css'
import { Button, TextField } from '@mui/material';

export interface SettingsProps {
    ref?: RefObject<Settings>
    exportTheme?: () => any;
    getThemeName?: () => string;
}

class Settings extends Component<SettingsProps> {

    root: HTMLElement
    rootStyles: CSSStyleDeclaration

    state = {
        name: ''
    }

    constructor(props: Readonly<SettingsProps>) {
        super(props)
        this.root = document.documentElement
        this.rootStyles = getComputedStyle(this.root)
    }

    getThemeName() {
        return this.state.name
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

    render() {
        const Picker = (props: { colorVar: string, submitColor: (color: Color) => any }) => {
            const [picking, setPicking] = useState(false)
            const [color, setColor] = useColor('hex', this.getAttrColor(props.colorVar))

            return <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                    width: '2.6em', height: '2.6em',
                    borderRadius: '.5em', margin: '.5em',
                    border: '.08em solid white',
                    cursor: 'pointer', background: color.hex
                }} onClick={() => {
                    setPicking(true)
                }
                }/>
                {picking && <div style={{ position: 'absolute', zIndex: 100, left: 'calc(calc(300px - 2.6em) / 2)', transform: 'translate(-50%, -50%)' }}>
                    <ClickAwayListener onClickAway={() => {
                        props.submitColor(color)
                        setPicking(false)
                    }}>
                        <div onClick={(event) => event.persist()}>
                            <ColorPicker width={300} color={color} onChange={setColor} dark
                                         onChangeComplete={setColor}/>
                        </div>
                    </ClickAwayListener>
                </div>}
            </div>
        }

        const generatePickers = () => colorVars.map(colorVar => <Picker colorVar={colorVar} submitColor={color => {
            this.root.style.setProperty(colorVar, color.hex)
        }}/>)

        return <div className='settings'>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                paddingTop: '.8em',
                width: '18em',
                margin: 'auto'
            }}>
                {generatePickers()}
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: 'calc(18em * .8)',
                paddingTop: '.8em',
                margin: 'auto',
                transform: 'scale(1.3)'
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
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        this.setState({ name: event.target.value })
                    }}/>
                <Button
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
            </div>
        </div>;
    }
}

export default Settings