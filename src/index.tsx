import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TagManager from 'react-gtm-module'
import App from './App'

TagManager.initialize({ gtmId: 'G-V0YXM60BWK' })

const container = document.getElementById('root')
if (container) {
    const root = createRoot(container)
    root.render([
        <div style={{
            height: '100vh',
            maxHeight: '100vh',
            paddingBottom: '1.5em',
            overflow: 'auto'
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    ])
}