import { css } from "@styles";

export const container = (width: number, padding: number) => css({
    alignItems: 'center',
    borderRadius: '9999px',
    height: `${width / 2}px`,
    width: `${width}px`,
    paddingLeft: `${padding}px`,
    paddingRight: `${padding}px`,
})()

export const slider = (width: number, sliderXPosition: number) => css({
    width: `${width}px`,
    height: `${width}px`,
    backgroundColor: '$onPickerBackground',
    borderRadius: '9999px',
    position: 'relative',
    left: `${sliderXPosition}px`
})()