import { useEffect, RefObject } from 'react';
import gsap from 'gsap';

// Types for the refs
type AnimationRefs = {
    formRef: RefObject<HTMLFormElement>;
    inputsRef: RefObject<(HTMLInputElement | null)[]>;
    buttonsRef: RefObject<(HTMLButtonElement | null)[]>;
};

// Reusable form animation hook
export const useFormAnimation = (
    formRef: AnimationRefs['formRef'],
    inputsRef: AnimationRefs['inputsRef'],
    buttonsRef: AnimationRefs['buttonsRef']
) => {
    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(formRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        },
    {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
    }
        
    )

            .fromTo(
                inputsRef.current,
                {
                    x: -30,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.2,
                    ease: 'power3.out',
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.2,
                    ease: 'power3.out',
                }
            )
            .fromTo(
                buttonsRef.current,
                {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.2,
                    ease: 'power3.out',
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.2,
                    ease: 'power3.out',
                }
            );

        return () => {
            tl.kill();
        };
    }, []);
};
