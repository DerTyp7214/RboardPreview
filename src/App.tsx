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

    return (
        <ThemeProvider theme={createTheme({ palette: { mode: 'dark', primary: { main: '#FFFFFF' } } })}>
            <div style={{ padding: 32 }}>
                <Keyboard ref={keyboardRef}/>
                <Settings exportTheme={exportTheme} ref={settingsRef}/>
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
