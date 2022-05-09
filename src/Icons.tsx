import { ReactElement } from 'react';
import { presets } from './variables';

export type Icon = 'shift' | 'backspace' | 'return' | 'topAction'
export type Preset = (typeof presets)[number]

export const getIcon: (icon: Icon, preset?: Preset) => ReactElement = (icon: Icon, preset: Preset = 'default') => {
    let additionalStyle = {}
    switch (preset) {
        case 'regularAlt':
            if (['return', 'topAction'].includes(icon)) additionalStyle = {
                color: 'var(--key-color)'
            }
            break
    }
    switch (icon) {
        case 'topAction':
            return <svg style={Object.assign({ width: '1.23em', height: '1.23em' }, additionalStyle)}
                        viewBox='0 0 24 24'>
                <path fill='currentColor'
                      d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'/>
            </svg>
        case 'shift':
            return <svg style={Object.assign({ width: '1em', height: '.916em' }, additionalStyle)} viewBox='0 0 24 21'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M18.0556 13H17.0556V14V19C17.0556 19.5523 16.6079 20 16.0556 20H8.00004C7.44776 20 7.00004 19.5523 7.00004 19V14V13H6.00004H2.70699C1.82482 13 1.37481 11.9409 1.98715 11.3059L11.5253 1.41444L21.7438 11.2806C22.3909 11.9053 21.9486 13 21.0492 13H18.0556Z'
                    stroke='currentColor' strokeWidth='2' strokeLinecap='round'/>
            </svg>
        case 'backspace':
            return <svg style={Object.assign({ width: '1.08em', height: '.916em' }, additionalStyle)}
                        viewBox='0 0 25 20' fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                <path fillRule='evenodd' clipRule='evenodd'
                      d='M10.7071 6.2928C11.0976 5.90228 11.7308 5.90228 12.1213 6.2928L18.7071 12.8786C19.0976 13.2691 19.0976 13.9023 18.7071 14.2928C18.3166 14.6833 17.6834 14.6833 17.2929 14.2928L10.7071 7.70701C10.3166 7.31649 10.3166 6.68332 10.7071 6.2928Z'
                      fill='currentColor'/>
                <path fillRule='evenodd' clipRule='evenodd'
                      d='M18.2929 6.2928C17.9024 5.90228 17.2692 5.90228 16.8787 6.2928L10.2929 12.8786C9.9024 13.2691 9.9024 13.9023 10.2929 14.2928C10.6834 14.6833 11.3166 14.6833 11.7071 14.2928L18.2929 7.70701C18.6834 7.31649 18.6834 6.68332 18.2929 6.2928Z'
                      fill='currentColor'/>
                <path fillRule='evenodd' clipRule='evenodd'
                      d='M7.58537 2L2.38537 10L7.58537 18H22C22.5523 18 23 17.5523 23 17V3C23 2.44772 22.5523 2 22 2H7.58537ZM6.5 20L0 10L6.5 0H22C23.6569 0 25 1.34315 25 3V17C25 18.6569 23.6569 20 22 20H6.5Z'
                      fill='currentColor'/>
            </svg>
        case 'return':
            return <svg style={Object.assign({ width: '1.66em', height: '1.66em' }, additionalStyle)}
                        viewBox='0 0 34 34' fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                <path
                    d='M23.9844 11.9844H26V17.9844H10.8125L14.4219 21.5938L13.0156 23L7.01562 17L13.0156 11L14.4219 12.4062L10.8125 16.0156H23.9844V11.9844Z'
                    fill='currentColor'/>
            </svg>
        default:
            return <></>
    }
}