import { forwardRef, MouseEvent, TouchEvent, useCallback, useImperativeHandle, useRef, useState } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useRegionStore from '../store/region_store.ts'
import { LaunchCancelBtn, LaunchConfirmBtn } from "./CaptainConsoleButton"
import DialogueBubble from "./DialogueBubble"
import SecretaryList from "./SecretaryList"
import type { SecretaryListHandle } from './SecretaryList'
import '../scss/CaptainCabinMobile.scss'

interface CaptainCabinMobileHandle {
    onMouseUp: () => void
    onMouseMove: (y: number) => void
}

function CaptainConsoleMobile({ regionListLength }: { regionListLength: number }) {
    return (
        <>
            <div className={regionListLength > 0 ? 'console_wrapper console_wrapper__l' : 'console_wrapper console_wrapper__l console_wrapper--invisible'}>
                <LaunchCancelBtn isWithLabel={false} />
            </div >
            <div className={regionListLength > 0 ? 'console_wrapper console_wrapper__r' : 'console_wrapper console_wrapper__r console_wrapper--invisible'}>
                <LaunchConfirmBtn isWithLabel={false} />
            </div >
        </>
    )
}

function SecretarySceneMobile() {
    const headImage = useCharacterStore((state) => state.headImage)

    return (
        <div className='secretary_scene--mobile'>
            <div className="secretary__head--mobile">
                <img src={headImage} alt='head' />
            </div>
            <DialogueBubble />
        </div>
    )
}

const enum CollapseStatus {
    EXPANDED = 'expanded',
    HALF_COLLAPSED = 'half_collapsed',
    COLLAPSED = 'collapsed'
}

const CaptainCabinMobile = forwardRef((_, ref) => {
    const regionList = useRegionStore((state) => state.regionList)
    const [prevHeight, setPrevHeight] = useState<number>(0)
    const [prevBottom, setPrevBottom] = useState<number>(0)
    const [isMouseLeave, setIsMouseLeave] = useState<boolean>(false)
    const [curCollapseStatus, setCurCollapseStatus] = useState<CollapseStatus>(CollapseStatus.EXPANDED)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const captainCabinMobileRef = useRef<HTMLDivElement>(null)
    const secretaryListRef = useRef<SecretaryListHandle>(null)

    const onDragStart = useCallback((y: number) => {
        setPrevHeight(y)
        setIsMouseLeave(false)

        if (captainCabinMobileRef.current) {
            if (captainCabinMobileRef.current.style.bottom === '') {
                setPrevBottom(parseInt(getComputedStyle(captainCabinMobileRef.current).bottom))
            } else {
                setPrevBottom(parseInt(captainCabinMobileRef.current.style.bottom))
            }
        } else {
            setPrevBottom(0)
        }

        if (captainCabinMobileRef.current) {
            captainCabinMobileRef.current.style.transition = 'none'
        }

        setIsDragging(true)
    }, [])

    const onDragging = useCallback((y: number) => {
        if (!isDragging) { return }

        if (captainCabinMobileRef.current) {
            const moveHeight: number = y - prevHeight
            let curBottom: number = 0

            if (captainCabinMobileRef.current.style.bottom === '') {
                curBottom = parseInt(getComputedStyle(captainCabinMobileRef.current).bottom)
            } else {
                curBottom = parseInt(captainCabinMobileRef.current.style.bottom)
            }

            const nextBottom: number = Math.max(Math.min(curBottom - moveHeight, 0), -1 * captainCabinMobileRef.current.offsetHeight)
            captainCabinMobileRef.current.style.bottom = `${nextBottom}px`
            setPrevBottom(nextBottom)
        }

        setPrevHeight(y)
    }, [prevHeight, isDragging])

    const onDragEnd = useCallback(() => {
        if (!isDragging) { return }

        setIsDragging(false)

        if (captainCabinMobileRef.current) {
            captainCabinMobileRef.current.style.removeProperty('bottom')
            captainCabinMobileRef.current.style.removeProperty('transition')
        }

        const COLLAPSE_THRESHOLD: number = 0.5
        const captainCabinMobileHeight: number = captainCabinMobileRef.current ? captainCabinMobileRef.current.offsetHeight : 0
        const secretaryListHeight: number = secretaryListRef.current ? secretaryListRef.current.getHeight() : 0
        const curBottom: number = -1 * prevBottom

        if (curBottom >= secretaryListHeight * COLLAPSE_THRESHOLD
            && curBottom < (captainCabinMobileHeight - secretaryListHeight) * COLLAPSE_THRESHOLD + secretaryListHeight) {
            setCurCollapseStatus(CollapseStatus.HALF_COLLAPSED)
            setPrevBottom(-1 * secretaryListHeight)
        } else if (curBottom >= (captainCabinMobileHeight - secretaryListHeight) * COLLAPSE_THRESHOLD + secretaryListHeight) {
            setCurCollapseStatus(CollapseStatus.COLLAPSED)
            setPrevBottom(-1 * captainCabinMobileHeight)
        } else {
            setCurCollapseStatus(CollapseStatus.EXPANDED)
            setPrevBottom(0)
        }

        setPrevHeight(0)
    }, [isDragging, prevBottom])

    const handleMouseLeave = useCallback(() => {
        setIsMouseLeave(true)
    }, [])

    const handleMouseDown = useCallback((event: MouseEvent<HTMLElement>) => {
        event.preventDefault()
        onDragStart(event.clientY)
    }, [onDragStart])

    const handleMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
        event.preventDefault()
        onDragging(event.clientY)
    }, [onDragging])

    const handleMouseUp = useCallback((event: MouseEvent<HTMLElement>) => {
        event.preventDefault()
        onDragEnd()
    }, [onDragEnd])

    const handleTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
        onDragStart(event.touches[0].clientY)
    }, [onDragStart])

    const handleTouchMove = useCallback((event: TouchEvent<HTMLElement>) => {
        onDragging(event.touches[0].clientY)
    }, [onDragging])

    const handleTouchEnd = useCallback(() => {
        onDragEnd()
    }, [onDragEnd])

    useImperativeHandle(ref, (): CaptainCabinMobileHandle => {
        return {
            onMouseUp() {
                onDragEnd()
            },
            onMouseMove(y: number) {
                if (isMouseLeave) {
                    onDragging(y)
                }
            }
        }

    }, [onDragEnd, onDragging, isMouseLeave])

    return (
        <div className={`captain_cabin_mobile${curCollapseStatus === CollapseStatus.HALF_COLLAPSED
            ? ' captain_cabin_mobile--half-collapsed'
            : curCollapseStatus === CollapseStatus.COLLAPSED
                ? ' captain_cabin_mobile--collapsed' : ''}`}
            ref={captainCabinMobileRef}>
            <div className="captain_cabin_mobile__handle"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="captain_cabin_mobile__handle__icon"></div>
            </div>
            <CaptainConsoleMobile regionListLength={regionList.length} />
            <SecretarySceneMobile />
            <SecretaryList ref={secretaryListRef} />
        </div>
    )
})

export type { CaptainCabinMobileHandle }
export default CaptainCabinMobile