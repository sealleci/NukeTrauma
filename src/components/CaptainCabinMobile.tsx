import { MouseEvent, TouchEvent, useCallback, useRef, useState } from 'react'
import useCharacterStore from '../store/character_store.ts'
import useRegionStore from '../store/region_store.ts'
import SecretaryList from "./SecretaryList"
import type { SecretaryListHandle } from './SecretaryList.tsx'
import DialogueBubble from "./DialogueBubble"
import { LaunchCancelBtn, LaunchConfirmBtn } from "./CaptainConsoleButton"
import '../scss/CaptainCabinMobile.scss'

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

export default function CaptainCabinMobile() {
    const regionList = useRegionStore((state) => state.regionList)
    const [startHeight, setStartHeight] = useState<number>(0)
    const [prevHeight, setPrevHeight] = useState<number>(0)
    const [curCollapseStatus, setCurCollapseStatus] = useState<CollapseStatus>(CollapseStatus.EXPANDED)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const captainCabinMobileRef = useRef<HTMLDivElement>(null)
    const secretaryListRef = useRef<SecretaryListHandle>(null)

    const onDragStart = useCallback((y: number) => {
        setStartHeight(y)
        setPrevHeight(y)

        if (captainCabinMobileRef.current) {
            captainCabinMobileRef.current.style.transition = 'none'
        }

        setIsDragging(true)
    }, [])

    const onDragging = useCallback((y: number) => {
        if (!isDragging) { return }

        if (captainCabinMobileRef.current) {
            const moveHeight: number = y - prevHeight
            let curTop: number = 0

            if (captainCabinMobileRef.current.style.top === '') {
                curTop = parseInt(getComputedStyle(captainCabinMobileRef.current).top)
            } else {
                curTop = parseInt(captainCabinMobileRef.current.style.top)
            }

            const nextTop: number = Math.min(Math.max(curTop + moveHeight, 0), captainCabinMobileRef.current.offsetHeight)
            captainCabinMobileRef.current.style.top = `${nextTop}px`
        }

        setPrevHeight(y)
    }, [prevHeight, isDragging])

    const onDragEnd = useCallback(() => {
        setIsDragging(false)

        if (captainCabinMobileRef.current) {
            captainCabinMobileRef.current.style.removeProperty('top')
            captainCabinMobileRef.current.style.removeProperty('transition')
        }

        const COLLAPSE_THRESHOLD: number = 0.5
        const captainCabinMobileHeight: number = captainCabinMobileRef.current ? captainCabinMobileRef.current.offsetHeight : 0
        const secretaryListHeight: number = secretaryListRef.current ? secretaryListRef.current.getHeight() : 0
        const moveHeight: number = prevHeight - startHeight

        switch (curCollapseStatus) {
            case CollapseStatus.EXPANDED:
                if (moveHeight > 0) {
                    if (moveHeight >= secretaryListHeight * COLLAPSE_THRESHOLD
                        && moveHeight < (captainCabinMobileHeight - secretaryListHeight) * COLLAPSE_THRESHOLD + secretaryListHeight) {
                        setCurCollapseStatus(CollapseStatus.HALF_COLLAPSED)
                    } else if (moveHeight >= (captainCabinMobileHeight - secretaryListHeight) * COLLAPSE_THRESHOLD + secretaryListHeight) {
                        setCurCollapseStatus(CollapseStatus.COLLAPSED)
                    }
                } else {
                    return
                }
                break
            case CollapseStatus.HALF_COLLAPSED:
                if (moveHeight > 0) {
                    if (moveHeight >= (captainCabinMobileHeight - secretaryListHeight) * COLLAPSE_THRESHOLD) {
                        setCurCollapseStatus(CollapseStatus.COLLAPSED)
                    }
                } else {
                    if (Math.abs(moveHeight) >= secretaryListHeight * COLLAPSE_THRESHOLD) {
                        console.log(2)
                        setCurCollapseStatus(CollapseStatus.EXPANDED)
                    }
                }
                break
            case CollapseStatus.COLLAPSED:
                if (moveHeight < 0) {
                    if (Math.abs(moveHeight) >= (captainCabinMobileHeight - secretaryListHeight) * COLLAPSE_THRESHOLD
                        && Math.abs(moveHeight) < captainCabinMobileHeight - secretaryListHeight * COLLAPSE_THRESHOLD) {
                        console.log(1)
                        setCurCollapseStatus(CollapseStatus.HALF_COLLAPSED)
                    } else if (Math.abs(moveHeight) >= captainCabinMobileHeight - secretaryListHeight * COLLAPSE_THRESHOLD) {
                        setCurCollapseStatus(CollapseStatus.EXPANDED)
                    }
                }
                break
            default:
                break
        }

        setPrevHeight(0)
        setStartHeight(0)
    }, [startHeight, prevHeight, curCollapseStatus])

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

    const handleMouseOut = useCallback(() => {
        onDragEnd()
    }, [onDragEnd])

    const handleTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
        event.preventDefault()
        onDragStart(event.touches[0].clientY)
    }, [onDragStart])

    const handleTouchMove = useCallback((event: TouchEvent<HTMLElement>) => {
        event.preventDefault()
        onDragging(event.touches[0].clientY)
    }, [onDragging])

    const handleTouchEnd = useCallback((event: TouchEvent<HTMLElement>) => {
        event.preventDefault()
        onDragEnd()
    }, [onDragEnd])

    return (
        <div className={`captain_cabin--mobile${curCollapseStatus === CollapseStatus.HALF_COLLAPSED
            ? ' captain_cabin--mobile--half-collapsed'
            : curCollapseStatus === CollapseStatus.COLLAPSED
                ? ' captain_cabin--mobile--collapsed' : ''}`}
            ref={captainCabinMobileRef}>
            <div className="captain_cabin--mobile__handle_wrapper">
                <div className="captain_cabin--mobile__handle"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseOut={handleMouseOut}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div></div>
                </div>
            </div>
            <CaptainConsoleMobile regionListLength={regionList.length} />
            <SecretarySceneMobile />
            <SecretaryList ref={secretaryListRef} />
        </div>
    )
}
