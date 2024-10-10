import { useEffect, useRef,  } from "react";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
export const useAnimateEntry = () => {
    const elementRef = useRef<HTMLElement | null>(null);
    const { ref: inViewRef, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
  
    const setRefs = (node: HTMLElement | null) => {
      elementRef.current = node;
      inViewRef(node);
    };
  
    useEffect(() => {
      if (inView && elementRef.current) {
        gsap.to(elementRef.current, {
          opacity: 1,
          duration: 1.25,
          ease: 'power3.out',
        });
      }
    }, [inView]);
  
    return { setRefs };
  };