import React, { useRef } from 'react'
import Keyboard from './Keyboard'
import Settings from './Settings'
import { createTheme, ThemeProvider } from "@mui/material";

function App() {
    const keyboardRef = useRef<Keyboard>(null)
    const settingsRef = useRef<Settings>(null)

    const exportTheme = async () => {
        if (settingsRef.current && keyboardRef.current)
            await keyboardRef.current.exportTheme(settingsRef.current.getThemeName())
    }

    return (
        <ThemeProvider theme={createTheme({ palette: { mode: 'dark', primary: { main: '#FFFFFF' } } })}>
            <div style={{padding: 32}}>
                <Keyboard ref={keyboardRef}/>
                <Settings exportTheme={exportTheme} ref={settingsRef}/>
            </div>
        </ThemeProvider>
    );
}

export default App;
