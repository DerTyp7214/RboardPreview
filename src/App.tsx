import React, { useRef } from 'react'
import Keyboard from './Keyboard'
import Settings from './Settings'
import { createTheme, ThemeProvider, Typography } from '@mui/material'
import { MobileView } from 'react-device-detect'

function App() {
    const keyboardRef = useRef<Keyboard>(null)
    const settingsRef = useRef<Settings>(null)

    const exportTheme = async () => {
        if (settingsRef.current && keyboardRef.current)
            await keyboardRef.current.exportTheme(settingsRef.current.getThemeName())
    }

    const getPreset = () => {
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
                themeName: query['themeName']
            }
        }
    }

    return (
        <ThemeProvider theme={createTheme({ palette: { mode: 'dark', primary: { main: '#FFFFFF' } } })}>
            <div style={{ padding: 32 }}>
                <Keyboard ref={keyboardRef}/>
                <Settings
                    exportTheme={exportTheme}
                    ref={settingsRef}
                    preset={getPreset()}/>
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
                    }}>You may have to rename the file from <code>.pack.zip</code> to <code>.pack</code> after download.</Typography>
                </MobileView>
            </div>
        </ThemeProvider>
    );
}

export default App;
