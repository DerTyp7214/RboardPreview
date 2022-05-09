import React, { useRef, useState } from 'react'
import Keyboard from './Keyboard'
import Settings, { Preset } from './Settings'
import { createTheme, Grid, ThemeProvider, Typography } from '@mui/material'
import { MobileView } from 'react-device-detect'
import Vibrant from 'node-vibrant/dist/vibrant'

function App() {
    const keyboardRef = useRef<Keyboard>(null)
    const settingsRef = useRef<Settings>(null)

    const getPreset: () => (Preset | undefined) = () => {
        const search = window.location.search
        if (search.length < 1) return
        const query: { [key: string]: string } = {}
        search.substring(1).split('&').forEach(entry => query[entry.split('=')[0]] = entry.split('=')[1])

        if (query['mainBg'] && query['keyBg'] && query['keyColor'] && query['secondKeyBg'] && query['accentBg']) {
            return {
                mainBg: `#${query['mainBg']}`,
                keyBg: `#${query['keyBg']}`,
                keyColor: `#${query['keyColor']}`,
                secondKeyBg: `#${query['secondKeyBg']}`,
                accentBg: `#${query['accentBg']}`,
                themeName: query['themeName'],
                author: query['author'],
                preset: query['preset'] ?? 'default'
            }
        }
    }

    const [colors, setColors] = useState<Preset | undefined>(getPreset())

    const exportTheme = async () => {
        if (settingsRef.current && keyboardRef.current)
            await keyboardRef.current.exportTheme(
                settingsRef.current.getThemeName(),
                settingsRef.current.getAuthorName()
            )
    }

    const uploadPic = async () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/png, image/jpeg'
        input.onchange = () => {
            const file = input.files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = async e => {
                    const base64 = e.target?.result?.toString()
                    if (base64) {
                        const randomColor = () => `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`

                        const palette = await Vibrant.from(base64).getPalette()

                        const mainBg = palette.DarkMuted?.hex ?? randomColor()
                        const keyBg = palette.Muted?.hex ?? randomColor()
                        const keyColor = palette.LightVibrant?.hex ?? randomColor()
                        const secondKeyBg = palette.Muted?.hex ?? randomColor()
                        const accentBg = palette.Vibrant?.hex ?? randomColor()
                        const preset = 'default'

                        setColors({
                            themeName: file.name.split('.').slice(0, -1).join('.'),
                            author: 'DerTyp7214',
                            mainBg, keyBg, keyColor, secondKeyBg, accentBg, preset
                        })
                    }
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    const uglify = () => {
        const randomColor = () => `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`

        const mainBg = randomColor()
        const keyBg = randomColor()
        const keyColor = randomColor()
        const secondKeyBg = randomColor()
        const accentBg = randomColor()
        const preset = 'default'

        setColors({
            themeName: `Ugly #${Math.random() * 187 << 0}`,
            author: 'DerTyp7214',
            mainBg, keyBg, keyColor, secondKeyBg, accentBg, preset
        })
    }

    return (
        <ThemeProvider theme={createTheme({ palette: { mode: 'dark', primary: { main: '#FFFFFF' } } })}>
            <div style={{ padding: 32 }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent='space-around'
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        transform: 'translateY(-50%)'
                    }}>
                    <Grid item>
                        <Keyboard ref={keyboardRef} preset={colors?.preset as any}/>
                    </Grid>
                    <Grid item>
                        <Settings
                            exportTheme={exportTheme}
                            passPreset={() => keyboardRef.current?.getPreset()}
                            uglify={uglify}
                            uploadPic={uploadPic}
                            ref={settingsRef}
                            preset={colors}/>
                        <MobileView>
                            <Typography variant='h2' sx={{
                                fontSize: 'var(--font-size)',
                                paddingTop: '.8em',
                                width: '17em',
                                margin: 'auto',
                                color: 'white',
                                textAlign: 'center',
                                '& code': {
                                    background: '#FFFFFF10',
                                    paddingLeft: '4px',
                                    paddingRight: '4px',
                                    borderRadius: '.2em'
                                }
                            }}>
                                You may have to rename the file from <code>.pack.zip</code> to <code>.pack</code> after
                                download.
                            </Typography>
                        </MobileView>
                    </Grid>
                </Grid>
            </div>
        </ThemeProvider>
    )
}

export default App;
